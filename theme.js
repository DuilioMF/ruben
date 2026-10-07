(function(){
 const controls=document.createElement('nav');
 controls.className='site-controls';
 controls.setAttribute('aria-label','Tema, estilo y navegación');

 const themeButton=document.createElement('button');
 themeButton.type='button';

 const styleSelect=document.createElement('select');
 styleSelect.setAttribute('aria-label','Estilo visual');
 styleSelect.innerHTML='<option value="russo">Estilo: Russo</option><option value="davinci">Estilo: Da Vinci</option>';

 function applyTheme(theme,save){
   document.documentElement.dataset.theme=theme;
   if(save){try{localStorage.setItem('doinglio.theme',theme)}catch(_){}}
   const light=theme==='light';
   themeButton.textContent=light?'🌙 Oscuro':'☀ Claro';
   themeButton.setAttribute('aria-label',light?'Activar oscuro':'Activar claro');
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

 const back=document.createElement('a');
 back.href='https://duiliomf.github.io/doinglio/';
 back.target='_self';
 back.textContent='← DoingLio';
 back.setAttribute('aria-label','Volver a DoingLio');
 back.className='control-back';
 controls.appendChild(back);

 const host=document.querySelector('.top-actions')||document.querySelector('.top')||document.body;
 host.appendChild(controls);

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