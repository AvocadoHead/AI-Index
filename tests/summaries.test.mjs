import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
test('official homepage cache has bilingual descriptions and dated source provenance',()=>{
 const data=JSON.parse(fs.readFileSync('data/official-summaries.json','utf8')),context={window:{}};vm.runInNewContext(fs.readFileSync('official-summaries.js','utf8'),context);
 assert.deepEqual(JSON.parse(JSON.stringify(context.window.officialSummaries)),data);assert.equal(Object.keys(data).length,16);
 for(const entry of Object.values(data)){assert.ok(entry.en.length>20&&entry.en.length<200);assert.ok(entry.he.length>20&&entry.he.length<200);assert.equal(new URL(entry.source).protocol,'https:');assert.equal(entry.checkedAt,'2026-10-12');assert.ok(entry.observedDescription.length>10);assert.equal(entry.kind,'official-homepage-summary');}
 assert.equal(data['ai-003'],undefined,'403 source must not be fabricated');assert.equal(data['ai-016'],undefined,'unrelated redirect must not describe Llama');
});
