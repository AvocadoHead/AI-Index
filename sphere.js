/* Deterministic sphere geometry, WebGL wireframe and accessible projected HTML labels. */
(function(root){
 'use strict';
 const golden=Math.PI*(3-Math.sqrt(5));
 function point(index,count){const y=1-2*(index+.5)/count,r=Math.sqrt(1-y*y),a=index*golden;return [Math.cos(a)*r,y,Math.sin(a)*r];}
 function rotate(p,rx,ry){const x=p[0]*Math.cos(ry)-p[2]*Math.sin(ry),z=p[2]*Math.cos(ry)+p[0]*Math.sin(ry);return [x,p[1]*Math.cos(rx)-z*Math.sin(rx),p[1]*Math.sin(rx)+z*Math.cos(rx)];}
 function inertiaStep(velocity,elapsed){const decay=Math.exp(-Math.max(0,elapsed)/360);return {velocity:velocity*decay,delta:velocity*360*(1-decay)};}
 // Zero slope at each end prevents a visible step as a point rounds the rim.
 function rimOpacity(depth){const t=Math.max(0,Math.min(1,(depth+.30)/.55));return t*t*(3-2*t);}
 function fadeStep(current,target,elapsed){const next=target+(current-target)*Math.exp(-Math.max(0,elapsed)/100);return Math.abs(next-target)<.002?target:next;}
 root.SphereMath={point,rotate,inertiaStep,rimOpacity,fadeStep};
 root.ToolSphere=class {
  constructor({stage,canvas,grid,onFallback,onMove}){
   Object.assign(this,{stage,canvas,grid,onFallback,onMove});this.rx=.15;this.ry=.35;this.playing=false;this.inertial=false;this.enabled=true;this.slots=new Map();this.fades=new WeakMap();this.fadeFrame=0;this.lastDraw=0;this.frame=0;this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
   try{this.gl=canvas.getContext('webgl',{alpha:true,antialias:true,preserveDrawingBuffer:true});if(!this.gl)throw Error('WebGL unavailable');this.initGL();}catch(error){this.failed=true;onFallback(error.message);return;}
   canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();this.failed=true;this.setPlaying(false);onFallback('context-lost')});
   this.reduced.addEventListener('change',()=>{if(this.reduced.matches)this.setPlaying(false)});
   this.resize=new ResizeObserver(()=>this.draw());this.resize.observe(stage);
   let drag=null,suppress=0;
   stage.addEventListener('pointerdown',event=>{if(this.transitioning||!this.enabled||event.button!==0)return;this.setPlaying(false);drag={id:event.pointerId,x:event.clientX,y:event.clientY,rx:this.rx,ry:this.ry,moved:false,lastX:event.clientX,lastY:event.clientY,time:event.timeStamp,vx:0,vy:0};});
   stage.addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(Math.hypot(dx,dy)>7){const elapsed=Math.max(8,event.timeStamp-drag.time);drag.vx=Math.max(-.003,Math.min(.003,(event.clientY-drag.lastY)*.006/elapsed));drag.vy=Math.max(-.003,Math.min(.003,(event.clientX-drag.lastX)*.006/elapsed));drag.lastX=event.clientX;drag.lastY=event.clientY;drag.time=event.timeStamp;drag.moved=true;stage.setPointerCapture(event.pointerId);stage.dataset.dragging='true';onMove();this.ry=drag.ry+dx*.006;this.rx=Math.max(-1.3,Math.min(1.3,drag.rx+dy*.006));this.draw();}});
   const end=event=>{if(!drag||drag.id!==event.pointerId)return;if(drag.moved){suppress=performance.now()+500;stage.dataset.suppressUntil=String(suppress);if(event.type==='pointerup'){const age=Math.max(0,event.timeStamp-drag.time);const decay=Math.exp(-age/90);this.startInertia(drag.vx*decay,drag.vy*decay);}}drag=null;delete stage.dataset.dragging;if(stage.hasPointerCapture(event.pointerId))stage.releasePointerCapture(event.pointerId);};
   stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);
   stage.addEventListener('click',event=>{if(performance.now()<suppress){event.preventDefault();event.stopImmediatePropagation()}},true);
   stage.addEventListener('keydown',event=>{if(this.transitioning||event.target!==stage)return;const moves={ArrowLeft:[0,-.2],ArrowRight:[0,.2],ArrowUp:[-.2,0],ArrowDown:[.2,0]};if(moves[event.key]){event.preventDefault();this.setPlaying(false);this.rx+=moves[event.key][0];this.ry+=moves[event.key][1];onMove();this.draw()}if(event.key===' '){event.preventDefault();this.setPlaying(!(this.playing||this.inertial))}if(event.key==='Escape'){event.preventDefault();this.setPlaying(false)}if(event.key==='Home'){event.preventDefault();this.reset()}});
   stage.addEventListener('focusin',()=>this.setPlaying(false));stage.addEventListener('pointerenter',()=>{if(this.playing)this.setPlaying(false)});document.addEventListener('visibilitychange',()=>{if(document.hidden)this.setPlaying(false)});
  }
  initGL(){
   const gl=this.gl;
   const shader=(type,source)=>{const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error('Shader compilation failed');return sh;};
   const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,'attribute vec3 p;uniform vec2 angle;uniform vec2 scale;varying float depth;void main(){float x=p.x*cos(angle.y)-p.z*sin(angle.y);float z=p.z*cos(angle.y)+p.x*sin(angle.y);float y=p.y*cos(angle.x)-z*sin(angle.x);z=p.y*sin(angle.x)+z*cos(angle.x);depth=z;gl_Position=vec4(x*scale.x,y*scale.y,0.,1.);}'));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,'precision mediump float;varying float depth;void main(){gl_FragColor=vec4(.35,.49,.45,.035+.085*(depth+1.)/2.);}'));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Shader link failed');this.program=program;
   const vertices=[];
   for(let latitude=-60;latitude<=60;latitude+=30){const a=latitude*Math.PI/180;for(let i=0;i<96;i++){for(const t of [i,i+1]){const b=t*Math.PI/48;vertices.push(Math.cos(a)*Math.cos(b),Math.sin(a),Math.cos(a)*Math.sin(b));}}}
   for(let longitude=0;longitude<180;longitude+=30){const b=longitude*Math.PI/180;for(let i=0;i<96;i++){for(const t of [i,i+1]){const a=t*Math.PI/48;vertices.push(Math.cos(a)*Math.cos(b),Math.sin(a),Math.cos(a)*Math.sin(b));}}}
   this.vertexCount=vertices.length/3;this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);gl.useProgram(program);const location=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,3,gl.FLOAT,false,0,0);gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
  }
  setRecords(ids,priority=[]){if(!this.slots.size){const first=ids.filter(id=>priority.includes(id)),rest=ids.filter(id=>!priority.includes(id));for(const group of [first,rest])group.forEach((id,index)=>this.slots.set(id,point(index,group.length)));}this.draw();}
  setEnabled(value){this.enabled=value;if(!value)this.setPlaying(false);this.draw();}
  setPlaying(value){this.stopInertia();this.playing=Boolean(value&&!this.reduced.matches&&!this.failed&&this.enabled);this.stage.dispatchEvent(new CustomEvent('sphere-motion',{detail:this.playing}));cancelAnimationFrame(this.frame);if(this.playing){let last=performance.now();const step=now=>{if(!this.playing)return;this.ry+=(now-last)*.000055;last=now;this.draw();this.frame=requestAnimationFrame(step)};this.frame=requestAnimationFrame(step);}}
  stopInertia(){this.inertial=false;delete this.stage.dataset.inertia;cancelAnimationFrame(this.frame);}
  startInertia(vx,vy){
   if(this.reduced.matches||this.failed||!this.enabled||Math.hypot(vx,vy)<.000015)return;
   this.stopInertia();this.inertial=true;this.stage.dataset.inertia='true';this.stage.dispatchEvent(new CustomEvent('sphere-motion',{detail:true}));let last=performance.now();
   const step=now=>{if(!this.inertial)return;const dt=Math.min(64,now-last);last=now;const x=inertiaStep(vx,dt),y=inertiaStep(vy,dt);vx=x.velocity;vy=y.velocity;this.rx=Math.max(-1.3,Math.min(1.3,this.rx+x.delta));this.ry+=y.delta;if(Math.abs(this.rx)>=1.3)vx=0;this.draw();if(Math.hypot(vx,vy)<.000015){this.stopInertia();this.stage.dispatchEvent(new CustomEvent('sphere-motion',{detail:false}));return;}this.frame=requestAnimationFrame(step)};
   this.frame=requestAnimationFrame(step);
  }
  reset(){this.setPlaying(false);this.rx=.15;this.ry=.35;this.onMove();this.draw();}
  draw(){
   cancelAnimationFrame(this.fadeFrame);
   if(this.transitioning||!this.enabled||this.failed||!this.gl)return;
   const now=performance.now(),elapsed=this.lastDraw?Math.min(64,now-this.lastDraw):16;this.lastDraw=now;let fading=false;
   const w=this.stage.clientWidth,h=this.stage.clientHeight;if(!w||!h)return;
   const radius=Math.min(w*.43,h*.45),gl=this.gl,dpr=Math.min(devicePixelRatio||1,2);
   if(this.canvas.width!==Math.round(w*dpr)||this.canvas.height!==Math.round(h*dpr)){this.canvas.width=Math.round(w*dpr);this.canvas.height=Math.round(h*dpr)}
   gl.viewport(0,0,this.canvas.width,this.canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(this.program);gl.uniform2f(gl.getUniformLocation(this.program,'angle'),this.rx,this.ry);gl.uniform2f(gl.getUniformLocation(this.program,'scale'),radius*2/w,radius*2/h);gl.drawArrays(gl.LINES,0,this.vertexCount);
   const entries=[...this.grid.querySelectorAll('.tool-label')].map(button=>{const id=button.parentElement.dataset.id,p=rotate(this.slots.get(id)||[0,0,1],this.rx,this.ry);return {button,p}}).sort((a,b)=>b.p[2]-a.p[2]);const occupied=[];let visible=0;
   for(const {button,p} of entries){
    const width=Math.min(button.offsetWidth,w-24),height=Math.max(44,button.offsetHeight),x=Math.max(width/2+6,Math.min(w-width/2-6,w/2+p[0]*radius)),y=h/2-p[1]*radius;
    const box={x:x-width/2,y:y-height/2,w:width,h:height};const focused=button===document.activeElement;
    const overlap=occupied.some(b=>box.x<b.x+b.w+5&&box.x+box.w+5>b.x&&box.y<b.y+b.h&&box.y+box.h>b.y);
    const target=focused?1:overlap?0:rimOpacity(p[2]);
    const previous=this.fades.get(button)??target;
    // Collision changes also dissolve; faded/occluded labels cannot intercept a tap.
    const alpha=focused?1:this.reduced.matches?target:fadeStep(previous,target,elapsed);
    this.fades.set(button,alpha);if(alpha!==target)fading=true;
    const interactive=focused||(target>=.9&&alpha>=.9),painted=alpha>0;
    button.style.visibility=painted?'visible':'hidden';button.style.pointerEvents=interactive?'auto':'none';button.tabIndex=interactive?0:-1;button.setAttribute('aria-hidden',String(!interactive));
    button.style.left=x+'px';button.style.top=y+'px';button.style.zIndex=String(20+Math.round(p[2]*10));button.style.opacity=String(alpha);button.dataset.depth=p[2].toFixed(3);
    if(target>0)occupied.push(box);if(interactive)visible++;

   }
   if(fading&&!this.reduced.matches)this.fadeFrame=requestAnimationFrame(()=>this.draw());
   this.stage.dataset.visible=String(visible);this.stage.dataset.rotation=this.rx.toFixed(3)+','+this.ry.toFixed(3);
  }
 };
})(typeof window==='undefined'?globalThis:window);
