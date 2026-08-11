@echo off
setlocal EnableExtensions DisableDelayedExpansion

if /I not "%PROCESSOR_ARCHITECTURE%"=="AMD64" goto unsupported

set "PLUGIN_ROOT=%~dp0.."
set "PAYLOAD_ROOT=%PLUGIN_ROOT%\payloads\win32-x64"
set "NODE_PATH=%PAYLOAD_ROOT%\bin\node.exe"
set "ENTRY_PATH=%PAYLOAD_ROOT%\cli\project-graph.mjs"
set "HELPER_PATH=%PAYLOAD_ROOT%\cli\project-graph-ownership-helper.exe"
set "VERSION_PATH=%PLUGIN_ROOT%\release-version"

if not exist "%NODE_PATH%" goto missing
if not exist "%ENTRY_PATH%" goto missing
if not exist "%HELPER_PATH%" goto missing
if not exist "%VERSION_PATH%" goto missing

set "EXPECTED_VERSION="
for /f "usebackq delims=" %%V in ("%VERSION_PATH%") do if not defined EXPECTED_VERSION set "EXPECTED_VERSION=%%V"
if not defined EXPECTED_VERSION goto mismatch

set "ACTUAL_VERSION="
set "VERSION_OUTPUT=%TEMP%\project-graph-version-%RANDOM%-%RANDOM%.txt"
"%NODE_PATH%" "%ENTRY_PATH%" --version >"%VERSION_OUTPUT%" 2>nul
if errorlevel 1 (
  del /q "%VERSION_OUTPUT%" >nul 2>nul
  goto mismatch
)
set /p ACTUAL_VERSION=<"%VERSION_OUTPUT%"
del /q "%VERSION_OUTPUT%" >nul 2>nul
if not "%ACTUAL_VERSION%"=="%EXPECTED_VERSION%" goto mismatch

if "%~1"=="--version" if "%~2"=="" (
  echo %ACTUAL_VERSION%
  exit /b 0
)

"%NODE_PATH%" "%ENTRY_PATH%" %*
exit /b %errorlevel%

:unsupported
>&2 echo {"code":"UNSUPPORTED_TARGET","message":"Project Graph CLI has no payload for this platform."}
exit /b 1

:missing
>&2 echo {"code":"PAYLOAD_MISSING","message":"Project Graph CLI payload is incomplete."}
exit /b 1

:mismatch
>&2 echo {"code":"VERSION_MISMATCH","message":"Project Graph CLI payload version does not match the Plugin."}
exit /b 1
