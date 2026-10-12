/* Optional isolated Chrome QA. No dependency installation and no personal profile access. */
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {spawn}=require('node:child_process');
const {pathToFileURL}=require('node:url');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const output=process.env.QA_OUTPUT || path.join(os.tmpdir(),'ai-index-design-evidence');fs.mkdirSync(output,{recursive:true});
const executable=process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if(!fs.existsSync(executable)) throw new Error('Set CHROME_BIN to an installed Chrome executable. No installation is performed.');
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'ai-index-design-profile-'));
const chrome=spawn(executable,['--headless=new','--remote-debugging-pipe',`--user-data-dir=${profile}`,'--no-first-run','--no-default-browser-check','--disable-sync','--disable-extensions','--disable-background-networking','about:blank'],{stdio:['ignore','ignore','pipe','pipe','pipe']});
let serial=0,buffer='',pending=new Map();
chrome.on('error',error=>{console.error(error.message);process.exitCode=1;});
chrome.stdio[4].on('data',chunk=>{buffer+=chunk;let end;while((end=buffer.indexOf('\0'))>=0){const message=JSON.parse(buffer.slice(0,end));buffer=buffer.slice(end+1);const request=pending.get(message.id);if(request){pending.delete(message.id);message.error?request.reject(new Error(JSON.stringify(message.error))):request.resolve(message.result);}}});
function send(method,params={},sessionId){return new Promise((resolve,reject)=>{const id=++serial;pending.set(id,{resolve,reject});chrome.stdio[3].write(JSON.stringify({id,method,params,sessionId})+'\0');});}
const timeout=setTimeout(()=>{chrome.kill();console.error('QA timed out');process.exit(2);},90000);
(async()=>{
 const results=[];
 for(const width of [360,390,768,1440]) for(const language of ['he','en']){
  const name=`${width}-${language}`;
  const {targetId}=await send('Target.createTarget',{url:'about:blank'});
  const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
  const evaluate=async expression=>{const result=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},sessionId);if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));return result.result.value;};
  const screenshot=async suffix=>{const {data}=await send('Page.captureScreenshot',{format:'png'},sessionId);fs.writeFileSync(path.join(output,name+suffix+'.png'),Buffer.from(data,'base64'));};
  await send('Page.enable',{},sessionId);await send('Page.bringToFront',{},sessionId);await send('Emulation.setDeviceMetricsOverride',{width,height:width>=1000?1100:844,deviceScaleFactor:1,mobile:width<620},sessionId);
  await send('Page.addScriptToEvaluateOnNewDocument',{source:"window.qaErrors=[];addEventListener('error',event=>{if(event.message)qaErrors.push(event.message)});"},sessionId);
  await send('Page.navigate',{url:pathToFileURL(path.join(root,'index.html')).href},sessionId);
  await evaluate("new Promise((resolve,reject)=>{let n=0;const timer=setInterval(()=>{if(document.querySelectorAll('.tool-card').length===131){clearInterval(timer);document.fonts.ready.then(resolve)}else if(++n>100){clearInterval(timer);reject(new Error('Directory did not initialize '+window.qaErrors))}},50)})");
  if(language==='en')await evaluate("document.getElementById('languageToggle').click()");
  const initial=await evaluate(`({language:document.documentElement.lang,direction:document.documentElement.dir,count:document.querySelectorAll('.tool-card').length,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,errors:qaErrors,columns:1})`);
  assert.equal(initial.language,language);assert.equal(initial.count,131);assert.equal(initial.width,width);assert.ok(initial.scrollWidth<=width,JSON.stringify(initial));assert.deepEqual(initial.errors,[]);
  await screenshot('-directory');
  const atlas=await evaluate(`(()=>{const labels=[...document.querySelectorAll('.tool-label')];return {font:document.fonts.check('16px Assistant'),fontLoaded:[...document.fonts].some(f=>f.family==='Assistant'&&f.status==='loaded'),minFont:Math.min(...labels.map(b=>parseFloat(getComputedStyle(b.querySelector('h3')).fontSize))),minTouch:Math.min(...labels.map(b=>b.getBoundingClientRect().height)),sizesMatch:labels.every(b=>{const score=b.parentElement.dataset.score;return b.style.getPropertyValue('--score-size')===DirectoryData.scoreSize(score==='unrated'?null:Number(score))+'px'}),visible:labels.filter(b=>b.getBoundingClientRect().bottom<=innerHeight).length,domains:new Set(labels.filter(b=>b.getBoundingClientRect().bottom<=innerHeight).map(b=>b.parentElement.dataset.category)).size}})()`);
  assert.ok(atlas.font&&atlas.fontLoaded);assert.ok(atlas.minFont>=16);assert.ok(atlas.minTouch>=44);assert.ok(atlas.sizesMatch);assert.ok(atlas.domains>=6,JSON.stringify(atlas));assert.ok(atlas.visible>=(width>=1000?30:10),JSON.stringify(atlas));
  const hoverPoint=await evaluate("(()=>{const r=document.querySelector('.tool-label').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()");await send('Input.dispatchMouseEvent',{type:'mouseMoved',...hoverPoint},sessionId);assert.equal(await evaluate("document.getElementById('quickPreview').hidden"),false);await screenshot('-summary');
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27},sessionId);await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27},sessionId);
  await evaluate("document.querySelector('[data-task=audio]').click();document.querySelector('[data-task=video]').click()");assert.equal(await evaluate("document.querySelectorAll('.task-chip[aria-pressed=true]').length"),2);await evaluate("document.getElementById('resetFilters').click()");
  await evaluate("document.querySelector('.tool-label').focus()");assert.equal(await evaluate("document.getElementById('quickPreview').hidden"),false);
  for(const key of ['Tab','Enter']){await send('Input.dispatchKeyEvent',{type:'keyDown',key,code:key,windowsVirtualKeyCode:key==='Tab'?9:13,text:key==='Enter'?'\r':undefined},sessionId);await send('Input.dispatchKeyEvent',{type:'keyUp',key,code:key,windowsVirtualKeyCode:key==='Tab'?9:13},sessionId);}
  assert.equal(await evaluate("document.getElementById('detailDialog').open"),true);await evaluate("document.getElementById('closeDialog').click();document.getElementById('searchInput').focus()");
  // Compose search + task + verification, then verify an empty intersection and reset.
  const filtered=await evaluate(`(()=>{const input=document.getElementById('searchInput');input.value='weavy';input.dispatchEvent(new Event('input'));if(innerWidth<620){const task=document.getElementById('mobileTask');task.value='workflow';task.dispatchEvent(new Event('change'))}else document.querySelector('[data-task=workflow]').click();const select=document.getElementById('statusFilter');select.value='checked';select.dispatchEvent(new Event('change'));return {count:document.querySelectorAll('.tool-card').length,name:document.querySelector('.tool-card h3')?.textContent}})()`);
  assert.deepEqual(filtered,{count:1,name:'Figma Weave'});
  await evaluate("document.getElementById('languageToggle').click();document.getElementById('languageToggle').click()");
  assert.equal(await evaluate("document.getElementById('searchInput').value"),'weavy');
  assert.equal(await evaluate("document.getElementById('statusFilter').value"),'checked');
  assert.equal(await evaluate("document.querySelectorAll('.tool-card').length"),1);
  await evaluate("if(innerWidth<620){const task=document.getElementById('mobileTask');task.value='audio';task.dispatchEvent(new Event('change'))}else {document.querySelector('[data-task=all]').click();document.querySelector('[data-task=audio]').click()}");assert.equal(await evaluate("document.querySelectorAll('.tool-card').length"),0);assert.equal(await evaluate("document.getElementById('emptyState').hidden"),false);
  await evaluate("document.getElementById('emptyReset').click()");assert.equal(await evaluate("document.querySelectorAll('.tool-card').length"),131);
  assert.equal(await evaluate("document.activeElement.id"),'searchInput');
  const clear=await evaluate(`(()=>{const input=document.getElementById('searchInput');input.value='zzzz_no_tool';input.dispatchEvent(new Event('input'));document.getElementById('clearSearch').click();return {count:document.querySelectorAll('.tool-card').length,value:input.value,focus:document.activeElement.id}})()`);
  assert.deepEqual(clear,{count:131,value:'',focus:'searchInput'});
  for(const [status,count] of [['checked',31],['pending',100],['retired',1]]){
    await evaluate(`(()=>{const select=document.getElementById('statusFilter');select.value='${status}';select.dispatchEvent(new Event('change'))})()`);
    assert.equal(await evaluate("document.querySelectorAll('.tool-card').length"),count);
  }
  await evaluate("document.getElementById('resetFilters').click()");
  // Open details, exercise native keyboard focus containment, dismiss with Escape.
  await evaluate("document.querySelector('.tool-card button').click();document.querySelector('#quickPreview .primary-button').click()");assert.equal(await evaluate("document.getElementById('detailDialog').open"),true);assert.equal(await evaluate("document.activeElement.id"),'closeDialog');
  if(width===390 || width===1440)await screenshot('-detail');
  const detailBounds=await evaluate("(()=>{document.querySelectorAll('#detailContent details').forEach(element=>element.open=true);const dialog=document.getElementById('detailDialog');return {scrollWidth:dialog.scrollWidth,width:dialog.clientWidth,sources:document.querySelectorAll('.source-list a').length}})()");
  assert.ok(detailBounds.scrollWidth<=detailBounds.width);assert.ok(detailBounds.sources>0);
  await evaluate("document.querySelectorAll('#detailContent details').forEach(element=>element.open=false)");
  for(let i=0;i<9;i++){await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9},sessionId);await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9},sessionId);assert.equal(await evaluate("document.getElementById('detailDialog').contains(document.activeElement)"),true);}
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27},sessionId);await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27},sessionId);
  await evaluate("new Promise(resolve=>setTimeout(resolve,100))");assert.equal(await evaluate("document.getElementById('detailDialog').open"),false);assert.equal(await evaluate("document.activeElement===document.querySelector('.tool-card button')"),true,JSON.stringify(await evaluate("({active:document.activeElement.outerHTML,focused:document.hasFocus(),open:document.getElementById('detailDialog').open})")));
  for(let i=0;i<3;i++){await evaluate("document.querySelector('.tool-card button').click();document.querySelector('#quickPreview .primary-button').click();document.getElementById('closeDialog').click()");await evaluate("new Promise(resolve=>setTimeout(resolve,20))");assert.equal(await evaluate("document.getElementById('detailDialog').open"),false);}
  // Repeated actual touch input on a fresh isolated mobile surface.
  if(width<620){
   await send('Emulation.setTouchEmulationEnabled',{enabled:true},sessionId);
   for(let i=0;i<3;i++){
    const point=await evaluate("(()=>{const b=document.querySelector('.tool-label');b.scrollIntoView({block:'center'});const r=b.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()");
    await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]},sessionId);await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]},sessionId);
    assert.equal(await evaluate("document.getElementById('quickPreview').hidden"),false);await evaluate("document.querySelector('#quickPreview .primary-button').click()");
    assert.equal(await evaluate("document.getElementById('detailDialog').open"),true);
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27},sessionId);await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27},sessionId);
    await evaluate("new Promise(resolve=>setTimeout(resolve,30))");assert.equal(await evaluate("document.activeElement===document.querySelector('.tool-label')"),true);
   }
  }
  // Retired entry has no launch button; provenance and old scores remain accessible.
  const retired=await evaluate(`(()=>{const input=document.getElementById('searchInput');input.value='InVision';input.dispatchEvent(new Event('input'));document.querySelector('.tool-card button').click();document.querySelector('#quickPreview .primary-button').click();return {launches:document.querySelectorAll('#detailContent .primary-button').length,scores:document.querySelectorAll('.historical-scores span').length,sources:document.querySelectorAll('.source-list a').length}})()`);
  assert.equal(retired.launches,0);assert.equal(retired.scores,2);assert.equal(retired.sources,1);
  await evaluate("document.getElementById('closeDialog').click();document.getElementById('resetFilters').click();document.getElementById('workflowOpen').click()");assert.equal(await evaluate("document.getElementById('detailDialog').open"),true);
  await evaluate("document.getElementById('closeDialog').click()");
  assert.deepEqual(await evaluate('qaErrors'),[]);
  results.push({...initial,...atlas,name,searchAndCombinedFilters:true,clearAndEmptyResults:true,dialogAndEscape:true,keyboardFocusContained:true,repeatedNavigation:true,retiredProvenance:true});
  if(width===1440&&language==='en'){
   await send('Page.navigate',{url:pathToFileURL(path.join(root,'legacy.html')).href},sessionId);
   await evaluate("new Promise(resolve=>setTimeout(resolve,1500))");await screenshot('-original');
  }
  console.log('PASS '+name);await send('Target.closeTarget',{targetId});
 }
 fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(results,null,2)+'\n');
 await send('Browser.close');clearTimeout(timeout);console.log('Evidence: '+output);
})().catch(error=>{console.error(error);clearTimeout(timeout);chrome.kill();process.exitCode=1;});
