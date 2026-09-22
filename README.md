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
- Bridge local: `127.0.0.1:8788`
- Arranque Windows: `RUBEN.bat`
- Carpeta local: `C:\\Sistemas\\Ruben`
- Driver: `psycopg[binary]`
- La contraseña se usa sólo durante la conexión y no se guarda en GitHub.
- El bridge real quedó implementado; falta probarlo contra la PostgreSQL del equipo.

## Archivos principales

- `index.html`: portada de Ruben.
- `conexion-postgres.html`: pantalla de conexión PostgreSQL.
- `RUBEN.bat`: inicia y valida el conector local.
- `bridge/ruben_local.py`: bridge PostgreSQL local.
- `.github/workflows/pages.yml`: despliegue preparado para GitHub Pages.

## Seguridad

- No guardar credenciales PostgreSQL en GitHub.
- No exponer claves privadas ni contraseñas en HTML o JavaScript público.

## Versionado

Cada cambio debe quedar en un commit recuperable antes de publicar. Conservar rollback.


## Publicación vigente — 22/09/2026

GitHub es la fuente de código y GitHub Pages publica `main`. No usar copias de Sites como origen ni destino de navegación. Cada cambio se integra por PR y conserva su commit para rollback. Tema claro/oscuro compartido entre páginas; control arriba y regreso debajo.
