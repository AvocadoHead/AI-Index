# AI Index: original interaction restored

## Audit: original versus the rejected directory

| Original behavior | What PR2 lost | Current restoration |
| --- | --- | --- |
| One field showed names from many domains together | Cards, then complete category columns, pushed most domains below the mobile fold | One wrapping typographic field interleaves eight domains; category color is keyed by the filter legend |
| Original average/category estimates changed text size | Cards hid scores; the first atlas used only an overall average | Size reflects the original scores relevant to the chosen domains, or the overall average in All |
| Category buttons could be combined | One exclusive task selector | Toggle any combination; matching is an explicit union, with search and verification applied together |
| Hover exposed descriptions | A full dialog was required | Pointer hover and keyboard focus show a concise preview; tapping pins it; a separate action opens full details |
| Compact controls left space for the tools | Hero, metadata and large gaps consumed the first screen | No hero; compact search, filters and legend above the shared field |

The original canvas's 3D movement and overlapping text are not retained. Selectable DOM labels preserve the simultaneous overview with reliable keyboard focus and touch targets. The original implementation remains at `legacy.html`.

## Identity and evidence

All 120 raw legacy entries, IDs, scores, URLs and categories are unchanged. All previous 130 catalog identities remain; Kolbo.AI adds one new unrated identity. Totals are now **131 identities, 31 source-reviewed (including retired InVision), 100 unverified**. Magnific's formerly unverified entry now has dated official-source metadata.

Generation strings are removed from family-level labels (for example ChatGPT, Claude, Gemini, Veo, Wan and Udio), with the untouched historical name and scores in details. Dated model observations remain nested. Stable IDs deduplicate repeated appearances of the same family; matching a vendor name is never sufficient to merge distinct products. Google Flow remains separate from Veo; Stable Video's historical app entry remains distinct from the Stable Video Diffusion model entry. No provider or product has been merged on an unverified equivalence.

Creative platforms are first-class: Weave, Kolbo, Magnific, Firefly, Krea and ComfyUI are discoverable through the Creative platforms filter. Their summaries distinguish workflow/platform products from model families. A platform offering a model does not make that model its own, nor imply API access.

- **Nano Banana:** one family; Google documents 2.1, original Gemini 2.5 Flash Image, Pro, 2 and 2 Lite. No Nano Banana 2.5 claim. The old `banana.dev` developer scores are retained as provenance, but excluded from this corrected image-family label.
- **Magnific:** current broad platform and historical upscaler scope are explained separately. Its old upscaler scores do not rank the broader platform.
- **Kolbo:** vendor-described multi-model creative workspace, with Visual DNA and project context; unrated. No authenticated inventory/API call was made.
- **Weave:** vendor model-catalog references are not an exhaustively validated live inventory; direct catalog retrieval failed in research. Third-party API permissions are distinct from the general catalog.
- **Firefly:** the platform, Adobe-owned model families and third-party models remain distinct in the identity notes and model observations. Availability at a platform is not family-wide availability.

Official URLs and checked dates are in each record's sources. Prior source references are retained. No private user preference has been published and no numeric score was added.

## Visual rules and interaction

Assistant is bundled locally from the [official Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/assistant), under the [SIL Open Font License](../../assets/fonts/OFL.txt).

Desktop label size is `16 + 80 × clamp(estimate − 0.75, 0, 0.25)` px. Mobile scales this to 72%, with a 16px minimum. The floor keeps low estimates readable without modifying the source values. Unrated labels use 17px/16px and a diamond. Hover labels expose the numerical estimate; source review is a separate check mark, retirement a cross. Color denotes domain, never score or verification.

Category chips combine by union; search and status narrow that union. Labels are interleaved by primary domain so even mobile begins with multiple domains. The primary domain follows the first recorded capability/category, with explicitly identified creative platforms grouped as platforms. Cross-domain memberships remain available through all matching filters.

Pointer hover or focus opens a nonmodal summary. Tap pins it. Tab from a focused label reaches the preview's detail action; Enter opens full details. Escape dismisses the preview or dialog and returns focus. Detail content includes sources, dates, uncertainties, observed generations and preserved original records.

## Screenshots

| Width | Hebrew RTL | English LTR |
| --- | --- | --- |
| 360 | [Overview](360-he-directory.png) | [Overview](360-en-directory.png) |
| 390 | [Overview](390-he-directory.png) | [Overview](390-en-directory.png) |
| 768 | [Overview](768-he-directory.png) | [Overview](768-en-directory.png) |
| 1440 | [Overview](1440-he-directory.png) | [Overview](1440-en-directory.png) |

[Touch summary](390-he-summary.png) · [Desktop hover summary](1440-en-summary.png) · [Full details](390-en-detail.png) · [Original cloud reference](1440-en-original.png)

## Validation

`node --test tests/*.test.mjs`: 23 passing tests. The original 14 catalog regression tests remain, with reviewed-count expectations updated for new evidence. New coverage includes canonical family labels, duplicate stable IDs, distinct products/providers, unrated additions, withheld mismatched scores and selected-category scoring.

`node scripts/catalog.mjs`: 131 records, 31 source-reviewed, all 120 legacy records unchanged.

`QA_OUTPUT=docs/redesign node scripts/browser-qa.cjs`: isolated headless Chrome with a fresh temporary profile; no personal browser access. Eight configurations cover 360/390/768/1440, Hebrew RTL and English LTR. [Results](results.json) record visible label counts and domains, locally loaded Assistant, 16px minimum labels, 44px minimum targets, size mapping and no overflow.

Coverage includes real pointer hover, keyboard-focus previews with Tab/Enter, category combinations, search/status filters, empty/reset states, repeated emulated touch summary/detail/Escape cycles, focus restoration/containment, sources and disabled retired launches. Rendered mobile, tablet, desktop and summary screenshots were inspected. Physical devices and screen readers were not exhaustively tested.

No merge or deployment. No new service, tracker, credentials or authenticated model inventory access. No Library delivery is claimed.
