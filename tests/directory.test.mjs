import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const context={window:{},URL};
vm.runInNewContext(fs.readFileSync('modules.js','utf8'),context);
vm.runInNewContext(fs.readFileSync('catalog-data.js','utf8'),context);
vm.runInNewContext(fs.readFileSync('directory.js','utf8'),context);
const api=context.window.DirectoryData;
const records=api.createRecords(context.window.defaultModules,context.window.aiCatalog);
const state={query:'',task:'all',status:'all',sort:'reviewed'};
test('unified directory preserves all 130 identities and all 120 original records',()=>{
 assert.equal(records.length,130);assert.equal(new Set(records.map(r=>r.id)).size,130);
 assert.equal(records.filter(r=>r.original).length,120);assert.equal(records.filter(r=>r.checked).length,29);
 assert.equal(records.filter(r=>!r.checked).length,101);
 for(const record of records.filter(r=>r.original)) assert.equal(record.original,context.window.defaultModules.find(r=>r.id===record.id));
});
test('reviewed capability filters do not inherit the wrong historical Nano Banana developer taxonomy',()=>{
 const nano=records.find(r=>r.original?.name==='Nano Banana Pro');
 assert.ok(nano.tasks.includes('image'));assert.ok(!nano.tasks.includes('workflow'));
 assert.deepEqual(JSON.parse(JSON.stringify(nano.original.categories)),['DEV','ML','INF']);
});
test('search, task and verification compose and reset without losing records',()=>{
 const result=api.selectRecords(records,{...state,query:'weavy',task:'workflow',status:'checked'});
 assert.equal(result.length,1);assert.equal(result[0].name,'Figma Weave');
 assert.equal(api.selectRecords(records,{...state,query:'weavy',task:'audio',status:'checked'}).length,0);
 assert.equal(api.selectRecords(records,{...state,status:'pending'}).length,101);
 assert.equal(api.selectRecords(records,{...state,status:'retired'}).length,1);
 assert.equal(api.selectRecords(records,state).length,130);
});
test('search handles Hebrew and English descriptions, aliases and whitespace',()=>{
 assert.ok(api.selectRecords(records,{...state,query:'תמונה'}).length>0);
 assert.ok(api.selectRecords(records,{...state,query:'  nAnO   bAnAnA  '}).some(r=>r.meta?.researchId==='google-gemini-image'));
 assert.ok(api.selectRecords(records,{...state,query:'reusable workflows'}).some(r=>r.meta?.researchId==='weavy'));
 assert.equal(api.selectRecords(records,{...state,query:'zzzz_no_such_tool'}).length,0);
});
test('sorting is explicit and independent of historical scores',()=>{
 const all=api.selectRecords(records,state);assert.ok(all.slice(0,29).every(r=>r.checked));
 const sorted=api.selectRecords(records,{...state,sort:'name'});
 assert.deepEqual(Array.from(sorted,r=>r.name),[...sorted].sort((a,b)=>a.name.localeCompare(b.name,'en')).map(r=>r.name));
});
test('verified corrections, retirement and fallback destinations are retained',()=>{
 assert.equal(api.destination(records.find(r=>r.original?.name==='Nano Banana Pro')),'https://gemini.google/overview/image-generation/');
 assert.equal(api.destination(records.find(r=>r.original?.name==='Domo')),'https://www.domoai.app/');
 assert.equal(api.destination(records.find(r=>r.original?.name==='InVision')),null);
 const fallback=api.createRecords(context.window.defaultModules,undefined);assert.equal(fallback.length,120);assert.ok(fallback.every(r=>!r.checked));
 assert.equal(api.destination({status:'uncertain',checked:false,original:{url:'javascript:alert(1)'}}),null);
});
