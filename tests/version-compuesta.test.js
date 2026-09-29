const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');
const version=read('VERSION').trim();
test('Versión única R4',()=>{assert.equal(version,'004');assert.match(read('index.html'),/theme\.js\?v=004/);});
test('Todas las pantallas indican versión dinámica',()=>{
  for(const page of ['index.html','conexion-postgres.html']){
    const html=read(page);
    assert.match(html,/theme\.js\?v=004/);
    assert.doesNotMatch(html,/RUBEN · 003/);
  }
});
test('Versión propia nunca se sustituye por un BUILD no verificado',()=>{
 const js=read('theme.js');
 assert.match(js,/fetch\('VERSION\?cache='/);
 assert.match(js,/RUBÉN · R/);
 assert.match(js,/p\.ok&&\/\^\\d\+\$\/\.test\(d\)/);
});
