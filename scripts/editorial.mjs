import fs from 'node:fs';
import assert from 'node:assert/strict';
const catalog=JSON.parse(fs.readFileSync('data/catalog.json'));
const audit=JSON.parse(fs.readFileSync('data/catalog-audit.json'));
assert.equal(Object.keys(audit.records).length,catalog.records.length);
assert.equal(audit.originalCoverage+audit.newIdentities.length,catalog.records.length);
for(const r of catalog.records){const a=audit.records[r.id];assert.ok(a?.he&&a.en&&a.decision&&a.category,r.id);assert.equal(new URL(a.source).protocol,'https:');if(a.verification==='unresolved')assert.equal(r.verifiedAt,null,r.id);}
for(const [name,global] of [['catalog-audit','catalogAudit'],['creative-guide','creativeGuide']]){
 const data=JSON.parse(fs.readFileSync(`data/${name}.json`));
 const output=`/* Generated from data/${name}.json. */\nwindow.${global} = ${JSON.stringify(data,null,2)};\n`;
 if(process.argv.includes('--write'))fs.writeFileSync(`${name}.js`,output);
 else assert.equal(fs.readFileSync(`${name}.js`,'utf8'),output,`${name}.js is stale; run node scripts/editorial.mjs --write`);
}
console.log(`Validated editorial coverage for ${catalog.records.length} identities.`);
