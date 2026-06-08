/* ============================================================
   All Star Bowl — Lane Banner Motion Study
   Canvas 2.5D bowling-lane renderer.
   Side view with a small downward tilt so the lane top reads as
   a thin plane (you see "the other side"). Ball rolls L->R,
   hooks into the pocket, scatters the pins. Auto-loops.

   Uses requestAnimationFrame (runs in this preview; CSS
   keyframe animation does not). No external deps.
   ============================================================ */
(function () {
  "use strict";

  const BRAND = {
    navy900: "#0a1430", navy800: "#0e1a3a", navy700: "#12224b",
    blue700: "#1b3a8f", blue500: "#2a5bd0",
    red600: "#c8202a", red500: "#e0241f", red400: "#f0433c",
    cream: "#f5f1e6", gold: "#f5b423",
  };

  // Standard 10-pin rack. v across in inches from pocket center,
  // r = row depth index (0 = head pin, nearest bowler).
  const RACK = [
    { n: 1, r: 0, x: 0 },
    { n: 2, r: 1, x: -6 }, { n: 3, r: 1, x: 6 },
    { n: 4, r: 2, x: -12 }, { n: 5, r: 2, x: 0 }, { n: 6, r: 2, x: 12 },
    { n: 7, r: 3, x: -18 }, { n: 8, r: 3, x: -6 }, { n: 9, r: 3, x: 6 }, { n: 10, r: 3, x: 18 },
  ];
  const LANE_W_IN = 41.5;          // real lane width
  const PIN_H_RATIO = 15 / LANE_W_IN;   // pin height vs lane width
  const BALL_D_RATIO = 8.5 / LANE_W_IN; // ball diameter vs lane width

  // Bowling-pin half-width profile, base (t=0) -> just below tip (t≈0.99).
  // [halfWidth, heightFraction]. Widest at the belly (lower third),
  // pinched neck high up, bulbed head — NOT wider at the bottom.
  const PIN_PROFILE = [
    [0.066, 0.00],   // base (narrow, rounded foot)
    [0.082, 0.035],
    [0.110, 0.10],
    [0.140, 0.19],
    [0.158, 0.29],   // belly — widest point
    [0.151, 0.38],
    [0.120, 0.50],
    [0.086, 0.61],
    [0.060, 0.70],   // neck
    [0.056, 0.745],  // neck — narrowest
    [0.070, 0.82],
    [0.090, 0.89],   // head bulb
    [0.080, 0.945],
    [0.048, 0.985],
  ];

  const clamp = (a, lo, hi) => Math.min(hi, Math.max(lo, a));
  const GRAV_W = 3.0;   // gravity for airborne pins, in lane-width units/s^2
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeIn = (t) => t * t;
  // smooth both ends — reads as a machine-controlled descent, not a gravity drop
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const rand = (a, b) => a + Math.random() * (b - a);

  class LaneScene {
    constructor(canvas, opts = {}) {
      this.cv = canvas;
      this.ctx = canvas.getContext("2d");
      this.opts = Object.assign({
        tilt: 9,              // degrees of downward look
        speed: 1,
        ball: "navy",         // navy | swirl | stars
        autoloop: true,
        loopGap: 1500,        // ms between auto rolls
        compact: false,       // nav-strip styling
      }, opts);

      this.state = "idle";    // idle | roll | strike | settle | reset
      this.t = 0;             // ms within current phase
      this.ball = null;
      this.pins = [];
      this.resetPins();

      this._raf = null;
      this._last = 0;
      this.resize();
      this._onResize = () => this.resize();
      window.addEventListener("resize", this._onResize);
      this.draw();        // immediate static first frame (don't wait for rAF)
      this.start();

      if (this.opts.autoloop) this._scheduleAuto(this.opts.loopGap + 400);
    }

    setOpt(k, v) {
      this.opts[k] = v;
      if (k === "tilt") this.resize();
    }

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = this.cv.getBoundingClientRect();
      this.W = Math.max(320, r.width);
      this.H = Math.max(80, r.height);
      this.cv.width = Math.round(this.W * dpr);
      this.cv.height = Math.round(this.H * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this._computeGeometry();
    }

    _computeGeometry() {
      const W = this.W, H = this.H, c = this.opts.compact;
      // Lane runs across the canvas. Leave room at left (approach)
      // and right (pin deck / back wall).
      this.padL = W * (c ? 0 : 0.05);
      this.padR = W * (c ? 0 : 0.21);     // compact: wood runs flush to both edges
      this.laneLen = W - this.padL - this.padR;

      const tilt = clamp(this.opts.tilt, 1.5, 32) * Math.PI / 180;
      // Pixels representing one full lane width:
      this.laneWidthPx = H * (c ? 0.92 : 0.74);
      this.acrossPx = this.laneWidthPx * Math.sin(tilt); // across (thin)
      this.vertScale = this.laneWidthPx * Math.cos(tilt); // upright objects

      // Baseline (near gutter outer edge) sits low; lane rises a hair
      // toward the pins for gentle depth.
      this.floorY = this.opts.transparent
        ? H - 2                                    // nuzzle the lane to the very bottom of the bar
        : H - (c ? H * 0.20 : H * 0.26) - this.acrossPx * 0.15;
      this.backRise = this.acrossPx * 0.55;
      this.gutterV = 0.085;   // gutter width as fraction of lane width
    }

    // u: 0..1 along length (L->R).  v: 0..1 across (0 near, 1 far).
    // w: height above surface in lane-width fractions.
    project(u, v, w = 0) {
      const persp = 1 - 0.085 * u;
      const x = this.padL + u * this.laneLen;
      const baseY = this.floorY - u * this.backRise;
      const y = baseY - (v + this.gutterV) * this.acrossPx * persp - w * this.vertScale * persp;
      return { x, y, s: persp };
    }

    /* ---------------- state ---------------- */
    resetPins() {
      this.pins = RACK.map((p) => {
        const u = 0.935 + p.r * 0.009;     // tighter rows on X, shifted toward the back edge
        const v = 0.5 + p.x / LANE_W_IN;
        return {
          n: p.n, u, v, w: 0,
          standing: true, airborne: false, setting: false, w0: 0,
          // world-space ballistic state (back / out / up)
          vu: 0, vv: 0, vw: 0, rot: 0, vrot: 0,
          delay: 0, t: 0, fade: 1, pop: 0,
        };
      });
    }

    roll() {
      if (this.state === "roll" || this.state === "strike") return;
      this._cancelAuto();
      this.state = "roll";
      this.t = 0;
      const hookSide = Math.random() < 0.5 ? -1 : 1; // left or right pocket
      this.ball = {
        u: 0.0, v: 0.5, w: 0,
        v0: 0.5, vHook: 0.5 + hookSide * 0.07, // ends slightly off-center -> pocket
        spin: 0, dist: 0, gone: false, fade: 1,
      };
      if (typeof this.onRoll === "function") this.onRoll();
    }

    _scheduleAuto(delay) {
      this._cancelAuto();
      this._auto = setTimeout(() => { if (this.opts.autoloop) this.roll(); }, delay);
    }
    _cancelAuto() { if (this._auto) { clearTimeout(this._auto); this._auto = null; } }

    _strike() {
      this.state = "strike";
      this.t = 0;
      const ball = this.ball;
      const impactU = 0.93, impactV = ball.vHook;
      // Clean strike: ball drives through the pocket, the head pin goes
      // first, and the rack ripples BACK into the pit and OUT to the
      // sides. Everything launches as a 3D ballistic in (u=back, v=out,
      // w=up) space, so the pins recede & tumble into the pit.
      for (const p of this.pins) {
        const du = Math.max(0, p.u - impactU);   // depth behind the contact
        const dv = p.v - impactV;                // lateral from the pocket
        const out = dv >= 0 ? 1 : -1;
        // head pin first; pins deeper / wider get hit a touch later
        p.delay = du * 900 + Math.abs(dv) * 150 + rand(0, 22);
        const power = clamp(1.2 - Math.abs(dv) * 0.5, 0.5, 1.2);
        const kick = rand(0.6, 1.2);             // per-pin energy spread
        // energetic scatter so the deck visibly clears within the ~0.55s sweep
        p.vu = (0.42 + du * 3.0 + power * 0.24) * kick;   // drive BACK into the pit
        p.vv = out * (0.16 + Math.abs(dv) * 0.95) * kick + rand(-0.06, 0.06); // spread OUT
        p.vw = (0.78 + power * 0.5) * rand(0.8, 1.2);     // pop UP
        p.vrot = out * rand(8, 15) + rand(-3, 3);
        p.rot = 0; p.w = 0; p.t = 0;
        p.standing = true; p.airborne = false; p.setting = false; p.fade = 1;
      }
      ball.struck = true;
    }

    update(dt) {
      const sp = this.opts.speed;
      this.t += dt;
      const ball = this.ball;

      if (this.state === "roll" && ball) {
        const dur = 1450 / sp;
        const k = clamp(this.t / dur, 0, 1);
        const ek = easeIn(k) * 0.35 + k * 0.65; // accelerate then steady
        ball.u = lerp(0.0, 0.95, ek);
        // hook: stays straight, then curves into pocket in last third
        const hk = clamp((k - 0.62) / 0.38, 0, 1);
        ball.v = lerp(ball.v0, ball.vHook, easeOut(hk));
        const dpx = (0.935) * this.laneLen / dur * dt; // approx px advance
        ball.dist += dpx;
        ball.spin = ball.dist / (Math.PI * (this.vertScale * BALL_D_RATIO));
        if (k >= 1) this._strike();
      }
      else if (this.state === "strike") {
        // ball continues into the pit and drops
        if (ball && !ball.gone) {
          ball.u += 0.00075 * sp * dt;
          if (ball.u > 0.985) { ball.w -= 0.0011 * dt; ball.fade -= 0.0016 * dt; }
          if (ball.fade <= 0) ball.gone = true;
        }
        const h = dt / 1000;
        let active = false;
        for (const p of this.pins) {
          if (!p.airborne) {
            if (p.fade <= 0) continue;
            p.t += dt;
            if (p.t >= p.delay) { p.airborne = true; p.standing = false; }
            else { active = true; continue; }   // still standing, waiting to be hit
          }
          // 3D ballistic: back (u), out (v), up (w) with gravity
          p.u += p.vu * h;
          p.v += p.vv * h;
          p.w += p.vw * h;
          p.vw -= GRAV_W * h;
          p.vu *= (1 - 0.5 * h);    // gentle drag as it leaves the deck
          p.rot += p.vrot * h;
          // fade out as it recedes deep into the pit or drops below it
          if (p.u > 1.16) p.fade -= 2.2 * h;
          if (p.w < -0.40) p.fade -= 2.5 * h;
          // time-based clear: guarantees an empty deck by the end of the
          // ~0.55s sweep window even for pins still in the air. NOTE: the
          // sweep + pinsetter timings below are absolute (not /sp) so they
          // hold their feel in the fast nav (speed 1.25) too — only the ball
          // roll is speed-scaled.
          if (this.t > 230) p.fade -= 3.4 * h;
          p.fade = clamp(p.fade, 0, 1);
          if (p.fade > 0) active = true;
        }
        if (this.t > 560 || !active) { this.state = "settle"; this.t = 0; }
      }
      else if (this.state === "settle") {
        // brief beat: deck cleared, the pinsetter swings in overhead
        if (this.t > 150) this._beginSet();
      }
      else if (this.state === "set") {
        // pinsetter lowers a fresh rack straight DOWN onto the deck — pins
        // flow in from above the bar and settle, they never pop up from the floor
        const fall = 880;
        for (const p of this.pins) {
          const pk = clamp((this.t - p.delay) / fall, 0, 1);
          p.w = p.w0 * (1 - easeInOut(pk));     // descend from start height to the deck
          p.fade = clamp(this.t / 120, 0, 1);   // ease in as it crosses into view
        }
        if (this.ball) this.ball.fade = 0;
        if (this.t > 1000) {
          this.resetPins();
          this.ball = null;
          this.state = "idle";
          if (this.opts.autoloop) this._scheduleAuto(this.opts.loopGap);
        }
      }
    }

    // Set a fresh rack high above the deck so it can be lowered into place.
    _beginSet() {
      this.state = "set";
      this.t = 0;
      this.resetPins();                 // upright, standing, w=0
      const SET_DROP = 1.25;            // start height in lane-width units (above the bar)
      for (const p of this.pins) {
        p.standing = true;
        p.airborne = false;
        p.setting = true;
        p.w0 = SET_DROP * rand(0.97, 1.03);
        p.w = p.w0;
        p.fade = 0;                     // fades in as it enters
        p.delay = rand(0, 70);          // tiny organic stagger in landing
        p.rot = 0;
      }
      if (this.ball) this.ball.fade = 0;
    }

    /* ---------------- draw ---------------- */
    draw() {
      const ctx = this.ctx, W = this.W, H = this.H;
      ctx.clearRect(0, 0, W, H);
      if (!this.opts.transparent) this._drawBackdrop();
      this._drawPocketGlow();
      this._drawLaneBed();
      this._drawGutters();
      this._drawArrows();

      const pinBaseY = (p) => {
        const elevated = p.airborne || p.setting;
        return this.project(p.u, p.v, elevated ? p.w : 0).y;
      };
      const order = this.pins
        .map((p) => ({ p, y: pinBaseY(p) }))
        .sort((a, b) => a.y - b.y);

      // ball relative to pins: draw ball among pins by its base y
      const ballY = this.ball && !this.ball.gone ? this.project(this.ball.u, this.ball.v, 0).y : -1;
      let ballDrawn = false;
      for (const o of order) {
        if (!ballDrawn && this.ball && !this.ball.gone && ballY <= o.y) {
          this._drawBall(); ballDrawn = true;
        }
        this._drawPin(o.p);
      }
      if (!ballDrawn && this.ball && !this.ball.gone) this._drawBall();
    }

    _drawBackdrop() {
      const ctx = this.ctx, W = this.W, H = this.H;
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#070d22");
      g.addColorStop(0.55, BRAND.navy900);
      g.addColorStop(1, "#05091a");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    _drawPocketGlow() {
      // soft spotlight on the dark backdrop behind the pins (no housing)
      const ctx = this.ctx;
      const c = this.project(0.95, 0.5, 0.5);
      const r = this.H * (this.opts.compact ? 0.9 : 0.7);
      const g = ctx.createRadialGradient(c.x, c.y, 2, c.x, c.y, r);
      g.addColorStop(0, "rgba(245,205,135,0.16)");
      g.addColorStop(0.45, "rgba(120,150,220,0.05)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, this.W, this.H);
    }

    _laneQuad(u0, u1, v0, v1) {
      const a = this.project(u0, v1), b = this.project(u1, v1),
            c = this.project(u1, v0), d = this.project(u0, v0);
      return [a, b, c, d];
    }

    _drawLaneBed() {
      const ctx = this.ctx;
      const [a, b, c, d] = this._laneQuad(0, 1, 0, 1);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y);
      ctx.closePath();
      // maple wood base gradient (far = darker, near = lighter)
      const g = ctx.createLinearGradient(0, a.y, 0, d.y);
      g.addColorStop(0, "#b07d3e");
      g.addColorStop(0.5, "#d9a865");
      g.addColorStop(1, "#e7bd80");
      ctx.fillStyle = g; ctx.fill();
      ctx.clip();

      // board lines (run along length, constant v)
      const boards = 39;
      ctx.lineWidth = 1;
      for (let i = 0; i <= boards; i++) {
        const v = i / boards;
        const p0 = this.project(0, v), p1 = this.project(1, v);
        const tone = 0.5 + 0.5 * Math.sin(i * 1.7);
        ctx.strokeStyle = `rgba(90,55,18,${0.10 + tone * 0.10})`;
        ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
      }
      // subtle plank seams across (length stations) for grain richness
      for (let i = 1; i < 26; i++) {
        const u = i / 26;
        const lo = this.project(u, 0), hi = this.project(u, 1);
        ctx.strokeStyle = "rgba(70,42,14,0.06)";
        ctx.beginPath(); ctx.moveTo(lo.x, lo.y); ctx.lineTo(hi.x, hi.y); ctx.stroke();
      }

      // oil sheen highlight band down the middle of the lane
      const m0 = this.project(0.0, 0.62), m1 = this.project(1, 0.62);
      const sg = ctx.createLinearGradient(m0.x, m0.y - this.acrossPx * 0.5, m0.x, m0.y + this.acrossPx * 0.3);
      sg.addColorStop(0, "rgba(255,240,210,0)");
      sg.addColorStop(0.5, "rgba(255,244,220,0.30)");
      sg.addColorStop(1, "rgba(255,240,210,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(this.padL, m0.y - this.acrossPx, this.laneLen + this.padR, this.acrossPx * 1.4);

      // pin-deck darker oiled zone
      const [pa, pb, pc, pd] = this._laneQuad(0.905, 1, 0, 1);
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.lineTo(pc.x, pc.y); ctx.lineTo(pd.x, pd.y);
      ctx.closePath();
      ctx.fillStyle = "rgba(40,24,8,0.30)"; ctx.fill();

      // foul line (red) near the start
      const fa = this.project(0.045, 0), fb = this.project(0.045, 1);
      ctx.strokeStyle = "rgba(200,32,42,0.85)"; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(fa.x, fa.y); ctx.lineTo(fb.x, fb.y); ctx.stroke();

      ctx.restore();
    }

    _drawArrows() {
      // range-finder arrows ~ 12-15 ft down. 7 arrows, center tallest.
      const ctx = this.ctx;
      const baseU = 0.30;
      ctx.save();
      for (let i = -3; i <= 3; i++) {
        const v = 0.5 + i * 0.115;
        const u = baseU + Math.abs(i) * 0.022; // chevron staggers back
        const tip = this.project(u + 0.02, v);
        const lw = this.project(u - 0.012, v - 0.03);
        const rw = this.project(u - 0.012, v + 0.03);
        ctx.beginPath();
        ctx.moveTo(tip.x, tip.y); ctx.lineTo(lw.x, lw.y); ctx.lineTo(rw.x, rw.y);
        ctx.closePath();
        ctx.fillStyle = i === 0 ? "rgba(120,70,20,0.85)" : "rgba(120,70,20,0.7)";
        ctx.fill();
      }
      ctx.restore();
    }

    _drawGutters() {
      const ctx = this.ctx;
      const drawG = (v0, v1, near) => {
        const a = this.project(0, v1), b = this.project(1, v1),
              c = this.project(1, v0), d = this.project(0, v0);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y);
        ctx.closePath();
        const g = ctx.createLinearGradient(0, a.y, 0, c.y);
        if (near) {
          g.addColorStop(0, "#0c1734"); g.addColorStop(0.5, "#1b2c5e"); g.addColorStop(1, "#0a1126");
        } else {
          g.addColorStop(0, "#14254f"); g.addColorStop(1, "#0b1530");
        }
        ctx.fillStyle = g; ctx.fill();
        // red cap edge toward the lane
        const e0 = near ? this.project(0, v1) : this.project(0, v0);
        const e1 = near ? this.project(1, v1) : this.project(1, v0);
        ctx.strokeStyle = "rgba(200,32,42,0.65)"; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(e0.x, e0.y); ctx.lineTo(e1.x, e1.y); ctx.stroke();
      };
      drawG(-this.gutterV, 0, true);   // near gutter (bottom)
      drawG(1, 1 + this.gutterV, false); // far gutter (top)
    }

    _ballColors() {
      switch (this.opts.ball) {
        case "swirl": return { a: "#e7e9f5", b: BRAND.red500, c: BRAND.blue700, hl: "#ffffff" };
        case "stars": return { a: BRAND.blue700, b: BRAND.navy900, c: BRAND.red500, hl: "#cfe0ff" };
        default: return { a: "#2747a8", b: BRAND.navy700, c: BRAND.navy900, hl: "#9fc0ff" };
      }
    }

    _drawBall() {
      const ctx = this.ctx, ball = this.ball;
      const p = this.project(ball.u, ball.v, BALL_D_RATIO / 2);
      const R = (this.vertScale * BALL_D_RATIO / 2) * p.s;
      const col = this._ballColors();

      // contact shadow on lane
      const sh = this.project(ball.u, ball.v, 0);
      ctx.save();
      ctx.globalAlpha = 0.32 * ball.fade;
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.beginPath();
      ctx.ellipse(sh.x, sh.y, R * 1.05, R * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = ball.fade;
      // sphere body
      const g = ctx.createRadialGradient(p.x - R * 0.35, p.y - R * 0.4, R * 0.15, p.x, p.y, R);
      g.addColorStop(0, col.a);
      g.addColorStop(0.55, col.b);
      g.addColorStop(1, col.c);
      ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();

      // swirl marble band for swirl/stars styles
      if (this.opts.ball !== "navy") {
        ctx.save();
        ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI * 2); ctx.clip();
        ctx.globalAlpha = ball.fade * 0.8;
        ctx.lineWidth = R * 0.5;
        ctx.strokeStyle = col.c;
        const ph = ball.spin;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, R * 0.9, R * 0.5, ph, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // finger holes (rotate with roll)
      const holes = [[-0.16, -0.34], [0.06, -0.36], [-0.05, -0.14]];
      for (const [hx, hy] of holes) {
        const ang = ball.spin;
        const rx = hx * Math.cos(ang) - hy * 0;       // simple roll: vertical wrap
        const ry = hy * Math.cos(ang) + 0.34 * Math.sin(ang);
        const depth = Math.cos(ang + hy * 3); // fade as it wraps to back
        if (depth < -0.1) continue;
        const hX = p.x + rx * R, hY = p.y + ry * R;
        const hr = R * 0.12 * clamp(depth + 0.4, 0.3, 1);
        ctx.globalAlpha = ball.fade * clamp(depth + 0.5, 0.2, 1);
        ctx.beginPath(); ctx.arc(hX, hY, hr, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(8,12,28,0.92)"; ctx.fill();
      }
      ctx.globalAlpha = ball.fade;
      // specular highlight
      const sg = ctx.createRadialGradient(p.x - R * 0.4, p.y - R * 0.45, 0, p.x - R * 0.4, p.y - R * 0.45, R * 0.9);
      sg.addColorStop(0, "rgba(255,255,255,0.6)");
      sg.addColorStop(0.25, "rgba(255,255,255,0.12)");
      sg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI * 2);
      ctx.fillStyle = sg; ctx.fill();
      ctx.restore();
    }

    _pinPath(ctx, h) {
      // Smooth bowling-pin silhouette from PIN_PROFILE, centered at base (0,0),
      // height h, pointing up. Uses midpoint-quadratic smoothing.
      const pts = [];
      for (const [w, t] of PIN_PROFILE) pts.push([w * h, -t * h]);   // right side up
      pts.push([0, -h]);                                            // rounded apex
      for (let i = PIN_PROFILE.length - 1; i >= 0; i--) {            // left side down
        const [w, t] = PIN_PROFILE[i];
        pts.push([-w * h, -t * h]);
      }
      const n = pts.length;
      const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const m0 = mid(pts[n - 1], pts[0]);
      ctx.beginPath();
      ctx.moveTo(m0[0], m0[1]);
      for (let i = 0; i < n; i++) {
        const cur = pts[i], next = pts[(i + 1) % n];
        const m = mid(cur, next);
        ctx.quadraticCurveTo(cur[0], cur[1], m[0], m[1]);
      }
      ctx.closePath();
    }

    _drawPin(p) {
      const ctx = this.ctx;
      const alpha = p.standing && !p.setting ? 1 : (p.fade != null ? p.fade : 1);
      if (alpha <= 0) return;
      const elevated = p.airborne || p.setting;
      const proj = elevated ? this.project(p.u, p.v, p.w) : this.project(p.u, p.v, 0);
      const x = proj.x, y = proj.y, s = proj.s;
      const rot = p.standing ? 0 : p.rot;
      const h = this.vertScale * PIN_H_RATIO * s;

      // contact shadow on the deck — present when standing or being set,
      // and grows / darkens as a descending pin nears the floor
      if (p.standing) {
        const ground = (p.setting && p.w0) ? clamp(1 - p.w / p.w0, 0, 1) : 1;
        if (ground > 0.02) {
          const gp = this.project(p.u, p.v, 0);
          const gs = 0.45 + 0.55 * ground;
          ctx.save();
          ctx.globalAlpha = 0.28 * ground;
          ctx.fillStyle = "#000";
          ctx.beginPath();
          ctx.ellipse(gp.x, gp.y, h * 0.22 * gs, h * 0.07 * gs, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      ctx.save();
      ctx.translate(x, y);
      if (!p.standing && rot) {
        // tumble about the pin's centre of mass
        ctx.translate(0, -h * 0.45);
        ctx.rotate(rot);
        ctx.translate(0, h * 0.45);
      }
      ctx.globalAlpha = alpha;

      // body
      this._pinPath(ctx, h);
      const g = ctx.createLinearGradient(-h * 0.18, 0, h * 0.20, 0);
      g.addColorStop(0, "#d4d6df");
      g.addColorStop(0.42, "#ffffff");
      g.addColorStop(1, "#bcbecb");
      ctx.fillStyle = g; ctx.fill();

      // two red neck rings
      ctx.save();
      this._pinPath(ctx, h); ctx.clip();
      ctx.fillStyle = BRAND.red500;
      ctx.fillRect(-h, -h * 0.80, h * 2, h * 0.042);
      ctx.fillRect(-h, -h * 0.71, h * 2, h * 0.042);
      ctx.restore();

      // outline + soft shade on right
      ctx.lineWidth = Math.max(0.8, h * 0.012);
      ctx.strokeStyle = "rgba(40,46,70,0.35)";
      this._pinPath(ctx, h); ctx.stroke();
      ctx.restore();
    }

    /* ---------------- loop ---------------- */
    start() {
      if (this._raf) return;
      this._last = performance.now();
      const tick = (now) => {
        const dt = Math.min(48, now - this._last);
        this._last = now;
        if (this.ball || this.state !== "idle") this.update(dt);
        this.draw();
        this._raf = requestAnimationFrame(tick);
      };
      this._raf = requestAnimationFrame(tick);
    }
    stop() {
      if (this._raf) cancelAnimationFrame(this._raf);
      this._raf = null;
      this._cancelAuto();
      window.removeEventListener("resize", this._onResize);
    }
  }

  window.LaneScene = LaneScene;
})();
