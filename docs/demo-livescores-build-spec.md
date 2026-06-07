# Demo Build Spec — LiveScores page (snapshot + fake live motion)

**For:** DesignClaude
**Goal:** A branded "Live Scores" page for the All Star Bowl demo that LOOKS and FEELS live when the client clicks around — with **zero backend**. It must not depend on Computer Score being reachable during the pitch. This is a DEMO, not the production integration.

**Approach (decided):** Static real-data snapshot + faked live motion in JS. We captured real data from the live floor on 2026-06-07; replay it with subtle animation so scores tick and the page pulses "updating," selling "live" without any real polling.

---

## Fixture data (real, captured 2026-06-07 ~3:30pm from the live floor)

All in `public/screenshots/demo-fixtures/`:

| File | What it is | Use for |
|------|-----------|---------|
| `all-lanes-board.json` | The full all-lanes overview HTML — 44 active lanes with real bowler names + seriesIDs at capture time | The "live floor" board view |
| `lane38-s0.json` | Lane 38 scoresheet (Woggie, Drece, Bj, Ricici) — state at T+0 | Live scoresheet, animation frame 1 |
| `lane38-s1.json` | Same lane, ~35s later — **Drece 55→60, Bj 69→79** (real movement) | Animation frame 2 |
| `lane38-s2.json` | Same lane, ~35s later again (static — gap between throws) | Animation frame 3 / shows realistic pauses |

Each JSON has: `{ players:[...], totals:[...], filledBowls, html: "<the raw wrapper.php fragment>" }`. The `html` field is the actual scoresheet markup (see structure below).

**Real progression captured (Lane 38):** earlier deltas Woggie 55→60, Drece 51→55, then s0→s1 Drece 55→60, Bj 69→79. So you have genuine frame-to-frame score increases to replay — not fabricated.

---

## Data structure (so you can parse/re-render in the new brand)

The scoresheet HTML (in each `lane38-s*.json` `html` field) is per-player:
```html
<div id="player1" class="player">
  <h2>Woggie</h2>
  <div class="frame filled">
    <div class="bowl-first">8</div>
    <div class="bowl-second">-</div>          <!-- "-"=miss, "X"=strike, <span class="spare">/</span>=spare -->
    <div class="bowl-arrow"><div class="bowl-total">8</div></div>   <!-- running total -->
  </div>
  ... 10 frames (last: class="frame final" with bowl-third) ...
  <div class="player-total"><div class="player-total-btm">60</div></div>
  <!-- also: table.pindicationtable with f1pin1per..pin10per, dot1/dot2/dot3 = pin standing state -->
</div>
```
The all-lanes board (`all-lanes-board.json`) is a table: `Lane N | bowler names | View Lane`. ~44 rows.

**Recommendation:** don't render their raw HTML directly — parse the fields you need (`name`, per-frame throws, running totals, player total) into a clean JS object and render YOUR components in the All Star Bowl brand. The fixtures are the data source; the look is yours.

---

## What to build

1. **"Live Floor" board** — re-skin `all-lanes-board.json`: a grid/list of lanes with current bowlers. Add a header like "🔴 LIVE — 44 lanes bowling now" and a faux "last updated 3s ago" that ticks.
2. **Lane scoresheet view** — click a lane → branded frame-by-frame scoresheet built from the `lane38-s*` fixtures. Strikes/spares/splits styled nicely. Optionally the pin diagram from pindication data.
3. **Fake live motion** (the convincer):
   - Cycle the scoresheet through `s0 → s1 → s2` on a timer (every ~5s, matching the real system's cadence), animating the changed totals counting up (Drece 55→60, Bj 69→79).
   - A subtle "updating…" pulse / spinner that flashes each cycle.
   - A "● LIVE" badge. After s2, loop back to s0 (or hold) so it runs indefinitely during the pitch.
   - Keep it subtle — real bowling has pauses (s1→s2 was static); the realistic gaps actually SELL it. Don't make every tick change.

## Hard constraints
- **No network calls to computerscore.com at runtime.** Everything reads from the local fixture JSON. The demo must work offline / if their site is down.
- It's a demo: prioritize "looks impressive on a phone/laptop when shown on-site" over completeness.
- Brand it fully — this should look like All Star Bowl's site, not Computer Score's.

## Note for later (NOT this demo)
Production = our backend polls `wrapper.php`/`view-lanes.php` every ~5s, parses, caches, serves. Same data shape as these fixtures, just live. See `docs/livescores-system-map.md` for the full endpoint map. The demo fixtures double as test data for that build.
