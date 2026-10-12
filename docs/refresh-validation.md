# Knowledge refresh validation — 2026-10-12

Base: `317b70822ab8a119a78a7e21f5640543b8493a0e` on `AvocadoHead/AI-Index`.

The static cloud retains all 120 original names, URLs, categories, scores and ordering, with permanent IDs added. The reference catalog contains 130 identities: 28 current research records, one retirement correction, and 101 entries explicitly awaiting verification. Ten research records are new reference-only entries and receive no scores or cloud position. Seven general production checks are presented separately from product facts.

## Result examples

| Existing cloud entry | Reviewed reference/result |
| --- | --- |
| Nano Banana Pro | Gemini · Nano Banana; opens Google's official image product page, preserving dated model-name observations and the title/body discrepancy |
| Domo | DomoAI; opens the video product rather than the analytics vendor |
| InVision | Retired; no active product launch, with Miro's retirement notice linked |
| Midjourney v6.1 | Midjourney product reference with dated V8.2 observations; historical cloud label and scores preserved |
| No previous Weavy entry | Figma Weave in the alphabetical reference panel; searchable by Weavy and stable research ID retained |
| Unverified legacy entries | Explicit pending-verification label and description fallback; no fabricated verification date |

## Automated checks

- `node scripts/catalog.mjs`: 130 records valid, 29 checked; all 120 original records unchanged.
- `node --test tests/*.test.mjs`: 11 terminal integration tests pass and cover both loading paths, IDs, category filtering and scores, edited/imported identities, local descriptions, corrected and retired destinations, safe tooltip text, Hebrew text direction, alias search, JavaScript export round-trip, missing metadata, and asynchronous tooltip race handling.
- `node --check` passes for `modules.js`, `script.js`, `catalog.js` and generated `catalog-data.js`.
- `git -c core.whitespace=cr-at-eol diff --check` passes (existing HTML/JS use CRLF).
- An independent comparison against `origin/main:modules.js` confirmed baseline equality after excluding added IDs.

Read-only terminal spot checks returned HTTP 200 for Google's Gemini image page, DomoAI, Miro's InVision retirement notice, Figma Weave and Midjourney's Version documentation. They confirmed the corrected identities, retirement date and the documented version observations. Other facts retain the supplied official-source research dates and references; they are not represented as independent hands-on tests.

## Review limits

No browser was opened, so layout, canvas gestures, focus behavior and mobile rendering still need visual review. No merge, deployment or hosted preview was performed. This is a dated documentation refresh, not a live updater. Descriptions no longer invoke scraping or machine-translation endpoints; existing unrelated site resources remain unchanged.

The existing local JavaScript importer still evaluates uploaded files. Its format is retained for compatibility; redesigning import security is outside this refresh.
