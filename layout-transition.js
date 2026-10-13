/* Keyed FLIP motion: the same names travel from the sphere into their categories. */
(function(root){
 'use strict';
 root.LayoutTransition=class {
  constructor({stage,canvas,grid,onStart,onFinish}){Object.assign(this,{stage,canvas,grid,onStart,onFinish});this.animations=[];this.version=0;this.active=false;this.reduced=matchMedia('(prefers-reduced-motion: reduce)');this.reduced.addEventListener('change',()=>{if(this.reduced.matches)this.finish()});}
  capture(){const labels=new Map();for(const b of this.grid.querySelectorAll('.tool-label')){const style=getComputedStyle(b);labels.set(b.parentElement.dataset.id,{rect:b.getBoundingClientRect(),opacity:style.visibility==='hidden'?0:Number(style.opacity)});}return {labels,height:this.stage.getBoundingClientRect().height,canvas:{opacity:this.canvas.hidden?0:Number(getComputedStyle(this.canvas).opacity),transform:getComputedStyle(this.canvas).transform}};}
  cancel(){cancelAnimationFrame(this.hitFrame);this.version++;for(const a of this.animations)a.cancel();this.animations=[];this.active=false;this.grid.inert=false;delete this.stage.dataset.unfolding;this.onFinish();}
  finish(){if(!this.active)return;const done=this.complete;done?.();}
  run(before,layout){
   if(this.reduced.matches||!before.labels.size)return;
   const version=++this.version,stage=this.stage,targetHeight=stage.getBoundingClientRect().height;
   this.active=true;this.onStart();stage.dataset.unfolding=layout;
   const animations=this.animations=[];const restore=[];
   const animate=(element,frames,options={})=>{const a=element.animate(frames,{duration:680,easing:'cubic-bezier(.22,.75,.18,1)',fill:'both',...options});animations.push(a);return a;};
   // The real buttons move, retaining their handlers. A press can settle motion immediately.
   for(const button of this.grid.querySelectorAll('.tool-label')){
    const old=before.labels.get(button.parentElement.dataset.id);if(!old)continue;
    const rect=button.getBoundingClientRect(),style=getComputedStyle(button),endOpacity=style.visibility==='hidden'?0:Number(style.opacity),base=style.transform==='none'?'':style.transform;
    const original={visibility:button.style.visibility,pointerEvents:button.style.pointerEvents};const tabIndex=button.tabIndex,ariaHidden=button.getAttribute('aria-hidden');restore.push(()=>{button.tabIndex=tabIndex;if(ariaHidden===null)button.removeAttribute('aria-hidden');else button.setAttribute('aria-hidden',ariaHidden);});restore.push(()=>Object.assign(button.style,original));
    button.style.visibility='visible';button.style.pointerEvents=old.opacity>.1||endOpacity>.1?'auto':'none';
    const dx=old.rect.left-rect.left,dy=old.rect.top-rect.top,sx=old.rect.width/Math.max(1,rect.width),sy=old.rect.height/Math.max(1,rect.height);
    button.style.transformOrigin='0 0';restore.push(()=>button.style.removeProperty('transform-origin'));
    animate(button,[{transform:`${base} translate(${dx}px,${dy}px) scale(${sx},${sy})`},{transform:base||'none'}]);
    animate(button,[{opacity:old.opacity},{offset:layout==='atlas'?.55:.25,opacity:layout==='atlas'?old.opacity:endOpacity},{opacity:endOpacity}],{easing:'linear'});
   }
   for(const group of this.grid.querySelectorAll('.atlas-group'))animate(group,[{borderColor:'transparent'},{borderColor:getComputedStyle(group).borderColor}],{duration:500,delay:100});
   const updateHits=()=>{if(!this.active)return;for(const b of this.grid.querySelectorAll('.tool-label')){const visible=Number(getComputedStyle(b).opacity)>.5;b.style.pointerEvents=visible?'auto':'none';b.tabIndex=visible?0:-1;b.setAttribute('aria-hidden',String(!visible));}this.hitFrame=requestAnimationFrame(updateHits);};updateHits();
   for(const heading of this.grid.querySelectorAll('.atlas-group h2'))animate(heading,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:420,delay:180});
   animate(stage,[{height:before.height+'px'},{height:targetHeight+'px'}]);
   const canvasHidden=this.canvas.hidden;this.canvas.hidden=false;
   animate(this.canvas,[{opacity:before.canvas.opacity,transform:before.canvas.transform},{opacity:layout==='atlas'?0:1,transform:layout==='atlas'?'translateY(-20px) scaleY(.06)':'none'}]);
   this.complete=()=>{if(version!==this.version||!this.active)return;this.active=false;cancelAnimationFrame(this.hitFrame);for(const a of animations)a.cancel();this.animations=[];for(const undo of restore)undo();this.canvas.hidden=canvasHidden;delete stage.dataset.unfolding;this.complete=null;this.onFinish();};
   Promise.all(animations.map(a=>a.finished)).then(()=>{if(version===this.version)this.complete?.();}).catch(()=>{});
  }
 };
})(window);
