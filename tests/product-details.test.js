const {test}=require('node:test');
const assert=require('node:assert/strict');
const {taxText,listText,imageSource}=require('../product-details.js');
test('Mantiene separados venta y compra y no sustituye tasas por 21',()=>{
  assert.equal(taxText([{name:'IVA ventas 10.5 %',amount:10.5,calculation_type:1}]),'IVA ventas 10.5 %');
  assert.equal(taxText([{name:'Exento compras',amount:0,calculation_type:1}]),'Exento compras · 0 %');
  assert.equal(taxText([{name:'IVA',amount:27,calculation_type:1,active:false}]),'IVA · 27 % (inactivo)');
});
test('Diferencia campos no leídos de listas vacías comprobadas',()=>{
  assert.equal(taxText(undefined),'No disponible');
  assert.equal(taxText([]),'Sin impuestos asociados');
  assert.equal(listText([{name:'Lunetas'}],'name'),'Lunetas');
  assert.equal(listText(['7790001']),'7790001');
});
test('Rechaza URL activa y SVG de imagen y acepta bitmap HTTPS/base64',()=>{
  assert.equal(imageSource('javascript:alert(1)'),null);
  assert.equal(imageSource('data:image/svg+xml,<svg onload="alert(1)">'),null);
  assert.equal(imageSource('https://example.com/image.png'),'https://example.com/image.png');
  assert.equal(imageSource('data:image/png;base64,AAAA'),'data:image/png;base64,AAAA');
});
