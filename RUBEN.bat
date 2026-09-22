@echo off
setlocal EnableExtensions

set "APPROOT=C:\Sistemas\Ruben"
set "LOCALPY=%APPROOT%\ruben_local.py"
set "REMOTE=https://raw.githubusercontent.com/DuilioMF/ruben/main/bridge/ruben_local.py"
set "HEALTH=http://127.0.0.1:8788/health"
set "WEB=https://duiliomf.github.io/ruben/conexion-postgres.html"

if not exist "C:\Sistemas" mkdir "C:\Sistemas" >nul 2>nul
if not exist "%APPROOT%" mkdir "%APPROOT%" >nul 2>nul

echo.
echo ============================================================
echo                  RUBEN · POSTGRESQL
echo ============================================================
echo.
echo   Carpeta local: %APPROOT%
echo.

echo   [1/4] Buscando Python...
where py >nul 2>nul
if not errorlevel 1 (
  set "PY=py"
) else (
  where python >nul 2>nul
  if errorlevel 1 goto :nopython
  set "PY=python"
)

echo   [2/4] Instalando driver PostgreSQL si hace falta...
%PY% -m pip show psycopg >nul 2>nul
if errorlevel 1 (
  %PY% -m pip install "psycopg[binary]"
  if errorlevel 1 goto :fatal
)

echo   [3/4] Descargando conector Ruben...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { Invoke-WebRequest -UseBasicParsing '%REMOTE%' -OutFile '%LOCALPY%'; exit 0 } catch { Write-Host $_.Exception.Message; exit 1 }"
if errorlevel 1 goto :fatal

echo   Cerrando conector anterior...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":8788 .*LISTENING"') do taskkill /PID %%P /F >nul 2>nul

echo   [4/4] Iniciando Ruben local...
start "Ruben PostgreSQL Local" /min %PY% "%LOCALPY%"

set "OK=0"
for /L %%I in (1,1,20) do (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r=Invoke-RestMethod -Uri '%HEALTH%' -TimeoutSec 1; if($r.ok){exit 0}else{exit 1} } catch { exit 1 }"
  if not errorlevel 1 (
    set "OK=1"
    goto :ready
  )
  timeout /t 1 >nul
)

:ready
if "%OK%"=="1" (
  echo.
  echo   Ruben local OK en 127.0.0.1:8788
  echo   Abriendo pantalla de conexión...
  start "" "%WEB%"
  timeout /t 2 >nul
  exit /b 0
)

:fatal
echo.
echo   No se pudo iniciar Ruben.
echo   Mandame esta pantalla.
pause
exit /b 1

:nopython
echo.
echo   No encuentro Python en esta PC.
echo   Instala Python y marca "Add Python to PATH".
pause
exit /b 1
