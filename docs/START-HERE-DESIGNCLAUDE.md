# Start Here — DesignClaude

You (DesignClaude) have this folder linked read-only. You can **read** files and images but
**cannot write** anything — so your built pages reach the repo only when the user hands your output
to the main Claude session, which writes and commits them. Surface your code/designs in chat; don't
try to save files.

Read **only these**, in order. Ignore everything else in `docs/` (handoffs, research appendices) —
they're internal and will just dilute your context.

## Read these (and nothing else)

1. **`docs/DESIGNCLAUDE-CONTENT-BRIEF.md`** — every page's content: facts, prices, rules. The
   authoritative content spec. Nothing is built yet; treat every section as [MISSING].
2. **`docs/MEMBER-AREA-SCOPING.md`** — what the member/Account area may show. Read the
   **do-not-fabricate** list and the **Tier A vs Tier B** split before designing any member page.
3. **`public/js/data.js`** — the live data layer (`window.ASB_DATA`). Components read from here.
4. **Reference images** — `public/img/reference/` (flyers in `infodocs/`, logo in `logos/`, interior
   in the per-area `flat-crops/` folders). **The image always wins** over transcribed text when they
   disagree.

If you want the *why* behind the member area, `MEMBER-METRICS-SUITE.md` and
`ARCHITECTURE-LONGEVITY.md` exist — but only open them if you need them; they're background.

## The three rules that govern every page you build

1. **Never hardcode data into JSX.** Business facts, member names, averages, saved items — all read
   from the data layer (`window.ASB_DATA`, and a `window.ASB_MEMBER` stub for member data). When the
   backend lands later, wiring it must be a one-file data-source swap, not a component rewrite.
2. **Do not fabricate member data.** A member with no tracked games shows an **empty state**, never a
   fake average/points/tier. Anything not backed by real owned data or a real source must be visibly
   labeled placeholder / Phase 2. (Full rules in `MEMBER-AREA-SCOPING.md`.)
3. **The image wins.** When a price or rule in the brief disagrees with a reference flyer image, trust
   the image and flag the discrepancy.
