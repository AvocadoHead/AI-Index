# Useful visual index — draft review

Sphere is the initial view when WebGL is available. Atlas remains the accessible alternative and automatic WebGL fallback, grouping 66 starting tools into eight typographic clusters. Assistant is bundled from Google Fonts under SIL OFL. Sphere inertia and reversible unfolding remain available. Explicit layout selections survive filtering and language changes during the session; there was no persisted cross-session preference to preserve. Search reaches the full catalog, while category filters expand beyond the starting set. A summary opens on hover/focus or a pinned click; mobile uses a bottom sheet. Details lead with purpose and an action, with sources and historical scores behind disclosures.

## Review artifacts

- [Download the self-contained interactive HTML](https://github.com/AvocadoHead/AI-Index/raw/refs/heads/design/useful-visual-index/docs/preview/ai-index-preview.html). Download and open it in a browser; GitHub's source viewer does not execute HTML.
- [Initial mobile Sphere](390-844-he-sphere.png) · [Initial desktop Sphere](1440-900-en-sphere.png)
- [Desktop Atlas, Hebrew](1440-900-he-overview.png) · [Desktop English](1440-900-en-overview.png)
- [Mobile Hebrew](390-844-he-overview.png) · [Mobile English](390-844-en-overview.png) · [360px mobile](360-he-overview.png)
- [Short 400×605 viewport](400-605-he-overview.png) · [768px tablet](768-en-overview.png)
- [Mobile summary](390-844-he-summary.png) · [Mobile sphere](390-844-en-sphere.png) · [Desktop sphere](1440-900-he-sphere.png) · [Unfolding midpoint](390-he-unfold-340.png)
- [Video workflow](390-844-he-workflow.png) · [Route-specific resolutions](390-844-he-routes.png) · [Magnific video finishing](390-844-he-upscaler.png)

## Catalog changes

All 131 pre-existing identities were reviewed; all 120 original records, URLs, categories and numeric scores remain byte-for-byte equivalent to the baseline. The catalog now has 158 identities: 154 with official-source review and four unresolved. Twenty-seven new current products have no inherited scores. Twenty-two historical or unresolved records are archived; this is separate from confirmed retirement (seven records). The default collection contains 66 tools.

[Audit coverage and bilingual descriptions](../../data/catalog-audit.json) records the decision for every identity and the 27 additions. [Canonical metadata](../../data/catalog.json) retains dated sources. No output benchmark, paid generation or account-level entitlement test was performed. The audit is public-source research, not a new quality ranking.

Corrections include Kaps captioning, DomoAI's distinct identity, Magnific upscalers versus the wider platform, Reve's consumer shutdown, Riffusion → Flow Music and Galileo → Stitch. Historical ChatGPT, DeepSeek, Claude, Gemini, ElevenLabs, Suno, Veo and Wan generations remain distinct from current product/family entries. Changed generations and mismatched products do not inherit current label-size scores. Valid original estimates remain accessible and explicitly historical; unrated tools receive a neutral size.

Haiper and CSM/Cube availability remain unresolved. DeepArt and the old Whisper Typing identity remain unresolved historical entries. Failed retrieval is not treated as proof of shutdown. The separately verified WhisperTyping product has its own unscored identity. Other lower-priority or nested addition candidates were not turned into new top-level entries.

The workflow contains no personal attribution: multimodal low-resolution trials in MiniMax H3 or Seedance 2.5, take selection, supported regeneration or Magnific video upscaling, then editing. Route details distinguish H3 from H3 Max, BytePlus 480p Draft → 1080p final, Kaiber resolutions and Magnific Precision/Creative up to 4K.

## Verification

- 35 automated tests pass; canonical and generated editorial validators pass.
- Isolated Chrome: 360, 390, 768 and 1440px, Hebrew RTL and English LTR; font loading, overflow, 44px label targets, score sizing, search/category/status combinations, summary/detail flows, Escape and focus, repeated touch/keyboard navigation, sphere inertia/fades and interrupted/reversed unfolding.
- WebGL-unavailable fallback, WebGL context loss and reduced-motion paths pass.
- Standalone HTML checked with HTTP(S) blocked at 400×605, 390×844 and 1440×900. Every one of the 158 details was checked in both languages against the audited text, without overflow or personal attribution.
- Atlas overview counts at 400×605: 21 labels visible; at 390×844: 35; at 1440×900: 66 and all eight category headings. [Measurements](review-results.json) · [Browser regression results](browser-results.json).
- Initial Sphere selection is asserted before every supported-device flow. The Atlas selection survives language changes. The scrolled mobile close-control focus ring remains inside the dialog; the English search placeholder fits and the original-index link is inside the sources disclosure.
- Rendered screenshots were inspected. No personal browser profile was accessed.

Reproduce with `node scripts/catalog.mjs`, `node scripts/editorial.mjs`, `node --test tests/*.test.mjs`, `node scripts/browser-qa.cjs` and `QA_ENTRY=docs/preview/ai-index-preview.html QA_OFFLINE=1 node scripts/review-screenshots.cjs`.

This is a draft review branch. Production remains at `de02a1f7c90e31fec4f7a6b534b48bb1bf84961e`; no merge, deployment or new hosting is part of this change.
