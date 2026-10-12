CREATE OR REPLACE PROCEDURE public.sp_ruben_obtener_producto(IN p_product_id integer, INOUT p_result jsonb DEFAULT NULL::jsonb)
 LANGUAGE plpgsql
AS $procedure$
BEGIN
  SELECT to_jsonb(x) INTO p_result
  FROM (
    SELECT p."ID" AS id,p."Name" AS name,p."SaleOK" AS sale_ok,p."PurchaseOK" AS purchase_ok,
           p."CanBeExpensed" AS can_be_expensed,p."Active" AS active,
           p."ListPrice" AS list_price,p."StandardPrice" AS standard_price,p."UnitPrice" AS unit_price,
           p."Margin" AS margin,p."type" AS type,p."CategoryID" AS category_id,
           pc."Name" AS category_name,p."ProductUnitOfMeasureID" AS uom_id,u."Name" AS uom_name,
           p."AvailableInPos" AS available_in_pos,p."PosCategoryID" AS pos_category_id,
           p."Volume" AS volume,p."Weight" AS weight,
           p."IncomeAccountID" AS income_account_id,p."ExpenseAccountID" AS expense_account_id,
           p."CostAccountID" AS cost_account_id,p."CreateDate" AS create_date,p."CreateUID" AS create_uid,
           p."WriteDate" AS write_date,p."WriteUID" AS write_uid,
           p."Image" AS image,
           COALESCE((SELECT jsonb_agg(b."Barcode" ORDER BY b."Barcode") FROM public."ProductBarcodes" b WHERE b."ProductID"=p."ID"),'[]'::jsonb) AS barcodes,
           COALESCE((SELECT jsonb_agg(jsonb_build_object('id',t."ID",'name',t."Name") ORDER BY t."ID") FROM public."ProductProductTags" r JOIN public."ProductTags" t ON t."ID"=r."ProductTagId" WHERE r."ProductID"=p."ID"),'[]'::jsonb) AS tags,
           COALESCE((SELECT jsonb_agg(jsonb_build_object('id',t."ID",'name',t."Name",'amount',t."Amount",'calculation_type',t."CalculationType",'active',t."Active") ORDER BY t."ID") FROM public."ProductTaxes" r JOIN public."Taxes" t ON t."ID"=r."TaxID" WHERE r."ProductID"=p."ID"),'[]'::jsonb) AS sale_taxes,
           COALESCE((SELECT jsonb_agg(jsonb_build_object('id',t."ID",'name',t."Name",'amount',t."Amount",'calculation_type',t."CalculationType",'active',t."Active") ORDER BY t."ID") FROM public."ProductPurchaseTax" r JOIN public."Taxes" t ON t."ID"=r."TaxID" WHERE r."ProductID"=p."ID"),'[]'::jsonb) AS purchase_taxes
    FROM public."Products" p
    LEFT JOIN public."ProductCategories" pc ON pc."ID"=p."CategoryID"
    LEFT JOIN public."ProductUnitOfMeasures" u ON u."ID"=p."ProductUnitOfMeasureID"
    WHERE p."ID"=p_product_id
  ) x;
  IF p_result IS NULL THEN
    RAISE EXCEPTION 'Producto % no encontrado',p_product_id;
  END IF;
END;
$procedure$;
