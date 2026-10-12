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
- `node --test tests/*.test.mjs`: 14 terminal integration tests pass and cover both loading paths, IDs, category filtering and scores, edited/imported identities, local descriptions, corrected and retired destinations, safe tooltip text, Hebrew text direction, alias search, JavaScript export round-trip, missing metadata, and asynchronous tooltip race handling.
- `node --check` passes for `modules.js`, `script.js`, `catalog.js` and generated `catalog-data.js`.
- `git -c core.whitespace=cr-at-eol diff --check` passes (existing HTML/JS use CRLF).
- An independent comparison against `origin/main:modules.js` confirmed baseline equality after excluding added IDs.

Read-only terminal spot checks returned HTTP 200 for Google's Gemini image page, DomoAI, Miro's InVision retirement notice, Figma Weave and Midjourney's Version documentation. They confirmed the corrected identities, retirement date and the documented version observations. Other facts retain the supplied official-source research dates and references; they are not represented as independent hands-on tests.

## Review limits

Follow-up QA used installed Chrome in isolated headless mode with a fresh temporary profile and external networking blocked. Desktop (1440×900), mobile Hebrew (390×844), and a truly absent metadata bundle all loaded 120 cloud records with zero JavaScript runtime errors. Search, first-click language switching, Hebrew direction, corrected/retired destinations and reference-panel viewport bounds passed. No personal browser or profile was opened. No merge, deployment or hosted preview was performed. This is a dated documentation refresh, not a live updater. Descriptions no longer invoke scraping or machine-translation endpoints; existing unrelated site resources remain unchanged.

The existing local JavaScript importer still evaluates uploaded files. Its format is retained for compatibility; redesigning import security is outside this refresh.

## Follow-up regression evidence

The absent-bundle fallback now guards workflow access. A regression removes `window.aiCatalog` entirely and executes directory initialization. The reference UI follows the existing language toggle, preserves the search query, and translates control and metadata labels. Language initialization now makes the first click switch to Hebrew. The panel stays below the toolbar when controls wrap on mobile.

- [Desktop screenshot](qa/desktop.png)
- [Mobile Hebrew screenshot](qa/mobile-hebrew.png)
- [Missing-bundle screenshot](qa/missing-bundle.png)
- [Headless smoke results](qa/results.json)

External fonts, icons, analytics and favicons were intentionally blocked during isolated QA. Screenshots therefore demonstrate layout with available local fonts, not externally loaded font/icon fidelity. Canvas gestures, touch-device behavior and full keyboard navigation were not exhaustively tested. With the metadata bundle absent, the original legacy destinations remain available; reviewed corrections and retirement status require that bundle. The existing dense cloud layout and local `eval` importer remain deferred.
