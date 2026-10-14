/* Data-only change proposals. No file mutation, network, credentials or publishing. */
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('..',import.meta.url));
const files=['data/catalog.json','data/catalog-audit.json','curation.js','data/model-relationships.json'];
export function snapshot(){return crypto.createHash('sha256').update(files.map(file=>file+'\n'+fs.readFileSync(path.join(root,file),'utf8')).join('\n')).digest('hex');}
const keys=(object,allowed)=>{assert.ok(object&&typeof object==='object'&&!Array.isArray(object),'Expected an object');for(const key of Object.keys(object))assert.ok(allowed.includes(key),`Unsupported field: ${key}`);};
const text=value=>typeof value==='string'&&value.trim().length>0&&value.length<=4000;
const https=value=>{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}};
const fields=['name','officialUrl','aliases','summaryHe','summaryEn','category','entityType','capabilities'];
export function validateProposal(proposal,catalog,expectedDigest){
 keys(proposal,['version','requestId','baseDigest','requestedBy','summary','operations']);
 assert.equal(proposal.version,1);assert.equal(proposal.baseDigest,expectedDigest,'Stale catalog snapshot; review against a fresh template');
 for(const key of ['requestId','requestedBy','summary'])assert.ok(text(proposal[key]),`Missing ${key}`);
 assert.ok(Array.isArray(proposal.operations)&&proposal.operations.length>0&&proposal.operations.length<=20,'Expected 1–20 operations');
 const ids=new Set(),names=new Set(catalog.records.map(r=>r.name.toLowerCase().replace(/[\s-]/g,'')));const plan=[];
 for(const op of proposal.operations){
  keys(op,['kind','id','reason','sources','changes']);assert.ok(['add','update','archive','restore'].includes(op.kind),'Unsupported operation; use archive instead of delete');
  assert.ok(typeof op.id==='string'&&/^[a-z][a-z0-9-]+$/.test(op.id)&&!ids.has(op.id),'Invalid or repeated identity');ids.add(op.id);
  const existing=catalog.records.find(r=>r.id===op.id);assert.ok(op.kind==='add'?!existing:Boolean(existing),'Identity must be new for add, existing otherwise');
  assert.ok(text(op.reason),'A reason is required');assert.ok(Array.isArray(op.sources),'Sources must be an array');
  for(const source of op.sources){keys(source,['url','checkedAt']);assert.ok(https(source.url),'Source must be HTTPS without credentials');assert.ok(typeof source.checkedAt==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(source.checkedAt)&&!isNaN(Date.parse(source.checkedAt))&&new Date(source.checkedAt).toISOString().slice(0,10)===source.checkedAt&&source.checkedAt<=new Date().toISOString().slice(0,10),'Invalid or future source check date');}
  keys(op.changes,fields);
  if(['archive','restore'].includes(op.kind))assert.equal(Object.keys(op.changes).length,0,'Archive/restore changes membership, never deletes facts or scores');
  else {
   assert.ok(Object.keys(op.changes).length,'Empty change');
   for(const [key,value] of Object.entries(op.changes)){
    if(['aliases','capabilities'].includes(key))assert.ok(Array.isArray(value)&&value.every(text),`Invalid ${key}`);
    else if(key==='officialUrl')assert.ok(https(value),'Invalid destination');
    else if(key==='category')assert.ok(['platforms','image','video','audio','design','workflow','text','spatial'].includes(value),'Unknown category; new taxonomy requires separate review');
    else if(key==='entityType')assert.ok(['vendor','product','model','platform','model-family','product-family','product_suite','workflow_platform','workflow_engine','code_driven_workflow','unknown'].includes(value),'Unknown entity type');
    else assert.ok(text(value),`Invalid ${key}`);
   }
   if(Object.keys(op.changes).some(key=>key!=='aliases'))assert.ok(op.sources.length,'Factual changes need dated official sources');
   if(op.changes.name)assert.ok(!catalog.records.some(r=>r.id!==op.id&&r.name.toLowerCase().replace(/[\s-]/g,'')===op.changes.name.toLowerCase().replace(/[\s-]/g,'')),'Name already exists; review identity instead of duplicating');
   if(op.kind==='add'){
    for(const field of ['name','officialUrl','summaryHe','summaryEn','category','entityType'])assert.ok(op.changes[field],`New tool needs ${field}`);
    const name=op.changes.name.toLowerCase().replace(/[\s-]/g,'');assert.ok(!names.has(name),'Name already exists; review identity instead of duplicating');names.add(name);
   }
  }
  plan.push({kind:op.kind,id:op.id,currentName:existing?.name||null,changes:op.changes,reason:op.reason,sources:op.sources});
 }
 return {requestId:proposal.requestId,baseDigest:expectedDigest,requestedBy:proposal.requestedBy,authorization:'not-established-by-this-file',requiresReview:true,affectedFiles:files,operations:plan};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  if(process.argv[2]==='--template')console.log(JSON.stringify({version:1,requestId:'replace-with-request-id',baseDigest:snapshot(),requestedBy:'replace-with-author',summary:'Describe the proposed change',operations:[{kind:'update',id:'ai-002',reason:'Describe why this change is needed',sources:[],changes:{aliases:['Base 44','Base-44','בייס44','בייס 44']}}]},null,2));
  else {assert.ok(process.argv[2],'Usage: node scripts/catalog-change.mjs --template | proposal.json');const proposal=JSON.parse(fs.readFileSync(process.argv[2],'utf8')),catalog=JSON.parse(fs.readFileSync(path.join(root,'data/catalog.json'),'utf8'));console.log(JSON.stringify(validateProposal(proposal,catalog,snapshot()),null,2));}
 }catch(error){console.error(error.message);process.exitCode=1;}
}
