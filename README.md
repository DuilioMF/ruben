# Ruben

<p align="center"><img src="brain-davinci.svg" width="86" alt="Icono cerebro Da Vinci"></p>

[![Ver Trello](https://img.shields.io/badge/VER-TRELLO-0052CC?style=for-the-badge)](https://trello.com/c/oUB73hRq)
[![Abrir Ruben](https://img.shields.io/badge/▶%20ABRIR-RUBEN-54bfc3?style=for-the-badge)](https://duiliomf.github.io/ruben/)

## Vista rápida

- Portada: `index.html`
- Conexión PostgreSQL: `conexion-postgres.html`
- Trello propio: https://trello.com/c/oUB73hRq
- Web publicada: `https://duiliomf.github.io/ruben/`.

## Qué es

Especialista de DoingLio para siniestros. Sigue el circuito presupuesto → autorización/pedido → reparación → entrega → facturación/cobranza.

## Rol en DoingLio

- Se abre desde DoingLio.
- Vive en su repositorio independiente.
- Usa PostgreSQL mediante un workflow de n8n.

## Estado

- Repositorio: `DuilioMF/ruben`
- Rama principal: `main`
- Versión web: **006**
- GitHub Pages: `https://duiliomf.github.io/ruben/`
- Estado: publicado.

## Conexión

- Motor: **PostgreSQL**
- Workflow n8n: **RUBEN | Conector PostgreSQL | v1**
- Webhook: `/webhook/ruben-conector-v1`
- La credencial PostgreSQL se administra dentro de n8n.
- La página no solicita ni guarda la contraseña de PostgreSQL.
- Prueba de conexión verificada con respuesta `connected:true`.

## Archivos principales

- `index.html`: portada de Ruben.
- `conexion-postgres.html`: estado y prueba de conexión mediante n8n.
- `theme.css` / `theme.js`: tema compartido.

## Seguridad

- No guardar credenciales PostgreSQL en GitHub.
- No exponer claves privadas ni contraseñas en HTML o JavaScript público.

## Versionado

Cada cambio debe quedar en un commit recuperable antes de publicar. Conservar rollback.
