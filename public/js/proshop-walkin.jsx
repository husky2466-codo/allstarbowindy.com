/* ============================================================
   PRO SHOP — Walk-In simulation (Mode 2) · REAL-PHOTO 360
   Photo Sphere Viewer v5 (core + markers-plugin) renders the actual
   store panoramas as navigable 360 nodes. Drag/pinch to look around,
   step between zones (entry -> ball wall -> counter) with a cross-fade,
   and tap a wall marker to ease the camera toward it and open the SAME
   shared ProductDetail the standard grid uses (by product id).

   Contract preserved for proshop.jsx: ProShopWalkIn({ onOpen, setMode }).
     - props.onOpen(id)         opens the shared ProductDetail
     - props.setMode("standard") exits to the standard grid

   PSV is ESM-only (importmap). The site renders via Babel-standalone,
   which can't `import`. index.html bridges them: a <script type="module">
   imports PSV and stashes { Viewer, MarkersPlugin } on window.__PSV, then
   dispatches a 'psv-ready' event. This component reads window.__PSV at
   runtime and waits on that event if the module hasn't resolved yet.

   Fallback ladder: if PSV never loads (timeout) OR WebGL is unavailable,
   render a notice and bounce the user to the standard grid via setMode.
   The "Exit to standard view" button is always visible.
   ============================================================ */

/* The three real-photo nodes. Panos live in public/img/proshop/pano/
   (4096x2048 equirectangular webp). defaultYaw aims each node at its
   point of interest. The entry pano is honestly the front DESK, not a
   true exterior door — we caption it as such rather than fake a facade. */
var WK_NODES = [
  {
    key: "entry", hotspotKey: "entry",
    name: "Welcome in", sub: "Front desk · the lanes are behind you",
    pano: "img/proshop/pano/entry-360.webp",
    defaultYaw: 0, defaultPitch: 0,
    caption: "Welcome in — drag to look around, then head to the New Arrivals wall."
  },
  {
    key: "ballWall", hotspotKey: "ball-wall",
    name: "New Arrivals wall", sub: "Fresh reactive balls on the chrome slatwall",
    pano: "img/proshop/pano/ball-wall-360.webp",
    defaultYaw: 0, defaultPitch: 0.02,
    caption: "Tap any glowing marker for full specs, then add it to your reservation."
  },
  {
    key: "counter", hotspotKey: "counter",
    name: "The counter", sub: "Where we measure, fit and drill",
    pano: "img/proshop/pano/counter-360.webp",
    defaultYaw: 0, defaultPitch: 0,
    caption: "This is where it comes together — fitting, drilling and gear set aside."
  }
];

/* WebGL availability probe (cheap, cached). */
function wkHasWebGL() {
  try {
    if (typeof window.WebGLRenderingContext === "undefined") return false;
    var c = document.createElement("canvas");
    return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch (e) { return false; }
}

function wkReducedMotion() {
  return typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* Resolve window.__PSV, waiting on the 'psv-ready' bridge event if the
   ESM module hasn't finished importing yet. Times out so we can fall
   back to the standard grid instead of hanging on a blank canvas. */
function wkWaitForPSV(timeoutMs) {
  return new Promise(function (resolve, reject) {
    if (window.__PSV && window.__PSV.Viewer) { resolve(window.__PSV); return; }
    var done = false;
    function onReady() {
      if (done) return;
      done = true;
      window.removeEventListener("psv-ready", onReady);
      if (window.__PSV && window.__PSV.Viewer) resolve(window.__PSV);
      else reject(new Error("psv-ready fired but window.__PSV is incomplete"));
    }
    window.addEventListener("psv-ready", onReady);
    setTimeout(function () {
      if (done) return;
      done = true;
      window.removeEventListener("psv-ready", onReady);
      if (window.__PSV && window.__PSV.Viewer) resolve(window.__PSV);
      else reject(new Error("PSV did not load within " + timeoutMs + "ms"));
    }, timeoutMs || 8000);
  });
}

/* A small builder turning hotspot rows into PSV markers. Each marker
   carries its productId in data so select-marker can open the card. */
function wkBuildMarkers(rows) {
  return (rows || []).map(function (h) {
    var prod = PROSHOP.byId(h.productId);
    var label = prod ? prod.name : h.productId;
    return {
      id: h.id,
      position: { yaw: h.yaw, pitch: h.pitch },
      html: '<span class="wk-pin"><span class="wk-pin-dot"></span><span class="wk-pin-ring"></span></span>',
      anchor: "center center",
      scale: [0.85, 1.4],
      tooltip: { content: label, position: "top center" },
      data: { productId: h.productId, ok: !!prod }
    };
  });
}

function ProShopWalkIn(props) {
  var ref = useReveal();
  var wish = useWishList();   // re-renders the cart count when items change
  var hostRef = React.useRef(null);
  var viewerRef = React.useRef(null);
  var markersRef = React.useRef(null);
  var aliveRef = React.useRef(true);

  var hotspotsRef = React.useRef(null);   // loaded hotspots json
  var nodeRef = React.useRef(0);          // current node index (for handlers)

  var stateInit = "loading";              // loading | ready | failed
  var s = React.useState(stateInit);
  var status = s[0], setStatus = s[1];
  var n = React.useState(0);
  var node = n[0], setNode = n[1];
  var f = React.useState(null);
  var failMsg = f[0], setFailMsg = f[1];

  var reduce = wkReducedMotion();

  React.useEffect(function () { nodeRef.current = node; }, [node]);

  /* Apply the markers for a given node index to the live plugin. */
  function applyMarkers(idx) {
    var plugin = markersRef.current;
    if (!plugin) return;
    var hs = hotspotsRef.current || {};
    var rows = hs[WK_NODES[idx].hotspotKey] || [];
    plugin.setMarkers(wkBuildMarkers(rows));
  }

  /* Switch panorama node with a fade (skipped under reduced motion). */
  function goNode(idx) {
    var clamped = Math.max(0, Math.min(WK_NODES.length - 1, idx));
    if (clamped === nodeRef.current) return;
    var viewer = viewerRef.current;
    var target = WK_NODES[clamped];
    if (!viewer) { setNode(clamped); return; }

    // Clear markers during the swap so they don't float over the old wall.
    if (markersRef.current) markersRef.current.clearMarkers();

    var opts = {
      position: { yaw: target.defaultYaw, pitch: target.defaultPitch },
      transition: reduce ? false : { effect: "fade", rotation: false, speed: 700 }
    };
    viewer.setPanorama(target.pano, opts).then(function () {
      if (!aliveRef.current) return;
      applyMarkers(clamped);
    }).catch(function () { /* swallow — stay on current */ });
    setNode(clamped);
  }

  /* Marker click: ease the camera toward it (unless reduced motion),
     then open the shared ProductDetail by product id. */
  function onSelectMarker(marker) {
    if (!marker || !marker.data || !marker.data.productId) return;
    var pid = marker.data.productId;
    var open = function () { props.onOpen && props.onOpen(pid); };
    var viewer = viewerRef.current;
    if (reduce || !viewer || !marker.position) { open(); return; }
    viewer.animate({
      yaw: marker.position.yaw,
      pitch: marker.position.pitch,
      zoom: 55,
      speed: 900
    }).then(open).catch(open);
  }

  React.useEffect(function () {
    aliveRef.current = true;

    if (!wkHasWebGL()) {
      setStatus("failed");
      setFailMsg("Your browser can't render the 360 view (WebGL unavailable). Showing the full catalog instead.");
      return;
    }

    var cancelled = false;

    // Load hotspots + PSV in parallel; both must succeed to mount.
    var hotspotsP = fetch("data/proshop-hotspots.json", { cache: "force-cache" })
      .then(function (r) { if (!r.ok) throw new Error("hotspots HTTP " + r.status); return r.json(); })
      .catch(function () { return {}; });     // degrade to no markers, still a 360
    var catalogP = (window.ProShopCatalog && window.ProShopCatalog.ready)
      ? window.ProShopCatalog.ready : Promise.resolve();
    var psvP = wkWaitForPSV(8000);

    Promise.all([psvP, hotspotsP, catalogP]).then(function (res) {
      if (cancelled || !aliveRef.current) return;
      var PSV = res[0];
      hotspotsRef.current = res[1] || {};
      if (!hostRef.current) return;

      var start = WK_NODES[0];
      var viewer = new PSV.Viewer({
        container: hostRef.current,
        panorama: start.pano,
        defaultYaw: start.defaultYaw,
        defaultPitch: start.defaultPitch,
        defaultZoomLvl: 30,
        minFov: 35,
        maxFov: 90,
        navbar: ["zoom", "move", "fullscreen"],
        loadingTxt: "Loading the shop…",
        touchmoveTwoFingers: false,
        mousewheelCtrlKey: false,
        plugins: [PSV.MarkersPlugin]
      });
      viewerRef.current = viewer;

      var plugin = viewer.getPlugin(PSV.MarkersPlugin);
      markersRef.current = plugin;
      if (plugin) {
        plugin.addEventListener("select-marker", function (e) {
          onSelectMarker(e.marker);
        });
      }

      viewer.addEventListener("ready", function () {
        if (cancelled || !aliveRef.current) return;
        applyMarkers(nodeRef.current);
        setStatus("ready");
        // PSV measures the container before the "ready" CSS reveals it, so the
        // canvas can lock to a collapsed size. Force a re-measure on the next
        // frame, once the reveal styles have applied.
        requestAnimationFrame(function () {
          if (!cancelled && aliveRef.current && viewerRef.current) {
            try { viewerRef.current.resize(); } catch (e) {}
          }
        });
      }, { once: true });

      // Safety: if 'ready' never fires, still reveal the canvas.
      setTimeout(function () {
        if (!cancelled && aliveRef.current && viewerRef.current) {
          setStatus(function (cur) { return cur === "loading" ? "ready" : cur; });
        }
      }, 4000);
    }).catch(function (err) {
      if (cancelled) return;
      setStatus("failed");
      setFailMsg("The 360 walk-in couldn't load. Showing the full catalog instead.");
      if (typeof console !== "undefined" && console.warn) console.warn("[walk-in]", err && err.message);
    });

    return function () {
      cancelled = true;
      aliveRef.current = false;
      if (viewerRef.current) {
        try { viewerRef.current.destroy(); } catch (e) {}
        viewerRef.current = null;
      }
      markersRef.current = null;
    };
    // eslint-disable-next-line
  }, []);

  /* Hard fallback: bounce to the standard grid. We render a brief notice
     and auto-exit so the user always lands on a working surface. */
  React.useEffect(function () {
    if (status !== "failed") return;
    var t = setTimeout(function () { props.setMode && props.setMode("standard"); }, 2600);
    return function () { clearTimeout(t); };
  }, [status]);

  var cur = WK_NODES[node];
  var cartCount = wish.get().length;

  return (
    <section className="section section--tight" ref={ref}>
      <div className="wrap">
        <div className="wk360 reveal">

          {/* top bar: zone label · zone strip · exit */}
          <div className="wk360-top">
            <div className="wk360-zone">
              <span className="wk360-zone-n">Zone {node + 1} / {WK_NODES.length}</span>
              <strong className="wk360-zone-name">{cur.name}</strong>
              <span className="wk360-zone-sub">{cur.sub}</span>
            </div>
            <div className="wk360-strip" role="tablist" aria-label="Shop zones">
              {WK_NODES.map(function (nd, i) {
                return (
                  <button key={nd.key} role="tab" aria-selected={i === node}
                    className={"wk360-chip" + (i === node ? " active" : "") + (i < node ? " done" : "")}
                    onClick={function () { goNode(i); }}>
                    <span className="wk360-chip-n">{i + 1}</span>
                    <span className="wk360-chip-name">{nd.name}</span>
                  </button>
                );
              })}
            </div>
            <button className="wk360-exit" onClick={function () { props.setMode("standard"); }}>
              <Icon name="menu" size={16} /> Exit to standard view
            </button>
          </div>

          {/* the 360 stage */}
          <div className="wk360-stage">
            <div ref={hostRef} className="wk360-canvas" aria-hidden={status !== "ready"} />

            {status === "loading" ? (
              <div className="wk360-overlay wk360-loading">
                <span className="wk360-spinner" aria-hidden="true"></span>
                <p>Loading the real shop in 360°…</p>
              </div>
            ) : null}

            {status === "failed" ? (
              <div className="wk360-overlay wk360-fail">
                <span className="wk360-fail-ic"><Icon name="info" size={26} /></span>
                <p>{failMsg}</p>
                <button className="btn btn-red btn-lg" onClick={function () { props.setMode("standard"); }}>
                  Go to the catalog <Icon name="arrow" size={18} />
                </button>
              </div>
            ) : null}

            {status === "ready" ? (
              <div className="wk360-caption" aria-live="polite">
                <Icon name="info" size={15} /> <span>{cur.caption}</span>
              </div>
            ) : null}

            {/* prev / next node controls */}
            {status === "ready" ? (
              <React.Fragment>
                <button className="wk360-nav wk360-nav--prev" disabled={node === 0}
                  onClick={function () { goNode(node - 1); }} aria-label="Previous zone">
                  <Icon name="chev" size={24} style={{ transform: "rotate(180deg)" }} />
                </button>
                <button className="wk360-nav wk360-nav--next" disabled={node === WK_NODES.length - 1}
                  onClick={function () { goNode(node + 1); }} aria-label="Next zone">
                  <Icon name="chev" size={24} />
                </button>
              </React.Fragment>
            ) : null}
          </div>

          {/* footer: cart + reserve, reusing the shared WishStore / ReserveStore */}
          <div className="wk360-foot">
            <p className="wk360-disclaimer">
              <Icon name="info" size={14} /> A real-photo 360° walk-through of the shop. {PROSHOP.disclaimer}
            </p>
            <div className="wk360-foot-actions">
              <button className="btn btn-ghost" style={{ color: "var(--navy-800)" }}
                onClick={function () { ReserveStore.open(WishStore.get()); }}>
                <Icon name="gift" size={17} /> Cart{cartCount ? " (" + cartCount + ")" : ""}
              </button>
              <button className="btn btn-red" onClick={function () { ReserveStore.open(WishStore.get()); }}>
                <Icon name="phone" size={16} /> Reserve / ask the pro
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ProShopWalkIn });
