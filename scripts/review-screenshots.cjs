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
 for(const [width,height,language] of [[400,605,'he'],[390,844,'he'],[390,844,'en'],[1440,900,'he'],[1440,900,'en']]){
  const name=`${width}-${height}-${language}`;
  const {targetId}=await send('Target.createTarget',{url:'about:blank'}),{sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
  const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},sessionId);if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
  const shot=async suffix=>{const {data}=await send('Page.captureScreenshot',{format:'png'},sessionId);fs.writeFileSync(path.join(output,name+'-'+suffix+'.png'),Buffer.from(data,'base64'));};
  await send('Page.enable',{},sessionId);await send('Network.enable',{},sessionId);if(process.env.QA_OFFLINE)await send('Network.setBlockedURLs',{urls:['http://*','https://*']},sessionId);
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<620},sessionId);
  await send('Page.navigate',{url:pathToFileURL(path.join(root,entry)).href},sessionId);
  await evaluate("new Promise(r=>{const t=setInterval(()=>{if(document.querySelector('.tool-label')){clearInterval(t);document.fonts.ready.then(r)}},30)})");
  if(language==='en')await evaluate("document.getElementById('languageToggle').click()");
  assert.equal(await evaluate("document.getElementById('sphereLayout').getAttribute('aria-pressed')"),'true');await shot('sphere');
  await evaluate("document.getElementById('atlasLayout').click();new Promise(r=>setTimeout(r,850))");
  const metrics=await evaluate(`(()=>{const labels=[...document.querySelectorAll('.tool-label')];return {top:document.getElementById('sphereStage').getBoundingClientRect().top,visible:labels.filter(b=>b.getBoundingClientRect().bottom<=innerHeight).length,categories:document.querySelectorAll('.atlas-group').length,overflow:document.documentElement.scrollWidth>innerWidth}})()`);
  assert.equal(metrics.overflow,false);assert.ok(metrics.visible>=12,JSON.stringify(metrics));if(width===1440){assert.equal(metrics.visible,66);assert.equal(metrics.categories,8);}await shot('overview');

  await evaluate("document.querySelector('[data-id=ai-029] .tool-label').click()");await shot('summary');
  await evaluate("document.querySelector('#quickPreview .quick-close').click();document.getElementById('workflowOpen').click()");await shot('workflow');
  await evaluate("document.querySelector('#detailContent details').open=true;document.querySelector('#detailContent details').scrollIntoView({block:'start'})");const closeBounds=await evaluate("(()=>{const b=document.getElementById('closeDialog').getBoundingClientRect(),d=document.getElementById('detailDialog').getBoundingClientRect();return {top:b.top-d.top,bottom:d.bottom-b.bottom}})()");assert.ok(closeBounds.top>=8&&closeBounds.bottom>=0,JSON.stringify(closeBounds));await shot('routes');
  await evaluate("document.querySelector('.workflow-tools button:last-child').click()");assert.equal(await evaluate("document.getElementById('detailTitle').textContent"),'Magnific Upscalers');await shot('upscaler');
  await evaluate("document.getElementById('closeDialog').click();new Promise(r=>setTimeout(r,30))");assert.equal(await evaluate("document.activeElement.id"),'workflowOpen');
  if(width===390){
   const report=await evaluate(`(async()=>{const s=document.getElementById('scopeFilter');s.value='all';s.dispatchEvent(new Event('change'));let reviewed=0;for(const b of [...document.querySelectorAll('.tool-label')]){b.click();document.querySelector('#quickPreview .primary-button').click();const text=document.getElementById('detailContent').textContent;const expected=catalogAudit.records[b.parentElement.dataset.id][document.documentElement.lang];if(document.querySelector('.detail-description').textContent!==expected)throw Error('Stale description '+b.textContent);if(/Eyal|אייל/.test(text))throw Error('Attribution '+b.textContent);if(document.getElementById('detailDialog').scrollWidth>document.getElementById('detailDialog').clientWidth)throw Error('Overflow '+b.textContent);reviewed++;document.getElementById('closeDialog').click();await new Promise(r=>setTimeout(r,5));}return reviewed})()`);assert.equal(report,158);
  }
  results.push({width,height,language,...metrics});console.log('PASS review '+name);await send('Target.closeTarget',{targetId});
 }
 fs.writeFileSync(path.join(output,'review-results.json'),JSON.stringify(results,null,2)+'\n');await send('Browser.close');clearTimeout(timeout);
})().catch(e=>{console.error(e);clearTimeout(timeout);chrome.kill();process.exitCode=1;});
