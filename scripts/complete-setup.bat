@echo off
setlocal enabledelayedexpansion

echo 🚀 Pilzno CRM - Complete GitHub Pages Setup
echo =============================================
echo.

REM Configuration
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%\.."
set "FRONTEND_DIR=%PROJECT_ROOT%\frontend"
set "GITHUB_REPO=https://github.com/bennyg83/pilzno-crm.git"

echo 📋 Checking current setup...
echo.

REM Check if we're in the right directory
if not exist "frontend" (
    echo ❌ Error: frontend directory not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

if not exist "scripts" (
    echo ❌ Error: scripts directory not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

echo ✅ Project structure verified
echo.

REM Check if git is initialized
if not exist ".git" (
    echo 📁 Initializing git repository...
    git init
    git remote add origin %GITHUB_REPO%
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

REM Check if we're in the right git repo
git remote -v | findstr "bennyg83/pilzno-crm" >nul
if %errorlevel% neq 0 (
    echo 🔄 Updating git remote...
    git remote set-url origin %GITHUB_REPO%
    echo ✅ Git remote updated
) else (
    echo ✅ Git remote is correct
)

echo.
echo 🔧 Setting up IP monitor dependencies...
cd /d "%SCRIPT_DIR%"
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed

echo.
echo 📝 Creating environment configuration...
set "ENV_FILE=%SCRIPT_DIR%\.env"
set "TEMPLATE_FILE=%SCRIPT_DIR%\environment-template.env"

if exist "%ENV_FILE%" (
    echo ⚠️  .env file already exists. Backing up...
    set "TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
    set "TIMESTAMP=!TIMESTAMP: =0!"
    copy "%ENV_FILE%" "%ENV_FILE%.backup.!TIMESTAMP!" >nul
)

copy "%TEMPLATE_FILE%" "%ENV_FILE%" >nul
echo ✅ Environment file created: %ENV_FILE%

echo.
echo 📁 Creating required directories...
if not exist "%PROJECT_ROOT%\data" mkdir "%PROJECT_ROOT%\data"
if not exist "%PROJECT_ROOT%\logs" mkdir "%PROJECT_ROOT%\logs"
if not exist "%PROJECT_ROOT%\.github\workflows" mkdir "%PROJECT_ROOT%\.github\workflows"
echo ✅ Directories created

echo.
echo 🔧 Configuring frontend for GitHub Pages...
cd /d "%FRONTEND_DIR%"

REM Check if build:pages script exists
findstr "build:pages" package.json >nul
if %errorlevel% neq 0 (
    echo ⚠️  Adding GitHub Pages build script to package.json...
    echo Please manually add this script to your frontend/package.json:
    echo   "build:pages": "vite build --base=/pilzno-crm/"
) else (
    echo ✅ GitHub Pages build script already exists
)

echo.
echo 📋 Creating GitHub Actions workflow...
set "WORKFLOW_FILE=%PROJECT_ROOT%\.github\workflows\deploy-pages.yml"

(
echo name: Deploy Frontend to GitHub Pages
echo.
echo on:
echo   push:
echo     branches: [ main, develop ]
echo   pull_request:
echo     branches: [ main ]
echo   workflow_dispatch:
echo.
echo permissions:
echo   contents: read
echo   pages: write
echo   id-token: write
echo.
echo concurrency:
echo   group: "pages"
echo   cancel-in-progress: false
echo.
echo jobs:
echo   build:
echo     runs-on: ubuntu-latest
echo     steps:
echo     - name: Checkout code
echo       uses: actions/checkout@v4
echo       
echo     - name: Setup Node.js
echo       uses: actions/setup-node@v4
echo       with:
echo         node-version: '18'
echo         cache: 'npm'
echo         
echo     - name: Install dependencies
echo       run: ^|
echo         cd frontend
echo         npm ci
echo         
echo     - name: Build frontend
echo       run: ^|
echo         cd frontend
echo         npm run build:pages
echo         
echo     - name: Upload build artifacts
echo       uses: actions/upload-artifact@v4
echo       with:
echo         name: frontend-build
echo         path: frontend/dist/
echo         retention-days: 1
echo.
echo   deploy:
echo     needs: build
echo     runs-on: ubuntu-latest
echo     environment:
echo       name: github-pages
echo       url: ${{{{ steps.deployment.outputs.page_url }}}}
echo       
echo     steps:
echo     - name: Checkout code
echo       uses: actions/checkout@v4
echo       
echo     - name: Download build artifacts
echo       uses: actions/download-artifact@v4
echo       with:
echo         name: frontend-build
echo         path: frontend/dist/
echo         
echo     - name: Setup Pages
echo       uses: actions/configure-pages@v4
echo       
echo     - name: Upload to GitHub Pages
echo       id: deployment
echo       uses: actions/upload-pages-artifact@v3
echo       with:
echo         path: frontend/dist/
echo         
echo     - name: Deploy to GitHub Pages
echo       id: deployment
echo       uses: actions/deploy-pages@v4
) > "%WORKFLOW_FILE%"

echo ✅ GitHub Actions workflow created

echo.
echo 📝 Creating .gitignore entries...
set "GITIGNORE_FILE=%PROJECT_ROOT%\.gitignore"

REM Check if .gitignore exists
if not exist "%GITIGNORE_FILE%" (
    echo Creating .gitignore file...
    (
echo # Environment files
echo scripts/.env
echo .env
echo .env.local
echo .env.*.local
echo.
echo # Data and logs
echo data/
echo logs/
echo.
echo # Dependencies
echo node_modules/
echo.
echo # Build outputs
echo dist/
echo build/
echo.
echo # IDE files
echo .vscode/
echo .idea/
echo *.swp
echo *.swo
echo.
echo # OS files
echo .DS_Store
echo Thumbs.db
    ) > "%GITIGNORE_FILE%"
    echo ✅ .gitignore file created
) else (
    echo ✅ .gitignore file already exists
)

echo.
echo 🔍 Testing IP detection...
cd /d "%SCRIPT_DIR%"
node -e "const axios = require('axios'); (async () => { try { const response = await axios.get('https://api.ipify.org'); console.log('✅ Current IP:', response.data); } catch (error) { console.log('❌ IP detection failed:', error.message); } })();"

echo.
echo 🎯 SETUP COMPLETE! Next Steps:
echo ================================
echo.
echo 1. ⚠️  IMPORTANT: Edit %SCRIPT_DIR%\.env with your GitHub PAT token
echo    - GITHUB_PAT=your-actual-token-here
echo.
echo 2. 🔧 Add this script to frontend/package.json:
echo    "build:pages": "vite build --base=/pilzno-crm/"
echo.
echo 3. 🚀 Push to GitHub:
echo    git add .
echo    git commit -m "Configure GitHub Pages deployment"
echo    git push origin main
echo.
echo 4. ⚙️  Configure GitHub Pages:
echo    - Go to: https://github.com/bennyg83/pilzno-crm
echo    - Settings ^> Pages
echo    - Source: Deploy from a branch
echo    - Branch: main
echo    - Folder: / ^(root^)
echo.
echo 5. 🎯 Start IP monitor:
echo    cd scripts
echo    npm start
echo.
echo Your site will be available at: https://bennyg83.github.io/pilzno-crm/
echo.
pause
