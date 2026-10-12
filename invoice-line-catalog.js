(function(root){
  'use strict';
  const blank=v=>v===null||v===undefined||String(v).trim()==='';
  const round=(n,d)=>Math.round((n+Number.EPSILON)*10**d)/10**d;
  function number(value){
    let raw=String(value??'').trim().replace(/[$\s]/g,'');
    if(!raw||/[^0-9,.-]/.test(raw))return null;
    if(raw.includes(',')&&raw.includes('.'))raw=raw.replace(/\./g,'').replace(',','.');
    else if(raw.includes(','))raw=raw.replace(',','.');
    const n=Number(raw);return Number.isFinite(n)?n:null;
  }
  function price(list,cost,taxes){
    let pct=0,fixed=0;
    for(const t of taxes||[]){if(Number(t.calculation_type)===1)pct+=Number(t.amount);else if(Number(t.calculation_type)===2)fixed+=Number(t.amount)}
    const unit=round((Number(list)-fixed)/(1+pct/100),4);
    return {unit,margin:unit>0?round((unit-Number(cost))/unit*100,2):0};
  }
  function hydrate(item,match){
    const row={...item};
    if(blank(row.unidad)&&match?.uom_name){row.unidad=match.uom_name;row.uom_id=match.uom_id}
    const taxes=(match?.purchase_taxes||[]).filter(t=>Number(t.calculation_type)===1&&t.active!==false&&/iva/i.test(t.name||''));
    if(blank(row.iva_alicuota)&&taxes.length===1){row.iva_alicuota=taxes[0].amount;row.tax_id=taxes[0].id}
    return row;
  }
  function choices(key,catalog){
    return key==='unidad'?(catalog.uoms||[]).map(u=>({id:u.id,value:String(u.name),label:u.name})):
      (catalog.taxes||[]).filter(t=>Number(t.scope)===2&&Number(t.calculation_type)===1&&/iva/i.test(t.name||'')).map(t=>({id:t.id,value:String(t.amount),label:t.name}));
  }
  function select(key,item,catalog){
    const el=document.createElement('select');el.dataset.itemField=key;el.setAttribute('aria-label',key==='unidad'?'Unidad de medida':'IVA de compras');
    const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent='Elegir…';el.append(placeholder);
    const options=choices(key,catalog);const value=blank(item[key])?'':String(item[key]);
    for(const c of options){const o=document.createElement('option');o.value=c.value;o.textContent=c.label;o.dataset.id=String(c.id);el.append(o)}
    if(value&&!options.some(c=>c.value===value)){const o=document.createElement('option');o.value=value;o.textContent=value+(key==='iva_alicuota'?' % (comprobante)':' (comprobante)');el.append(o)}
    el.value=value;
    const id=item[key==='unidad'?'uom_id':'tax_id'];const preferred=id&&Array.from(el.options).find(o=>o.dataset.id===String(id));if(preferred)preferred.selected=true;
    return el;
  }
  const api={blank,number,price,hydrate,choices,select};root.RubenLineCatalog=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
