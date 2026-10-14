# AI Index

A static, bilingual directory of creative AI tools. Search by name or task, distinguish dated official-source research from unverified legacy records, and inspect sources, limitations and historical data in tool details.

- `index.html`, `styles.css`, `directory.js`, `sphere.js`: bilingual sphere and Atlas layouts.
- `official-summaries.js`, `data/official-summaries.json`: dated cached homepage summaries, separate from full source-review status.
- `curation.js`: reversible starting set and evidenced archive, separate from raw records.
- [Download and open the interactive local preview](docs/preview/README.md).
- `legacy.html`, `legacy-styles.css`, `script.js`, `catalog.js`: original cloud and local editing interface.
- `modules.js`: all 120 preserved legacy entries and scores.
- `data/catalog.json`: reviewed metadata and unverified placeholders; see [maintenance guide](data/README.md).
- [Current draft review and screenshots](docs/model-links/README.md).
- [Redesign review and screenshots](docs/redesign/README.md).

No build or dependency installation is required. Open `index.html` or serve the repository with a static server. GitHub Pages serves the existing `main` branch.

Checks:

```sh
node scripts/catalog.mjs
node scripts/editorial.mjs
node scripts/relationships.mjs
node --test tests/*.test.mjs
```

Optional isolated browser checks use an already installed Chrome:

```sh
node scripts/browser-qa.cjs
```

The original local JavaScript importer evaluates supplied files and is retained only in the original view; replacing that importer is a separate security task.

Support the project: [Buy Me a Coffee](https://buymeacoffee.com/Optopia).

Owner/agent update proposals: [shared catalog maintenance route](docs/catalog-updates/README.md). Generate a data-only proposal with `node scripts/catalog-change.mjs --template`, then validate it with `node scripts/catalog-change.mjs change.json`. This creates a review plan; it does not grant writes or publish changes.

[Sphere exploration and sourced model relationships](docs/model-links/README.md). Model/generation links are maintained in `data/model-relationships.json`; regenerate its bundle with `node scripts/relationships.mjs --write`.
