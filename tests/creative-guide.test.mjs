import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const guide=JSON.parse(fs.readFileSync('data/creative-guide.json'));
const context={window:{},URL};for(const file of ['modules.js','catalog-data.js','curation.js','creative-guide.js','directory.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),context);
test('editorial guidance preserves canonical identities and numeric scores',()=>{
 assert.deepEqual(JSON.parse(JSON.stringify(context.window.creativeGuide)),guide);
 const api=context.window.DirectoryData,records=api.canonicalRecords(api.createRecords(context.window.defaultModules,context.window.aiCatalog));
 assert.equal(records.length,131);assert.equal(context.window.defaultModules.length,120);assert.equal(records.filter(r=>r.checked).length,31);
 assert.equal(guide.attribution,'Eyal');assert.deepEqual(guide.imageOrder,['openai-chatgpt-images','ai-006','ai-031']);
 for(const [id,notes] of Object.entries(guide.models)){assert.ok(records.some(r=>r.id===id));for(const note of notes){assert.ok(note.en&&note.he&&note.name);assert.equal(note.score,undefined);assert.ok(note.sources.every(url=>new URL(url).protocol==='https:'));}}
 for(const [query,id] of [['GPT Image 2','openai-chatgpt-images'],['H3 Max','ai-021'],['FLUX 3 Video','ai-031'],['Seedance 2.5','bytedance-seedance'],['Wan 3','ai-019']])assert.ok(api.selectRecords(records,{query,task:'all',scope:'all',status:'all',selectedTasks:[]}).some(r=>r.id===id));
});
test('workflow keeps variants and preferences separate from measured facts',()=>{
 assert.equal(guide.en.steps.length,4);assert.equal(guide.he.steps.length,4);
 const h3=guide.models['ai-021'];assert.match(h3[0].en,/768p\/2K/);assert.match(h3[1].en,/480p or 768p/);assert.match(h3[1].en,/fal/);
 assert.match(guide.models['bytedance-seedance'][1].en,/native audio/);assert.match(guide.models['ai-006'][0].en,/unresolved/);
 assert.match(guide.en.intro,/not benchmark/);assert.match(guide.en.caution,/change details/);
});
