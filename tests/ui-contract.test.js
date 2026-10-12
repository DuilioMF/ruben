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
  assert.match(html,/grid-template-columns:minmax\(360px,\.72fr\) minmax\(720px,1\.55fr\)/);
  assert.match(html,/id="invoice-document-file"/);
  assert.match(html,/id="invoice-document-open"/);
  assert.match(html,/>Abrir original<\/button>/);
});


test('Busca Products por nombre y código y permite alta desde Sin coincidencia',()=>{
  assert.match(html,/ID producto/);
  assert.match(html,/product_lookup/);
  assert.match(html,/codigo:String\(item\?\.codigo/);
  assert.match(html,/Agregar producto/);
  assert.match(html,/product_catalog/);
  assert.match(html,/create_product/);
  assert.match(html,/Guardar producto/);
});

test('Prorratea el descuento global sobre el precio unitario',()=>{
  assert.match(html,/function prorateInvoiceDiscount/);
  assert.match(html,/descuento_prorrateado_pct/);
  assert.match(html,/P\.Unit original/);
  assert.match(html,/P\.Unit final/);
  assert.match(html,/Subtotal gravado/);
});


test('Reconoce transferencias como comprobante bancario',()=>{
  assert.match(html,/Clase de comprobante/);
  assert.match(html,/TRANSFERENCIA detectada/);
  assert.match(html,/Referencia \/ ID operación/);
  assert.match(html,/Banco origen/);
  assert.match(html,/Banco destino/);
});


test('Permite abrir y modificar un producto existente',()=>{
  assert.match(html,/data-edit-product/);
  assert.match(html,/openProductEdit/);
  assert.match(html,/ruben-actions/);
  assert.match(html,/get_product/);
  assert.match(html,/update_product/);
  assert.match(html,/Guardar cambios/);
});

test('Al guardar un comprobante intenta crear la orden de compra',()=>{
  assert.match(html,/createPurchaseOrderFromInvoice/);
  assert.match(html,/create_purchase_order/);
  assert.match(html,/partner_reference/);
  assert.match(html,/supplier_cuit/);
  assert.match(html,/purchase_order_name/);
});


test('Muestra impuestos grabados en la orden de compra',()=>{
  assert.match(html,/tax_count/);
  assert.match(html,/impuesto\(s\)/);
});


test('Muestra sumatorias de control del comprobante',()=>{
  assert.match(html,/invoice-items-totals/);
  assert.match(html,/invoice-control-totals/);
  assert.match(html,/recalculateInvoiceTotals/);
  assert.match(html,/Total comprobante/);
  assert.match(html,/Diferencia/);
});
