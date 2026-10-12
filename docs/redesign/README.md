# Typographic atlas revision

The original cloud made many tools visible at once and used estimated scores to size text. This revision restores that overview with selectable HTML labels in quiet category colors, compact headings, and on-demand details. The large hero and individual tool cards are removed.

Assistant is self-hosted from the [Google Fonts Assistant source](https://github.com/google/fonts/tree/main/ofl/assistant), under the bundled [SIL Open Font License](../../assets/fonts/OFL.txt). No external font request is needed.

## Reading the map

- Label size uses the arithmetic average of the original record's estimated scores, matching the original all-category averaging principle. Desktop sizing is `16 + 60 × clamp(average − 0.75, 0, 0.25)` pixels; mobile uses 80%, with a 16px reading floor. The readable floor does not change stored scores.
- Unrated additions have a neutral 17px size (16px on mobile) and a diamond; no score is invented. Hover or accessible labels expose the exact original estimated average. Full original category scores remain in details.
- Check marks indicate dated source review, independently of score, color and size. A cross marks retired tools. These are not current benchmarks or recommendations.
- Each identity appears once in the overview, in its first matching broad task group. A category filter includes every matching tool, including cross-category tools. Names, sources and original categories remain available in details.
- Mobile uses a single wrapping field with native category and verification selectors; tablet has two columns and desktop three. All labels have at least 44px touch height and remain selectable.

## Screenshots

| Width | Hebrew RTL | English LTR |
| --- | --- | --- |
| 360 | [Overview](360-he-directory.png) | [Overview](360-en-directory.png) |
| 390 | [Overview](390-he-directory.png) | [Overview](390-en-directory.png) |
| 768 | [Overview](768-he-directory.png) | [Overview](768-en-directory.png) |
| 1440 | [Overview](1440-he-directory.png) | [Overview](1440-en-directory.png) |

[Mobile details](390-en-detail.png) · [Original cloud reference](1440-en-original.png)

## Validation

`node --test tests/*.test.mjs`: all 21 tests pass, including the 14 original catalog regressions. `node scripts/catalog.mjs` confirms 130 identities, 29 checked including retired InVision, 101 unverified, and unchanged legacy records. Canonical data files and sources are unchanged.

`QA_OUTPUT=docs/redesign node scripts/browser-qa.cjs`: all eight width/language combinations pass using installed headless Chrome with a fresh temporary profile, without accessing the personal browser. [Machine-readable results](results.json) include successful Assistant loading, score-size mapping, no horizontal overflow, 16px minimum mobile text and 44px minimum targets. Desktop shows 86 labels in its initial 1440×1100 viewport; mobile shows 18–20 in 360/390×844.

Coverage includes compound search/category/status filters, category-heading exploration, clear/reset/empty results, language preservation, dialog details/sources/scores, repeated touch open/Escape/focus return, repeated button close, Tab focus containment, and retired launch suppression. Screenshots were inspected at mobile, tablet and desktop sizes, in RTL and LTR, including details and the original cloud. Emulation is not a physical-device or screen-reader audit.

Draft PR only. No merge, deployment, new service or tracker. Screenshots are repository artifacts; no Library upload is claimed.
