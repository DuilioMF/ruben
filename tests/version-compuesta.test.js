const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');
const version=read('VERSION').trim();

test('Versión única R7',()=>{
  assert.equal(version,'007');
  assert.match(read('index.html'),/theme\.js\?v=007/);
  assert.match(read('index.html'),/ruben-auth\.js\?v=007/);
});

test('Todas las pantallas de Ruben requieren acceso autorizado',()=>{
  for(const page of ['index.html','conexion-postgres.html']){
    const html=read(page);
    assert.match(html,/ruben-auth\.js\?v=007/);
    assert.match(html,/id="ruben-app"/);
    assert.doesNotMatch(html,/Rubén|RUBÉN|rubén/);
  }
  const auth=read('ruben-auth.js');
  assert.ok(auth.includes('signInWithOtp'));
  assert.ok(auth.includes('shouldCreateUser:true'));
  assert.ok(auth.includes("sb.functions.invoke('ruben-access'"));
  assert.ok(auth.includes('PENDIENTE DE AUTORIZACIÓN'));
  assert.ok(auth.includes('active'));
});

test('R7 carga y permite cambiar compañías',()=>{
  const html=read('index.html');
  assert.match(html,/id="company-select"/);
  assert.match(html,/Saltar entre compañías/);
  assert.ok(html.includes("RubenAuth.invoke('companies'"));
  assert.ok(html.includes("RubenAuth.invoke('select_company'"));
  for(const id of ['company-fiscal','company-document','company-gross','company-city','company-address','company-phone','company-email'])
    assert.ok(html.includes('id="'+id+'"'));
});

test('La base de acceso nace inactiva y recuerda compañía',()=>{
  const sql=read('supabase/migrations/202610060001_ruben_access.sql');
  assert.match(sql,/active boolean not null default false/);
  assert.match(sql,/selected_company_id bigint/);
  assert.match(sql,/enable row level security/);
  assert.match(sql,/revoke all on table public\.ruben_access/);
});

test('Versión propia nunca se sustituye por un BUILD no verificado',()=>{
 const js=read('theme.js');
 assert.match(js,/fetch\('VERSION\?cache='/);
 assert.match(js,/RUBEN · R/);
 assert.doesNotMatch(js,/Rubén|RUBÉN|rubén/);
 assert.match(js,/p\.ok&&\/\^\\d\+\$\/\.test\(d\)/);
});
