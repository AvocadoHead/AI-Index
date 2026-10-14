# Shared catalog updates: one reviewed route

## What exists today

The current public directory is read-only. Its canonical dataset is maintained in this repository: `data/catalog.json` holds identities and sourced facts; `data/catalog-audit.json` supplies bilingual display text and categories; `curation.js` supplies the selected set and reversible archive. `data/model-relationships.json` records sourced platform/model/generation relationships. Generated JavaScript and the standalone preview are outputs, not separate catalogs. In particular, editing only a catalog description may not change the displayed description because the bilingual audit takes precedence.

The original `legacy.html` interface can add, edit and delete entries in its local in-memory view. “Save Index” downloads JavaScript. It does not update the current directory, write to GitHub, or publish the site. It is not the shared editing route, and its old executable JavaScript importer should not be used for agent-generated changes.

## A common input for the owner and authorized agents

Use a data-only change proposal, whether the request originates with the owner or an authorized assistant. Their names in a file are attribution, never permission. The new local tool validates the proposal and emits a review plan. It does not apply changes or contact another system.

```sh
node scripts/catalog-change.mjs --template > change.json
# Edit the JSON proposal, then validate/export its review plan:
node scripts/catalog-change.mjs change.json > review-plan.json
```

The template carries a digest of the current canonical dataset, so a stale proposal is rejected. Operations are `add`, `update`, `archive` and `restore`; IDs remain stable. A removal request means reversible archive, not deleting historical records. Reasons and official-source check dates accompany factual changes. Additions require bilingual summaries, an explicit entity type and task category. New scores, verification labels and unknown fields cannot be supplied through this route. Duplicate IDs/names, unsafe destinations and stale snapshots fail validation. Validation checks structure and consistency, not source authenticity, licensing, or product quality.

The bounded publishing workflow is:

1. An owner or already-authorized agent prepares the same JSON proposal.
2. A repository maintainer reviews identity, sources and the proposed changes. No direct write permission follows from a proposal.
3. The maintainer applies the accepted changes to the canonical dataset on a review branch, updates the matching bilingual audit/curation entries, and regenerates outputs with the existing scripts.
4. Catalog/editorial checks, unit tests and relevant browser flows run. The PR diff records the before/after state and reason; Git history makes rollback possible.
5. An approved merge to `main` publishes through the existing Pages workflow.

This leaves one source of truth and one review gate. A small form or agent adapter can later generate this exact proposal format instead of maintaining another catalog.

## Integration boundary

Existing catalog consumers remain read-only. A future adapter should export proposals for review, not expose a public write API. Actual adapter development requires reviewing its contract in an authorized task. Adding credentials, granting persistent write access, sending proposals to external agents or enabling automatic publishing requires explicit authorization for the named destination and permissions. None is part of this change.

## Assistant products and model relationships

Treat an assistant product separately from its provider, workspace/platform, available model and the agent authorized to edit this catalog. The proposed relationship records should carry `assistant/product → platform/access route → model/version`, task, plan/mode constraints, documented versus tested availability, source and check date. A planned model rollout must remain planned. Scoring would remain scoped to task + product/platform + model/version/mode/plan, with untested values null.

New assistant products require confirmed identities and dated official evidence before catalog additions. Similar spellings must not be silently reconciled. No speculative assistant records or comparative scores are included in this change; provider benchmarking restrictions must be respected.

## Search correction

Base44 already has the permanent identity `ai-002`, and belongs to the selected set. A matching sphere label can be occluded or behind the interior viewpoint; category, archive and verification filters can also exclude it. Search now renders matching tools in the readable grouped list, independently of sphere orientation/depth. Clearing search restores the prior layout and depth. Filters remain explicit: when they hide matching records, “Search the full collection” clears those constraints while preserving the query. Case, spacing, hyphen and Hebrew aliases resolve to the same identity.

## Review evidence

The production repro returned `{count:1,id:"ai-002",visibility:"hidden",tabIndex:-1,depth:"1.000"}`. The matching identity existed but could not be seen or focused.

Fixed renders: [mobile match](screenshots/390-he-found.png), [mobile filter recovery](screenshots/390-he-filters.png), [desktop match](screenshots/1440-en-found.png). The [search matrix](search-results.json) covers 360/390/768/1440 px in Hebrew and English, selected/all scope, case/space/hyphen/Hebrew aliases, interior-view search, category/status/archive recovery, keyboard details and return to the prior view.

Validation: all 42 unit tests pass; catalog/editorial checks preserve 158 identities and all 120 legacy records. The [full browser suite](browser-results.json) passes all eight width/language cases plus unsupported-WebGL and reduced-motion fallbacks. Native touch opens Base44 search results on mobile. No assistant identities or scores were added and no deployment was performed.
