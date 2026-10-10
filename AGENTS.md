# Reglas de trabajo — Ruben

Estas reglas son obligatorias para cualquier cambio en este repositorio.

## 1. No romper lo que ya funciona
- Un cambio nuevo no puede degradar, ocultar, achicar ni desplazar controles existentes.
- Antes de publicar, comparar el comportamiento nuevo contra el existente.
- No modificar Compras, autenticación, selección de compañía ni circuitos existentes salvo que el cambio lo requiera explícitamente.

## 2. Contrato visual del tablero
- El selector de compañía tiene prioridad de ancho y nunca debe quedar truncado por agregar acciones.
- La fecha conserva un ancho estable.
- Las acciones se agrupan en un bloque independiente; agregar botones no debe crear nuevas columnas que compriman compañía o fecha.
- "Actualizar" es una acción secundaria.
- "Cargar factura" es una acción principal.
- En anchos menores, los controles deben reacomodarse antes de comprimirse.
- No se publica una UI con texto cortado, controles superpuestos, overflow horizontal o botones desproporcionados.

## 3. Responsive obligatorio
Todo cambio visual debe conservar una disposición válida en:
- Escritorio.
- Tablet.
- Móvil.

## 4. Publicación
- No publicar directamente un cambio visual sin pasar los tests del repo.
- El deploy debe fallar si se rompe el contrato básico del layout.
- Mantener VERSION y los controles de versión existentes.

## 5. Datos
- No inventar datos.
- No convertir errores de lectura en ceros verificados.
- Preservar el origen de datos acordado para cada módulo.
