# Sphere → Atlas draft

[Download the standalone preview](https://github.com/AvocadoHead/AI-Index/raw/refs/heads/design/unfolding-atlas/docs/preview/ai-index-preview.html), save it as HTML and open it in Chrome or another modern browser. It embeds Assistant, scripts and data and works offline. This branch is a review preview, not a production deployment.

The same tool names travel from their projected sphere positions to their category positions. The wireframe flattens and fades, section lines and headings arrive gently, and previously occluded names appear once the layout has separated. Reversing midway starts from the current rendered positions. Height interpolates to avoid an abrupt document jump. Resize retargets the transition; filters settle it before updating results. A tap or keyboard focus on a moving label settles the layout and opens its summary. Reduced motion switches directly without added animation.

The light theme, Assistant font, geometry, rotation inertia, category access and provenance UI remain intact. No duplicate overlay labels or additional hosting are introduced.

## Creative guidance

The workflow dialog now contains Eyal’s attributed image/video preferences and a four-step image-to-video finishing path, in Hebrew and English. Version notes are nested in existing tool details and searchable by their model names. They are held in `creative-guide.js` / `data/creative-guide.json`, separate from catalog verification and original numeric scores.

Official pages supplied for GPT Image 2, Nano Banana, Seedance, MiniMax H3/H3 Max, FLUX 3 Video and Magnific were read on October 13, 2026. URLs are retained beside the notes. Nano Banana 2.5 remains an unresolved marketing/developer-name mapping. H3 Max 480p/768p text/image inputs are not conflated with direct H3 768p/2K multimodal inputs. Seedance 1.5 Pro generates native audio. Higgsfield is mentioned as a platform, not as a verified “Premium” model. Regeneration/upscaling can alter faces, text and products; costs depend on route and settings.

The supplied Wan 3 release URL exposed a generic release-page shell during this read. Wan 3 is therefore presented as Eyal’s budget preference, not a newly verified capability inventory. No verification totals are upgraded by these editorial notes. All 120 original records/scores, 131 canonical identities, 31 reviewed and 100 unverified records are retained; existing catalog and source files are unchanged.

## Validation

31 unit/regression tests and the catalog validator pass. Isolated headless Chrome on the connected Mac uses a fresh temporary profile, with HTTP(S) blocked for the standalone preview; the personal browser profile is not used.

The browser suite covers 360/390/768/1440 in Hebrew RTL and English LTR, repeated/reversed toggles, coordinate continuity at reversal, resizing mid-transition, scroll position, animation cleanup, selecting a moving label, search/filter/category/detail flows, Assistant loading, score-size mapping, sphere drag/inertia, WebGL loss/fallback and reduced motion. Screenshots include paused samples of the real browser animations for visual inspection. Physical-device and screen-reader coverage is not exhaustive.

[Machine-readable results](results.json) · [Mobile opening](390-he-unfold-160.png) · [Mobile settling](390-he-unfold-340.png) · [Mobile Atlas](390-he-unfold-atlas.png) · [Desktop opening](1440-en-unfold-160.png) · [Workflow](390-he-workflow.png).

No merge or deployment is authorized for this iteration. Production remains at `144e662f2fc7341a91d38a69dc08ba5105561a9e`.
