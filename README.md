# Ruben

[![Ver Ruben en GitHub](https://img.shields.io/badge/▶%20VER-RUBEN-54bfc3?style=for-the-badge)](https://github.com/DuilioMF/ruben)
[![Volver a DoingLio](https://img.shields.io/badge/←%20VOLVER-DOINGLIO-111111?style=for-the-badge)](https://doinglio.revalsoftia.chatgpt.site/)
[![Capitán Rodolfo](https://img.shields.io/badge/🧠%20ABRIR-CAPITÁN%20RODOLFO-c8793f?style=for-the-badge)](https://duiliomf.github.io/capitan-rodolfo/)

## Qué es

Especialista de DoingLio para siniestros. Sigue el circuito presupuesto → autorización/pedido → reparación → entrega → facturación/cobranza.

## Rol en DoingLio

- Se abre desde DoingLio.
- Vive en su repositorio independiente.
- Usa PostgreSQL mediante un conector local.
- Debe conservar el botón **← Volver a DoingLio**.

## Estado

- Repositorio: `DuilioMF/ruben`
- Rama principal: `main`
- Fuente inicial: build **001**
- GitHub Pages objetivo: `https://duiliomf.github.io/ruben/`
- GitHub Pages: pendiente de habilitación en el repositorio.

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
