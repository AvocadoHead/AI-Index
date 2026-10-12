/* Reviewed facts are separate from legacy scores and user-edited records. */
(() => {
    const records = new Map((window.aiCatalog?.records || []).map(record => [record.id, record]));
    const originals = new Map(window.defaultModules.map(record => [record.id, record]));
    function get(module) {
        const original = originals.get(module.id);
        // A custom edit must not inherit an official verification badge.
        if (!original || module.name !== original.name || module.url !== original.url) return null;
        return records.get(module.id) || null;
    }
    function safeUrl(value) {
        try {
            const url = new URL(value);
            return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null;
        } catch { return null; }
    }
    function destination(module) {
        const record = get(module);
        if (record?.status === 'retired') return null;
        return safeUrl(record?.officialUrl || module.url);
    }
    function appendText(parent, tag, text, language) {
        const node = document.createElement(tag);
        node.textContent = text;
        node.dir = language === 'he' ? 'rtl' : 'auto';
        if (language) node.lang = language;
        parent.appendChild(node);
        return node;
    }
    function facts(parent, record) {
        appendText(parent, 'p', record?.verifiedAt ? `Official sources checked: ${record.verifiedAt}` : 'Official-source verification pending');
        appendText(parent, 'p', `Status: ${record?.status || 'uncertain'} · Type: ${record?.entityType || 'unknown'}`);
        if (record?.vendor) appendText(parent, 'p', `Vendor: ${record.vendor}${record.product ? ` · Product: ${record.product}` : ''}`);
        if (record?.identityNote) appendText(parent, 'p', record.identityNote, 'he');
        if (record?.capabilities?.length) appendText(parent, 'p', `Documented categories: ${record.capabilities.join(', ')}`);
        for (const observation of record?.modelObservations || []) {
            appendText(parent, 'p', `Model observed ${observation.observedAt}: ${observation.name} (${observation.vendor}) — ${observation.note}`);
        }
        for (const limitation of record?.limitations || []) appendText(parent, 'p', limitation, 'he');
        for (const uncertainty of record?.uncertainties || []) appendText(parent, 'p', uncertainty);
        for (const source of record?.sources || []) {
            const link = appendText(parent, 'a', `Official source: ${new URL(source.url).hostname} (${source.checkedAt})`);
            link.href = source.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            parent.appendChild(document.createElement('br'));
        }
    }
    function render(tooltip, module) {
        const record = get(module);
        const panel = document.createElement('div');
        panel.className = 'catalog-facts';
        facts(panel, record);
        appendText(panel, 'p', 'Scores retain the original editorial values. They are not verified benchmarks or a new recommendation.');
        tooltip.querySelector('.tooltip-body').appendChild(panel);
    }
    function setupDirectory() {
        const host = document.getElementById('catalogDirectory');
        if (!host) return;
        const checked = [...records.values()].filter(record => record.verifiedAt).sort((a, b) => a.name.localeCompare(b.name));
        appendText(host, 'summary', `Reviewed reference · ${checked.length} tools`);
        appendText(host, 'p', 'Official-source facts, checked on the dates shown; no hands-on benchmark. Alphabetical and unranked. The cloud keeps its original labels, categories and editorial scores.');
        const label = appendText(host, 'label', 'Find a tool ');
        const search = document.createElement('input');
        search.type = 'search';
        search.placeholder = 'Name, vendor or description';
        label.appendChild(search);
        const list = document.createElement('div');
        host.appendChild(list);
        function update() {
            list.replaceChildren();
            const query = search.value.trim().toLowerCase();
            const matches = checked.filter(record => [record.name,record.legacyName,record.vendor,record.product,record.description,...record.aliases].join(' ').toLowerCase().includes(query));
            appendText(list, 'p', `${matches.length} matching tools`).setAttribute('aria-live', 'polite');
            for (const record of matches) {
                const item = document.createElement('details');
                appendText(item, 'summary', `${record.name} · ${record.status}`);
                appendText(item, 'p', record.description, record.descriptionLanguage);
                if (record.officialUrl && record.status !== 'retired') {
                    const link = appendText(item, 'a', 'Open official product page');
                    link.href = record.officialUrl; link.target = '_blank'; link.rel = 'noopener noreferrer';
                }
                facts(item, record);
                list.appendChild(item);
            }
        }
        search.addEventListener('input', update);
        update();
        const workflows = document.createElement('details');
        appendText(workflows, 'summary', 'Production workflow checks');
        appendText(workflows, 'p', 'General production guidance, not product capabilities, comparative benchmarks or owner endorsements.');
        for (const workflow of window.aiCatalog.workflows || []) {
            appendText(workflows, 'h4', workflow.title);
            appendText(workflows, 'p', workflow.guidance);
        }
        host.appendChild(workflows);
    }
    window.catalogMetadata = { get, render, destination, safeUrl };
    document.addEventListener('DOMContentLoaded', setupDirectory);
})();
