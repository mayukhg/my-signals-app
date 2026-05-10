@echo off
echo =====================================================
echo  Starting Agentic Strategic Command Center (Windows)
echo =====================================================

:: Check if node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please download it from https://nodejs.org/
    pause
    exit /b 1
)

:: Navigate to script directory
cd /d "%~dp0"

:: Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

:: Start the server in a new window with a specific title
echo Starting Vite dev server...
start "AgenticCommandCenter" cmd /c "npm run dev"

echo Server started successfully in a new window!
echo Initializing...
timeout /t 3 >nul
echo The application is running at: http://localhost:5173/my-signals-app/
