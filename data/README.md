# Reviewed catalog

`catalog.json` stores official-source facts and general production guidance. `catalog.schema.json` describes its structure. `scripts/catalog.mjs` also checks identity, evidence dates, unique IDs, complete legacy coverage and exact preservation of all 120 legacy records. It does not independently verify source authenticity or factual accuracy; those require research review.

## Identity and evidence

IDs `ai-001` through `ai-120` are permanent identities for the original cloud entries. Never regenerate them from names or versions. `legacy-baseline.json` preserves their original names, URLs, categories and scores. `researchId` retains the research collection's stable product identity. New reference-only tools use that research ID directly and receive no scores or cloud placement.

Keep vendor, product, platform, model, model-family and product-family distinct. `name` is the reviewed reference label; `legacyName` is immutable (null for a new reference-only entry). A product-family reference does not imply the original model version remains available. Explicit uncertainties explain mappings from historical version labels to broader product references.

`description` is an original factual summary, with `descriptionLanguage` set to `he` or `en`. Hebrew is displayed with its language and text direction; translations are not generated at runtime. `status` is active, retired, renamed or uncertain. `verifiedAt` is the actual official-source check date, not publication date or a guarantee of future availability. `sources` contains `{url, checkedAt}` records. Evidence is recorded at the record level: no sentence-by-sentence or model-specific attribution is invented when the research did not provide it.

`modelObservations` contains `{name, vendor, observedAt, note}`. Preserve conflicting title/body version names and their context. Do not silently reconcile them, convert them to API identifiers or call them the latest. `limitations` and `uncertainties` are separate from the description. A reachable URL alone does not establish current status.

`recommendation` remains null. Existing cloud scores retain their original values; they are neither verified benchmarks nor newly attributed owner recommendations. General workflows are editorial production checks, not claims of current capabilities in a particular product.

Only original public metadata and official-source references belong here. No private messages, member identities, quotations, project details, private evidence links, credentials or inferred endorsements are permitted.

## Research transfer format

Send a JSON file with `records`, preserving its supplied stable IDs and verification dates. Include either an explicit exact `legacyName` mapping or a proposed mapping to review. The following research format is supported by the curation process (do not overwrite the catalog wholesale):

```json
{
  "id": "stable-product-id",
  "name": "Public product name",
  "vendor": "Provider",
  "product": "Product",
  "entityType": "product",
  "summaryHe": "Original Hebrew factual summary",
  "officialURL": "https://official.example/product",
  "verifiedDate": "2026-10-12",
  "status": "active",
  "sourceURLs": ["https://official.example/documentation"],
  "modelObservations": [{"name": "Observed version", "vendor": "Provider", "role": "Context and uncertainty"}],
  "limitations": [],
  "unknowns": []
}
```

Use unknown/uncertain and null dates when not established. Suggested use cases or comparative opinions are not imported as factual recommendations. Check new identities explicitly; never fuzzy-match vendors and products.

## Build and checks

Run `node scripts/catalog.mjs --write`, then `node scripts/catalog.mjs` and `node --test tests/*.test.mjs`. No dependencies or network access are required. The generated classic-script bundle supports GitHub Pages and direct file opening without a runtime fetch, build service or paid call. Do not hand-edit `catalog-data.js`.

The original cloud, filters, scores, editing and JavaScript import/export remain in place. Export retains stable IDs. User changes to a legacy name or URL detach reviewed metadata to avoid verifying a custom entry. Official destination corrections apply when opening matched entries, while the original record stays preserved. Retired entries have no product launch link; evidence links remain available. The alphabetical reference panel includes reviewed tools without assigning new ranks.

Isolated headless QA and screenshots are documented in [refresh-validation.md](../docs/refresh-validation.md). Personal browser sessions were not accessed. Terminal tests cover legacy preservation, scores, metadata association, custom edits, local descriptions, destinations and safe rendering. The existing JavaScript importer evaluates uploaded files; this refresh does not redesign that feature.
