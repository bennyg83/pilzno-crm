@echo off
echo 🚀 Pilzno CRM GitHub Pages - Quick Start
echo =========================================

echo.
echo This script will get you started with GitHub Pages deployment.
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

REM Run the main setup script
echo Running main setup script...
call scripts\setup-github-pages.bat

echo.
echo 🎯 NEXT STEPS:
echo ===============
echo.
echo 1. Get your GitHub Personal Access Token:
echo    - Go to: https://github.com/settings/tokens
echo    - Click "Generate new token (classic)"
echo    - Select: repo, workflow permissions
echo    - Copy the token
echo.
echo 2. Edit scripts\.env and add your PAT token
echo.
echo 3. Make your repository public:
echo    - Go to: https://github.com/bennyg83/pilzno-crm
echo    - Settings > General > Danger Zone
echo    - Change repository visibility to Public
echo.
echo 4. Add GitHub Actions workflow:
echo    - Create .github/workflows/deploy-pages.yml
echo    - Copy content from docs/GITHUB_PAGES_DEPLOYMENT.md
echo.
echo 5. Configure GitHub Pages:
echo    - Settings > Pages
echo    - Source: Deploy from a branch
echo    - Branch: main
echo    - Folder: / (root)
echo.
echo 6. Push your changes:
echo    git add .
echo    git commit -m "Configure GitHub Pages"
echo    git push origin main
echo.
echo 7. Start IP monitor:
echo    cd scripts
echo    npm start
echo.
echo Your site will be available at: https://bennyg83.github.io/pilzno-crm/
echo.
pause
