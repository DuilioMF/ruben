const {test}=require('node:test');
const assert=require('node:assert/strict');
const {price,hydrate,choices,number}=require('../invoice-line-catalog.js');
const taxes=[{id:1,name:'IVA ventas 21 %',scope:1,amount:21,calculation_type:1},{id:3,name:'IVA compras 21 %',scope:2,amount:21,calculation_type:1},{id:6,name:'IVA compras 0%',scope:2,amount:0,calculation_type:1}];
test('Misma fórmula de FetchPriceQuery: venta neta y margen sobre neto',()=>{
  assert.deepEqual(price(2420,1000,[taxes[0]]),{unit:2000,margin:50});
  assert.deepEqual(price(1,1,[taxes[0]]),{unit:0.8264,margin:-21.01});
  assert.deepEqual(price(0,1000,[]),{unit:0,margin:0});
  assert.deepEqual(price(2530,1000,[taxes[0],{amount:110,calculation_type:2}]),{unit:2000,margin:50});
});
test('Carga unidad y alícuota del producto únicamente cuando falta el dato',()=>{
  assert.deepEqual(hydrate({unidad:'',iva_alicuota:null},{uom_id:1,uom_name:'Unidad (es)',purchase_taxes:[taxes[1]]}),{unidad:'Unidad (es)',iva_alicuota:21,uom_id:1,tax_id:3});
  assert.deepEqual(hydrate({unidad:'Docena(s)',iva_alicuota:0},{uom_id:1,uom_name:'Unidad (es)',purchase_taxes:[taxes[1]]}),{unidad:'Docena(s)',iva_alicuota:0});
  assert.equal(hydrate({iva_alicuota:''},{purchase_taxes:[taxes[1],taxes[2]]}).iva_alicuota,'');
});
test('El selector de línea trae IVA de compras y conserva exento 0%',()=>{
  assert.deepEqual(choices('iva_alicuota',{taxes}).map(t=>t.id),[3,6]);
  assert.equal(choices('iva_alicuota',{taxes})[1].value,'0');
  assert.deepEqual(choices('unidad',{uoms:[{id:7,name:'Caja X 24'}]}),[{id:7,value:'Caja X 24',label:'Caja X 24'}]);
});
test('Costo distingue un cero válido de texto o número incompleto',()=>{
  assert.equal(number('0'),0);assert.equal(number('$ 152.671,63'),152671.63);
  assert.equal(number('hola123'),null);assert.equal(number(''),null);assert.equal(number('1.2.3'),null);
});
