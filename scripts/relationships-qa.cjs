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
for(const width of (process.env.QA_WIDTHS?process.env.QA_WIDTHS.split(',').map(Number):[390,1440]))for(const language of (process.env.QA_LANGUAGES?process.env.QA_LANGUAGES.split(','):['he','en'])){
 const {targetId}=await send('Target.createTarget',{url:'about:blank'}),{sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
 const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},sessionId);if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};const pause=ms=>evaluate(`new Promise(r=>setTimeout(r,${ms}))`);
 await send('Network.enable',{},sessionId);if(process.env.QA_OFFLINE)await send('Network.setBlockedURLs',{urls:['http://*','https://*']},sessionId);await send('Page.enable',{},sessionId);await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<620},sessionId);await send('Page.navigate',{url:pathToFileURL(path.join(root,entry)).href},sessionId);await evaluate("new Promise(r=>{const t=setInterval(()=>{if(window.modelRelationships&&document.querySelectorAll('.tool-label').length===66){clearInterval(t);document.fonts.ready.then(r)}},30)})");if(language==='en')await evaluate("document.getElementById('languageToggle').click()");
 assert.equal(await evaluate("Boolean(document.getElementById('explorationDepth')||document.getElementById('explorationHint'))"),false);
 await evaluate("[...document.querySelectorAll('.tool-label')].find(b=>b.tabIndex===0).click()");const pinned=await evaluate("document.querySelector('#quickPreview h2').textContent");
 for(const layout of ['atlas','sphere']){const point=await evaluate(`(()=>{const r=document.getElementById('${layout}Layout').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point},sessionId);await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point},sessionId);await evaluate("new Promise(r=>{const t=setInterval(()=>{if(!document.getElementById('sphereStage').dataset.unfolding){clearInterval(t);r()}},30)})");await pause(100);assert.equal(await evaluate("document.getElementById('quickPreview').hidden"),false);assert.equal(await evaluate("document.querySelector('#quickPreview h2').textContent"),pinned);}
 await evaluate("document.querySelector('#quickPreview .quick-close').click()");
 const graph=await evaluate('modelRelationships');const open=async id=>{await evaluate(`if(document.getElementById('detailDialog').open)document.getElementById('closeDialog').click();var s=document.getElementById('searchInput');s.value=${JSON.stringify(id)};s.dispatchEvent(new Event('input'));document.querySelector('[data-id="${id}"] .tool-label').click();document.querySelector('#quickPreview .primary-button').click()`);};
 for(const [id,family] of Object.entries(graph.families)){
  for(const g of family.generations){await open(id);await evaluate(`([...document.querySelectorAll('.relationship-link')].find(b=>b.textContent===${JSON.stringify(g.name+' ↗')})).click()`);assert.equal(await evaluate("document.getElementById('detailTitle').textContent"),g.name);assert.ok(await evaluate("document.querySelectorAll('.relationship-sources a').length>0"));assert.ok(await evaluate("document.getElementById('detailDialog').scrollWidth<=document.getElementById('detailDialog').clientWidth"));}
 }
 for(const [id,routes] of Object.entries(graph.platforms)){await open(id);assert.equal(await evaluate("document.querySelectorAll('.model-relationships>.detail-section:first-child .relationship-row').length"),routes.length);await evaluate("document.querySelectorAll('.route-details').forEach(d=>d.open=true);var b=document.querySelector('.generation-links button');if(b)b.click()");assert.ok(await evaluate("document.querySelector('.relationship-sources')!==null"));}
 for(const id of ['sync-lipsync','bytedance-seedance','kolbo-ai','google-antigravity','openai-codex','ai-040','weavy']){await open(id);const {data}=await send('Page.captureScreenshot',{format:'png'},sessionId);fs.writeFileSync(path.join(output,`${width}-${language}-${id}.png`),Buffer.from(data,'base64'));}
 results.push({width,language,pinnedAcrossLayouts:true,sliderRemoved:true,families:Object.keys(graph.families).length,routes:Object.values(graph.platforms).flat().length});console.log(`PASS relationships ${width}-${language}`);await send('Target.closeTarget',{targetId});
}
fs.writeFileSync(path.join(output,'relationship-results.json'),JSON.stringify(results,null,2)+'\n');await send('Browser.close');clearTimeout(timeout);
})().catch(e=>{console.error(e);clearTimeout(timeout);chrome.kill();process.exitCode=1;});
