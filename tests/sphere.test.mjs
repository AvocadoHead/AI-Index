import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const context={window:{},URL};
for(const name of ['modules.js','catalog-data.js','catalog-audit.js','curation.js','directory.js','sphere.js'])vm.runInNewContext(fs.readFileSync(name,'utf8'),context);
const api=context.window.DirectoryData,geometry=context.window.SphereMath;
const records=api.canonicalRecords(api.createRecords(context.window.defaultModules,context.window.aiCatalog));
const state={query:'',task:'all',selectedTasks:[],status:'all',sort:'reviewed'};
test('sphere coordinates are deterministic, unique and on the unit sphere',()=>{
 const points=Array.from({length:131},(_,i)=>geometry.point(i,131));assert.equal(new Set(points.map(p=>JSON.stringify(p))).size,131);
 for(const [i,p] of points.entries()){assert.ok(Math.abs(Math.hypot(...p)-1)<1e-10);assert.deepEqual(p,geometry.point(i,131));assert.ok(Math.abs(Math.hypot(...geometry.rotate(p,.3,.9))-1)<1e-10)}
});
test('curation is reversible, broad and independent of lifecycle or verification',()=>{
 const start=api.selectRecords(records,{...state,scope:'curated'});assert.equal(start.length,66);assert.ok(new Set(start.map(r=>r.primaryTask)).size>=7);
 assert.equal(api.selectRecords(records,{...state,scope:'all'}).length,158);
 assert.equal(api.selectRecords(records,{...state,scope:'current'}).length,136);
 const archive=api.selectRecords(records,{...state,scope:'archived'});assert.equal(archive.length,22);assert.ok(archive.every(r=>r.curation.source.startsWith('https://')));
 assert.ok(api.selectRecords(records,{...state,scope:'curated',query:'Sora'}).some(r=>r.id==='ai-017'));
 assert.ok(api.selectRecords(records,{...state,scope:'curated',selectedTasks:['audio']}).some(r=>r.id==='ai-068'));
 for(const id of ['ai-025','ai-029','ai-047'])assert.equal(records.find(r=>r.id===id).curation,undefined);
 assert.equal(records.find(r=>r.id==='ai-011').name,'Claude 3.5 Sonnet');
 assert.equal(context.window.defaultModules.length,120);
});

test('inertia damping is time based, bounded and settles naturally',()=>{
 const whole=geometry.inertiaStep(.003,160),first=geometry.inertiaStep(.003,80),second=geometry.inertiaStep(first.velocity,80);
 assert.ok(Math.abs(whole.delta-first.delta-second.delta)<1e-12);
 assert.ok(Math.abs(whole.velocity-second.velocity)<1e-12);
 let velocity=.003,total=0;for(let i=0;i<160;i++){const next=geometry.inertiaStep(velocity,16);assert.ok(next.velocity<=velocity);total+=next.delta;velocity=next.velocity;}
 assert.ok(velocity<.000015);assert.ok(total<1.08);assert.ok(total>1);
 assert.equal(geometry.inertiaStep(0,16).delta,0);
});


test('rim emergence is continuous with smooth endpoints and no rear hit visibility',()=>{
 assert.equal(geometry.rimOpacity(-1),0);assert.equal(geometry.rimOpacity(-.30),0);assert.equal(geometry.rimOpacity(.25),1);
 let previous=0;
 for(let z=-.30;z<=.251;z+=.001){const alpha=geometry.rimOpacity(z);assert.ok(alpha>=previous);assert.ok(alpha-previous<.003);previous=alpha;}
 assert.ok(geometry.rimOpacity(-.299)<.00002);assert.ok(1-geometry.rimOpacity(.249)<.00002);
});
test('collision fades are continuous, time based and finish at their target',()=>{
 const whole=geometry.fadeStep(0,1,32),half=geometry.fadeStep(0,1,16);
 assert.ok(whole>0&&whole<1);assert.ok(Math.abs(whole-geometry.fadeStep(half,1,16))<1e-12);
 let alpha=1;for(let i=0;i<50;i++)alpha=geometry.fadeStep(alpha,0,16);assert.equal(alpha,0);
});

test('exploration projects continuously through a transparent shell into the far hemisphere',()=>{
 for(const depth of [0,.1,.45,.75,1])for(let i=0;i<158;i++){
  const p=geometry.projection(geometry.point(i,158),depth);assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));assert.ok(p.alpha>=0&&p.alpha<=1);
 }
 assert.equal(geometry.projection([0,0,-1],0).alpha,0);
 assert.equal(geometry.projection([0,0,-1],.45).alpha,1);
 assert.equal(geometry.projection([0,0,1],1).alpha,0);
 assert.equal(geometry.projection([0,0,-1],1).alpha,1);
});
test('wheel exploration normalizes devices and bounds a single event',()=>{
 assert.equal(geometry.wheelStep(1,1),geometry.wheelStep(16,0));
 assert.equal(geometry.wheelStep(5000,0),.125);assert.equal(geometry.wheelStep(-5000,0),-.125);
 assert.equal(geometry.wheelStep(0,0),0);assert.ok(geometry.wheelStep(2,0)<.005);
});
