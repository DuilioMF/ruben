// Applies only the R20 changes to a current connector; no credentials are stored here.
function patch(w){
  const input=w.nodes.find(n=>n.name==='Validar solicitud');
  let s=input.parameters.jsCode;
  const start=s.indexOf("if(action==='product_catalog'){");const end=s.indexOf("if(action==='get_product'){",start);
  s=s.slice(0,start)+"if(action==='product_catalog'){return [{json:{action,query:`CALL public.sp_ruben_catalogo_producto(NULL)`}}];}\n"+s.slice(end);
  const helper=`
const taxArray=v=>{if(v==null)return 'NULL';if(!Array.isArray(v)||v.length>50||v.some(x=>!Number.isInteger(Number(x))||Number(x)<=0))throw new Error('Impuestos inválidos');return 'ARRAY['+[...new Set(v.map(Number))].join(',')+']::integer[]'};
const productSql=(b,id)=>{
 const esc=s=>String(s??'').replace(/'/g,"''");
 const num=(v,allowNegative=false)=>{const n=Number(v??0);if(!Number.isFinite(n)||(!allowNegative&&n<0))throw new Error('Precio inválido');return n};
 const int=v=>{const n=Number(v);if(!Number.isInteger(n)||n<=0)throw new Error('Referencia inválida');return n};
 const name=String(b.name||'').trim();if(!name)throw new Error('Nombre obligatorio');
 const bool=(v,d)=>typeof v==='boolean'?v:d;
 return 'CALL public.sp_ruben_guardar_producto_con_impuestos('+[
   id==null?'NULL':int(id),"'"+esc(name)+"'",bool(b.sale_ok,true),bool(b.purchase_ok,true),bool(b.can_be_expensed,false),bool(b.active,true),
   num(b.list_price),num(b.standard_price),num(b.unit_price),num(b.margin,true),int(b.type||3),int(b.category_id),int(b.uom_id),
   "'"+esc(b.write_uid||b.create_uid||'Ruben')+"'",taxArray(b.sale_tax_ids),taxArray(b.purchase_tax_ids),'NULL'
 ].join(',')+')';
};
`;
  s=s.replace("if(action==='health') return",helper+"\nif(action==='health') return");
  s=s.replace("if(action==='create_product'){", "if(action==='create_product'){\n if(Array.isArray(body.sale_tax_ids)||Array.isArray(body.purchase_tax_ids))return [{json:{action,query:productSql(body,null)}}];");
  s=s.replace("if(mode==='get_product'){",`if(mode==='update_cost'){
    const id=Number(special.product_id),cost=Number(special.standard_price);
    if(!Number.isInteger(id)||id<=0||!Number.isFinite(cost)||cost<0)throw new Error('Producto/costo inválido');
    const uid=String(special.write_uid||'Ruben').replace(/'/g,"''");
    return [{json:{action,mode,product_id:id,query:\`CALL public.sp_ruben_actualizar_costo(\${id},\${cost},'\${uid}',NULL)\`}}];
  }
  if(mode==='get_product'){`);
  s=s.replace("if(mode==='update_product'){", "if(mode==='update_product'){\n if(Array.isArray(special.sale_tax_ids)||Array.isArray(special.purchase_tax_ids))return [{json:{action,mode,product_id:Number(special.product_id),query:productSql(special,special.product_id)}}];");
  s=s.replace('const query=`\nWITH requested','let query=`\nWITH requested');
  s=s.replace('return [{json:{action,items,query}}];',`query=\`WITH matched AS (\${query}) SELECT m.*,p."ProductUnitOfMeasureID" AS uom_id,u."Name" AS uom_name,
    COALESCE((SELECT jsonb_agg(jsonb_build_object('id',t."ID",'name',t."Name",'amount',t."Amount",'calculation_type',t."CalculationType",'active',t."Active") ORDER BY t."ID") FROM public."ProductPurchaseTax" pt JOIN public."Taxes" t ON t."ID"=pt."TaxID" WHERE pt."ProductID"=p."ID"),'[]'::jsonb) AS purchase_taxes
    FROM matched m LEFT JOIN public."Products" p ON p."ID"=m.product_id LEFT JOIN public."ProductUnitOfMeasures" u ON u."ID"=p."ProductUnitOfMeasureID" ORDER BY m.item_index\`;
  return [{json:{action,items,query}}];`);
  input.parameters.jsCode=s;
  const output=w.nodes.find(n=>n.name==='Preparar respuesta');let o=output.parameters.jsCode;
  const a=o.indexOf("if(action==='product_catalog'){");const b=o.indexOf("if(action==='get_product'){",a);
  o=o.slice(0,a)+"if(action==='product_catalog'){const p=rows[0]?.p_result;if(!p)throw new Error('Catálogo no disponible');return [{json:{connected:true,service:'Ruben',connector:'PostgreSQL',version:'v3-r20',...p}}];}\n"+o.slice(b);
  o=o.replace("const id=Number(rows[0]?.p_product_id||rows[0]?.product_id||0);", "const id=Number(rows[0]?.p_result?.id||rows[0]?.p_product_id||rows[0]?.product_id||0);");
  o=o.replace("if(req.mode==='get_product'){", "if(req.mode==='get_product'||req.mode==='update_cost'){");
  o=o.replace("mode:'get_product',product_id:Number(req.product_id||0)", "mode:req.mode,product_id:Number(req.product_id||0)");
  o=o.replace("match_count:Number(r.match_count||0)", "match_count:Number(r.match_count||0),uom_id:r.uom_id==null?null:Number(r.uom_id),uom_name:String(r.uom_name||''),purchase_taxes:Array.isArray(r.purchase_taxes)?r.purchase_taxes:[]");
  o=o.replace(/version:'v3-[^']+'/g,"version:'v3-r20'");
  if(w.name)w.name='RUBEN | Conector PostgreSQL | '+(/TESINTG/.test(w.name)?'TESINTG':'Cavallero')+' R20';
  output.parameters.jsCode=o;return w;
}
if(typeof module!=='undefined')module.exports={patch};
