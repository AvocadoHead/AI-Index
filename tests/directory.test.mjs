import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const context={window:{},URL};
vm.runInNewContext(fs.readFileSync('modules.js','utf8'),context);
vm.runInNewContext(fs.readFileSync('catalog-data.js','utf8'),context);
vm.runInNewContext(fs.readFileSync('catalog-audit.js','utf8'),context);
vm.runInNewContext(fs.readFileSync('directory.js','utf8'),context);
const api=context.window.DirectoryData;
const records=api.createRecords(context.window.defaultModules,context.window.aiCatalog);
const state={query:'',task:'all',status:'all',sort:'reviewed'};
test('unified directory preserves all 131 identities and all 120 original records',()=>{
 assert.equal(records.length,context.window.aiCatalog.records.length);assert.equal(new Set(records.map(r=>r.id)).size,context.window.aiCatalog.records.length);
 assert.equal(records.filter(r=>r.original).length,120);assert.equal(records.filter(r=>r.checked).length,context.window.aiCatalog.records.filter(r=>r.verifiedAt).length);
 assert.equal(records.filter(r=>!r.checked).length,4);
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
 assert.equal(api.selectRecords(records,{...state,query:'weavy',task:'text',status:'checked'}).length,0);
 assert.equal(api.selectRecords(records,{...state,status:'pending'}).length,4);
 assert.equal(api.selectRecords(records,{...state,status:'retired'}).length,7);
 assert.equal(api.selectRecords(records,state).length,context.window.aiCatalog.records.length);
});
test('search handles Hebrew and English descriptions, aliases and whitespace',()=>{
 assert.ok(api.selectRecords(records,{...state,query:'תמונה'}).length>0);
 assert.ok(api.selectRecords(records,{...state,query:'  nAnO   bAnAnA  '}).some(r=>r.meta?.researchId==='google-gemini-image'));
 assert.ok(api.selectRecords(records,{...state,query:'reusable workflows'}).some(r=>r.meta?.researchId==='weavy'));
 assert.equal(api.selectRecords(records,{...state,query:'zzzz_no_such_tool'}).length,0);
});
test('sorting is explicit and independent of historical scores',()=>{
 const all=api.selectRecords(records,state);assert.ok(all.slice(0,context.window.aiCatalog.records.filter(r=>r.verifiedAt).length).every(r=>r.checked));
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

test('estimated averages preserve originals, stay independent of verification, and never fabricate missing scores',()=>{
 for(const record of records){const values=Object.values(record.original?.scores || {});assert.equal(api.estimatedScore(record),context.window.catalogAudit.records[record.id].scoreScope==='history-only'?null:values.length?values.reduce((a,b)=>a+b,0)/values.length:null);}
 assert.equal(api.estimatedScore({checked:true}),null);
 assert.equal(api.estimatedScore({original:{scores:{image:0}}}),0);
 assert.ok(api.scoreSize(.95)>api.scoreSize(.85));
 const record=records.find(r=>r.original);assert.equal(api.estimatedScore({...record,checked:!record.checked}),api.estimatedScore(record));
});

test('canonical labels keep generations nested without merging distinct products or providers',()=>{
 const canonical=api.canonicalRecords(records);assert.equal(canonical.length,context.window.aiCatalog.records.length);
 assert.equal(api.canonicalRecords([...records,records[0]]).length,context.window.aiCatalog.records.length);
 assert.equal(canonical.find(r=>r.id==='ai-009').name,'ChatGPT · GPT-5.2');
 assert.equal(canonical.find(r=>r.id==='ai-018').name,'Veo 3');
 assert.ok(canonical.some(r=>r.id==='google-flow'));assert.ok(canonical.some(r=>r.id==='ai-018'));
 assert.ok(canonical.some(r=>r.id==='ai-028'));assert.ok(canonical.some(r=>r.id==='ai-080'));
 assert.equal(canonical.find(r=>r.id==='ai-006').meta.modelObservations.length,3);
 assert.equal(api.estimatedScore(canonical.find(r=>r.id==='kolbo-ai')),null);
 assert.equal(api.estimatedScore(canonical.find(r=>r.id==='ai-037')),null);
 const first=api.interleave(api.selectRecords(canonical,state)).slice(0,12);
 assert.ok(new Set(first.map(r=>r.primaryTask)).size>=6);
});
test('category combinations use union and selected-domain scores only',()=>{
 const combined=api.selectRecords(records,{...state,selectedTasks:['audio','video']});
 assert.ok(combined.every(r=>r.tasks.includes('audio')||r.tasks.includes('video')));
 const sample={original:{scores:{T2I:.8,T2V:.9,AUD:.7}}};assert.equal(api.estimatedScore(sample,['video']),.9);assert.equal(api.estimatedScore(sample,['design']),null);
});

test('Seedance launches 2.5 and Codex remains discoverable without a duplicate',()=>{
 assert.equal(api.destination(records.find(r=>r.id==='bytedance-seedance')),'https://seed.bytedance.com/en/seedance2_5');
 assert.equal(api.destination(records.find(r=>r.id==='kolbo-ai')),'https://kolbo.ai/');
 for(const query of ['Codex','OpenAI Codex','קודקס']){
  const matches=api.selectRecords(records,{...state,query,selectedTasks:['workflow']});
  assert.equal(matches.length,1);assert.equal(matches[0].id,'openai-codex');assert.equal(matches[0].primaryTask,'workflow');
 }
 assert.equal(records.filter(r=>r.id==='openai-codex').length,1);
 assert.equal(api.estimatedScore(records.find(r=>r.id==='openai-codex')),null);
});

test('Base44 has one identity with case, spacing and Hebrew aliases across scopes',()=>{
 for(const scope of ['curated','all'])for(const query of ['base44','BASE44','Base 44','  base   44  ','Base-44','בייס44','בייס 44']){
  const found=api.selectRecords(records,{...state,scope,query,selectedTasks:[]});assert.equal(found.length,1);assert.equal(found[0].id,'ai-002');
 }
 assert.equal(api.selectRecords(records,{...state,query:'base44',selectedTasks:['audio']}).length,0);
 assert.equal(api.selectRecords(records,{...state,query:'base44',selectedTasks:['workflow']})[0].id,'ai-002');
});
