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
- Usa PostgreSQL mediante un conector local.

## Estado

- Repositorio: `DuilioMF/ruben`
- Rama principal: `main`
- Fuente inicial: build **001**
- GitHub Pages: `https://duiliomf.github.io/ruben/`
- Estado: publicado.

## Conexión

- Motor: **PostgreSQL**
- Pantalla preparada para conector local en `127.0.0.1:8788`
- La contraseña se usa sólo durante la conexión y no se guarda en GitHub.
- Falta completar y probar el bridge PostgreSQL real.

## Archivos principales

- `index.html`: portada de Ruben.
- `conexion-postgres.html`: pantalla de conexión PostgreSQL.
- `.github/workflows/pages.yml`: despliegue preparado para GitHub Pages.

## Seguridad

- No guardar credenciales PostgreSQL en GitHub.
- No exponer claves privadas ni contraseñas en HTML o JavaScript público.

## Versionado

Cada cambio debe quedar en un commit recuperable antes de publicar. Conservar rollback.
