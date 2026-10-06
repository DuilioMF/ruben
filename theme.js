(function(){
 const controls=document.createElement('nav');controls.className='site-controls';controls.setAttribute('aria-label','Tema y navegación');
 const button=document.createElement('button');button.type='button';
 function apply(theme,save){document.documentElement.dataset.theme=theme;if(save){try{localStorage.setItem('doinglio.theme',theme)}catch(_){}}const light=theme==='light';button.textContent=light?'🌙 Activar oscuro':'☀ Activar claro';button.setAttribute('aria-label',button.textContent);document.querySelector('meta[name="theme-color"]')?.setAttribute('content',light?'#f3ecdf':'#090907');}
 button.onclick=()=>apply(document.documentElement.dataset.theme==='light'?'dark':'light',true);
 controls.appendChild(button);
 let oldBack=document.querySelector('a.doinglio-home,a.back,.top a[href="index.html"]');
 if(!oldBack){
   oldBack=document.createElement('a');
   oldBack.href='https://duiliomf.github.io/doinglio/';
   oldBack.target='_self';
   oldBack.textContent='← Volver a DoingLio';
   oldBack.setAttribute('aria-label','Volver a DoingLio');
 }
 oldBack.className='control-back';
 controls.appendChild(oldBack);
 document.body.appendChild(controls);apply(document.documentElement.dataset.theme==='light'?'light':'dark',false);
})();
(function(){async function version(){let target=document.getElementById('ruben-version')||document.querySelector('.code');if(!target){target=document.createElement('span');target.id='ruben-version';document.body.appendChild(target)}try{const r=await fetch('VERSION?cache='+Date.now(),{cache:'no-store'});if(!r.ok)throw Error('VERSION');const v=(await r.text()).trim();if(!/^\d+$/.test(v))throw Error('bad version');target.textContent='RUBEN · R'+Number(v);const parent=location.hostname==='localhost'||location.hostname==='127.0.0.1'?'../BUILD':'https://duiliomf.github.io/doinglio/BUILD';try{const p=await fetch(parent+'?cache='+Date.now(),{cache:'no-store'});const d=(await p.text()).trim();if(p.ok&&/^\d+$/.test(d))target.textContent='RUBEN · D'+Number(d)+'.R'+Number(v)}catch(_){}}catch(_){target.textContent='RUBEN · versión sin verificar'}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',version,{once:true});else version()})();
