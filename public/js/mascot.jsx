/* ============================================================
   CORNER BUDDY — site-wide bowling-pin mascot
   - Fixed bottom-right, follows on every page (mounted in App root)
   - rAF-driven idle bob / hover wave / excite burst / entrance
     (CSS animation clocks are frozen in the preview iframe)
   - Contextual greeting per route, reacts to red CTAs in view
   - Always dismissible (remembered for the session)
   - Respects prefers-reduced-motion
   ============================================================ */

const BUDDY_HOVER_LINES = ["Ready to bowl?", "Strike!", "Grab a lane!", "Hey there!", "Let's roll!"];

const BUDDY_ROUTE_LINES = {
  "/": "Ready to roll?",
  "/bowl": "Let's book a lane!",
  "/cosmic": "Lights down, glow up!",
  "/leagues": "Join a league!",
  "/scores": "Who's winning?",
  "/eat": "Hungry? Pizza time.",
  "/proshop": "Let's find your ball!",
  "/specials": "Don't miss a deal!",
  "/parties": "Let's party!",
  "/account": "Earn free games!",
  "/join": "Join the club — it's free!",
  "/contact": "Say hi!",
  "/terms": "Just the fine print!",
  "/privacy": "We've got your back."
};

function buddyLineFor(route) {
  if (route === "" ) return BUDDY_ROUTE_LINES["/"];
  const keys = Object.keys(BUDDY_ROUTE_LINES);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (k === "/") { if (route === "/") return BUDDY_ROUTE_LINES[k]; continue; }
    if (route.indexOf(k) === 0) return BUDDY_ROUTE_LINES[k];
  }
  return "Strike!";
}

function easeOutBack(x) {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}
function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

function CornerBuddy() {
  const route = useRoute();
  const rootRef = useRef(null);
  const imgRef = useRef(null);
  const bubbleRef = useRef(null);
  const [dismissed, setDismissed] = useState(function () {
    try { return sessionStorage.getItem("asb_buddy_dismissed") === "1"; } catch (e) { return false; }
  });
  const [bubbleText, setBubbleText] = useState(buddyLineFor(Router.parse()));

  // All animation state lives in a ref so the rAF loop never triggers re-renders.
  const st = useRef(null);
  if (st.current === null) {
    const reduce = (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) || false;
    st.current = {
      mountT: performance.now(),
      lastT: performance.now(),
      phase: 0,
      excite: 0,          // smoothed excitement 0..1
      exciteUntil: 0,     // timestamp burst end
      hover: false,
      hoverBubble: false,
      bubble: 0,          // smoothed bubble visibility 0..1
      bubbleUntil: 0,     // timestamp bubble auto-hide
      hoverIdx: 0,
      ctaCooldown: 0,
      dismissed: false,
      nest: 0,            // smoothed nested/peeking progress 0..1
      peek: 0,            // smoothed hover-peek lift while nested
      reduce: reduce
    };
  }

  /* ---- single rAF loop ---- */
  useEffect(function () {
    const s = st.current;
    let raf = 0;
    function frame(now) {
      const dt = Math.min(50, now - s.lastT);
      s.lastT = now;

      /* entrance */
      const enterDelay = 650, enterDur = 680;
      const ep = clamp01((now - s.mountT - enterDelay) / enterDur);
      const eo = easeOutBack(ep);

      /* excitement target: hover OR active burst */
      let tgt = s.hover ? 1 : 0;
      if (now < s.exciteUntil) tgt = 1;
      s.excite += (tgt - s.excite) * Math.min(1, dt / 120);

      /* oscillation (phase-integrated so speed changes don't jump) */
      const baseOmega = (2 * Math.PI) / 2600;       // ~2.6s idle period
      const omega = baseOmega * (1 + 1.4 * s.excite);
      s.phase += omega * dt;
      const osc = Math.sin(s.phase);
      const amp = 6 + 11 * s.excite;
      const rot = 2 + 7 * s.excite;
      const scl = 1 + 0.055 * s.excite * (0.5 + 0.5 * osc);

      if (imgRef.current) {
        if (s.reduce) {
          imgRef.current.style.transform = "none";
        } else {
          const tY = -((osc + 1) / 2) * amp;
          imgRef.current.style.transform = "translateY(" + tY.toFixed(2) + "px) rotate(" + (osc * rot).toFixed(2) + "deg) scale(" + scl.toFixed(3) + ")";
        }
      }

      /* root: blend entrance pose ↔ nested "peeking" pose.
         When dismissed, the pin tucks into the corner with only the
         top ~15% (the head) poking out at an angle; click to restore. */
      if (rootRef.current) {
        const nTgt = s.dismissed ? 1 : 0;
        s.nest += (nTgt - s.nest) * Math.min(1, dt / 130);
        const peekTgt = (s.dismissed && s.hover) ? 1 : 0;
        s.peek += (peekTgt - s.peek) * Math.min(1, dt / 120);

        const enterY = (1 - eo) * 155;
        const nestY = 86 - 12 * s.peek;     // % down — head bulb crests the edge; lifts on hover
        const nestRot = -15 + 6 * s.peek;   // deg — head tilts out toward the page

        const ty = (1 - s.nest) * enterY + s.nest * nestY;
        const rot = s.nest * nestRot;
        rootRef.current.style.transform = "translateY(" + ty.toFixed(2) + "%) rotate(" + rot.toFixed(2) + "deg)";
        rootRef.current.style.opacity = clamp01(ep * 1.35).toFixed(3);
      }

      /* bubble visibility */
      const wantBubble = (now < s.bubbleUntil) || (s.hover && s.hoverBubble);
      s.bubble += ((wantBubble ? 1 : 0) - s.bubble) * Math.min(1, dt / 110);
      if (bubbleRef.current) {
        bubbleRef.current.style.opacity = s.bubble.toFixed(3);
        bubbleRef.current.style.transform = "translateY(" + ((1 - s.bubble) * 6).toFixed(2) + "px) scale(" + (0.9 + 0.1 * s.bubble).toFixed(3) + ")";
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return function () { cancelAnimationFrame(raf); };
  }, []);

  /* ---- if already dismissed at mount, snap straight to nested pose ---- */
  useEffect(function () {
    if (dismissed) { st.current.dismissed = true; st.current.nest = 1; }
  }, []);

  /* ---- contextual greeting + excite burst on every route change ---- */
  useEffect(function () {
    const s = st.current;
    if (s.dismissed) return;
    const now = performance.now();
    // skip the very first mount (entrance is enough), greet on later navigations
    if (now - s.mountT < 400) return;
    setBubbleText(buddyLineFor(route));
    s.exciteUntil = now + 1500;
    s.bubbleUntil = now + 2800;
  }, [route]);

  /* ---- react to a red CTA scrolling into view (IntersectionObserver does
          not fire in the preview iframe, so we poll on scroll) ---- */
  useEffect(function () {
    let ticking = false;
    function check() {
      ticking = false;
      const s = st.current;
      if (s.dismissed) return;
      const now = performance.now();
      if (now < s.ctaCooldown) return;
      if (now - s.mountT < 1400) return; // let it enter first
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const btns = document.querySelectorAll(".btn-red, .btn-blue");
      for (let i = 0; i < btns.length; i++) {
        const el = btns[i];
        if (el.closest(".nav") || el.closest(".footer")) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const mid = r.top + r.height / 2;
        if (mid > vh * 0.18 && mid < vh * 0.82) {
          s.exciteUntil = now + 1600;
          s.bubbleUntil = now + 2600;
          s.ctaCooldown = now + 7000;
          setBubbleText("Book here! \u2192");
          return;
        }
      }
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(check);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return function () { window.removeEventListener("scroll", onScroll); };
  }, []);

  function onEnter() {
    const s = st.current;
    s.hover = true;
    if (s.dismissed) { s.hoverBubble = false; return; } // peeking: lift only, no bubble
    s.hoverBubble = true;
    setBubbleText(BUDDY_HOVER_LINES[s.hoverIdx % BUDDY_HOVER_LINES.length]);
    s.hoverIdx++;
  }
  function onLeave() {
    const s = st.current;
    s.hover = false;
    s.hoverBubble = false;
  }
  function go() { Router.go("/bowl"); }
  function restore() {
    const s = st.current;
    s.dismissed = false;
    s.hover = false;
    try { sessionStorage.removeItem("asb_buddy_dismissed"); } catch (err) {}
    setDismissed(false);
    const now = performance.now();
    s.exciteUntil = now + 1400;
    s.bubbleUntil = now + 2200;
    setBubbleText("I'm back!");
  }
  function onRootClick() {
    if (st.current.dismissed) restore(); else go();
  }
  function onKey(e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onRootClick(); }
  }
  function close(e) {
    e.stopPropagation();
    st.current.dismissed = true;
    try { sessionStorage.setItem("asb_buddy_dismissed", "1"); } catch (err) {}
    setDismissed(true);
  }

  return (
    <div
      className={"buddy" + (dismissed ? " buddy--nested" : "")}
      ref={rootRef}
      role="button"
      tabIndex={0}
      aria-label={dismissed ? "Bring back the All Star Bowl mascot" : "All Star Bowl mascot — go reserve a lane"}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onRootClick}
      onKeyDown={onKey}
    >
      {!dismissed && (
        <button className="buddy-close" aria-label="Tuck the mascot away" onClick={close}>&times;</button>
      )}
      <div className="buddy-bubble" ref={bubbleRef} aria-hidden="true">{bubbleText}</div>
      <div className="buddy-imgwrap" ref={imgRef}>
        <img src="img/mascot/mascot-wave.png" alt="All Star Bowl bowling-pin mascot waving" />
      </div>
    </div>
  );
}

Object.assign(window, { CornerBuddy });
