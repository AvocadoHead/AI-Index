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
 const results=[];
 for(const width of [360,390,768,1440])for(const language of ['he','en']){
 const {targetId}=await send('Target.createTarget',{url:'about:blank'}),{sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
 const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},sessionId);if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 const pause=ms=>evaluate(`new Promise(r=>setTimeout(r,${ms}))`);
 const query=async q=>evaluate(`document.getElementById('searchInput').value=${JSON.stringify(q)};document.getElementById('searchInput').dispatchEvent(new Event('input'))`);
 await send('Page.enable',{},sessionId);await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<620},sessionId);await send('Page.navigate',{url:pathToFileURL(path.join(root,entry)).href},sessionId);await evaluate("new Promise(r=>{const t=setInterval(()=>{if(document.querySelectorAll('.tool-label').length===66){clearInterval(t);document.fonts.ready.then(r)}},30)})");if(language==='en')await evaluate("document.getElementById('languageToggle').click()");
 await evaluate("document.getElementById('exploreInside').click()");await pause(900);
 for(const scope of ['curated','all'])for(const q of ['base44','BASE44','Base 44','  base   44  ','Base-44','בייס44','בייס 44']){
  // Set scope before the query; its explicit control resets exploration as designed.
  await evaluate(`document.getElementById('scopeFilter').value='${scope}';document.getElementById('scopeFilter').dispatchEvent(new Event('change'))`);await query(q);
  const result=await evaluate("(()=>{const b=document.querySelector('.tool-label'),r=b.getBoundingClientRect();return {count:document.querySelectorAll('.tool-label').length,id:b.parentElement.dataset.id,tab:b.tabIndex,visibility:getComputedStyle(b).visibility,visible:r.top>=0&&r.bottom<innerHeight,flat:document.getElementById('sphereStage').classList.contains('atlas-mode')}})()");assert.deepEqual(result,{count:1,id:'ai-002',tab:0,visibility:'visible',visible:true,flat:true});
 }
 await query('');await pause(900);await evaluate("document.getElementById('exploreInside').click()");await pause(900);await query('base44');assert.equal(await evaluate("document.querySelector('.tool-label').tabIndex"),0);assert.equal(await evaluate("document.getElementById('sphereCanvas').hidden"),true);
 await evaluate("document.querySelector('.tool-label').focus()");await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'},sessionId);await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13},sessionId);assert.equal(await evaluate("document.querySelector('#quickPreview h2').textContent"),'Base44');await evaluate("document.querySelector('#quickPreview .primary-button').click()");assert.equal(await evaluate("document.getElementById('detailDialog').open"),true);await evaluate("document.getElementById('closeDialog').click();document.getElementById('clearSearch').click()");assert.equal(await evaluate("document.getElementById('sphereStage').classList.contains('atlas-mode')"),false);assert.equal(await evaluate("document.getElementById('sphereStage').dataset.exploration"),'1.000');
 await query('base44');
 if(width<620){await send('Emulation.setTouchEmulationEnabled',{enabled:true},sessionId);const point=await evaluate("(()=>{const r=document.querySelector('.tool-label').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()");await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]},sessionId);await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]},sessionId);assert.equal(await evaluate("document.querySelector('#quickPreview h2').textContent"),'Base44');assert.equal(await evaluate("document.getElementById('quickPreview').hidden"),false);await evaluate("document.querySelector('#quickPreview .quick-close').click()");await send('Emulation.setTouchEmulationEnabled',{enabled:false},sessionId);}
 await evaluate("document.querySelector('[data-task=audio]').click()");assert.equal(await evaluate("document.querySelectorAll('.tool-label').length"),0);assert.equal(await evaluate("document.getElementById('searchAll').hidden"),false);
 const {data}=await send('Page.captureScreenshot',{format:'png'},sessionId);fs.writeFileSync(path.join(output,`${width}-${language}-filters.png`),Buffer.from(data,'base64'));
 await evaluate("document.getElementById('searchAll').click()");assert.equal(await evaluate("document.getElementById('searchInput').value"),'base44');assert.equal(await evaluate("document.querySelector('.tool-label').parentElement.dataset.id"),'ai-002');
 for(const [id,value] of [['scopeFilter','archived'],['statusFilter','pending']]){await evaluate(`document.getElementById('${id}').value='${value}';document.getElementById('${id}').dispatchEvent(new Event('change'))`);assert.equal(await evaluate("document.getElementById('searchAll').hidden"),false);await evaluate("document.getElementById('searchAll').click()");assert.equal(await evaluate("document.querySelectorAll('.tool-label').length"),1);}
 const shot=await send('Page.captureScreenshot',{format:'png'},sessionId);fs.writeFileSync(path.join(output,`${width}-${language}-found.png`),Buffer.from(shot.data,'base64'));assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'));
 results.push({width,language,aliases:true,scopes:true,categoryAndStatusRecovery:true,insideSearch:true,restoreView:true,keyboardDetails:true});console.log(`PASS search ${width}-${language}`);await send('Target.closeTarget',{targetId});
 }
 fs.writeFileSync(path.join(output,'search-results.json'),JSON.stringify(results,null,2)+'\n');await send('Browser.close');clearTimeout(timeout);
})().catch(e=>{console.error(e);clearTimeout(timeout);chrome.kill();process.exitCode=1;});
