import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
class Element {
    constructor(tag) { this.tag = tag; this.children = []; this.style = {}; this.value = ''; this.attributes = {}; this.events = {}; }
    appendChild(child) { this.children.push(child); return child; }
    removeChild(child) { this.children = this.children.filter(item => item !== child); }
    replaceChildren(...children) { this.children = children; }
    setAttribute(name, value) { this.attributes[name] = value; }
    addEventListener(name, callback) { this.events[name] = callback; }
    click() {}
    querySelector(selector) { return this.children.find(node => node.tag === selector || `.${node.className}` === selector) || this.children.map(node => node.querySelector(selector)).find(Boolean); }
}
function setup(catalog) {
    const ready = [], directory = new Element('details');
    const context = { window: {}, URL, Blob, document: { body: new Element('body'), addEventListener(name, callback) { ready.push(callback); }, createElement(tag) { return new Element(tag); }, getElementById() { return directory; } }, console };
    vm.runInNewContext(fs.readFileSync('modules.js', 'utf8'), context);
    if (catalog) context.window.aiCatalog = catalog;
    else if (catalog !== null) vm.runInNewContext(fs.readFileSync('catalog-data.js', 'utf8'), context);
    vm.runInNewContext(fs.readFileSync('catalog.js', 'utf8'), context);
    vm.runInNewContext(fs.readFileSync('script.js', 'utf8') + '\nthis.AIModule = AIModule; this.ModuleCloud = ModuleCloud;', context);
    return {context, ready, directory};
}
const getOriginal = (context, name) => context.window.defaultModules.find(record => record.name === name);
test('stable IDs survive runtime construction; all 120 legacy scores remain unchanged', () => {
    const {context} = setup();
    assert.equal(context.window.defaultModules.length, 120);
    for (const record of context.window.defaultModules) {
        const module = new context.AIModule(record.name, record.categories, record.url, record.scores, record.id);
        assert.equal(context.window.catalogMetadata.get(module).id, record.id);
        const scores = Object.values(record.scores);
        assert.equal(module.getAverageScore(new Set(['all'])), scores.reduce((a,b) => a+b, 0) / scores.length);
    }
});
test('custom edits and unknown imported records do not inherit official evidence', () => {
    const {context} = setup();
    const original = getOriginal(context, 'Nano Banana Pro');
    assert.equal(context.window.catalogMetadata.get({...original, url:'https://example.org'}), null);
    assert.equal(context.window.catalogMetadata.get({...original, name:'Other'}), null);
    assert.equal(context.window.catalogMetadata.get({...original, id:null}), null);
});
test('descriptions use reviewed local Hebrew or an honest fallback without fetching', async () => {
    const {context} = setup();
    const get = context.ModuleCloud.prototype.getModuleDescription;
    assert.match(await get.call({currentLanguage:'en'}, getOriginal(context, 'Haiper')), /awaiting official-source verification/);
    assert.match(await get.call({currentLanguage:'en'}, {name:'Custom'}), /awaiting official-source verification/);
    const original = getOriginal(context, 'Nano Banana Pro');
    assert.equal(await get.call({currentLanguage:'he'}, original), context.window.catalogMetadata.get(original).description);
});
test('known destination errors are corrected and retired links disabled across launch helper', () => {
    const {context} = setup();
    const cloud = Object.create(context.ModuleCloud.prototype);
    const opened = [];
    context.window.open = (...args) => opened.push(args);
    for (const name of ['Nano Banana Pro','Domo','InVision']) cloud.openModule(getOriginal(context, name));
    assert.deepEqual(opened.map(args => args[0]), ['https://gemini.google/overview/image-generation/','https://www.domoai.app/']);
    assert.ok(opened.every(args => args[2] === 'noopener,noreferrer'));
    assert.equal(context.window.catalogMetadata.destination({url:'javascript:alert(1)'}), null);
    assert.equal(context.window.catalogMetadata.destination({url:'https://user:password@example.com'}), null);
});
test('tooltip renders reviewed content as text and retains language, historical scores and sources', async () => {
    const {context} = setup();
    const cloud = Object.create(context.ModuleCloud.prototype);
    cloud.tooltip = new Element('div'); cloud.currentLanguage = 'en';
    await cloud.showTooltip(getOriginal(context, 'Nano Banana Pro'), 10, 20);
    await Promise.resolve();
    assert.equal(cloud.tooltip.querySelector('.module-name').textContent, 'Nano Banana');
    assert.equal(cloud.tooltip.querySelector('.description').lang, 'he');
    assert.equal(cloud.tooltip.querySelector('.description').dir, 'rtl');
    assert.ok(cloud.tooltip.querySelector('.catalog-facts').children.some(node => node.textContent?.includes('not verified benchmarks')));
    assert.ok(cloud.tooltip.querySelector('.catalog-facts').children.filter(node => node.tag === 'a').every(node => node.rel === 'noopener noreferrer'));
    const custom = {name:'<img src=x onerror=alert(1)>',url:'javascript:alert(1)',categories:['<script>'],scores:{}};
    await cloud.showTooltip(custom, 10, 20);
    assert.equal(cloud.tooltip.querySelector('.module-name').textContent, custom.name);
    assert.equal(cloud.tooltip.querySelector('.tooltip-name').tag, 'span');
});
test('reference directory is alphabetical, unranked and searchable by old aliases', () => {
    const {ready, directory} = setup();
    ready[0]();
    assert.equal(directory.children[0].textContent, `Reviewed reference · ${JSON.parse(fs.readFileSync('data/catalog.json')).records.filter(r=>r.verifiedAt).length} tools`);
    const search = directory.children.find(node => node.tag === 'label').children[0];
    search.value = 'Weavy'; search.events.input();
    const list = directory.children.find(node => node.tag === 'div');
    assert.equal(list.children[0].textContent, '1 matching tools');
    assert.equal(list.children[1].children[0].textContent, 'Figma Weave · active');
});
test('legacy JavaScript export preserves IDs and safely roundtrips quoted custom names', async () => {
    const {context} = setup();
    let saved;
    context.URL = {createObjectURL(blob) {saved = blob; return 'blob:test';}, revokeObjectURL() {}};
    context.prompt = () => 'test';
    const records = [JSON.parse(JSON.stringify(getOriginal(context,'Nano Banana Pro'))),{id:null,name:'Quoted "tool"\nline',url:'https://example.org',categories:['A'],scores:{A:0.5}}];
    context.ModuleCloud.prototype.saveModules.call({modules:records});
    const output = {};
    vm.runInNewContext(await saved.text() + '\nthis.records = defaultModules;', output);
    assert.deepEqual(JSON.parse(JSON.stringify(output.records)), records);
});
test('missing metadata bundle still allows original cloud destinations', () => {
    const {context} = setup({records:[]});
    assert.equal(context.window.catalogMetadata.get(getOriginal(context,'Manus')), null);
    assert.equal(context.window.catalogMetadata.destination(getOriginal(context,'Manus')), 'https://manus.ai/');
});
test('both initialization paths preserve all records, IDs and category score filtering', () => {
    const {context} = setup();
    context.defaultModules = context.window.defaultModules;
    const cloud = Object.create(context.ModuleCloud.prototype);
    cloud.positionModuleInCloud = () => {};
    cloud.showError = message => { throw new Error(message); };
    cloud.loadDefaultModules();
    assert.equal(cloud.modules.length, 120);
    cloud.selectedCategories = new Set(['T2V']);
    cloud.filterModules();
    for (const module of cloud.modules) assert.equal(module.visible, (module.scores.T2V || 0) > 0);
    cloud.initializeFromModules(context.window.defaultModules);
    assert.equal(cloud.modules.length, 120);
    assert.equal(cloud.modules[5].id, 'ai-006');
    assert.equal(cloud.getModuleUrl(cloud.modules[5]), 'https://gemini.google/overview/image-generation/');
});
test('late description from a previous tooltip cannot overwrite the current record', async () => {
    const {context} = setup();
    const cloud = Object.create(context.ModuleCloud.prototype);
    cloud.tooltip = new Element('div'); cloud.currentLanguage = 'en';
    const pending = [];
    cloud.getModuleDescription = () => new Promise(resolve => pending.push(resolve));
    await cloud.showTooltip(getOriginal(context, 'Manus'), 10, 20);
    await cloud.showTooltip(getOriginal(context, 'Domo'), 10, 20);
    pending[1]('Current description'); await Promise.resolve();
    pending[0]('Stale description'); await Promise.resolve();
    assert.equal(cloud.tooltip.querySelector('.description').textContent, 'Current description');
});
test('validator rejects duplicate IDs, unsupported facts, unsafe sources and legacy edits', async () => {
    const os = await import('node:os');
    const path = await import('node:path');
    const {spawnSync} = await import('node:child_process');
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-index-validator-'));
    try {
        fs.mkdirSync(path.join(directory, 'scripts'));
        fs.mkdirSync(path.join(directory, 'data'));
        for (const file of ['scripts/catalog.mjs','data/catalog.json','data/legacy-baseline.json','modules.js','catalog-data.js']) fs.copyFileSync(file, path.join(directory, file));
        const original = JSON.parse(fs.readFileSync('data/catalog.json', 'utf8'));
        for (const mutate of [
            data => { data.records[1].id = data.records[0].id; },
            data => { data.records[0].verifiedAt = null; },
            data => { data.records.find(record => record.sources.length).sources[0].url = 'javascript:alert(1)'; },
            data => { data.records[0].recommendation = 'Best tool'; }
        ]) {
            const data = structuredClone(original); mutate(data);
            fs.writeFileSync(path.join(directory, 'data/catalog.json'), JSON.stringify(data));
            const result = spawnSync(process.execPath, [path.join(directory,'scripts/catalog.mjs'),'--write'], {encoding:'utf8'});
            assert.notEqual(result.status, 0, 'Invalid catalog must fail');
        }
        fs.writeFileSync(path.join(directory, 'data/catalog.json'), JSON.stringify(original));
        fs.appendFileSync(path.join(directory, 'modules.js'), '\nwindow.defaultModules[0].scores.AGENT = 0.01;');
        assert.notEqual(spawnSync(process.execPath, [path.join(directory,'scripts/catalog.mjs'),'--write']).status, 0);
    } finally { fs.rmSync(directory, {recursive:true, force:true}); }
});

test('truly absent metadata bundle initializes directory and keeps the legacy cloud usable', async () => {
    const {context, ready, directory} = setup(null);
    assert.equal(Object.hasOwn(context.window, 'aiCatalog'), false);
    assert.doesNotThrow(() => ready[0]());
    assert.equal(directory.children[0].textContent, 'Reviewed reference · 0 tools');
    const cloud = Object.create(context.ModuleCloud.prototype);
    context.defaultModules = context.window.defaultModules;
    cloud.positionModuleInCloud = () => {};
    cloud.showError = message => { throw new Error(message); };
    cloud.loadDefaultModules();
    assert.equal(cloud.modules.length, 120);
    assert.equal(cloud.getModuleUrl(cloud.modules[0]), 'https://manus.ai/');
    assert.match(await cloud.getModuleDescription(cloud.modules[0]), /awaiting official-source verification/);
});

test('Hebrew toggle refreshes reference labels and keeps the search and Hebrew descriptions', () => {
    const {context, ready, directory} = setup();
    ready[0]();
    const search = directory.querySelector('input');
    search.value = 'Weavy'; search.events.input();
    context.document.documentElement = {lang: 'he'};
    context.window.catalogMetadata.refresh();
    assert.equal(directory.lang, 'he');
    assert.equal(directory.dir, 'rtl');
    assert.equal(directory.children[0].textContent, `מידע שנבדק · ${JSON.parse(fs.readFileSync('data/catalog.json')).records.filter(r=>r.verifiedAt).length} כלים`);
    assert.equal(directory.querySelector('input').value, 'Weavy');
    assert.equal(directory.querySelector('input').placeholder, 'שם, ספק או תיאור');
    const list = directory.children.find(node => node.tag === 'div');
    assert.equal(list.children[0].textContent, '1 כלים תואמים');
    assert.equal(list.children[1].children[0].textContent, 'Figma Weave · פעיל');
    const description = list.children[1].children[1];
    assert.equal(description.lang, 'he'); assert.equal(description.dir, 'rtl');
    assert.ok(list.children[1].children.some(node => node.textContent?.includes('ספק: Figma')));
});

test('the actual language control switches to Hebrew on its first click and back to English', () => {
    const {context, ready, directory} = setup();
    ready[0]();
    const controls = new Element('div');
    context.document.documentElement = {lang:'en', setAttribute(key, value) { this[key] = value; }};
    context.document.querySelector = () => controls;
    context.document.querySelectorAll = () => [];
    const cloud = Object.create(context.ModuleCloud.prototype);
    cloud.translations = {en:{}, he:{}};
    cloud.updateCategoryLabels = () => {};
    cloud.setupLanguageToggle();
    controls.children[0].onclick();
    assert.equal(cloud.currentLanguage, 'he');
    assert.equal(directory.children[0].textContent, `מידע שנבדק · ${JSON.parse(fs.readFileSync('data/catalog.json')).records.filter(r=>r.verifiedAt).length} כלים`);
    controls.children[0].onclick();
    assert.equal(cloud.currentLanguage, 'en');
    assert.equal(directory.children[0].textContent, `Reviewed reference · ${JSON.parse(fs.readFileSync('data/catalog.json')).records.filter(r=>r.verifiedAt).length} tools`);
});
