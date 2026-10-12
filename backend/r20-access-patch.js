function patch(source){
  source=source.replace('uoms: Array.isArray(data.uoms) ? data.uoms : [],','uoms: Array.isArray(data.uoms) ? data.uoms : [],\n        taxes: Array.isArray(data.taxes) ? data.taxes : [],');
  source=source.replace('create_uid: user.email,','create_uid: user.email,\n        ...(Array.isArray(body.sale_tax_ids)?{sale_tax_ids:body.sale_tax_ids}:{}),\n        ...(Array.isArray(body.purchase_tax_ids)?{purchase_tax_ids:body.purchase_tax_ids}:{}),');
  source=source.replace('const items = Array.isArray(body.items) ? body.items.slice(0,100) : [];','const items = Array.isArray(body.items) ? body.items.slice(0,100).map((item:any)=>({...item,write_uid:user.email,create_uid:user.email})) : [];');
  return source;
}
if(typeof module!=='undefined')module.exports={patch};
