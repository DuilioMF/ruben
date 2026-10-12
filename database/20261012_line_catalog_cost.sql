-- Extends Ruben without changing existing product procedure signatures.
CREATE OR REPLACE PROCEDURE public.sp_ruben_catalogo_producto(INOUT p_result jsonb DEFAULT NULL)
LANGUAGE plpgsql AS $$
BEGIN
  SELECT jsonb_build_object(
    'categories',COALESCE((SELECT jsonb_agg(jsonb_build_object('id',"ID",'name',"Name") ORDER BY "Name") FROM public."ProductCategories"),'[]'::jsonb),
    'uoms',COALESCE((SELECT jsonb_agg(jsonb_build_object('id',"ID",'name',"Name") ORDER BY "Name") FROM public."ProductUnitOfMeasures" WHERE "Active" IS NOT FALSE),'[]'::jsonb),
    'taxes',COALESCE((SELECT jsonb_agg(jsonb_build_object('id',"ID",'name',"Name",'amount',"Amount",'scope',"Scope",'calculation_type',"CalculationType",'active',"Active") ORDER BY "Name") FROM public."Taxes" WHERE "Active" IS NOT FALSE AND "Scope" IN (1,2)),'[]'::jsonb)
  ) INTO p_result;
END;
$$;

CREATE OR REPLACE PROCEDURE public.sp_ruben_actualizar_costo(
  IN p_product_id integer, IN p_cost numeric, IN p_write_uid text,
  INOUT p_result jsonb DEFAULT NULL)
LANGUAGE plpgsql AS $$
DECLARE v_unit numeric;
BEGIN
  IF p_cost IS NULL OR p_cost<0 THEN RAISE EXCEPTION 'Costo inválido'; END IF;
  SELECT "UnitPrice" INTO v_unit FROM public."Products" WHERE "ID"=p_product_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Producto % no encontrado',p_product_id; END IF;
  UPDATE public."Products" SET "StandardPrice"=p_cost,
    "Margin"=CASE WHEN v_unit>0 THEN round((v_unit-p_cost)/v_unit*100,2) ELSE 0 END,
    "WriteDate"=now(),"WriteUID"=COALESCE(NULLIF(btrim(p_write_uid),''),'Ruben')
  WHERE "ID"=p_product_id;
  CALL public.sp_ruben_obtener_producto(p_product_id,p_result);
END;
$$;

CREATE OR REPLACE PROCEDURE public.sp_ruben_guardar_producto_con_impuestos(
  IN p_id integer, IN p_name text, IN p_sale_ok boolean, IN p_purchase_ok boolean,
  IN p_can_be_expensed boolean, IN p_active boolean, IN p_list_price numeric,
  IN p_standard_price numeric, IN p_unit_price numeric, IN p_margin numeric,
  IN p_type integer, IN p_category_id integer, IN p_uom_id integer,
  IN p_uid text, IN p_sale_tax_ids integer[], IN p_purchase_tax_ids integer[],
  INOUT p_result jsonb DEFAULT NULL)
LANGUAGE plpgsql AS $$
DECLARE v_id integer:=p_id; v_updated boolean; v_unit numeric:=p_unit_price;
  v_margin numeric:=p_margin; v_pct numeric; v_fixed numeric;
BEGIN
  IF p_id IS NOT NULL THEN
    PERFORM 1 FROM public."Products" WHERE "ID"=p_id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Producto % no encontrado',p_id; END IF;
  END IF;
  IF EXISTS(SELECT 1 FROM unnest(p_sale_tax_ids) x WHERE NOT EXISTS(SELECT 1 FROM public."Taxes" t WHERE t."ID"=x AND t."Scope"=1)) THEN
    RAISE EXCEPTION 'Impuesto de venta inválido';
  END IF;
  IF EXISTS(SELECT 1 FROM unnest(p_purchase_tax_ids) x WHERE NOT EXISTS(SELECT 1 FROM public."Taxes" t WHERE t."ID"=x AND t."Scope"=2)) THEN
    RAISE EXCEPTION 'Impuesto de compra inválido';
  END IF;
  IF p_sale_tax_ids IS NOT NULL THEN
    SELECT COALESCE(sum("Amount") FILTER(WHERE "CalculationType"=1),0),
           COALESCE(sum("Amount") FILTER(WHERE "CalculationType"=2),0)
    INTO v_pct,v_fixed FROM public."Taxes" WHERE "ID"=ANY(p_sale_tax_ids);
    v_unit:=round((p_list_price-v_fixed)/(1+v_pct/100),4);
    v_margin:=CASE WHEN v_unit>0 THEN round((v_unit-p_standard_price)/v_unit*100,2) ELSE 0 END;
  END IF;
  IF p_id IS NULL THEN
    CALL public.sp_ruben_crear_producto(p_name,p_sale_ok,p_purchase_ok,p_can_be_expensed,p_active,
      p_list_price,p_standard_price,v_unit,v_margin,p_type,p_category_id,p_uom_id,p_uid,v_id);
  ELSE
    CALL public.sp_ruben_actualizar_producto(v_id,p_name,p_sale_ok,p_purchase_ok,p_can_be_expensed,p_active,
      p_list_price,p_standard_price,v_unit,v_margin,p_type,p_category_id,p_uom_id,p_uid,v_updated);
  END IF;
  IF p_sale_tax_ids IS NOT NULL THEN
    DELETE FROM public."ProductTaxes" WHERE "ProductID"=v_id;
    INSERT INTO public."ProductTaxes"("ProductID","TaxID") SELECT v_id,x FROM (SELECT DISTINCT unnest(p_sale_tax_ids) x) ids;
  END IF;
  IF p_purchase_tax_ids IS NOT NULL THEN
    DELETE FROM public."ProductPurchaseTax" WHERE "ProductID"=v_id;
    INSERT INTO public."ProductPurchaseTax"("ProductID","TaxID") SELECT v_id,x FROM (SELECT DISTINCT unnest(p_purchase_tax_ids) x) ids;
  END IF;
  CALL public.sp_ruben_obtener_producto(v_id,p_result);
END;
$$;
