# Sphere first: interactive review

**[Download the working standalone preview](https://github.com/AvocadoHead/AI-Index/raw/refs/heads/design/readable-directory/docs/preview/ai-index-preview.html), then open the downloaded HTML in a browser.** A GitHub image or source page is not an interactive demo. [Opening instructions](../preview/README.md).

## Original behavior and restoration

The original used Canvas 2D to project rotating 3D points, rather than WebGL. Its useful concept was a dense spherical overview, category filtering, score-sized names and hover summaries. The rejected directory removed that spatial interaction and pushed other domains below long category blocks.

The default is now a true WebGL wireframe sphere with accessible HTML labels projected onto the same geometry. Deterministic Fibonacci placement replaces random positioning; filters retain positions. Front-to-back overlap handling keeps visible labels readable and gives their full label a real click/touch target. Occluded labels can be reached by rotating or switching to Atlas. The starting orientation shows 11–14 labels on mobile, 23 on tablet and 27 on desktop, across six or seven domains. Rotation exposes the remaining labels.

Motion is off by default. Drag to rotate, use the left/right controls, or focus the sphere and use arrow keys. Center restores the stable initial orientation. Optional play stops on interaction; reduced-motion preference prevents autoplay. A 7px drag threshold and post-drag click suppression distinguish rotating from selecting. Pointer hover and keyboard focus show a concise summary; tapping pins it. Tab reaches its detail action; Enter opens the detail dialog; Escape dismisses and restores focus.

**Atlas**, the alternative layout, is an ordered set of domain sections with compact selectable labels and counts. It provides direct access to all matching labels without rotation. WebGL initialization failure or context loss automatically selects Atlas with an explanation. Search, category combinations, verification and scope remain shared across both layouts.

## Reversible curation

No record was deleted. `curation.js` holds display scope separately from catalog facts and immutable legacy data.

- **Starting set:** 51 tools, including creative platforms and image/video/audio work plus coding agents, research, 3D and established design applications. This is editorial selection, not a numeric ranking or a claim that other tools failed.
- **All current:** 125 entries outside the six evidenced historical records.
- **All + archive:** every one of the 131 identities.
- **Archive:** InVision, Zyro, Sora, DALL-E 3, Claude 3.5 Sonnet and Gemini 2.0 Flash. The latter two explicitly retain their generation names; their retirement does not imply the entire Claude or Gemini family is retired. Each reason has a dated source. Archived entries do not show launch actions in the new UI.

Typing a query searches beyond the starting set, including matching archived history. Selecting a domain reaches all non-archived entries in that domain. Unresolved tools remain unverified; fetch failures do not count as retirement. Stable Video and Stable Video Diffusion remain separate historical/self-hosted-related entries pending exact lineage work; they were not declared universally dead or merged. Fooocus maintenance status is not retirement.

All 120 raw legacy entries, IDs, scores, URLs and categories are unchanged. All previous 130 identities remain, plus unrated Kolbo: **131 catalog identities, 31 source-reviewed, 100 unverified**. Archive evidence is separate from those source-review totals.

## Families, platforms and scores

Stable family names keep generations inside dated observations or original-record details. Matching a provider name does not merge distinct products: Flow is not Veo, and platforms that offer other models do not own those model families. Weave, Kolbo, Magnific and Firefly are first-class creative platforms; no personal-use preference was published.

The old Nano Banana `banana.dev` developer scores are retained but do not size the corrected image family. Magnific's old upscaler scores do not rate its broader platform. No Nano Banana 2.5 claim or invented score was added. Weave's catalog was not exhaustively validated after a direct-fetch failure; Kolbo's authenticated inventory was not queried. Vendor claims are not benchmarks.

Assistant is bundled from the [official Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/assistant), under the [SIL Open Font License](../../assets/fonts/OFL.txt). No runtime font connection is needed.

Estimated sizing uses original category scores relevant to combined domain filters, or their overall average in All. Readability floors do not modify stored scores. Unrated labels have a diamond, source-reviewed labels a separate check, and color denotes domain. Sphere labels have a 16px minimum and at least 44px target height. Overlapping and rear labels are hidden from both pointer and keyboard focus until rotated into view; Atlas always exposes every matching entry.

## Supplementary screenshots

| Width | Hebrew sphere | English sphere |
| --- | --- | --- |
| 360 | [Sphere](360-he-sphere.png) | [Sphere](360-en-sphere.png) |
| 390 | [Sphere](390-he-sphere.png) | [Sphere](390-en-sphere.png) |
| 768 | [Sphere](768-he-sphere.png) | [Sphere](768-en-sphere.png) |
| 1440 | [Sphere](1440-he-sphere.png) | [Sphere](1440-en-sphere.png) |

[Mobile summary](390-he-sphere-summary.png) · [Atlas](1440-en-directory.png) · [Full details](390-en-detail.png) · [Original cloud reference](1440-en-original.png).

## Verification

- `node --test tests/*.test.mjs`: 25 tests pass, including original catalog regressions, deterministic sphere geometry, reversible curation and broad category/search reachability.
- `node scripts/catalog.mjs`: 131 records, 31 reviewed; all 120 legacy records unchanged.
- Isolated headless Chrome with a temporary profile, never the personal browser. Eight 360/390/768/1440 RTL/LTR configurations validate sphere rendering, actual mouse drag, mobile touch drag versus tap, summaries/details, layout changes, shared filters, focus, Escape, font loading, text/target sizes and no overflow. Context loss falls back to Atlas with all entries retained.
- Separate unsupported-WebGL and reduced-motion scenarios pass. The generated standalone HTML passes the same browser suite with all HTTP(S) requests blocked. [Machine-readable evidence](results.json).
- Rendered mobile, tablet, desktop, summary and Atlas screenshots were inspected. Physical-device and screen-reader testing is not exhaustive.

No merge, production deployment, new hosting, trackers, credentials or access changes. The standalone HTML is a local interactive review route, not a hosted site.
