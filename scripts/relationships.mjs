import fs from 'node:fs';
import assert from 'node:assert/strict';
const catalog=JSON.parse(fs.readFileSync('data/catalog.json'));
const data=JSON.parse(fs.readFileSync('data/model-relationships.json'));
const ids=new Set(catalog.records.map(r=>r.id));
const evidence=value=>{assert.ok(Array.isArray(value.sources)&&value.sources.length,'Missing relationship evidence');for(const source of value.sources){assert.equal(new URL(source.url).protocol,'https:');assert.match(source.checkedAt,/^\d{4}-\d{2}-\d{2}$/);}};
assert.equal(data.schemaVersion,1);
for(const [id,family] of Object.entries(data.families)){
 assert.ok(ids.has(id),'Unknown model family '+id);const generations=new Set();
 for(const g of family.generations){assert.ok(g.id&&g.name&&!generations.has(g.id));generations.add(g.id);assert.ok(['current','available','legacy','planned','sibling','documented'].includes(g.status));assert.ok(g.he&&g.en);assert.ok(Array.isArray(g.inputs)&&Array.isArray(g.outputs));evidence(g);}
}
for(const [id,routes] of Object.entries(data.platforms)){
 assert.ok(ids.has(id),'Unknown platform '+id);
 for(const route of routes){assert.ok(route.familyId?ids.has(route.familyId)&&data.families[route.familyId]:route.familyName&&route.models?.length,'Unknown route family');assert.ok(['available','planned','legacy','pricing-listed','api-documented'].includes(route.availability));assert.ok(route.he&&route.en&&route.surface);for(const id of route.generations||[])assert.ok(data.families[route.familyId].generations.some(g=>g.id===id),'Unknown generation '+id);evidence(route);}
}
const output='/* Generated from data/model-relationships.json. */\nwindow.modelRelationships = '+JSON.stringify(data,null,2)+';\n';
if(process.argv.includes('--write'))fs.writeFileSync('model-relationships.js',output);else assert.equal(fs.readFileSync('model-relationships.js','utf8'),output);
console.log(`Validated ${Object.keys(data.families).length} families and ${Object.values(data.platforms).reduce((n,r)=>n+r.length,0)} documented routes.`);
