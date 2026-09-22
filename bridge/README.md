# Conector local de Ruben

Este bridge escucha únicamente en \`127.0.0.1:8788\` y conecta la web pública de Ruben con PostgreSQL.

## Arranque

Usar \`RUBEN.bat\` desde la raíz del repositorio.

El BAT:
1. crea \`C:\Sistemas\Ruben\`,
2. verifica Python,
3. instala \`psycopg[binary]\` si falta,
4. descarga la versión actual de \`ruben_local.py\`,
5. inicia el servicio local,
6. valida \`/health\`,
7. abre la pantalla web de conexión.

## Seguridad

- El servicio escucha sólo en loopback.
- No se guardan contraseñas en GitHub.
- La contraseña se mantiene sólo durante el intento de conexión.
- No hay reconexión automática ni perfil PostgreSQL precargado.

