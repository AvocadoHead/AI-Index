/* Optional isolated Chrome QA. No dependency installation and no personal profile access. */
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {spawn}=require('node:child_process');
const {pathToFileURL}=require('node:url');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');const entry=process.env.QA_ENTRY || 'index.html';
const output=process.env.QA_OUTPUT || path.join(os.tmpdir(),'ai-index-design-evidence');fs.mkdirSync(output,{recursive:true});
const executable=process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if(!fs.existsSync(executable)) throw new Error('Set CHROME_BIN to an installed Chrome executable. No installation is performed.');
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'ai-index-design-profile-'));
const chrome=spawn(executable,['--headless=new','--remote-debugging-pipe',`--user-data-dir=${profile}`,'--no-first-run','--no-default-browser-check','--disable-sync','--disable-extensions','--disable-background-networking','about:blank'],{stdio:['ignore','ignore','pipe','pipe','pipe']});
let serial=0,buffer='',pending=new Map();
chrome.on('error',error=>{console.error(error.message);process.exitCode=1;});
chrome.stdio[4].on('data',chunk=>{buffer+=chunk;let end;while((end=buffer.indexOf('\0'))>=0){const message=JSON.parse(buffer.slice(0,end));buffer=buffer.slice(end+1);const request=pending.get(message.id);if(request){pending.delete(message.id);message.error?request.reject(new Error(JSON.stringify(message.error))):request.resolve(message.result);}}});
function send(method,params={},sessionId){return new Promise((resolve,reject)=>{const id=++serial;pending.set(id,{resolve,reject});chrome.stdio[3].write(JSON.stringify({id,method,params,sessionId})+'\0');});}
const timeout=setTimeout(()=>{chrome.kill();console.error('QA timed out');process.exit(2);},300000);
(async()=>{
 const results=[],total=JSON.parse(fs.readFileSync(path.join(root,'data/catalog.json'))).records.length;
 for(const width of [360,390,768,1440])for(const language of ['he','en']){
 const {targetId}=await send('Target.createTarget',{url:'about:blank'}),{sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
 const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},sessionId);if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 const pause=ms=>evaluate(`new Promise(r=>setTimeout(r,${ms}))`);
 const settle=()=>evaluate("new Promise(r=>{const t=setInterval(()=>{if(!document.getElementById('sphereStage').dataset.zooming){clearInterval(t);r()}},30)})");
 const shot=async name=>{const {data}=await send('Page.captureScreenshot',{format:'png'},sessionId);fs.writeFileSync(path.join(output,`${width}-${language}-${name}.png`),Buffer.from(data,'base64'));};
 await send('Page.enable',{},sessionId);await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<620},sessionId);await send('Page.navigate',{url:pathToFileURL(path.join(root,entry)).href},sessionId);
 await evaluate("new Promise(r=>{const t=setInterval(()=>{if(document.querySelectorAll('.tool-label').length===66){clearInterval(t);document.fonts.ready.then(r)}},30)})");if(language==='en')await evaluate("document.getElementById('languageToggle').click()");
 const wheel=async deltaY=>{const point=await evaluate("(()=>{const r=document.getElementById('sphereStage').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+150}})()");await send('Input.dispatchMouseEvent',{type:'mouseWheel',deltaX:0,deltaY,...point},sessionId);await pause(60);};
 await shot('outer');await wheel(-45);await pause(700);assert.equal(await evaluate("document.querySelectorAll('.tool-label').length"),total);assert.ok(await evaluate("Number(document.getElementById('sphereStage').dataset.exploration)>0"));
 await evaluate("document.getElementById('exploreAll').click()");await pause(850);await shot('transparent');
 const count=await evaluate("Number(document.getElementById('sphereStage').dataset.visible)");assert.ok(count>=5,`Too few visible labels: ${width} ${count}`);
 await evaluate("document.getElementById('exploreInside').click()");await pause(900);await settle();await shot('inside');assert.equal(await evaluate("document.getElementById('sphereStage').dataset.exploration"),'1.000');
 assert.ok(await evaluate("Number(document.getElementById('sphereStage').dataset.visible)>=3"));assert.ok(await evaluate("document.documentElement.scrollWidth<=innerWidth"));
 await evaluate("window.qaSpacer=document.createElement('div');qaSpacer.style.height='600px';document.body.append(qaSpacer);scrollTo(0,180)");const before=await evaluate('scrollY');await wheel(-180);assert.ok(await evaluate('scrollY')<before,'wheel at inner boundary must scroll page');
 await evaluate("qaSpacer.remove();document.getElementById('exploreSelected').click();scrollTo(0,0)");await pause(900);await settle();assert.equal(await evaluate("document.querySelectorAll('.tool-label').length"),66);
 // Pinned previews remain stable under wheel input; keyboard and touch stops work.
 await evaluate("[...document.querySelectorAll('.tool-label')].find(b=>b.tabIndex===0).click()");const pinned=await evaluate("document.querySelector('#quickPreview h2').textContent");await wheel(40);assert.equal(await evaluate("document.querySelector('#quickPreview h2').textContent"),pinned);assert.equal(await evaluate("document.getElementById('sphereStage').dataset.exploration"),'0.000');
 await evaluate("document.querySelector('#quickPreview .quick-close').click();document.getElementById('exploreInside').focus();scrollTo(0,0)");
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'},sessionId);await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'},sessionId);await pause(900);await settle();assert.equal(await evaluate("document.getElementById('sphereStage').dataset.exploration"),'1.000');
 await evaluate("document.getElementById('exploreSelected').focus()");await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'},sessionId);await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'},sessionId);await pause(900);await settle();assert.equal(await evaluate("document.querySelectorAll('.tool-label').length"),66);
 if(width<620){
 await send('Emulation.setTouchEmulationEnabled',{enabled:true},sessionId);
 for(const id of ['exploreInside','exploreSelected']){const point=await evaluate(`(()=>{const r=document.getElementById('${id}').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]},sessionId);await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]},sessionId);await pause(900);await settle();assert.equal(await evaluate("document.querySelectorAll('.tool-label').length"),id==='exploreInside'?total:66);}
 await evaluate("window.qaTouchSpacer=document.createElement('div');qaTouchSpacer.style.height='600px';document.body.append(qaTouchSpacer)");const point=await evaluate("(()=>{const r=document.getElementById('sphereStage').getBoundingClientRect();return {x:r.x+30,y:r.y+180}})()");const beforeTouch=await evaluate('scrollY');await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]},sessionId);for(let i=1;i<=5;i++){await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:point.x,y:point.y-i*25}]},sessionId);await pause(20);}await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]},sessionId);await pause(150);assert.ok(await evaluate('scrollY')>beforeTouch,'vertical touch must scroll page');await send('Emulation.setTouchEmulationEnabled',{enabled:false},sessionId);await evaluate('qaTouchSpacer.remove();scrollTo(0,0)');
 }
 // Existing filters survive expansion and return.
 await evaluate("document.querySelector('[data-task=workflow]').click();document.getElementById('exploreAll').click()");await pause(850);assert.equal(await evaluate("document.querySelector('[data-task=workflow]').getAttribute('aria-pressed')"),'true');
 assert.ok(await evaluate("[...document.querySelectorAll('.tool-card')].every(e=>DirectoryData.selectRecords(DirectoryData.canonicalRecords(DirectoryData.createRecords(defaultModules,aiCatalog)),{query:'',selectedTasks:['workflow'],scope:'all',status:'all',sort:'reviewed'}).some(r=>r.id===e.dataset.id))"));
 await evaluate("document.getElementById('exploreSelected').click()");await pause(900);await settle();await evaluate("document.getElementById('resetFilters').click();document.getElementById('exploreAll').click()");await pause(850);
 await evaluate("document.getElementById('atlasLayout').click()");await pause(850);assert.equal(await evaluate("document.querySelectorAll('.tool-label').length"),total);assert.equal(await evaluate("document.getElementById('explorationControls').hidden"),true);
 await evaluate("document.getElementById('sphereLayout').click()");await pause(850);
 // Reduced motion disables wheel zoom but leaves instant explicit controls available.
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]},sessionId);await evaluate("qaSpacer.remove();document.getElementById('exploreSelected').click();scrollTo(0,0)");await wheel(-45);assert.equal(await evaluate("document.getElementById('sphereStage').dataset.exploration"),'0.000');
 await evaluate("document.getElementById('exploreInside').click()");assert.equal(await evaluate("document.getElementById('sphereStage').dataset.exploration"),'1.000');
 await evaluate("document.getElementById('exploreSelected').click()");assert.equal(await evaluate("document.querySelectorAll('.tool-label').length"),66);
 results.push({width,language,all:total,return:66,filters:true,atlas:true,boundaryScroll:true,reducedMotion:true});console.log(`PASS exploration ${width}-${language}`);await send('Target.closeTarget',{targetId});
 }
 fs.writeFileSync(path.join(output,'exploration-results.json'),JSON.stringify(results,null,2)+'\n');await send('Browser.close');clearTimeout(timeout);
})().catch(e=>{console.error(e);clearTimeout(timeout);chrome.kill();process.exitCode=1;});
