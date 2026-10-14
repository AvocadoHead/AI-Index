# Sphere exploration, pinned previews and the next catalog iteration

## Sphere exploration

Gentle wheel movement over the sphere reveals the full catalog, then moves the viewpoint inside its shell. The depth slider and Outer view / Full collection / Inside buttons provide keyboard and touch alternatives. The previous collection and all task/search/status filters survive the round trip. Expanding includes archived records; their details retain lifecycle and provenance information. Atlas offers the full filtered list.

New labels dissolve in, with collision checks and edge fading; only sufficiently visible labels accept input. Existing score-to-type-size mapping stays unchanged. Wheel deltas are normalized and capped for trackpads, line-mode wheels and page-mode wheels. Wheel input passes through at the depth boundaries, with modifier keys, while a card is pinned, and in reduced-motion mode. Vertical touch gestures scroll the page; sideways gestures rotate with the existing inertia. Reduced motion uses immediate explicit depth changes. The palette shifts video from rust to muted blue-teal, with quieter violet, olive and slate accents.

## Implemented preview fixes

Hover previews a tool. A single click pins its card; incidental pointer movement and focus on other labels cannot replace it. Clicking another label deliberately selects it. Clicking the pinned label again, the close button, outside the card, or Escape closes it. Enter activates the same behavior. Escape restores focus. Moving across a neighboring label into the card preserves the card and its DOM; a deliberate hover on another label has a short delay. Tapping a label during the sphere/atlas transition settles the animation before activating it once.

Seedance now opens its verified 2.5 page. Kolbo's destination remains unchanged. Codex already belongs to the selected 66 tools and Code & workflows; English and Hebrew aliases improve discovery without another identity or an invented score.

## Bounded next step: model access relationships (proposal)

Add a small, source-backed relationship collection, rather than duplicating model families for every hosting platform. Each relation should contain:

- Platform ID and model-family ID, generation/version/mode, product surface and task.
- Supported input and output modalities; distinguish audio references from generated audio. Video entries should explicitly state text, image, video and audio inputs where verified.
- Plan, region or account restrictions; use unknown when not checked.
- Verified launch URL if available, documentation URL, official source and checked date.
- Availability state: documented, tested, unavailable or unknown.

Platform detail panels can link internally to their model families. Model panels can list verified access routes back to platforms. Keep providers, platforms, coding-agent products and foundation models distinct; Codex is not a model-family duplicate. Do not assume a provider's latest generation is offered by every host.

A bounded pilot would cover a few Firefly routes and Seedance's official access routes before expanding to Figma Weave and OpenAI products. Adobe's official matrix documents FLUX.2 for image tasks, Veo 3.1 for video, and Ray 3 variants on particular Firefly surfaces. It lists Dreamina Seedance 2.0 routes; that is not evidence of Seedance 2.5 in Firefly. Check each host, version and task separately.

Sources checked 2026-10-14:

- [Adobe's partner model and product matrix](https://helpx.adobe.com/creative-cloud/apps/generative-ai/non-adobe-models-in-adobe-products.html)
- [Seedance 2.5 official page and access links](https://seed.bytedance.com/en/seedance2_5)

The selected 66 are an editorial starter set, not a verified There's An AI For That ranking. Canva AI, GitHub Copilot, Make, Zapier and Leonardo already exist in the full catalog. Consider any future starter-set changes against concrete student tasks and overlap, rather than adding records or claiming external rank.

## Transparent scoring (proposal; no scores assigned)

An evaluation belongs to a **task + platform + model/version/mode/plan**, with settings and evaluation date. Preserve the original historical estimates separately. New evaluations start as `untested` with null values, never zero.

| Dimension | Evidence required before assigning a value |
| --- | --- |
| Quality | Comparable saved outputs from a shared task brief, inputs and constraints; a published task-specific rubric and review notes. |
| Control | A feature checklist that distinguishes officially documented controls from controls actually exercised, with saved inputs/settings and observed results. |
| Value | Actual cost of a usable deliverable, including failed attempts and retries, currency, date, plan and matching output resolution/duration. |

Show the three dimensions separately before considering any composite. Let users inspect outputs, rubric, sample size, limitations and provenance. Confidence and verification status describe evidence, not output quality. Unknown restrictions, untested controls and unavailable prices remain explicitly unknown. No paid benchmark runs, fabricated benchmark values or inferred external rankings are part of this change.

## Validation

Run `node --test tests/*.test.mjs`, `node scripts/browser-qa.cjs` `node scripts/preview-pin-qa.cjs` and `node scripts/exploration-qa.cjs`. The browser scripts use disposable isolated Chrome profiles. The full suite covers 360/390/768/1440 px in Hebrew and English, font loading, score sizing, filters, detail flows, layout motion and fallbacks. The targeted suite checks both layouts, normal/reduced motion, pointer transitions, pinned state, keyboard and repeated mobile touch actions.

The exploration suite covers all four widths in both languages, native wheel input and boundary release, native keyboard range control, mobile touch controls and page scrolling, pinned-card stability, filter retention, Atlas access and reduced-motion controls.

## Review images

| View | Mobile Hebrew | Desktop English |
| --- | --- | --- |
| Outer selection | [360 px](screenshots/360-he-outer.png) | [1440 px](screenshots/1440-en-outer.png) |
| Transparent collection | [360 px](screenshots/360-he-transparent.png) | [1440 px](screenshots/1440-en-transparent.png) |
| Inside | [360 px](screenshots/360-he-inside.png) | [1440 px](screenshots/1440-en-inside.png) |

Also: [390 px English inside](screenshots/390-en-inside.png), [768 px Hebrew inside](screenshots/768-he-inside.png), [pinned mobile card](screenshots/390-he-pinned.png). These renders were inspected after the implementation. Downloadable interactive review: [preview instructions](../preview/README.md).

Results: [exploration matrix](exploration-results.json), [pin interaction matrix](pin-results.json). The production catalog remains 158 identities, including 120 unchanged legacy records; source/editorial validation and all 38 unit tests pass.

The [full browser results](browser-results.json) cover 360/390/768/1440 px × Hebrew/English plus unsupported-WebGL and reduced-motion fallback checks. The standalone HTML also passed the 390 px Hebrew suite with HTTP(S) requests blocked. All browser runs used isolated disposable profiles.
