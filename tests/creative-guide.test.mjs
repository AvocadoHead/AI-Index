import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const guide=JSON.parse(fs.readFileSync('data/creative-guide.json'));
const context={window:{},URL};for(const file of ['modules.js','catalog-data.js','catalog-audit.js','curation.js','creative-guide.js','directory.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),context);
test('editorial guidance preserves canonical identities and numeric scores',()=>{
 assert.deepEqual(JSON.parse(JSON.stringify(context.window.creativeGuide)),guide);
 const api=context.window.DirectoryData,records=api.canonicalRecords(api.createRecords(context.window.defaultModules,context.window.aiCatalog));
 assert.equal(records.length,158);assert.equal(context.window.defaultModules.length,120);assert.equal(records.filter(r=>r.checked).length,154);
 assert.equal(guide.attribution,undefined);assert.equal(guide.imageOrder,undefined);
 assert.doesNotMatch(JSON.stringify(guide),/Eyal|אייל|Topaz/);
 for(const [id,notes] of Object.entries(guide.models)){assert.ok(records.some(r=>r.id===id));for(const note of notes){assert.ok(note.en&&note.he&&note.name);assert.equal(note.score,undefined);assert.ok(note.sources.every(url=>new URL(url).protocol==='https:'));}}
 for(const [query,id] of [['ChatGPT Images 2.5','openai-chatgpt-images'],['H3 Max','ai-021'],['FLUX 3 Video','ai-031'],['Seedance 2.5','bytedance-seedance']])assert.ok(api.selectRecords(records,{query,task:'all',scope:'all',status:'all',selectedTasks:[]}).some(r=>r.id===id));
});
test('workflow connects multimodal drafting to selection and finishing',()=>{
 for(const language of ['he','en']){assert.equal(guide[language].steps.length,5);assert.equal(guide[language].stepTitles.length,5);}
 const workflow=guide.en.steps.join(' ');
 assert.match(workflow,/MiniMax H3/);assert.match(workflow,/Seedance 2.5/);assert.match(workflow,/Magnific/);
 assert.doesNotMatch(workflow,/H3 Max|Topaz|768p|2K/);
 assert.match(guide.models['ai-021'][0].en,/video and audio references/);
 assert.equal(guide.models['ai-021'][1].visible,false);
 assert.equal(guide.models['ai-019'].length,0);assert.match(guide.routes[1].en,/480p.*1080p/);assert.match(guide.routes[1].en,/seven days/);
});
