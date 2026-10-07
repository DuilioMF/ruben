(function(){
 const controls=document.createElement('nav');controls.className='site-controls';controls.setAttribute('aria-label','Tema, estilo y navegación');
 const themeButton=document.createElement('button');themeButton.type='button';
 const styleSelect=document.createElement('select');styleSelect.setAttribute('aria-label','Estilo visual');
 styleSelect.innerHTML='<option value="russo">Estilo: Russo</option><option value="davinci">Estilo: Da Vinci</option>';

 function applyTheme(theme,save){
   document.documentElement.dataset.theme=theme;
   if(save){try{localStorage.setItem('doinglio.theme',theme)}catch(_){}}
   const light=theme==='light';
   themeButton.textContent=light?'🌙 Activar oscuro':'☀ Activar claro';
   themeButton.setAttribute('aria-label',themeButton.textContent);
   document.querySelector('meta[name="theme-color"]')?.setAttribute('content',light?'#eaf1f6':'#071522');
 }
 function applyStyle(style,save){
   const value=style==='davinci'?'davinci':'russo';
   document.documentElement.dataset.style=value;
   styleSelect.value=value;
   if(save){try{localStorage.setItem('doinglio.style',value)}catch(_){}}
 }
 themeButton.onclick=()=>applyTheme(document.documentElement.dataset.theme==='light'?'dark':'light',true);
 styleSelect.onchange=()=>applyStyle(styleSelect.value,true);
 controls.append(themeButton,styleSelect);

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
 document.body.appendChild(controls);
 applyStyle(document.documentElement.dataset.style||'russo',false);
 applyTheme(document.documentElement.dataset.theme==='light'?'light':'dark',false);
})();
(function(){
 async function version(){
  let target=document.getElementById('ruben-version')||document.querySelector('.code');
  if(!target){target=document.createElement('span');target.id='ruben-version';document.body.appendChild(target)}
  try{
   const r=await fetch('VERSION?cache='+Date.now(),{cache:'no-store'});
   if(!r.ok)throw Error('VERSION');
   const v=(await r.text()).trim();
   if(!/^\d+$/.test(v))throw Error('bad version');
   target.textContent='RUBEN · R'+Number(v);
   const parent=location.hostname==='localhost'||location.hostname==='127.0.0.1'?'../BUILD':'https://duiliomf.github.io/doinglio/BUILD';
   try{
    const p=await fetch(parent+'?cache='+Date.now(),{cache:'no-store'});
    const d=(await p.text()).trim();
    if(p.ok&&/^\d+$/.test(d))target.textContent='RUBEN · D'+Number(d)+'.R'+Number(v)
   }catch(_){}
  }catch(_){target.textContent='RUBEN · versión sin verificar'}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',version,{once:true});else version()
})();