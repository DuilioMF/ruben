const {test}=require('node:test');const assert=require('node:assert/strict');
const {patch}=require('../backend/r20-connector-patch');const fixture=require('../backend/r19-connector-template.json');
function workflow(){return patch({nodes:[{name:'Validar solicitud',parameters:{jsCode:fixture.validator}},{name:'Preparar respuesta',parameters:{jsCode:fixture.response}}]})}
function input(body){return new Function('$json',workflow().nodes[0].parameters.jsCode)({body:{bridge_key:'__BRIDGE_KEY__',...body}})[0].json}
test('Catálogo real y costo puntual conservan autenticación del conector',()=>{
  assert.throws(()=>input({action:'product_catalog',bridge_key:'wrong'}),/No autorizado/);
  assert.match(input({action:'product_catalog'}).query,/sp_ruben_catalogo_producto/);
  const q=input({action:'product_lookup',items:[{mode:'update_cost',product_id:124,standard_price:152671.63}]}).query;
  assert.match(q,/sp_ruben_actualizar_costo\(124,152671\.63/);
  assert.doesNotMatch(q,/sp_ruben_actualizar_producto\(/);
});
test('Impuestos y precios inválidos se rechazan antes de SQL',()=>{
  const body={action:'create_product',name:'R20 test',category_id:1,uom_id:1,list_price:2420,standard_price:1000,unit_price:2000,margin:50,type:3,sale_tax_ids:[1],purchase_tax_ids:[3]};
  assert.throws(()=>input({...body,sale_tax_ids:['1);DROP TABLE x']}),/Impuestos inválidos/);
  assert.throws(()=>input({...body,standard_price:-1}),/Precio inválido/);
  assert.match(input({...body,margin:-20}).query,/sp_ruben_guardar_producto_con_impuestos/);
});
test('Lookup devuelve unidad e impuestos en el mismo recorrido por Products',()=>{
  const q=input({action:'product_lookup',items:[{codigo:'180852VATP',descripcion:''}]}).query;
  assert.match(q,/ProductUnitOfMeasureID/);assert.match(q,/ProductPurchaseTax/);assert.match(q,/FROM matched m/);
});
test('Respuesta acepta CREATE previo y CREATE nuevo, sin perder campos del catálogo',()=>{
  const code=workflow().nodes[1].parameters.jsCode;
  const run=(req,row)=>new Function('$input','$',code)({all:()=>[{json:row}]},()=>({first:()=>({json:req})}))[0].json;
  assert.equal(run({action:'create_product'},{p_product_id:100}).product_id,100);
  assert.equal(run({action:'create_product'},{p_result:{id:101}}).product_id,101);
  assert.deepEqual(run({action:'product_catalog'},{p_result:{taxes:[{id:3}],uoms:[{id:1}]}}).taxes,[{id:3}]);
  assert.equal(run({action:'product_lookup',mode:'update_cost',product_id:101},{p_result:{id:101,standard_price:50}}).matches[0].product.standard_price,50);
});
