# Directory redesign review

The previous interface placed a dense animated cloud behind a separate narrow reference panel. On mobile, wrapping controls competed for space with that panel. The redesign makes all 130 identities one searchable directory, with explicit status and task filters, readable cards and a focused detail dialog.

## Interaction and layout

- Hebrew-first RTL and English LTR layouts, with English display summaries translated from the preserved reviewed descriptions. Canonical source notes remain in their original language and use appropriate direction.
- Desktop task chips become native task/verification selectors on mobile. No sideways-scrolling navigation or fixed overlay toolbar.
- Explicit “reviewed first” or alphabetical ordering. Scores never influence ordering or card prominence.
- Source links, model observations, limitations, uncertainties and historical scores use progressive disclosure inside the detail dialog. Original scores retain the historical/non-benchmark disclaimer.
- Native modal semantics, visible focus, explicit Tab/Shift+Tab cycling, Escape dismissal and focus restoration. Clear and empty-result actions return focus to search.
- The previous cloud/local editing UI remains at `legacy.html`, with a return link. Its script and behavior tests remain intact. The pre-existing local JavaScript `eval` importer is confined to that original view and remains deferred.

## Screenshots

[Desktop Hebrew](desktop-he.png) · [Desktop English](desktop-en.png) · [Mobile Hebrew](mobile-he.png) · [Mobile English](mobile-en.png) · [Mobile detail](mobile-detail.png)

## Verification

`node scripts/catalog.mjs` validates the unchanged canonical data. All 14 prior catalog tests remain; six additional directory tests check identity preservation, corrected taxonomy, compound search/filtering, Hebrew/English search, ordering and destination handling.

`node scripts/browser-qa.cjs` uses an installed Chrome executable in headless mode with a fresh temporary profile. Set `CHROME_BIN` if needed and `QA_OUTPUT` to select an evidence directory. It installs no dependencies. The suite checks 360px, 390px, 768px and 1440px widths in both languages: search, task/status intersections, filter resets, empty results, language switching, detail opening/closing, keyboard focus/Tab/Escape, repeated navigation, retired-entry behavior, source disclosure and horizontal overflow. The browser screenshots were visually inspected.

Canonical JSON, generated data, the original 120 records, their scores and all verification dates/sources are unchanged. The directory represents 130 identities: 29 checked (including retired InVision), 101 unverified. Ten reviewed references have no historical cloud entry or invented scores.

Reviewed task filters use reviewed capabilities; unverified task groupings derive only from original category labels. [Browser result matrix](browser-results.json) records all eight viewport/language runs.

No new services, trackers, storage, hosting changes or production deployment. The new landing page omits the old analytics tag and external icon stylesheet; it uses the site's existing Google Fonts provider with system-font fallbacks. The original view retains its pre-existing resources. Physical-device gestures and assistive-technology narration are not exhaustively tested.
