const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');
const version=read('VERSION').trim();
test('Versión única R6',()=>{assert.equal(version,'006');assert.match(read('index.html'),/theme\.js\?v=006/);});
test('Todas las pantallas indican versión dinámica',()=>{
  for(const page of ['index.html','conexion-postgres.html']){
    const html=read(page);
    assert.match(html,/theme\.js\?v=006/);
    assert.doesNotMatch(html,/Rubén|RUBÉN|rubén/);
  }
});
test('Versión propia nunca se sustituye por un BUILD no verificado',()=>{
 const js=read('theme.js');
 assert.match(js,/fetch\('VERSION\?cache='/);
 assert.match(js,/RUBEN · R/);
 assert.doesNotMatch(js,/Rubén|RUBÉN|rubén/);
 assert.match(js,/p\.ok&&\/\^\\d\+\$\/\.test\(d\)/);
});
