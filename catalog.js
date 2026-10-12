/* Reviewed facts are separate from legacy scores and user-edited records. */
(() => {
    const records = new Map((window.aiCatalog?.records || []).map(record => [record.id, record]));
    const originals = new Map(window.defaultModules.map(record => [record.id, record]));
    const labels = {
        en: {
            checked: 'Official sources checked', pending: 'Official-source verification pending',
            status: 'Status', type: 'Type', vendor: 'Vendor', product: 'Product',
            categories: 'Documented categories', observed: 'Model observed', source: 'Official source',
            scores: 'Scores retain the original editorial values. They are not verified benchmarks or a new recommendation.',
            reference: 'Reviewed reference', tools: 'tools',
            introduction: 'Official-source facts, checked on the dates shown; no hands-on benchmark. Alphabetical and unranked. The cloud keeps its original labels, categories and editorial scores.',
            find: 'Find a tool', placeholder: 'Name, vendor or description', matching: 'matching tools',
            open: 'Open official product page', workflows: 'Production workflow checks',
            guidance: 'General production guidance, not product capabilities, comparative benchmarks or owner endorsements.',
            active: 'active', retired: 'retired', renamed: 'renamed', uncertain: 'uncertain', unknown: 'unknown',
            model: 'model', platform: 'platform', 'model-family': 'model family', 'product-family': 'product family',
            product_suite: 'product suite', workflow_platform: 'workflow platform', workflow_engine: 'workflow engine', code_driven_workflow: 'code-driven workflow',
            legacyScores: 'Legacy categories & editorial scores:'
        },
        he: {
            checked: 'מקורות רשמיים נבדקו', pending: 'ממתין לאימות ממקור רשמי',
            status: 'מצב', type: 'סוג', vendor: 'ספק', product: 'מוצר',
            categories: 'קטגוריות מתועדות', observed: 'מודל שנצפה', source: 'מקור רשמי',
            scores: 'הציונים משמרים את הערכים העריכתיים המקוריים. הם אינם מבחני ביצועים מאומתים או המלצה חדשה.',
            reference: 'מידע שנבדק', tools: 'כלים',
            introduction: 'עובדות ממקורות רשמיים שנבדקו בתאריכים המוצגים, ללא מבחן שימוש מעשי. סדר אלפביתי, ללא דירוג. הענן משמר את השמות, הקטגוריות והציונים העריכתיים המקוריים.',
            find: 'חיפוש כלי', placeholder: 'שם, ספק או תיאור', matching: 'כלים תואמים',
            open: 'פתיחת דף המוצר הרשמי', workflows: 'בדיקות לתהליך ההפקה',
            guidance: 'הנחיות הפקה כלליות, לא יכולות של מוצרים, מבחנים השוואתיים או המלצות בעל האתר.',
            active: 'פעיל', retired: 'הופסק', renamed: 'שונה שם', uncertain: 'לא ודאי', unknown: 'לא ידוע',
            model: 'מודל', platform: 'פלטפורמה', 'model-family': 'משפחת מודלים', 'product-family': 'משפחת מוצרים',
            product_suite: 'חבילת מוצרים', workflow_platform: 'פלטפורמת תהליכי עבודה', workflow_engine: 'מנוע תהליכי עבודה', code_driven_workflow: 'תהליך עבודה מבוסס קוד',
            legacyScores: 'קטגוריות וציונים עריכתיים מקוריים:'
        }
    };
    const language = () => document.documentElement?.lang === 'he' ? 'he' : 'en';
    const translate = key => labels[language()][key] || key;
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
        appendText(parent, 'p', record?.verifiedAt ? `${translate('checked')}: ${record.verifiedAt}` : translate('pending'));
        appendText(parent, 'p', `${translate('status')}: ${translate(record?.status || 'uncertain')} · ${translate('type')}: ${translate(record?.entityType || 'unknown')}`);
        if (record?.vendor) appendText(parent, 'p', `${translate('vendor')}: ${record.vendor}${record.product ? ` · ${translate('product')}: ${record.product}` : ''}`);
        if (record?.identityNote) appendText(parent, 'p', record.identityNote, 'he');
        if (record?.capabilities?.length) appendText(parent, 'p', `${translate('categories')}: ${record.capabilities.join(', ')}`);
        for (const observation of record?.modelObservations || []) {
            appendText(parent, 'p', `${translate('observed')} ${observation.observedAt}: ${observation.name} (${observation.vendor}) — ${observation.note}`);
        }
        for (const limitation of record?.limitations || []) appendText(parent, 'p', limitation, 'he');
        for (const uncertainty of record?.uncertainties || []) appendText(parent, 'p', uncertainty);
        for (const source of record?.sources || []) {
            const link = appendText(parent, 'a', `${translate('source')}: ${new URL(source.url).hostname} (${source.checkedAt})`);
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
        appendText(panel, 'p', translate('scores'));
        tooltip.querySelector('.tooltip-body').appendChild(panel);
    }
    function positionDirectory() {
        const host = document.getElementById('catalogDirectory');
        const controls = document.querySelector?.('.controls');
        if (!host || !controls?.getBoundingClientRect) return;
        const top = controls.getBoundingClientRect().bottom + 12;
        host.style.top = `${top}px`;
        host.style.maxHeight = `${Math.max(160, window.innerHeight - top - 100)}px`;
    }
    function setupDirectory() {
        const host = document.getElementById('catalogDirectory');
        if (!host) return;
        const queryBeforeRefresh = host.querySelector('input')?.value || '';
        host.replaceChildren();
        host.lang = language();
        host.dir = language() === 'he' ? 'rtl' : 'ltr';
        const checked = [...records.values()].filter(record => record.verifiedAt).sort((a, b) => a.name.localeCompare(b.name));
        appendText(host, 'summary', `${translate('reference')} · ${checked.length} ${translate('tools')}`);
        appendText(host, 'p', translate('introduction'));
        const label = appendText(host, 'label', translate('find') + ' ');
        const search = document.createElement('input');
        search.type = 'search';
        search.placeholder = translate('placeholder');
        search.value = queryBeforeRefresh;
        label.appendChild(search);
        const list = document.createElement('div');
        host.appendChild(list);
        function update() {
            list.replaceChildren();
            const query = search.value.trim().toLowerCase();
            const matches = checked.filter(record => [record.name,record.legacyName,record.vendor,record.product,record.description,...record.aliases].join(' ').toLowerCase().includes(query));
            appendText(list, 'p', `${matches.length} ${translate('matching')}`).setAttribute('aria-live', 'polite');
            for (const record of matches) {
                const item = document.createElement('details');
                appendText(item, 'summary', `${record.name} · ${translate(record.status)}`);
                appendText(item, 'p', record.description, record.descriptionLanguage);
                if (record.officialUrl && record.status !== 'retired') {
                    const link = appendText(item, 'a', translate('open'));
                    link.href = record.officialUrl; link.target = '_blank'; link.rel = 'noopener noreferrer';
                }
                facts(item, record);
                list.appendChild(item);
            }
        }
        search.addEventListener('input', update);
        update();
        const workflows = document.createElement('details');
        appendText(workflows, 'summary', translate('workflows'));
        appendText(workflows, 'p', translate('guidance'));
        for (const workflow of window.aiCatalog?.workflows || []) {
            appendText(workflows, 'h4', workflow.title);
            appendText(workflows, 'p', workflow.guidance);
        }
        host.appendChild(workflows);
        positionDirectory();
        window.requestAnimationFrame?.(positionDirectory);
    }
    window.catalogMetadata = { get, render, destination, safeUrl, translate, refresh: setupDirectory };
    document.addEventListener('DOMContentLoaded', setupDirectory);
    window.addEventListener?.('resize', positionDirectory);
})();
