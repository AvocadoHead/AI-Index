import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
process.chdir(fileURLToPath(new URL('..', import.meta.url)));
const catalog = JSON.parse(fs.readFileSync('data/catalog.json', 'utf8'));
const baseline = JSON.parse(fs.readFileSync('data/legacy-baseline.json', 'utf8'));
const context = { window: {} };
vm.runInNewContext(fs.readFileSync('modules.js', 'utf8'), context);
const modules = JSON.parse(JSON.stringify(context.window.defaultModules));
const fail = (test, message) => assert.ok(test, message);
const date = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(value).toISOString().slice(0,10) === value && value <= new Date().toISOString().slice(0,10);
const https = value => { try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; } };
assert.deepEqual(Object.keys(catalog).sort(), ['schemaVersion','records','workflows'].sort(), 'Unexpected catalog envelope');
fail(catalog.schemaVersion === 1 && Array.isArray(catalog.records), 'Invalid catalog envelope');
assert.deepEqual(modules, baseline, 'Legacy records, scores, categories, URLs and IDs must remain intact');
fail(modules.length === 120, 'Expected all 120 legacy records');
const ids = new Set();
const fields = ['id','researchId','legacyName','entityType','vendor','product','name','officialUrl','description','descriptionLanguage','status','verifiedAt','sources','modelObservations','limitations','uncertainties','recommendation','aliases','capabilities','identityNote'];
for (const record of catalog.records) {
    assert.deepEqual(Object.keys(record).sort(), [...fields].sort(), `Unexpected or missing fields: ${record.id}`);
    fail(/^[a-z][a-z0-9-]+$/.test(record.id) && !ids.has(record.id), 'Invalid or duplicate stable ID');
    ids.add(record.id);
    const original = baseline.find(item => item.id === record.id);
    fail(original ? record.legacyName === original.name : record.legacyName === null, `Unknown legacy identity: ${record.id}`);
    fail(record.researchId === null || (typeof record.researchId === 'string' && /^[a-z][a-z0-9-]+$/.test(record.researchId)), 'Invalid research ID');
    fail(['vendor','product','model','platform','model-family','product-family','product_suite','workflow_platform','workflow_engine','code_driven_workflow','unknown'].includes(record.entityType), 'Invalid entity type');
    fail(['active','retired','renamed','uncertain'].includes(record.status), 'Invalid status');
    fail(typeof record.name === 'string' && record.name.length > 0, 'Missing name');
    for (const key of ['vendor','product','description','identityNote']) fail(record[key] === null || (typeof record[key] === 'string' && record[key].length > 0), `Invalid ${key}`);
    fail(record.officialUrl === null || https(record.officialUrl), 'Invalid official URL');
    fail(record.verifiedAt === null || date(record.verifiedAt), 'Invalid verification date');
    fail(record.recommendation === null, 'Recommendations need a separately approved provenance workflow');
    fail(Array.isArray(record.sources) && Array.isArray(record.modelObservations) && Array.isArray(record.uncertainties), 'Invalid evidence arrays');
    for (const key of ['aliases','capabilities']) fail(Array.isArray(record[key]) && record[key].every(value => typeof value === 'string' && value.length), `Invalid ${key}`);
    fail(Array.isArray(record.limitations) && record.limitations.every(item => typeof item === 'string' && item.length), 'Invalid limitations');
    fail(record.descriptionLanguage === null || ['en','he'].includes(record.descriptionLanguage), 'Invalid description language');
    fail(record.uncertainties.every(item => typeof item === 'string' && item.length), 'Invalid uncertainty');
    for (const source of record.sources) {
        assert.deepEqual(Object.keys(source).sort(), ['url','checkedAt'].sort(), 'Invalid source shape');
        fail(https(source.url) && date(source.checkedAt), 'Invalid official source');
        fail(record.verifiedAt && source.checkedAt <= record.verifiedAt, 'Source check exceeds record verification date');
    }
    for (const observation of record.modelObservations) {
        assert.deepEqual(Object.keys(observation).sort(), ['name','vendor','observedAt','note'].sort(), 'Invalid model observation shape');
        fail(typeof observation.name === 'string' && observation.name.length && typeof observation.vendor === 'string' && observation.vendor.length && typeof observation.note === 'string' && date(observation.observedAt), 'Invalid model observation');
        fail(observation.observedAt <= record.verifiedAt, 'Observation exceeds record verification date');
    }
    const hasFacts = record.description !== null || record.officialUrl !== null || record.status !== 'uncertain' || record.entityType !== 'unknown' || record.vendor !== null || record.product !== null || record.name !== record.legacyName || record.modelObservations.length || record.identityNote !== null || record.capabilities.length || record.limitations.length;
    if (hasFacts || record.verifiedAt !== null) fail(record.verifiedAt && record.sources.length > 0, 'Reviewed facts need dated official evidence');
    if (record.description !== null) fail(record.descriptionLanguage, 'Description needs a language');
}
for (const module of modules) fail(ids.has(module.id), 'Catalog must cover every legacy ID');
const researchIds = catalog.records.map(record => record.researchId).filter(Boolean);
fail(new Set(researchIds).size === researchIds.length, 'Duplicate research identities');
fail(Array.isArray(catalog.workflows), 'Missing workflows');
for (const workflow of catalog.workflows) {
    assert.deepEqual(Object.keys(workflow).sort(), ['id','title','guidance'].sort());
    fail(Object.values(workflow).every(value => typeof value === 'string' && value.length), 'Invalid workflow');
}
const generated = '// Generated from data/catalog.json by node scripts/catalog.mjs --write. Do not edit.\nwindow.aiCatalog = ' + JSON.stringify(catalog, null, 2) + ';\n';
if (process.argv.includes('--write')) fs.writeFileSync('catalog-data.js', generated);
else assert.equal(fs.readFileSync('catalog-data.js', 'utf8'), generated, 'Run node scripts/catalog.mjs --write');
console.log(`Validated ${ids.size} records; ${catalog.records.filter(record => record.verifiedAt).length} officially checked. Legacy records unchanged.`);
