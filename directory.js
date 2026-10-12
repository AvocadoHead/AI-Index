/* One directory for reviewed references and preserved legacy records. No network or storage writes. */
(function (root) {
  'use strict';
  const tasks = {
    platforms:{he:'סביבות יצירה',en:'Creative platforms',keys:['workflow-platform','workflow-engine']},
    all: {he:'כל המשימות', en:'All tasks', keys:[]},
    image: {he:'תמונה ועריכה', en:'Image & editing', keys:['image-generation','image-editing','image-enhancement','product-photography','retouching','style-transfer','upscaling','T2I','I2I','UPS','VIS']},
    video: {he:'וידאו ותנועה', en:'Video & motion', keys:['video-generation','video-editing','video-enhancement','image-to-video','reference-video','native-audio-video','character-animation','animation','avatars','lipsync','motion-design','code-driven-video','vfx','T2V','I2V','V2V','VID','ANI','FCE']},
    audio: {he:'קול ומוזיקה', en:'Voice & music', keys:['audio','audio-cleanup','dubbing','music','song-generation','podcasts','transcription','sound-effects','voice-cloning','voiceover','video-translation','AUD','MUS','PODCAST','T2S','S2T','VCL','Voice Clone']},
    design: {he:'עיצוב וממשקים', en:'Design & UI', keys:['art-direction','compositing','typography','vector-design','ui-design','prototyping','storyboarding','DES','UI/UX','VEC','TYP','PRE']},
    workflow: {he:'קוד ואוטומציה', en:'Code & workflows', keys:['automation','batch-processing','developer-workflow','code-assisted-creation','workflow-engine','workflow-platform','web-apps','DEV','AUTOMATION','AGENT','ML','INF','DATA','WEB']},
    text: {he:'כתיבה ומחקר', en:'Writing & research', keys:['LLM','RESEARCH','REASONING','SEA','CON','TRANS','DOCS','MULTIMODAL','USE']},
    spatial: {he:'תלת־ממד', en:'3D', keys:['3D','I23']}
  };
  const copy = {
    he: {archived:'בארכיון',sphereLayout:'ספירה',atlasLayout:'אטלס',resetSphere:'מרכוז',sphereHint:'גררו לסיבוב · בחרו שם לתקציר · חצים לסיבוב מדויק · אטלס לכל הכלים',mapLegend:'גודל = הערכה מקורית בתחומים שנבחרו; אפשר לשלב מסננים · ◇ ללא ציון · ✓ מקור נבדק · × הופסק. ציון אינו אימות או מבחן עדכני.',skip:'דילוג לכלים',about:'על האינדקס',eyebrow:'מפת כלים לעבודה יצירתית',heroOne:'מרחב הכלים',heroTwo:'ליצירה.',intro:'מבט רחב. כיוון חדש. בחרו שם כדי להעמיק.',note:'כלים ומודלים, במקום אחד.',checkedSummary:n=>`${n} עם מקור רשמי שנבדק`,whatChecked:'מה בדיוק נבדק? ↙',directory:'ספריית הכלים',searchLabel:'חיפוש כלים',placeholder:'שם כלי, ספק או תיאור…',clearSearch:'ניקוי החיפוש',verification:'מצב בדיקה',allStatus:'כל הרשומות',checkedStatus:'נבדקו במקור רשמי',pendingStatus:'ממתינות לבדיקה',retiredStatus:'כלים שהופסקו',filterLabel:'סינון לפי משימה',taskLabel:'המשימה שלי',reset:'איפוס סינון',sort:'סדר התוצאות',reviewedFirst:'נבדקו תחילה',byName:'לפי שם',result:n=>`${n} כלים ורשומות`,emptyTitle:'לא מצאנו התאמה הפעם.',emptyDescription:'נסו מילה אחרת או הרחיבו את הסינון.',showAll:'הצגת כל הכלים',methodEyebrow:'בחירה טובה מתחילה במידע ברור',methodTitle:'מקורות, לא הבטחות.',methodCopy:'״נבדק״ אומר שבדקנו תיעוד רשמי בתאריך המצוין — לא שערכנו מבחן ביצועים. רשומות ותיקות עדיין מחכות לבדיקה; מודלים, זמינות ותנאים עשויים להשתנות.',scoresCopy:'ממוצע הציונים המוערכים המקוריים קובע את גודל השם; כל הציונים נשמרו בפרטים. הם אינם דירוג איכות עדכני או המלצה חדשה.',workflowOpen:'בדיקות שכדאי להכניס לתהליך העבודה ↗',legacy:'תצוגה מקורית ועריכה מקומית',data:'נתוני האינדקס',support:'תמיכה בפרויקט ↗',close:'סגירת פרטים',checked:'מקור רשמי נבדק',pending:'טרם נבדק',retired:'הופסק',renamed:'שונה שם',uncertain:'לא ודאי',details:'להכיר את הכלי',pendingDescription:'רשומה מהאינדקס המקורי. התיאור, הזמינות והיכולות עדיין ממתינים לבדיקה ממקור רשמי.',legacyRecord:'רשומה ותיקה',checkedDate:'נבדק',notDated:'אין תאריך אימות',visit:'לאתר הרשמי ↗',visitLegacy:'לקישור המקורי · לא מאומת ↗',retiredNotice:'המוצר הופסק. קישורי המקור נשמרו לעיון.',limits:'מה חשוב לדעת',uncertainties:'מה עדיין לא ודאי',models:'מודלים וגרסאות שנצפו',sources:'מקורות ותאריך בדיקה',historical:'הרשומה המקורית והציונים הישנים',historicalNote:'נתונים היסטוריים שנשמרו מהאינדקס המקורי. לא מבחן ביצועים, דירוג עדכני או המלצה חדשה.',oldName:'השם המקורי',oldUrl:'הקישור המקורי',categories:'קטגוריות מקוריות',identity:'על המוצר והספק',vendor:'ספק',product:'מוצר',type:'סוג',noSources:'טרם צורפו מקורות רשמיים. אין להסיק מהקישור שהכלי פעיל.',modelNote:'תצפיות מתוארכות מתוך המקורות המצורפים, לא בדיקת איכות או הבטחה לזמינות בחשבון שלכם.',workflows:'לפני שמתחילים להפיק',workflowNote:'בדיקות עבודה כלליות. הן אינן תכונה מובטחת של מוצר מסוים, מבחן השוואתי או המלצה אישית.',nav:'ניווט ראשי',verifiedCount:'נבדקו',legacyLink:'פתיחת הרשומה המקורית ↗'},
    en: {archived:'Archived',sphereLayout:'Sphere',atlasLayout:'Atlas',resetSphere:'Center',sphereHint:'Drag to rotate · Select a name for a summary · Arrow keys rotate · Atlas shows every tool',mapLegend:'Size = original estimate for selected domains; combine filters · ◇ unrated · ✓ source checked · × retired. Scores are not verification or current benchmarks.',skip:'Skip to tools',about:'About the index',eyebrow:'A field guide for creative work',heroOne:'Tools for',heroTwo:'creative minds.',intro:'See the landscape. Find a direction. Select a name to explore.',note:'Tools and models, in one place.',checkedSummary:n=>`${n} checked against official sources`,whatChecked:'What does checked mean? ↗',directory:'Tool directory',searchLabel:'Search tools',placeholder:'Tool name, provider or description…',clearSearch:'Clear search',verification:'Verification',allStatus:'All records',checkedStatus:'Official sources checked',pendingStatus:'Awaiting review',retiredStatus:'Retired tools',filterLabel:'Filter by task',taskLabel:'My task',reset:'Reset filters',sort:'Sort results',reviewedFirst:'Reviewed first',byName:'Name A–Z',result:n=>`${n} tools & records`,emptyTitle:'No match this time.',emptyDescription:'Try another word or broaden your filters.',showAll:'Show all tools',methodEyebrow:'Better choices start with clear information',methodTitle:'Sources, not promises.',methodCopy:'“Checked” means official documentation was reviewed on the date shown—not that we ran a benchmark. Legacy records still await review; models, availability and terms can change.',scoresCopy:'Original estimated averages set label size; individual scores remain in details. They are not current quality rankings or new recommendations.',workflowOpen:'Checks worth adding to your workflow ↗',legacy:'Original view & local editing',data:'Catalog data',support:'Support the project ↗',close:'Close details',checked:'Official source checked',pending:'Not yet reviewed',retired:'Retired',renamed:'Renamed',uncertain:'Uncertain',details:'Explore tool',pendingDescription:'A record from the original index. Its description, availability and capabilities still await official-source review.',legacyRecord:'Legacy record',checkedDate:'Checked',notDated:'Not yet dated',visit:'Official website ↗',visitLegacy:'Original link · unverified ↗',retiredNotice:'This product has been retired. Its source links remain available for reference.',limits:'What to know',uncertainties:'What remains uncertain',models:'Observed models & versions',sources:'Sources & verification date',historical:'Original record & legacy scores',historicalNote:'Historical data preserved from the original index. Not a benchmark, current ranking or new recommendation.',oldName:'Original name',oldUrl:'Original URL',categories:'Original categories',identity:'Product & provider',vendor:'Provider',product:'Product',type:'Type',noSources:'Official sources have not been added yet. A link alone does not establish that a tool is active.',modelNote:'Dated observations from the listed sources, not a quality test or a guarantee of availability in your account.',workflows:'Before you start producing',workflowNote:'General production checks. Not guaranteed product features, comparative tests or personal recommendations.',nav:'Main navigation',verifiedCount:'checked',legacyLink:'Open original record ↗'}
  };
  const summariesEn = {
    'kolbo-ai':'A multi-model creative workspace for image, video, audio, 3D and chat, with reusable workflows and project context, as described by its vendor.',
    magnific:'A broad creative platform combining media tools and models. The original Magnific.ai upscalers are part of its offering; historical scores apply only to those tools.',
    'google-gemini-image':'Create and edit images conversationally, combine references, and adjust lighting, composition and details.',
    midjourney:'Explore visual directions, references and image edits in a creative image-making environment.',
    'adobe-firefly':'An integrated creative environment with Adobe and partner models, image and video editing, and shared idea boards.',
    'adobe-photoshop':'Generative editing within a layer, mask and selection workflow, with Firefly and partner models.',
    ideogram:'Create and edit images with a focus on text in visuals, alongside tools for adapting assets.',
    recraft:'Generate images and vector assets, with editing, styles and preparation tools for design work.',
    'black-forest-labs-flux':'A family of generation and editing models, accessible through a playground, API and model-specific self-hosting options.',
    krea:'A creative suite for real-time visual exploration, multiple generation models, enhancement and visual customization.',
    photoroom:'Product-photo tools for background removal, product scenes, format adaptation and batch editing.',
    'topaz-labs':'Finishing tools for images and video, including noise reduction, sharpening and resolution enhancement.',
    runway:'A creative environment for video generation, editing existing footage and animating characters.',
    'google-flow':'Google’s filmmaking environment for creating and editing video with model-dependent reference and audio features.',
    'kling-ai':'A platform for creating video and images with model-dependent controls and reference inputs.',
    'luma-dream-machine':'Create and transform video with references and creative controls in Luma’s production environment.',
    pika:'Create and transform short video clips with animation and visual effects.',
    hedra:'Create character-led video from images and audio, with tools for expressive animation.',
    heygen:'Create presenter and avatar video, with translation and voice workflows.',
    domoai:'A creative platform for video generation, stylization and character animation.',
    elevenlabs:'A platform for voice, audio and creative production, with speech and model-dependent audio tools.',
    suno:'Create songs and music from prompts and develop musical ideas with creation and editing tools.',
    descript:'Edit audio and video through a transcript, with tools for recording and spoken-content production.',
    'adobe-podcast':'Clean up speech, record remotely and edit audio through transcripts, with caption and music-removal options.',
    weavy:'Connect creative models, image editing and compositing into reusable workflows, with layers, masks and simpler team-facing tools.',
    comfyui:'Build visible, customizable generation workflows by connecting models and operations as nodes, locally or in Comfy Cloud.',
    'figma-make':'Create interactive interfaces from conversation and Figma designs, with visual editing, code access and sharing.',
    remotion:'Create video and motion graphics with React components, data and templates, with previewing and repeatable rendering.',
    'openai-chatgpt-images':'Create and edit images in conversation, using references, focused revisions and iteration on a visual direction.',
    'bytedance-seedance':'A family of video and audio models using text and references, with segment and timing controls in supporting products.',
    'ai-119':'InVision’s design products, including Prototype and DSM, were discontinued at the end of 2024.'
  };
  const types = {vendor:['ספק','Provider'],product:['מוצר','Product'],model:['מודל','Model'],platform:['פלטפורמה','Platform'],'model-family':['משפחת מודלים','Model family'],'product-family':['משפחת מוצרים','Product family'],product_suite:['חבילת מוצרים','Product suite'],workflow_platform:['פלטפורמת תהליכי עבודה','Workflow platform'],workflow_engine:['מנוע תהליכי עבודה','Workflow engine'],code_driven_workflow:['תהליך עבודה מבוסס קוד','Code-driven workflow'],unknown:['לא ידוע','Unknown']};
  const normalize = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f\u0591-\u05c7]/g,'').toLowerCase();
  function safeUrl(value) { try { const url = new URL(value); return ['http:','https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null; } catch { return null; } }
  function createRecords(modules, catalog) {
    const originals = new Map(modules.map(record => [record.id, record]));
    const metadata = new Map((catalog?.records || []).map(record => [record.id, record]));
    const ids = [...originals.keys(), ...[...metadata.keys()].filter(id => !originals.has(id))];
    return ids.map(id => {
      const original = originals.get(id), meta = metadata.get(id);
      const checked = Boolean(meta?.verifiedAt);
      const capabilities = checked ? [...(meta.capabilities || [])] : [...(original?.categories || [])];
      if(['weavy','comfyui','kolbo-ai','ai-037','ai-040','ai-036'].includes(id))capabilities.unshift(...(capabilities.includes('workflow-platform')?[]:['workflow-platform']));
      return {id, curation:root.catalogCuration?.[id],curated:root.curatedToolIds?.includes(id),primaryTask:id==='ai-119'?'design':Object.keys(tasks).find(key=>key!=='all' && tasks[key].keys.includes(capabilities[0])) || 'text', name: checked ? meta.name : original?.name || meta.name, original, meta, checked, status: checked ? meta.status : 'uncertain', tasks:Object.entries(tasks).filter(([key,task]) => key !== 'all' && capabilities.some(value => task.keys.includes(value))).map(([key]) => key)};
    });
  }
  function selectRecords(records, state) {
    const words = normalize(state.query).trim().split(/\s+/).filter(Boolean);
    return records.filter(record => {
      if(state.scope==='curated'&&!state.query&&!state.selectedTasks?.length&&!record.curated)return false;
      if(state.scope==='curated'&&!state.query&&record.curation?.state==='archived')return false;
      if(state.scope==='current'&&record.curation?.state==='archived')return false;
      if(state.scope==='archived'&&record.curation?.state!=='archived')return false;
      const chosen=state.selectedTasks || (state.task==='all'?[]:[state.task]);
      if(chosen.length && !chosen.some(key=>record.tasks.includes(key)))return false;
      if (state.status === 'checked' && !record.checked) return false;
      if (state.status === 'pending' && record.checked) return false;
      if (state.status === 'retired' && record.status !== 'retired') return false;
      const searchable = normalize([record.name,record.id,record.meta?.researchId,record.original?.name,record.legacyDisplayName,...(record.meta?.modelObservations || []).map(item=>item.name),record.meta?.vendor,record.meta?.product,record.meta?.description,summariesEn[record.meta?.researchId || record.id],...(record.meta?.aliases || []),...record.tasks.flatMap(key => [tasks[key].he,tasks[key].en])].join(' '));
      return words.every(word => searchable.includes(word));
    }).sort((a,b) => (state.sort === 'reviewed' ? Number(b.checked) - Number(a.checked) : 0) || a.name.localeCompare(b.name,'en'));
  }
  function destination(record) { return record.status === 'retired' ? null : safeUrl(record.checked ? record.meta.officialUrl || record.original?.url : record.original?.url); }
  function estimatedScore(record, selected=[]) {
    if(['ai-006','ai-037'].includes(record.id))return null; // Legacy developer scores belong to the misidentified banana.dev record.
    const values=Object.entries(record.original?.scores || {}).filter(([key])=>!selected.length || selected.some(task=>tasks[task]?.keys.includes(key))).map(([,value])=>value).filter(value=>typeof value==='number' && Number.isFinite(value));
    return values.length ? values.reduce((sum,value)=>sum+value,0)/values.length : null;
  }
  function scoreSize(score) { return score===null ? 17 : 16+80*Math.max(0,Math.min(.25,score-.75)); }
  const familyNames={'ai-009':'ChatGPT','ai-010':'DeepSeek','ai-011':'Claude','ai-012':'Gemini','ai-013':'Perplexity','ai-016':'Llama','ai-017':'Sora','ai-018':'Veo','ai-019':'Wan','ai-031':'FLUX','ai-055':'ElevenLabs','ai-057':'Udio','adobe-photoshop':'Photoshop','topaz-labs':'Topaz','bytedance-seedance':'Seedance','ai-006':'Nano Banana','ai-023':'Luma'};
  function canonicalRecords(raw) {
    // Stable record IDs identify families; generations are metadata, never new tiles.
    // Do not merge separate products merely because they share a provider or a model.
    const unique=new Map();
    for(const record of raw){if(!unique.has(record.id))unique.set(record.id,{...record,name:record.curation?.kind==='retired-generation'?record.original.name:familyNames[record.id] || record.name,legacyDisplayName:record.name});}
    return [...unique.values()];
  }
  function interleave(records){const groups=new Map();records.forEach(r=>{const key=r.primaryTask;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r)});const result=[];while([...groups.values()].some(g=>g.length))for(const group of groups.values())if(group.length)result.push(group.shift());return result;}
  root.DirectoryData = {canonicalRecords,interleave,createRecords,selectRecords,destination,normalize,tasks,estimatedScore,scoreSize};
  if (!root.document?.getElementById('toolGrid')) return;
  const doc = root.document, records = canonicalRecords(createRecords(root.defaultModules || [],root.aiCatalog));
  const state = {language:doc.documentElement.lang === 'he' ? 'he':'en',query:'',task:'all',status:'all',sort:'reviewed',selectedTasks:[],scope:'curated'};
  const el = id => doc.getElementById(id), t = key => copy[state.language][key];
  let sphere=null,layout='sphere';
  let activeRecord = null, returnFocus = null;
  function node(tag,text,className) { const element=doc.createElement(tag); if(text !== undefined) element.textContent=text; if(className) element.className=className; return element; }
  function textLanguage(element, language) { if(language !== 'auto') element.lang=language; element.dir=language==='auto'?'auto':language==='he'?'rtl':'ltr'; return element; }
  function badge(record) { const status=record.curation?.state==='archived'?'archived':record.status === 'retired'?'retired':record.checked?'checked':'pending'; return node('span',(status==='checked'?'✓ ':'')+t(status),'badge '+status); }
  function summary(record) { if(!record.checked || !record.meta.description) return {text:t('pendingDescription'),language:state.language}; const translated=summariesEn[record.meta.researchId || record.id]; return state.language==='en' && translated ? {text:translated,language:'en'} : {text:record.meta.description,language:record.meta.descriptionLanguage || 'he'}; }
  function link(text,url,className) { const a=node('a',text,className); a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a; }
  const quick=doc.createElement('aside');quick.id='quickPreview';quick.hidden=true;quick.setAttribute('aria-label','Tool summary');doc.body.append(quick);
  let quickPinned=false,quickTrigger=null,quickTimer=null;
  function hideQuick(){clearTimeout(quickTimer);quick.hidden=true;quickPinned=false;if(quickTrigger)quickTrigger.removeAttribute('aria-describedby');}
  function scheduleQuickClose(){clearTimeout(quickTimer);quickTimer=setTimeout(()=>{if(!quickPinned&&!quick.matches(':hover')&&!quick.contains(doc.activeElement))hideQuick()},180);}
  function showQuick(record,trigger,pinned){
    if(el('detailDialog').open||performance.now()<Number(el('sphereStage').dataset.suppressUntil||0))return;
    sphere?.setPlaying(false);clearTimeout(quickTimer);quickPinned=pinned;quickTrigger=trigger;quick.replaceChildren();
    const close=node('button','×','quick-close');close.type='button';close.setAttribute('aria-label',t('close'));close.addEventListener('click',()=>{hideQuick();trigger.focus();hideQuick()});
    const title=node('h2',record.name);title.dir='auto';
    const description=summary(record);const text=textLanguage(node('p',description.text),description.language);text.id='quickDescription';trigger.setAttribute('aria-describedby',text.id);
    const kind=types[record.meta?.entityType || 'unknown']?.[state.language==='he'?0:1] || '';
    const context=node('p',record.tasks.map(key=>tasks[key][state.language]).join(' · ')+' / '+kind,'quick-context');
    const details=node('button',t('details')+' ↗','primary-button');details.type='button';details.addEventListener('click',()=>{hideQuick();openRecord(record,trigger)});
    quick.append(close,title,context,text,badge(record),details);if(record.curation)quick.append(node('p',record.curation[state.language],'quick-context'));if(['ai-006','ai-037'].includes(record.id))quick.append(node('p',state.language==='he'?'ציון ותיק אינו חל על הזהות המתוקנת.':'Legacy score does not apply to this corrected identity.','quick-context'));quick.hidden=false;
    const rect=trigger.getBoundingClientRect();quick.style.left=Math.max(12,Math.min(innerWidth-quick.offsetWidth-12,rect.left))+'px';quick.style.top=Math.max(12,Math.min(innerHeight-quick.offsetHeight-12,rect.bottom+8))+'px';
  }
  quick.addEventListener('pointerenter',()=>clearTimeout(quickTimer));quick.addEventListener('pointerleave',scheduleQuickClose);
  doc.addEventListener('keydown',event=>{if(event.key==='Escape'&&!quick.hidden){event.preventDefault();const trigger=quickTrigger;hideQuick();trigger?.focus();hideQuick()}});
  doc.addEventListener('pointerdown',event=>{if(!quick.contains(event.target)&&!event.target.closest('.tool-label'))hideQuick()});
  doc.addEventListener('focusin',event=>{if(!quick.contains(event.target)&&!event.target.closest('.tool-label'))hideQuick()});
  function card(record) {
    const article=node('article',undefined,'tool-card');article.dataset.id=record.id;
    article.dataset.category=record.primaryTask;
    const score=estimatedScore(record,state.selectedTasks);article.dataset.score=score===null?'unrated':String(score);
    const button=node('button',undefined,'tool-label');button.type='button';
    button.style.setProperty('--score-size',scoreSize(score)+'px');
    const heading=node('h3',record.name);heading.dir='auto';
    const mark=node('span',record.status==='retired'?'×':record.checked?'✓':'','verification-mark');mark.setAttribute('aria-hidden','true');
    const scoreText=score===null?(state.language==='he'?'ללא ציון':'Unrated'):(state.language==='he'?'ממוצע מוערך מקורי: ':'Original estimated average: ')+(score*100).toFixed(1)+'%';
    button.title=scoreText+' · '+t(record.status==='retired'?'retired':record.checked?'checked':'pending');
    button.setAttribute('aria-label',record.name+' · '+button.title+' · '+t('details'));
    button.append(heading,mark);if(score===null){const unrated=node('span','◇','unrated-mark');unrated.setAttribute('aria-hidden','true');button.append(unrated);}
    button.addEventListener('keydown',event=>{if(event.key==='Tab'&&!event.shiftKey&&!quick.hidden&&quickTrigger===button){event.preventDefault();quick.querySelector('.primary-button').focus()}});button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'&&!el('sphereStage').dataset.dragging)showQuick(record,button,false)});button.addEventListener('focus',()=>showQuick(record,button,false));button.addEventListener('pointerleave',scheduleQuickClose);button.addEventListener('click',()=>showQuick(record,button,true));article.append(button);return article;
  }
  function renderResults() {
    hideQuick();const selected=selectRecords(records,state);
    if(layout==='sphere')el('toolGrid').replaceChildren(...interleave(selected).map(card));else {const groups=[];for(const key of Object.keys(tasks).filter(k=>k!=='all')){const members=selected.filter(record=>record.primaryTask===key);if(!members.length)continue;const group=node('section',undefined,'atlas-group');const heading=node('h2',tasks[key][state.language]+' · '+members.length);const labels=node('div',undefined,'atlas-labels');labels.append(...members.map(card));group.append(heading,labels);groups.push(group)}el('toolGrid').replaceChildren(...groups)}
    sphere?.draw();el('resultsCount').textContent=t('result')(selected.length);el('emptyState').hidden=selected.length>0;el('clearSearch').hidden=!state.query;el('resetFilters').hidden=!(state.query || state.selectedTasks.length || state.status!=='all');
    el('mobileTask').value=state.task;
    doc.querySelectorAll('.task-chip').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.task==='all'?!state.selectedTasks.length:state.selectedTasks.includes(button.dataset.task))));
  }
  function renderLanguage() {
    doc.documentElement.lang=state.language;doc.documentElement.dir=state.language==='he'?'rtl':'ltr';doc.title=state.language==='he'?'AI Index — כלים לעבודה יצירתית':'AI Index — A creative field guide';
    doc.querySelectorAll('[data-i18n]').forEach(element=>{element.textContent=t(element.dataset.i18n);});
    el('recordCount').textContent=records.length;el('checkedSummary').textContent=t('checkedSummary')(records.filter(record=>record.checked).length);el('searchInput').placeholder=t('placeholder');el('clearSearch').setAttribute('aria-label',t('clearSearch'));el('closeDialog').setAttribute('aria-label',t('close'));el('mainNav').setAttribute('aria-label',t('nav'));el('taskFilters').setAttribute('aria-label',t('filterLabel'));
    el('languageToggle').textContent=state.language==='he'?'EN ↔':'עב ↔';el('languageToggle').setAttribute('aria-label',state.language==='he'?'Switch to English':'מעבר לעברית');
    (state.language==='he'?['נקודת פתיחה','כל הנוכחיים','הכול והארכיון','ארכיון']:['Starting set','All current','All + archive','Archive']).forEach((label,index)=>el('scopeFilter').options[index].textContent=label);
    ['allStatus','checkedStatus','pendingStatus','retiredStatus'].forEach((key,index)=>el('statusFilter').options[index].textContent=t(key));['reviewedFirst','byName'].forEach((key,index)=>el('sortOrder').options[index].textContent=t(key));
    el('mobileTask').replaceChildren(...['all',...Object.keys(tasks).filter(key=>key!=='all')].map(key=>{const option=node('option',tasks[key][state.language]);option.value=key;return option;}));
    el('taskFilters').replaceChildren(...['all',...Object.keys(tasks).filter(key=>key!=='all')].map(key=>{const button=node('button',tasks[key][state.language],'task-chip');button.type='button';button.dataset.task=key;button.addEventListener('click',()=>{state.selectedTasks=key==='all'?[]:state.selectedTasks.includes(key)?state.selectedTasks.filter(k=>k!==key):[...state.selectedTasks,key];state.task=state.selectedTasks.length===1?state.selectedTasks[0]:'all';renderResults();});return button;}));
    renderResults();
  }
  function section(title, collapsible=false) { const element=node(collapsible?'details':'section',undefined,'detail-section');element.append(node(collapsible?'summary':'h3',title));return element; }
  function listSection(title,items,language='he') { if(!items?.length)return null;const element=section(title,true),list=node('ul');items.forEach(text=>list.append(textLanguage(node('li',text),language)));element.append(list);return element; }
  function append(parent,...children){children.filter(Boolean).forEach(child=>parent.append(child));}
  function openDialog(trigger) {returnFocus=trigger;const dialog=el('detailDialog');dialog.showModal();dialog.scrollTop=0;el('closeDialog').focus();}
  function openRecord(record,trigger) {
    activeRecord=record;const content=el('detailContent');content.replaceChildren();
    const header=node('header',undefined,'detail-header');const eyebrow=node('div',undefined,'detail-eyebrow');eyebrow.append(badge(record),node('span',types[record.meta?.entityType || 'unknown']?.[state.language==='he'?0:1] || record.meta?.entityType,'detail-date'));
    const title=node('h2',record.name);title.id='detailTitle';title.dir='auto';header.append(eyebrow,title,node('p',record.meta?.vendor || t('legacyRecord'),'provider'));content.append(header);if(record.curation){const history=section(state.language==='he'?'הקשר הרשומה ההיסטורית':'Historical record context');history.append(node('p',record.curation[state.language]),link(record.curation.source,record.curation.source),node('p',record.curation.date));content.append(history);}
    const description=summary(record);content.append(textLanguage(node('p',description.text,'detail-description'),description.language));
    const actions=node('div',undefined,'detail-actions');const url=record.curation?.state==='archived'?null:destination(record);if(url)actions.append(link(t(record.checked?'visit':'visitLegacy'),url,'primary-button'));else if(record.status==='retired')actions.append(node('p',t('retiredNotice')));
    actions.append(node('span',record.checked?`${t('checkedDate')}: ${record.meta.verifiedAt}`:t('notDated'),'detail-date'));content.append(actions);
    if(record.meta?.identityNote || record.meta?.product){const identity=section(t('identity'));if(record.meta.product)identity.append(node('p',`${t('product')}: ${record.meta.product} · ${t('vendor')}: ${record.meta.vendor}`));if(record.meta.identityNote){const generic=record.meta.identityNote.includes('modelObservations');identity.append(textLanguage(node('p',generic?(state.language==='he'?'שם המוצר נשמר בנפרד משמות וגרסאות המודלים שנצפו.':'The product identity stays separate from observed model names and versions.'):record.meta.identityNote),generic?state.language:'he'));}content.append(identity);}
    append(content,listSection(t('limits'),record.meta?.limitations),listSection(t('uncertainties'),record.meta?.uncertainties,'auto'));
    if(record.meta?.modelObservations.length){const models=section(t('models'),true);models.append(node('p',t('modelNote')));const list=node('ul');record.meta.modelObservations.forEach(observation=>{const item=node('li');const name=node('strong',`${observation.name} · ${observation.vendor}`);name.dir='auto';const note=textLanguage(node('p',observation.note),'he');item.append(name,node('p',observation.observedAt),note);list.append(item);});models.append(list);content.append(models);}
    const sources=section(t('sources'),true);if(record.meta?.sources.length){const list=node('ul',undefined,'source-list');record.meta.sources.forEach(source=>{const item=node('li');item.append(link(new URL(source.url).hostname+new URL(source.url).pathname,source.url),node('time',`${t('checkedDate')}: ${source.checkedAt}`));list.append(item);});sources.append(list);}else sources.append(node('p',t('noSources')));content.append(sources);
    if(record.original){const historical=section(t('historical'),true);historical.append(node('p',t('historicalNote')),node('p',`${t('oldName')}: ${record.original.name}`),node('p',`${t('categories')}: ${record.original.categories.join(', ')}`));const originalUrl=safeUrl(record.original.url);if(originalUrl){const originalText=node('p',`${t('oldUrl')}: ${originalUrl}`);originalText.style.overflowWrap='anywhere';historical.append(originalText);}const scores=node('div',undefined,'historical-scores');Object.entries(record.original.scores).forEach(([category,score])=>scores.append(node('span',`${category}: ${Math.round(score*100)}%`)));historical.append(scores);content.append(historical);}
    openDialog(trigger);
  }
  function openWorkflows(trigger){activeRecord=null;const content=el('detailContent');content.replaceChildren();const title=node('h2',t('workflows'));title.id='detailTitle';content.append(title,node('p',t('workflowNote'),'detail-description'));for(const workflow of root.aiCatalog?.workflows || []){const item=section(workflow.title);item.append(textLanguage(node('p',workflow.guidance),'en'));content.append(item);}openDialog(trigger);}
  function reset(){state.query='';state.task='all';state.selectedTasks=[];state.status='all';el('searchInput').value='';el('statusFilter').value='all';renderResults();el('searchInput').focus();}
  el('searchInput').addEventListener('input',event=>{state.query=event.target.value;renderResults();});
  el('clearSearch').addEventListener('click',()=>{state.query='';el('searchInput').value='';renderResults();el('searchInput').focus();});
  el('mobileTask').addEventListener('change',event=>{state.task=event.target.value;state.selectedTasks=state.task==='all'?[]:[state.task];renderResults();});
  el('scopeFilter').addEventListener('change',event=>{state.scope=event.target.value;renderResults()});
  el('statusFilter').addEventListener('change',event=>{state.status=event.target.value;renderResults();});el('sortOrder').addEventListener('change',event=>{state.sort=event.target.value;renderResults();});
  el('resetFilters').addEventListener('click',reset);el('emptyReset').addEventListener('click',reset);
  el('languageToggle').addEventListener('click',()=>{state.language=state.language==='he'?'en':'he';renderLanguage();});
  el('closeDialog').addEventListener('click',()=>el('detailDialog').close());
  el('detailDialog').addEventListener('click',event=>{if(event.target===el('detailDialog')){const rect=event.target.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)event.target.close();}});
  el('detailDialog').addEventListener('keydown',event=>{
    if(event.key !== 'Tab') return;
    const focusable=[...el('detailDialog').querySelectorAll('button,a[href],summary,input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(element=>!element.disabled && element.getClientRects().length);
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey && doc.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey && doc.activeElement===last){event.preventDefault();first.focus();}
  });
  el('detailDialog').addEventListener('close',()=>{activeRecord=null;if(returnFocus?.isConnected)returnFocus.focus();returnFocus=null;});
  el('workflowOpen').addEventListener('click',event=>openWorkflows(event.currentTarget));
  function applyLayout(next){layout=next;el('sphereStage').classList.toggle('atlas-mode',next==='atlas');el('sphereStage').tabIndex=next==='sphere'?0:-1;el('sphereCanvas').hidden=next!=='sphere';el('motionControls').hidden=next!=='sphere';el('sphereHint').hidden=next!=='sphere';el('sphereLayout').setAttribute('aria-pressed',String(next==='sphere'));el('atlasLayout').setAttribute('aria-pressed',String(next==='atlas'));sphere?.setEnabled(next==='sphere');renderResults();}
  const fallback=()=>{el('sphereLayout').disabled=true;el('sphereFallback').hidden=false;el('sphereFallback').textContent=state.language==='he'?'תצוגת הספירה אינה זמינה במכשיר זה. האטלס מציג את כל הכלים.':'The sphere is unavailable on this device. Atlas keeps every tool accessible.';applyLayout('atlas');};
  sphere=new root.ToolSphere({stage:el('sphereStage'),canvas:el('sphereCanvas'),grid:el('toolGrid'),onFallback:fallback,onMove:hideQuick});
  sphere.setRecords(interleave(records).map(record=>record.id),root.curatedToolIds||[]);
  el('sphereLayout').addEventListener('click',()=>applyLayout('sphere'));el('atlasLayout').addEventListener('click',()=>applyLayout('atlas'));
  el('motionToggle').addEventListener('click',()=>sphere.setPlaying(!sphere.playing));
  el('sphereStage').addEventListener('sphere-motion',event=>{el('motionToggle').textContent=event.detail?'Ⅱ':'▶';el('motionToggle').setAttribute('aria-pressed',String(event.detail));});
  el('motionToggle').setAttribute('aria-label',state.language==='he'?'הפעלה או עצירה של סיבוב':'Play or pause rotation');el('motionToggle').disabled=sphere.reduced.matches;
  el('resetSphere').addEventListener('click',()=>sphere.reset());
  for(const [id,step] of [['rotateLeft',-.3],['rotateRight',.3]])el(id).addEventListener('click',()=>{sphere.setPlaying(false);sphere.ry+=step;hideQuick();sphere.draw()});
  root.addEventListener('resize',hideQuick);doc.fonts.ready.then(()=>sphere.draw());
  renderLanguage();
})(typeof window === 'undefined' ? globalThis : window);
