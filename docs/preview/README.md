# Interactive local review

Download **ai-index-preview.html**, then open the downloaded file in a current browser. It is the working app, not a screenshot or GitHub code preview. The initial Sphere, compact Atlas alternative, reversible full-collection/interior exploration, rotation controls, pinned summaries, full details, search, filters, scope/archive selector and Atlas layout work locally. No web server or installation is required.

[Download the interactive HTML](https://github.com/AvocadoHead/AI-Index/raw/refs/heads/fix/pinned-tool-previews/docs/preview/ai-index-preview.html)

GitHub's normal “blob” page displays source code; it does not run the app. Use **Download raw file** there if the link above displays code instead of downloading. A browser or device may require explicitly opening the downloaded `.html` file in its browser rather than a file preview application.

The file embeds Assistant, its SIL Open Font License, the complete catalog and all app scripts/styles. It was tested with HTTP(S) requests blocked. Outbound official-source links require a connection only when clicked. The original-view link in this standalone package opens repository source; the original view remains runnable in the full checkout.

This is a local review artifact, not a public preview deployment. No new hosting was created. Rebuild it after changes with `node scripts/build-preview.mjs`. Validate with:

```sh
QA_OUTPUT=/tmp/ai-index-offline QA_ENTRY=docs/preview/ai-index-preview.html QA_OFFLINE=1 node scripts/browser-qa.cjs
```
