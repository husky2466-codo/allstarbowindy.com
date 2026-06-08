# USBC spine re-parse notes (2026-06-08)

Re-parsed `usbc_approved_balllist_2026-06-02.pdf` with a column-aware parser
(`scripts/parse_usbc_pdf.py`) to fix a brand/name column-split bug in the prior spine.

## What was broken

The prior parser split the brand from the ball name on a fixed/greedy boundary, which
mangled every **multi-word brand**. The first word landed in `brand` and the rest of the
brand bled into `name` with a long run of layout spaces. Examples of the OLD (broken) records:

| OLD brand | OLD name | Correct brand | Correct name |
|---|---|---|---|
| `Pro` | `Bowl                Frosted Power` | `Pro Bowl` | `Frosted Power` |
| `Bowling` | `Mania           Bowling Mania (Spare) (All Colors)` | `Bowling Mania` | `Bowling Mania (Spare) (All Colors)` |
| `Bowl` | `Star                          Bowl Star` | `Bowl Star` | `Bowl Star` |
| `Epic` | `Bowling   ...   Be Epic (All Colors)` | `Epic Bowling` | `Be Epic (All Colors)` |

The bug signature: the `name` field contained a run of **3+ spaces**, and the `brand` was a
bare fragment (`Pro`, `Bowl`, `Bowling`, `Epic`, `Star`, …).

## The fix

Split each PDF line on runs of **2+ spaces** (`re.split(r'\s{2,}', line)`). The PDF renders
(via `pdftotext -layout`) as a 3-column fixed layout: `<brand>  <name>  <date>`, columns
separated by 2+ spaces. A clean line yields exactly `[brand, name, date]`; the brand keeps its
internal single spaces ("Pro Bowl", "900 Global", "NL-Bowling Star"). This isolates the brand
correctly regardless of word count. See the script header for the full algorithm and the
complete set of date formats handled.

## Before / after counts

| File | Window | OLD count | NEW count | Records fixed |
|---|---|---|---|---|
| `usbc_2024_2026.json` | year ∈ {2024,2025,2026} | 661 | **661** | **44** |
| `usbc_2016_present.json` | year ≥ 2016 | 2,960 | **2,960** | **145** |

Counts are unchanged because the bug corrupted *fields within* records, not the set of records.

## Records dropped

**1 record dropped** (both files): `Columbia 300 — Super Cuda PowerCOR`, dated
`September 3, 3024` in the source PDF (a typo for 2024/2025). The parser drops any record whose
parsed year exceeds `listDate year + 1`. The prior parse also dropped it. Its sibling
`Super Cuda PowerCOR Pearl` (May 27, 2025) is present and correct.

No other records were dropped. **Verified zero data loss**: every ball present in the OLD files
is present in the NEW files (matched on normalized full `brand + name`), and nothing new was
added — `missing=0, added=0` for both files.

## Verification (all pass)

- 3+-space runs in `name`: OLD 44 / 145 → **NEW 0 / 0**.
- Bare-fragment brands (`Pro`/`Bowl`/`Bowling`/`Epic`/`Star`/…): OLD 20 / 28 → **NEW 0 / 0**.
- Out-of-window records: **0**. `dateApproved`/`year` mismatches: **0**. Both files valid JSON.
- Spot-checked against raw `pdftotext` output and confirmed correct:
  `Pro Bowl | Frosted Power | 2025-02`; the three `Bowling Mania` spares;
  `Epic Bowling | Be Epic (All Colors) | 2025-05` plus all `Curve`/`Ignite` color variants;
  `Bowl Star | Bowl Star | 2025-01`; `NL-Bowling Star | Depart (All Colors) | 2026-01`;
  the `ABS | Nanodesu …` family; `PBS | 乾坤 火 (Qiankun Fire) | 2024-12` and
  `PBS | 乾坤 水 (Qiankun Water) | 2025-02`.

## Odd brands / records — all verified source-faithful (not parse artifacts)

- **CJK names** `乾坤 火 (Qiankun Fire)` / `乾坤 水 (Qiankun Water)` parse cleanly under brand
  `PBS`; the internal single space stays inside the name. Stored as `\uXXXX` escapes to match
  the prior files' encoding (`ensure_ascii=True`).
- **`storm` (lowercase)** is a genuine source typo in the PDF — one entry,
  `PhysiX Paint The Lanes Pink` (2022-09) — coexisting with the proper brand `Storm` (461
  balls). Preserved verbatim; present identically in the OLD file. Not corrected here (would be
  a data edit, not a parse fix).
- **`DC`** (5 balls, "Hero (Batman/Flash/Joker/Superman)") is a real licensed brand in the PDF.
- **`KRSF`** is a real brand abbreviation in the PDF, distinct from `Strikeforce`.
- **`**` legend marker**: the PDF prefixes `**` to names of balls "manufactured only under 13
  pounds" (page-1 legend). It is a marker, not part of the name, so a leading `**` is stripped —
  matching the prior files (10 such names in the 2016+ set, e.g. `**Boost Christmas …`).

## Sort order — DEVIATION FROM THE OLD FILES (needs a decision)

The NEW files sort `balls` by **(brand, name) case-insensitive alphabetical**.

The OLD files did **not** use a clean alphabetical sort. Within each brand they preserved
**PDF source order** (e.g. `900 Global`: `Cruise Control`, `Cruise GPT`, `Cruise (PC) …` —
which is PDF appearance order, not alphabetical), and the brand grouping itself was partly
**corrupted by the very bug being fixed** (mangled brand fragments like `Bowl`, `Bowling`,
`Epic`, `KRSF`, `NL-Bowling` sorted into wrong positions; `Strikeforce` even sorted before
`Storm`). That order is non-obvious and not faithfully reproducible once the brands are fixed,
so the clean alphabetical sort was chosen instead — it is deterministic and matches the
spec's stated intent ("sort by (brand, name) … brand-then-name alphabetical").

**If you'd rather preserve PDF-source order within each brand instead, say so and the parser
can be switched.** This is the one intentional structural difference from the old files; the
ball *data* itself is otherwise a strict superset-equal (no balls lost or added).
