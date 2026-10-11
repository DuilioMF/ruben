const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

const html=fs.readFileSync('index.html','utf8');

test('La barra principal protege el ancho de compañía',()=>{
  assert.match(html,/\.filters\{display:grid;grid-template-columns:minmax\(300px,1fr\) 180px auto;/);
  assert.doesNotMatch(html,/\.filters\{[^}]*grid-template-columns:1fr 180px auto auto/);
  assert.match(html,/id="company-select"/);
  assert.match(html,/id="dashboard-date"/);
});

test('Las acciones principales están agrupadas y jerarquizadas',()=>{
  assert.match(html,/class="filter-actions"/);
  assert.match(html,/id="dashboard-refresh" class="refresh secondary"/);
  assert.match(html,/id="invoice-upload-top" class="refresh primary"/);
  assert.match(html,/\.filter-actions\{display:flex;/);
});

test('El layout se reacomoda antes de comprimir controles',()=>{
  assert.match(html,/@media\(max-width:820px\)\{\.filters\{grid-template-columns:1fr 180px\}/);
  assert.match(html,/@media\(max-width:700px\)\{\.filters\{grid-template-columns:1fr\}/);
  assert.match(html,/\.filter-actions\{grid-column:1\/-1;justify-content:flex-end\}/);
});

test('Cargar comprobante sigue visible sin romper Compras',()=>{
  assert.match(html,/>Cargar comprobante<\/button>/);
  assert.match(html,/COMPRAS Y GASTOS/);
  assert.match(html,/metric\('Insumos'/);
  assert.match(html,/metric\('Gastos'/);
  assert.match(html,/metric\('Pendiente de pago'/);
  assert.match(html,/metric\('Pagado'/);
});


test('La carga permite revisar el comprobante original antes de guardar',()=>{
  assert.match(html,/id="invoice-document-preview"/);
  assert.match(html,/COMPROBANTE ORIGINAL/);
  assert.match(html,/>Guardar comprobante<\/button>/);
  assert.match(html,/Puede ser factura, recibo, ticket u otro comprobante/);
});


test('El comprobante original ocupa el panel principal y muestra el archivo',()=>{
  assert.match(html,/grid-template-columns:minmax\(520px,1\.35fr\) minmax\(380px,1fr\)/);
  assert.match(html,/id="invoice-document-file"/);
  assert.match(html,/id="invoice-document-open"/);
  assert.match(html,/>Abrir original<\/button>/);
});


test('Busca el Product ID por coincidencia exacta con Products.Name',()=>{
  assert.match(html,/ID producto/);
  assert.match(html,/product_lookup/);
  assert.match(html,/product_id/);
  assert.match(html,/Coincidencia exacta con Products\.Name/);
});
