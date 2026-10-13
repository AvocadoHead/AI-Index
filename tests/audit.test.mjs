import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const audit=JSON.parse(fs.readFileSync('data/catalog-audit.json'));
const context={window:{},URL};for(const file of ['modules.js','catalog-data.js','catalog-audit.js','curation.js','directory.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),context);
const api=context.window.DirectoryData,records=api.canonicalRecords(api.createRecords(context.window.defaultModules,context.window.aiCatalog));
test('audit covers every original identity and keeps additions distinct and unrated',()=>{
 const originalIds=[...Array.from({length:120},(_,i)=>'ai-'+String(i+1).padStart(3,'0')),'weavy','kolbo-ai','comfyui','remotion','figma-make','adobe-photoshop','photoroom','topaz-labs','openai-chatgpt-images','google-flow','bytedance-seedance'];
 assert.equal(originalIds.length,audit.originalCoverage);assert.equal(audit.originalCoverage,131);
 for(const id of originalIds){const a=audit.records[id];assert.ok(a?.he&&a.en&&a.source&&a.decision,id);assert.ok(records.some(r=>r.id===id),id);}
 for(const id of audit.newIdentities){const r=records.find(r=>r.id===id);assert.ok(r);assert.equal(r.original,undefined);assert.equal(api.estimatedScore(r),null);}
 assert.deepEqual(JSON.parse(JSON.stringify(context.window.catalogAudit)),audit);
});
test('current discovery excludes historical and unresolved records without declaring all archived tools retired',()=>{
 const start=api.selectRecords(records,{query:'',scope:'curated',selectedTasks:[],status:'all'});assert.equal(start.length,66);
 assert.ok(start.every(r=>r.status!=='retired'&&r.curation?.state!=='archived'&&r.checked));
 for(const id of ['ai-052','ai-092']){const r=records.find(r=>r.id===id);assert.equal(r.checked,false);assert.equal(r.status,'uncertain');assert.equal(r.curation.state,'archived');}
 for(const id of ['ai-025','ai-109'])assert.equal(records.find(r=>r.id===id).checked,false);
 for(const id of ['ai-010','ai-016','ai-112'])assert.notEqual(records.find(r=>r.id===id).status,'retired');
});
test('corrected capabilities and score scope do not inherit mismatched history',()=>{
 for(const id of ['ai-006','ai-020','ai-022','ai-023','ai-024','ai-029','ai-031','ai-032','ai-033','ai-034','ai-037','ai-044','ai-079'])assert.equal(api.estimatedScore(records.find(r=>r.id===id)),null,id);
 const byId=id=>records.find(r=>r.id===id);
 assert.equal(byId('ai-029').primaryTask,'video');assert.ok(byId('ai-029').meta.capabilities.includes('transcription'));assert.ok(!byId('ai-029').meta.capabilities.includes('video-generation'));
 assert.equal(byId('ai-077').primaryTask,'image');assert.equal(byId('ai-078').primaryTask,'video');assert.equal(byId('ai-088').primaryTask,'workflow');
 assert.equal(byId('ai-019').name,'Wan 2.1');assert.equal(byId('wan-video').name,'Wan');assert.equal(byId('ai-018').name,'Veo 3');assert.equal(byId('google-veo').original,undefined);
 assert.ok(byId('ai-031').tasks.includes('video'));assert.ok(byId('ai-037').tasks.includes('video'));
});
test('public interface and workflow contain no personal attribution',()=>{
 for(const file of ['index.html','legacy.html','directory.js','creative-guide.js','catalog-audit.js'])assert.doesNotMatch(fs.readFileSync(file,'utf8'),/Eyal|אייל|(?:^|\s)איל(?:\s|$)/i,file);
});
