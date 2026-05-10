@echo off
echo =====================================================
echo  Shutting down Agentic Strategic Command Center
echo =====================================================

echo Stopping server process...
:: Kill the process associated with the window title we set in startup.bat
taskkill /FI "WINDOWTITLE eq AgenticCommandCenter*" /T /F >nul 2>nul

if %errorlevel% equ 0 (
    echo Server process has been stopped.
) else (
    echo Server was not running or could not be found.
)

timeout /t 3 >nul
