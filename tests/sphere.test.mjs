import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const context={window:{},URL};
for(const name of ['modules.js','catalog-data.js','curation.js','directory.js','sphere.js'])vm.runInNewContext(fs.readFileSync(name,'utf8'),context);
const api=context.window.DirectoryData,geometry=context.window.SphereMath;
const records=api.canonicalRecords(api.createRecords(context.window.defaultModules,context.window.aiCatalog));
const state={query:'',task:'all',selectedTasks:[],status:'all',sort:'reviewed'};
test('sphere coordinates are deterministic, unique and on the unit sphere',()=>{
 const points=Array.from({length:131},(_,i)=>geometry.point(i,131));assert.equal(new Set(points.map(p=>JSON.stringify(p))).size,131);
 for(const [i,p] of points.entries()){assert.ok(Math.abs(Math.hypot(...p)-1)<1e-10);assert.deepEqual(p,geometry.point(i,131));assert.ok(Math.abs(Math.hypot(...geometry.rotate(p,.3,.9))-1)<1e-10)}
});
test('curation is reversible, broad and independent of lifecycle or verification',()=>{
 const start=api.selectRecords(records,{...state,scope:'curated'});assert.equal(start.length,51);assert.ok(new Set(start.map(r=>r.primaryTask)).size>=7);
 assert.equal(api.selectRecords(records,{...state,scope:'all'}).length,131);
 assert.equal(api.selectRecords(records,{...state,scope:'current'}).length,125);
 const archive=api.selectRecords(records,{...state,scope:'archived'});assert.equal(archive.length,6);assert.ok(archive.every(r=>r.curation.source.startsWith('https://')));
 assert.ok(api.selectRecords(records,{...state,scope:'curated',query:'Sora'}).some(r=>r.id==='ai-017'));
 assert.ok(api.selectRecords(records,{...state,scope:'curated',selectedTasks:['audio']}).some(r=>r.id==='ai-070'));
 for(const id of ['ai-025','ai-029','ai-047','ai-052','ai-070'])assert.equal(records.find(r=>r.id===id).curation,undefined);
 assert.equal(records.find(r=>r.id==='ai-011').name,'Anthropic Claude 3.5 Sonnet');
 assert.equal(context.window.defaultModules.length,120);
});
