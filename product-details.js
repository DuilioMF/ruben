(function(root){
  'use strict';
  const taxText=taxes=>!Array.isArray(taxes)?'No disponible':taxes.length?taxes.map(t=>{
    const name=String(t.name||'Impuesto #'+t.id);
    const rate=t.amount==null?'':Number(t.amount).toLocaleString('es-AR',{maximumFractionDigits:4});
    const amount=rate&&!name.includes('%')?' · '+rate+(t.calculation_type===1?' %':''):'';
    return name+amount+(t.active===false?' (inactivo)':'');
  }).join(' · '):'Sin impuestos asociados';
  const listText=(rows,key)=>!Array.isArray(rows)?'No disponible':rows.length?rows.map(r=>key?String(r[key]??''):String(r)).join(' · '):'Sin datos asociados';
  function imageSource(value){
    const v=String(value||'').trim();
    if(/^https:\/\//i.test(v)||/^data:image\/(png|jpe?g|webp|gif);base64,[a-z0-9+/=\s]+$/i.test(v))return v;
    if(v.length>40&&/^[a-z0-9+/=\s]+$/i.test(v))return 'data:image/jpeg;base64,'+v;
    return null;
  }
  function render(container,p){
    container.replaceChildren();
    const grid=document.createElement('div');grid.className='product-extra-grid';
    for(const [label,value] of [['Impuestos de cliente / IVA ventas',taxText(p.sale_taxes)],['Impuestos de proveedor / IVA compras',taxText(p.purchase_taxes)],['Etiquetas',listText(p.tags,'name')],['Códigos de barra',listText(p.barcodes)]]){
      const box=document.createElement('div'),small=document.createElement('small'),b=document.createElement('b');small.textContent=label;b.textContent=value;box.append(small,b);grid.append(box);
    }
    container.append(grid);
    const source=imageSource(p.image);const label=document.createElement('div');label.className='product-image-label';label.textContent='Imagen';container.append(label);
    if(source){const img=document.createElement('img');img.className='product-detail-image';img.alt='Imagen del producto';img.src=source;img.addEventListener('error',()=>{img.replaceWith(document.createTextNode('No se pudo cargar la imagen'))});container.append(img)}
    else container.append(document.createTextNode(p.image?'Formato de imagen no disponible':'Sin imagen cargada'));
  }
  const api={taxText,listText,imageSource,render};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.RubenProductDetails=api;
})(typeof window!=='undefined'?window:globalThis);
