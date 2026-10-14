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
 for(const width of [390,1440])for(const language of ['he','en'])for(const reduced of [false,true]){
  const name=`${width}-${language}-${reduced?'reduced':'normal'}`;
  const {targetId}=await send('Target.createTarget',{url:'about:blank'}),{sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
  const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},sessionId);if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
  const pause=ms=>evaluate(`new Promise(r=>setTimeout(r,${ms}))`);
  const move=point=>send('Input.dispatchMouseEvent',{type:'mouseMoved',x:point.x,y:point.y},sessionId);
  const click=async point=>{await move(point);await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,x:point.x,y:point.y},sessionId);await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,x:point.x,y:point.y},sessionId);};
  const key=async (key,code)=>{await send('Input.dispatchKeyEvent',{type:'keyDown',key,code:key,windowsVirtualKeyCode:code,text:key==='Enter'?'\r':undefined},sessionId);await send('Input.dispatchKeyEvent',{type:'keyUp',key,code:key,windowsVirtualKeyCode:code},sessionId);};
  const point=async selector=>evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)}),r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  const label=async exclude=>evaluate(`(()=>{for(const b of document.querySelectorAll('.tool-label')){const r=b.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2;if(b.parentElement.dataset.id!==${JSON.stringify(exclude||'')}&&b.tabIndex===0&&r.top>=0&&r.bottom<innerHeight&&document.elementFromPoint(x,y)?.closest('.tool-label')===b)return {id:b.parentElement.dataset.id,name:b.querySelector('h3').textContent,x,y};}throw Error('No reachable label')})()`);
  const title=()=>evaluate("document.querySelector('#quickPreview h2')?.textContent");
  const visible=()=>evaluate("!document.getElementById('quickPreview').hidden");
  await send('Page.enable',{},sessionId);await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<620},sessionId);
  if(reduced)await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]},sessionId);
  await send('Page.navigate',{url:pathToFileURL(path.join(root,entry)).href},sessionId);
  await evaluate("new Promise(r=>{const t=setInterval(()=>{if(document.querySelectorAll('.tool-label').length===66){clearInterval(t);document.fonts.ready.then(r)}},30)})");if(language==='en')await evaluate("document.getElementById('languageToggle').click()");
  assert.equal(await evaluate("document.getElementById('resultsCount').textContent.match(/\\d+/)[0]"),'66');
  for(const layout of ['sphere','atlas']){
   await evaluate(`document.getElementById('${layout}Layout').click();scrollTo(0,0)`);await pause(850);await move({x:1,y:1});
   const a=await label();await move(a);assert.equal(await visible(),true);assert.equal(await title(),a.name);
   await evaluate("window.previewTitle=document.querySelector('#quickPreview h2')");
   // Traversing another label into an unpinned card must preserve the preview and its DOM.
   const b=await label(a.id);await move(b);await pause(30);await move(await point('#quickPreview h2'));await pause(350);
   assert.equal(await title(),a.name);assert.equal(await evaluate("previewTitle===document.querySelector('#quickPreview h2')"),true);
   // A single explicit click pins; all incidental pointer/focus movement leaves it alone.
   await click(a);assert.equal(await evaluate(`document.querySelector('[data-id="${a.id}"] .tool-label').getAttribute('aria-pressed')`),'true');
   const other=await label(a.id);await move(other);await pause(400);assert.equal(await title(),a.name);
   await move(await point('#quickPreview h2'));await pause(300);assert.equal(await title(),a.name);
   await evaluate(`document.querySelector('[data-id="${other.id}"] .tool-label').focus()`);assert.equal(await title(),a.name);
   await evaluate(`document.querySelector('[data-id="${a.id}"] .tool-label').focus()`);await key('Tab',9);assert.equal(await evaluate("document.activeElement.matches('#quickPreview .primary-button')"),true);
   await move(other);await pause(300);assert.equal(await title(),a.name);
   await key('Escape',27);assert.equal(await visible(),false);assert.equal(await evaluate(`document.activeElement===document.querySelector('[data-id="${a.id}"] .tool-label')`),true);
   // Keyboard activation pins; repeat activation deliberately closes it.
   await key('Enter',13);assert.equal(await visible(),true);assert.equal(await title(),a.name);await key('Enter',13);assert.equal(await visible(),false);
   await move({x:1,y:1});await click(a);const replacement=await label(a.id);await click(replacement);assert.equal(await title(),replacement.name);
   assert.equal(await evaluate(`document.querySelector('[data-id="${a.id}"] .tool-label').hasAttribute('aria-describedby')`),false);
   await click(await point('#quickPreview .quick-close'));assert.equal(await visible(),false);
   await move({x:1,y:1});await move(a);assert.equal(await visible(),true);await click({x:1,y:1});assert.equal(await visible(),false);
   if(width<620){
    await send('Emulation.setTouchEmulationEnabled',{enabled:true},sessionId);
    for(let i=0;i<3;i++){
     const tap=await label();await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:tap.x,y:tap.y}]},sessionId);await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]},sessionId);
     assert.equal(await visible(),true);assert.equal(await title(),tap.name);assert.equal(await evaluate(`document.querySelector('[data-id="${tap.id}"] .tool-label').getAttribute('aria-pressed')`),'true');
     const close=await point('#quickPreview .quick-close');await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[close]},sessionId);await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]},sessionId);assert.equal(await visible(),false);
    }await send('Emulation.setTouchEmulationEnabled',{enabled:false},sessionId);
   }
   results.push({name,layout,hoverBridge:true,clickPins:true,pointerAndFocusStable:true,keyboard:true,touch:width<620});
  }
  await evaluate("document.getElementById('resetFilters').click();document.querySelector('[data-task=workflow]').click()");assert.equal(await evaluate("Boolean(document.querySelector('[data-id=openai-codex]'))"),true);
  await evaluate("const search=document.getElementById('searchInput');search.value='קודקס';search.dispatchEvent(new Event('input'))");assert.equal(await evaluate("document.querySelectorAll('.tool-label').length"),1);assert.equal(await evaluate("document.querySelector('.tool-label').parentElement.dataset.id"),'openai-codex');
  await evaluate("document.getElementById('sphereLayout').click();new Promise(r=>setTimeout(r,850))");assert.equal(await evaluate("document.querySelector('.tool-label').tabIndex"),0);
  await evaluate("document.getElementById('resetFilters').click();document.getElementById('atlasLayout').click();new Promise(r=>setTimeout(r,850))");
  await evaluate("const q=document.getElementById('searchInput');q.value='Seedance';q.dispatchEvent(new Event('input'));document.querySelector('.tool-label').click()");assert.equal(await evaluate("document.querySelector('#quickPreview .quick-visit').href"),'https://seed.bytedance.com/en/seedance2_5');
  const {data}=await send('Page.captureScreenshot',{format:'png'},sessionId);fs.writeFileSync(path.join(output,name+'.png'),Buffer.from(data,'base64'));
  console.log('PASS pin '+name);await send('Target.closeTarget',{targetId});
 }
 fs.writeFileSync(path.join(output,'pin-results.json'),JSON.stringify(results,null,2)+'\n');await send('Browser.close');clearTimeout(timeout);
})().catch(e=>{console.error(e);clearTimeout(timeout);chrome.kill();process.exitCode=1;});
