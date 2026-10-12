# R20: unidades, impuestos, costo y margen

Fuente: `DuilioMF/revalsoft_V1`, rama `master`, leída el 12/10/2026.

- `VERP.WebAPI/Endpoints/ProductMeasureUnitEndpoints.cs`: GET `/api/productmeasureunit`, GET `/api/productmeasureunit/search` con texto y categoría.
- `VERP.Application/ProductMeasureUnits/Queries/GetAllCommand.cs`: lee ProductMeasureUnits completas. `SearchCommand.cs`: filtra por nombre/categoría, ordena por nombre y limita a 7 resultados.
- `VERP.WebAPI/Endpoints/TaxEndpoints.cs`: GET `/api/tax/search`, parámetros texto y scope. `VERP.Application/Taxes/Queries/SearchCommand.cs`: filtra scope si no es cero y nombre ILIKE.
- `eTaxScope`: ventas=1, compras=2. `eTaxCalculationType`: porcentaje=1, fijo=2.
- `ProductProfile`: unidades por ID/nombre; impuestos de ventas y compras son asociaciones distintas.
- `FetchPriceQuery` + `Financial.UnitPriceFromListPrice`: neto = (precio venta - impuestos fijos)/(1 + suma porcentajes/100), redondeado a 4 decimales. Margen = (neto-costo)/neto*100, 2 decimales; si neto no es positivo, margen=0.
- `eProductType`: consumible=1, servicio=2, producto=3.

Ruben reutiliza los SP previos. Los SP R20 agregan catálogo, actualización puntual de costo y guardado atómico de producto con sus impuestos. La grilla toma unidad/IVA asociado si el OCR no los encontró; conserva elecciones manuales y IVA 0%. Si no hay una asociación inequívoca, exige selección en vez de inventar una tasa.

Click en el código de un producto existente cambia costo, margen derivado y auditoría. No cambia nombre, precio de venta, unidad, categoría ni impuestos. Un código sin coincidencia abre el alta con el costo de P.Unit final; una coincidencia ambigua exige revisar.

Rollback: revertir interfaz y parches de funciones/workflows usando las versiones anteriores conservadas. Los SP nuevos pueden permanecer instalados sin afectar las firmas previas.
