@echo off
setlocal EnableExtensions DisableDelayedExpansion

set "PLUGIN_ROOT=%~dp0.."
set "BOOTSTRAP_PATH=%PLUGIN_ROOT%\runtime\bootstrap.mjs"

where node >nul 2>nul
if errorlevel 1 goto node_missing
if not exist "%BOOTSTRAP_PATH%" goto missing

node "%BOOTSTRAP_PATH%" %*
exit /b %errorlevel%

:node_missing
>&2 echo {"code":"NODE_RUNTIME_MISSING","message":"Project Graph CLI requires Node.js 22.13 or newer on PATH."}
exit /b 1

:missing
>&2 echo {"code":"PAYLOAD_MISSING","message":"Project Graph CLI payload is incomplete."}
exit /b 1
