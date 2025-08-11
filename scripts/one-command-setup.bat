@echo off
echo 🚀 Pilzno CRM - One Command Setup
echo ===================================
echo.

REM Run the complete setup
call "%~dp0complete-setup.bat"

echo.
echo 🎯 NOW RUN THESE COMMANDS IN ORDER:
echo ====================================
echo.
echo 1. Edit your PAT token in scripts\.env:
echo    GITHUB_PAT=your-actual-token-here
echo.
echo 2. Add build script to frontend/package.json:
echo    "build:pages": "vite build --base=/pilzno-crm/"
echo.
echo 3. Push to GitHub:
echo    git add .
echo    git commit -m "Configure GitHub Pages deployment"
echo    git push origin main
echo.
echo 4. Configure GitHub Pages in your repository settings
echo.
echo 5. Start IP monitor:
echo    cd scripts
echo    npm start
echo.
pause
