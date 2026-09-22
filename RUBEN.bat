@echo off
setlocal EnableExtensions
title Ruben - PostgreSQL local

set "APPROOT=C:\Sistemas\Ruben"
set "LOCALPY=%APPROOT%\ruben_local.py"
set "LOG=%APPROOT%\install.log"
set "REMOTE=https://raw.githubusercontent.com/DuilioMF/ruben/main/bridge/ruben_local.py"
set "HEALTH=http://127.0.0.1:8788/health"
set "WEB=https://duiliomf.github.io/ruben/conexion-postgres.html"

rem Crear carpeta local. Si Windows bloquea C:\Sistemas, pedir elevacion UAC.
if not exist "C:\Sistemas" mkdir "C:\Sistemas" >nul 2>nul
if not exist "%APPROOT%" mkdir "%APPROOT%" >nul 2>nul
if not exist "%APPROOT%" (
  echo Se necesitan permisos para crear %APPROOT%.
  echo Windows va a pedir autorizacion...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)

> "%LOG%" echo [%date% %time%] Inicio instalacion Ruben
>>"%LOG%" echo Carpeta local: %APPROOT%

echo.
echo ============================================================
echo                  RUBEN - POSTGRESQL
echo ============================================================
echo.
echo Carpeta local: %APPROOT%
echo Log: %LOG%
echo.

echo [1/5] Buscando Python...
set "PY="
where py >nul 2>nul
if not errorlevel 1 set "PY=py"
if not defined PY (
  where python >nul 2>nul
  if not errorlevel 1 set "PY=python"
)
if not defined PY goto :nopython
for /f "delims=" %%V in ('%PY% --version 2^>^&1') do (
  echo Python: %%V
  >>"%LOG%" echo Python: %%V
)

echo [2/5] Verificando pip...
%PY% -m pip --version >>"%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: pip no esta disponible.
  >>"%LOG%" echo ERROR: pip no esta disponible
  goto :fatal
)

echo [3/5] Instalando driver PostgreSQL...
%PY% -c "import psycopg" >nul 2>nul
if errorlevel 1 (
  %PY% -m pip install --disable-pip-version-check "psycopg[binary]" >>"%LOG%" 2>&1
  if errorlevel 1 goto :fatal
)
%PY% -c "import psycopg; print('psycopg', psycopg.__version__)" >>"%LOG%" 2>&1

echo [4/5] Descargando conector Ruben...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; Invoke-WebRequest -UseBasicParsing '%REMOTE%' -OutFile '%LOCALPY%'; if((Get-Item '%LOCALPY%').Length -lt 1000){throw 'Archivo descargado incompleto'}" >>"%LOG%" 2>&1
if errorlevel 1 (
  echo PowerShell fallo; probando curl...
  curl.exe -L --fail --silent --show-error "%REMOTE%" -o "%LOCALPY%" >>"%LOG%" 2>&1
  if errorlevel 1 goto :fatal
)

if not exist "%LOCALPY%" goto :fatal
for %%A in ("%LOCALPY%") do if %%~zA LSS 1000 goto :fatal

echo Cerrando conector anterior si existe...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":8788 .*LISTENING"') do taskkill /PID %%P /F >nul 2>nul

echo [5/5] Iniciando Ruben local...
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
  >>"%LOG%" echo [%date% %time%] Ruben OK en 127.0.0.1:8788
  echo.
  echo ============================================================
  echo  RUBEN INSTALADO CORRECTAMENTE
  echo  %APPROOT%
  echo  Servicio: http://127.0.0.1:8788
  echo ============================================================
  echo.
  start "" "%WEB%"
  timeout /t 3 >nul
  exit /b 0
)

>>"%LOG%" echo [%date% %time%] ERROR: health 8788 no respondio
goto :fatal

:nopython
echo ERROR: No encuentro Python.
>>"%LOG%" echo ERROR: Python no encontrado en PATH
echo Instala Python y marca "Add Python to PATH".
pause
exit /b 1

:fatal
echo.
echo ============================================================
echo  NO SE PUDO INSTALAR / INICIAR RUBEN
echo  Log: %LOG%
echo ============================================================
echo.
if exist "%LOG%" type "%LOG%"
pause
exit /b 1
