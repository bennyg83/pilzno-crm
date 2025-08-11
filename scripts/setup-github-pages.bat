@echo off
setlocal enabledelayedexpansion

REM GitHub Pages Migration Setup Script for Pilzno CRM (Windows)
REM This script automates the setup process for migrating to GitHub Pages

echo 🚀 Pilzno CRM GitHub Pages Migration Setup
echo ==================================================

REM Configuration
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%\.."
set "FRONTEND_DIR=%PROJECT_ROOT%\frontend"

REM Check prerequisites
echo.
echo Checking prerequisites...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=2 delims=." %%i in ('node --version') do set NODE_VERSION=%%i
if %NODE_VERSION% lss 16 (
    echo ❌ Node.js version 16+ is required. Current version: 
    node --version
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

echo ✅ All prerequisites met

REM Install IP monitor dependencies
echo.
echo Installing IP monitor dependencies...
cd /d "%SCRIPT_DIR%"

if not exist "package.json" (
    echo ❌ package.json not found in scripts directory
    pause
    exit /b 1
)

npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ IP monitor dependencies installed

REM Create environment file
echo.
echo Setting up environment configuration...
set "ENV_FILE=%SCRIPT_DIR%\.env"
set "TEMPLATE_FILE=%SCRIPT_DIR%\environment-template.env"

if not exist "%TEMPLATE_FILE%" (
    echo ❌ Environment template not found
    pause
    exit /b 1
)

if exist "%ENV_FILE%" (
    echo ⚠️  .env file already exists. Backing up...
    set "TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
    set "TIMESTAMP=!TIMESTAMP: =0!"
    copy "%ENV_FILE%" "%ENV_FILE%.backup.!TIMESTAMP!" >nul
)

copy "%TEMPLATE_FILE%" "%ENV_FILE%" >nul
echo ✅ Environment file created: %ENV_FILE%
echo ⚠️  Please edit %ENV_FILE% with your GitHub credentials

REM Create required directories
echo.
echo Creating required directories...
if not exist "%PROJECT_ROOT%\data" mkdir "%PROJECT_ROOT%\data"
if not exist "%PROJECT_ROOT%\logs" mkdir "%PROJECT_ROOT%\logs"
echo ✅ Directories created

REM Setup frontend for GitHub Pages
echo.
echo Setting up frontend for GitHub Pages...
if not exist "%FRONTEND_DIR%" (
    echo ❌ Frontend directory not found: %FRONTEND_DIR%
    pause
    exit /b 1
)

cd /d "%FRONTEND_DIR%"

if not exist "package.json" (
    echo ❌ Frontend package.json not found
    pause
    exit /b 1
)

echo ⚠️  Please manually add the following script to your frontend package.json:
echo   "build:pages": "vite build --base=/pilzno-crm/"
echo ✅ Frontend setup complete

REM Create deployment instructions
echo.
echo Creating deployment instructions...
set "INSTRUCTIONS_FILE=%PROJECT_ROOT%\docs\GITHUB_PAGES_DEPLOYMENT.md"

if not exist "%PROJECT_ROOT%\docs" mkdir "%PROJECT_ROOT%\docs"

(
echo # GitHub Pages Deployment Instructions
echo.
echo ## Prerequisites
echo - GitHub account with a Personal Access Token ^(PAT^)
echo - Node.js 16+ installed
echo - Git installed
echo.
echo ## Step 1: Use Existing GitHub Repository
echo 1. Use your existing repository: `pilzno-crm`
echo 2. Ensure it is public ^(required for GitHub Pages^)
echo 3. Clone or pull the latest changes
echo.
echo ## Step 2: Configure Environment
echo 1. Copy `scripts/environment-template.env` to `scripts/.env`
echo 2. Edit `scripts/.env` with your GitHub credentials:
echo    - `GITHUB_OWNER`: Your GitHub username
echo    - `GITHUB_REPO`: `pilzno-crm`
echo    - `GITHUB_PAT`: Your Personal Access Token
echo.
echo ## Step 3: Configure Frontend
echo 1. Your `frontend` directory is already in the repository
echo 2. Update the frontend package.json with:
echo    ```json
echo    "scripts": {
echo      "build:pages": "vite build --base=/pilzno-crm/"
echo    }
echo    ```
echo.
echo ## Step 4: Configure GitHub Pages
echo 1. Go to repository Settings ^> Pages
echo 2. Source: Deploy from a branch
echo 3. Branch: main
echo 4. Folder: / ^(root^)
echo 5. Save
echo.
echo ## Step 5: Deploy
echo 1. Push your code to GitHub
echo 2. GitHub Actions will automatically build and deploy
echo 3. Your site will be available at: `https://bennyg83.github.io/pilzno-crm/`
echo.
echo ## Step 6: Start IP Monitor
echo 1. Run: `cd scripts ^&^& npm start`
echo 2. The service will automatically update the frontend when your IP changes
echo.
echo ## Troubleshooting
echo - Check GitHub Actions logs for build errors
echo - Verify your PAT has the correct permissions
echo - Ensure the repository is public
echo - Check the IP monitor logs in `logs/ip-monitor.log`
) > "%INSTRUCTIONS_FILE%"

echo ✅ Deployment instructions created: %INSTRUCTIONS_FILE%

REM Test IP monitor service
echo.
echo Testing IP monitor service...
cd /d "%SCRIPT_DIR%"

if not exist ".env" (
    echo ❌ .env file not found. Please configure it first.
    goto :end
)

echo Testing IP detection...
node -e "const axios = require('axios'); (async () => { try { const response = await axios.get('https://api.ipify.org'); console.log('✅ Current IP:', response.data); } catch (error) { console.log('❌ IP detection failed:', error.message); } })();"

echo ✅ IP monitor test complete

:end
echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Edit %SCRIPT_DIR%\.env with your GitHub credentials
echo 2. Use existing GitHub repository: pilzno-crm
echo 3. Follow the deployment instructions in docs\GITHUB_PAGES_DEPLOYMENT.md
echo 4. Start the IP monitor: cd scripts ^&^& npm start
echo.
echo For help, see: docs\GITHUB_PAGES_DEPLOYMENT.md
echo.
pause
