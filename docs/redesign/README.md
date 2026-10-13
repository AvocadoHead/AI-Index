# Sphere first: interactive review

**[Download the working standalone preview](https://github.com/AvocadoHead/AI-Index/raw/refs/heads/design/readable-directory/docs/preview/ai-index-preview.html), then open the downloaded HTML in a browser.** A GitHub image or source page is not an interactive demo. [Opening instructions](../preview/README.md).

## Original behavior and restoration

The original used Canvas 2D to project rotating 3D points, rather than WebGL. Its useful concept was a dense spherical overview, category filtering, score-sized names and hover summaries. The rejected directory removed that spatial interaction and pushed other domains below long category blocks.

The default is now a true WebGL wireframe sphere with accessible HTML labels projected onto the same geometry. Deterministic Fibonacci placement replaces random positioning; filters retain positions. Front-to-back overlap handling keeps visible labels readable and gives their full label a real click/touch target. Occluded labels can be reached by rotating or switching to Atlas. The starting orientation shows labels across multiple domains on mobile, tablet and desktop; the grouped Atlas exposes every match at once. Rotation exposes the remaining labels.

The canvas uses a white-to-light-gray gradient and darker category colors with no text glow or halos. Interactive labels meet the 4.5:1 contrast check against the darker gradient stop; faint transition labels are excluded from pointer and keyboard targets.

Motion is off on load. Drag release restores the original sense of momentum with bounded velocity (up to 0.003 radians/ms per axis), time-based exponential damping (360ms decay constant), and a small stop threshold. It settles without requiring constant rotation. New touch, keyboard pause/center, layout/filter changes and hidden-page state stop it immediately. Reduced motion disables the release coast as well as autoplay. The primary interface contains search, an explicit Categories button, a subtle Sphere/Atlas switch and a result count. The previous visible arrow/center toolbar, instructional paragraphs and score-symbol legend are removed. Focus the sphere for keyboard controls: arrows rotate, Space plays/pauses, Home centers, and Escape stops motion. These instructions remain available to assistive technology without crowding the canvas. Optional play stops on interaction; reduced-motion preference prevents autoplay. A 7px drag threshold and post-drag click suppression distinguish rotating from selecting. Pointer hover and keyboard focus show a concise summary; tapping pins it. Tab reaches its detail action; Enter opens the detail dialog; Escape dismisses and restores focus.

The **Categories** button opens a softly animated native dialog drawer. Category combinations remain available; collection, archive, verification and ordering live under Refine view. Done, Escape and outside click/tap dismiss the drawer and restore focus. Focus is contained while open; reduced motion removes the animation. The drawer does not add browser-history entries.

**Atlas**, the alternative layout, is an ordered set of domain sections with compact selectable labels and counts. It provides direct access to all matching labels without rotation. WebGL initialization failure or context loss automatically selects Atlas with an explanation. Search, category combinations, verification and scope remain shared across both layouts.

## Reversible curation

No record was deleted. `curation.js` holds display scope separately from catalog facts and immutable legacy data.

- **Starting set:** 51 tools, including creative platforms and image/video/audio work plus coding agents, research, 3D and established design applications. This is editorial selection, not a numeric ranking or a claim that other tools failed.
- **All current:** 125 entries outside the six evidenced historical records.
- **All + archive:** every one of the 131 identities.
- **Archive:** InVision, Zyro, Sora, DALL-E 3, Claude 3.5 Sonnet and Gemini 2.0 Flash. The latter two explicitly retain their generation names; their retirement does not imply the entire Claude or Gemini family is retired. Each reason has a dated source. Archived entries do not show launch actions in the new UI.

Typing a query searches beyond the starting set, including matching archived history. Selecting a domain reaches all non-archived entries in that domain. Unresolved tools remain unverified; fetch failures do not count as retirement. Stable Video and Stable Video Diffusion remain separate historical/self-hosted-related entries pending exact lineage work; they were not declared universally dead or merged. Fooocus maintenance status is not retirement.

All 120 raw legacy entries, IDs, scores, URLs and categories are unchanged. All previous 130 identities remain, plus unrated Kolbo: **131 catalog identities, 31 source-reviewed, 100 unverified**. Archive evidence is separate from those source-review totals.

## Original description behavior and current cache

Inspection of `317b708:script.js`, the pre-metadata implementation, confirms that `getModuleDescription` requested `https://api.microlink.io?url=...`, extracted `data.description` or `data.meta.description`, optionally translated it through Google's public translation endpoint, truncated it to 150 characters, and cached it in memory by module name/language. It was a third-party metadata fetch, not a direct browser fetch from each company. Later metadata work replaced this with local descriptions.

The new hover/tap preview shows a concise description and one detail link. It no longer includes category inventories, verification badges, archival-origin paragraphs, score exceptions or native tooltip provenance text. Relevant status, evidence and historical context remain in full details.

Existing reviewed descriptions remain local. `data/official-summaries.json` and `official-summaries.js` add 16 concise bilingual summaries grounded in public official-homepage descriptions fetched on 2026-10-12. The original observed description, resolved URL and date are retained. These are homepage summaries, not full capability/availability reviews, and do not change the 31 reviewed / 100 unverified catalog totals. Source links and dates are included discreetly in details.

No runtime proxy, backend, credentials, scraping bypass or translation service was added. Static Pages cannot assume every official site permits cross-origin HTML reads; the offline preview cannot rely on live network requests. This cache is an honest reliability choice, not a claim of live-fetch parity. Lovable's 403 was not retried through a bypass. The Llama URL redirected to a different Meta model offering and was excluded. Pages with absent or uninformative descriptions retain a short unavailable message rather than a fabricated product description.

## Families, platforms and scores

Stable family names keep generations inside dated observations or original-record details. Matching a provider name does not merge distinct products: Flow is not Veo, and platforms that offer other models do not own those model families. Weave, Kolbo, Magnific and Firefly are first-class creative platforms; no personal-use preference was published.

The old Nano Banana `banana.dev` developer scores are retained but do not size the corrected image family. Magnific's old upscaler scores do not rate its broader platform. No Nano Banana 2.5 claim or invented score was added. Weave's catalog was not exhaustively validated after a direct-fetch failure; Kolbo's authenticated inventory was not queried. Vendor claims are not benchmarks.

Assistant is bundled from the [official Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/assistant), under the [SIL Open Font License](../../assets/fonts/OFL.txt). No runtime font connection is needed.

Estimated sizing uses original category scores relevant to combined domain filters, or their overall average in All. Readability floors do not modify stored scores. Color denotes domain. Estimated scores and source-review status remain distinct in details; their former superscript markers are hidden from the visual overview. Sphere labels have a 16px minimum and at least 44px target height. Overlapping and rear labels are hidden from both pointer and keyboard focus until rotated into view; Atlas always exposes every matching entry.

## Supplementary screenshots

| Width | Hebrew sphere | English sphere |
| --- | --- | --- |
| 360 | [Sphere](360-he-sphere.png) | [Sphere](360-en-sphere.png) |
| 390 | [Sphere](390-he-sphere.png) | [Sphere](390-en-sphere.png) |
| 768 | [Sphere](768-he-sphere.png) | [Sphere](768-en-sphere.png) |
| 1440 | [Sphere](1440-he-sphere.png) | [Sphere](1440-en-sphere.png) |

[Category drawer](390-he-categories.png) · [Mobile summary](390-he-sphere-summary.png) · [Atlas](1440-en-directory.png) · [Full details](390-en-detail.png) · [Original cloud reference](1440-en-original.png).

## Verification

- `node --test tests/*.test.mjs`: 29 tests pass, including original catalog regressions, deterministic sphere geometry, frame-rate-independent inertia damping, reversible curation, dated bilingual summary-cache integrity and broad category/search reachability.
- `node scripts/catalog.mjs`: 131 records, 31 reviewed; all 120 legacy records unchanged.
- Isolated headless Chrome with a temporary profile, never the personal browser. Eight 360/390/768/1440 RTL/LTR configurations validate sphere rendering, actual mouse/touch drag-release coasting and settling, interruption by new touch, Pause/Center, reduced-motion drag without coasting, drag versus tap, summaries/details, layout changes, shared filters, focus, Escape, font loading, text/target sizes and no overflow. Context loss falls back to Atlas with all entries retained.
- Separate unsupported-WebGL and reduced-motion scenarios pass. The generated standalone HTML passes the same browser suite with all HTTP(S) requests blocked. [Machine-readable evidence](results.json).
- Rendered mobile, tablet, desktop, summary, category-drawer and Atlas screenshots were inspected. Physical-device and screen-reader testing is not exhaustive.

No merge, production deployment, new hosting, trackers, credentials or access changes. The standalone HTML is a local interactive review route, not a hosted site.

## Final rim-transition revision — 2026-10-13

Labels now emerge through a smooth depth-based opacity curve instead of switching on at a fixed rear-depth threshold. Collision occlusion also dissolves with time-based damping, including after rotation settles. Pointer and keyboard targets require both a clear projected position and at least 90% opacity; focused labels remain readable. Reduced motion uses the spatial curve without extra temporal animation. Sphere inertia, geometry, typography, categories and catalog data are unchanged.

The 29 unit/regression tests and all eight offline 360/390/768/1440 Hebrew/English browser configurations pass, plus unsupported WebGL, context loss and reduced motion. Frame-by-frame instrumentation verifies intermediate opacity, bounded changes and no hit/focus targets below the readability threshold. Rendered rotation sequences were inspected on mobile and desktop. [Results](rim-transition/results.json).

Recorded mobile rotation frames: [0](rim-transition/390-he-rotation-0.png) · [1](rim-transition/390-he-rotation-1.png) · [2](rim-transition/390-he-rotation-2.png) · [3](rim-transition/390-he-rotation-3.png) · [4](rim-transition/390-he-rotation-4.png) · [5](rim-transition/390-he-rotation-5.png).

Recorded desktop rotation frames: [0](rim-transition/1440-en-rotation-0.png) · [1](rim-transition/1440-en-rotation-1.png) · [2](rim-transition/1440-en-rotation-2.png) · [3](rim-transition/1440-en-rotation-3.png) · [4](rim-transition/1440-en-rotation-4.png) · [5](rim-transition/1440-en-rotation-5.png).

Merge and deployment through the existing GitHub Pages configuration are now authorized after this focused fix. Deployment completion is verified separately from these pre-merge test results.
