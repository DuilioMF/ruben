
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL='https://apqgrwudkfytwikrsivd.supabase.co';
const SUPABASE_KEY='sb_publishable_B9NdjnzOKu9BhZGmTM6LGg_wDB3n8lY';
const RUBEN_PUBLIC_URL='https://duiliomf.github.io/ruben/';
const sb=createClient(SUPABASE_URL,SUPABASE_KEY,{
  auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
});

const state={authorized:false,user:null,access:null};
window.RubenAuth={sb,state,invoke,check,logout};

const style=document.createElement('style');
style.textContent=`
body:not(.ruben-authorized) #ruben-app{visibility:hidden}
#ruben-auth-shell{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:22px;background:radial-gradient(circle at 50% 25%,#12353a,#090a0c 48%,#070809)}
body.ruben-authorized #ruben-auth-shell{display:none}
.ruben-auth-card{width:min(560px,94vw);border:1px solid #54bfc355;background:#0d1014f2;border-radius:24px;padding:34px;box-shadow:0 40px 120px #0009}
.ruben-auth-brand{display:flex;align-items:center;gap:12px;font-size:11px;letter-spacing:.2em}.ruben-auth-brand img{width:36px;height:36px}
.ruben-auth-kicker{margin-top:28px;color:#54bfc3;font-size:9px;letter-spacing:.22em}.ruben-auth-card h2{font:600 46px/1 "Cormorant Garamond",Georgia,serif;margin:10px 0 14px}
.ruben-auth-copy{color:#9ca1a6;line-height:1.7;font-size:13px}.ruben-auth-form{display:flex;gap:9px;margin-top:20px}
.ruben-auth-form input{flex:1;min-width:0;border:1px solid #ffffff22;background:#ffffff08;color:#f0eee8;border-radius:12px;padding:14px}
.ruben-auth-form button,.ruben-auth-btn{border:1px solid #54bfc366;background:#54bfc31b;color:#dff9fa;border-radius:12px;padding:12px 15px;font-weight:800;cursor:pointer}
.ruben-auth-status{min-height:24px;margin-top:13px;color:#aab0b6;font-size:12px;line-height:1.5}.ruben-auth-status.error{color:#ffaaaa}.ruben-auth-status.ok{color:#82e3bd}
.ruben-auth-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.ruben-auth-note{margin-top:18px;padding-top:15px;border-top:1px solid #ffffff15;color:#777f86;font-size:10px;line-height:1.6}
@media(max-width:560px){.ruben-auth-form{flex-direction:column}.ruben-auth-card{padding:28px 22px}.ruben-auth-card h2{font-size:40px}}
`;
document.head.appendChild(style);

const shell=document.createElement('section');
shell.id='ruben-auth-shell';
shell.innerHTML=`
<div class="ruben-auth-card">
  <div class="ruben-auth-brand"><img src="brain-davinci.svg" alt=""><span>DOINGLIO · RUBEN</span></div>
  <div class="ruben-auth-kicker" id="ruben-auth-kicker">ACCESO CONTROLADO</div>
  <h2 id="ruben-auth-title">Entrá con tu mail.</h2>
  <p class="ruben-auth-copy" id="ruben-auth-copy">Te enviamos un enlace seguro. La primera vez tu cuenta queda inactiva hasta que sea habilitada.</p>
  <form class="ruben-auth-form" id="ruben-auth-form">
    <input id="ruben-auth-email" type="email" autocomplete="email" inputmode="email" placeholder="tu@email.com" required>
    <button id="ruben-auth-submit" type="submit">Entrar</button>
  </form>
  <div class="ruben-auth-status" id="ruben-auth-status"></div>
  <div class="ruben-auth-actions" id="ruben-auth-actions" hidden>
    <button class="ruben-auth-btn" id="ruben-auth-recheck" type="button">Volver a verificar</button>
    <button class="ruben-auth-btn" id="ruben-auth-logout" type="button">Salir</button>
  </div>
  <div class="ruben-auth-note">El acceso se registra por mail. Nadie entra a Ruben hasta que el campo <strong>active</strong> esté habilitado.</div>
</div>`;
document.body.appendChild(shell);

const form=document.getElementById('ruben-auth-form');
const emailInput=document.getElementById('ruben-auth-email');
const submit=document.getElementById('ruben-auth-submit');
const statusEl=document.getElementById('ruben-auth-status');
const actions=document.getElementById('ruben-auth-actions');
const title=document.getElementById('ruben-auth-title');
const copy=document.getElementById('ruben-auth-copy');
const kicker=document.getElementById('ruben-auth-kicker');

function setStatus(message,type=''){
  statusEl.className='ruben-auth-status'+(type?' '+type:'');
  statusEl.textContent=message||'';
}
function showLogin(){
  state.authorized=false; state.access=null;
  document.body.classList.remove('ruben-authorized');
  kicker.textContent='ACCESO CONTROLADO';
  title.textContent='Entrá con tu mail.';
  copy.textContent='Te enviamos un enlace seguro. La primera vez tu cuenta queda inactiva hasta que sea habilitada.';
  form.hidden=false; actions.hidden=true;
}
function showPending(email){
  state.authorized=false;
  document.body.classList.remove('ruben-authorized');
  kicker.textContent='PENDIENTE DE AUTORIZACIÓN';
  title.textContent='Tu acceso está registrado.';
  copy.textContent='El mail '+email+' todavía está inactivo para Ruben. Cuando se habilite el tilde active, vas a poder entrar.';
  form.hidden=true; actions.hidden=false;
  setStatus('Acceso pendiente de aprobación.','ok');
}
function showAuthorized(access,user){
  state.authorized=true; state.access=access; state.user=user;
  document.body.classList.add('ruben-authorized');
  const label=document.getElementById('ruben-account');
  if(label)label.textContent=user?.email||access?.email||'Cuenta DoingLio';
  const logoutBtn=document.getElementById('ruben-logout');
  if(logoutBtn&&!logoutBtn.dataset.bound){
    logoutBtn.dataset.bound='1';
    logoutBtn.addEventListener('click',logout);
  }
  window.dispatchEvent(new CustomEvent('ruben:authorized',{detail:{access,user}}));
}
async function invoke(action,payload={}){
  const {data,error}=await sb.functions.invoke('ruben-access',{body:{action,...payload}});
  if(error){
    let parsed=null;
    try{parsed=await error.context?.clone?.().json()}catch(_){}
    const err=new Error(parsed?.message||error.message||'No se pudo consultar Ruben.');
    err.code=parsed?.error||'function_error';
    err.payload=parsed;
    throw err;
  }
  if(data?.error){
    const err=new Error(data.message||'No se pudo consultar Ruben.');
    err.code=data.error; err.payload=data; throw err;
  }
  return data;
}
async function check(){
  try{
    const {data:{session}}=await sb.auth.getSession();
    if(!session?.user){showLogin();return}
    state.user=session.user;
    const access=await invoke('status');
    state.access=access;
    if(access.active)showAuthorized(access,session.user);
    else showPending(access.email||session.user.email||'');
  }catch(error){
    if(error.code==='pending_approval'){
      showPending(error.payload?.email||state.user?.email||'');
      return;
    }
    showLogin();
    setStatus(error.message||'No pude comprobar tu acceso.','error');
  }
}
async function logout(){
  await sb.auth.signOut();
  state.authorized=false; state.user=null; state.access=null;
  showLogin(); setStatus('');
}
form.addEventListener('submit',async(event)=>{
  event.preventDefault();
  const email=String(emailInput.value||'').trim().toLowerCase();
  if(!email)return;
  submit.disabled=true; submit.textContent='Enviando…';
  setStatus('Enviando acceso seguro…');
  try{
    const {error}=await sb.auth.signInWithOtp({
      email,
      options:{emailRedirectTo:RUBEN_PUBLIC_URL,shouldCreateUser:true}
    });
    if(error)throw error;
    setStatus('Te enviamos el enlace. Abrilo desde ese mail para continuar.','ok');
  }catch(error){
    setStatus('No pude enviar el acceso: '+(error.message||error),'error');
  }finally{
    submit.disabled=false; submit.textContent='Entrar';
  }
});
document.getElementById('ruben-auth-recheck').addEventListener('click',check);
document.getElementById('ruben-auth-logout').addEventListener('click',logout);
sb.auth.onAuthStateChange(()=>setTimeout(check,0));
check();
