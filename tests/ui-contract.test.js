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

test('Cargar factura sigue visible sin romper Compras',()=>{
  assert.match(html,/>Cargar factura<\/button>/);
  assert.match(html,/COMPRAS Y GASTOS/);
  assert.match(html,/metric\('Insumos'/);
  assert.match(html,/metric\('Gastos'/);
  assert.match(html,/metric\('Pendiente de pago'/);
  assert.match(html,/metric\('Pagado'/);
});
