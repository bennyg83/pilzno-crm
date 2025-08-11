@echo off
echo 🔄 Switching to External Access Configuration...
echo.

echo 📋 Stopping current containers...
docker-compose down

echo.
echo 🚀 Starting containers with external access...
docker-compose -f docker-compose.external.yml up -d

echo.
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

echo.
echo 📊 Checking container status...
docker ps

echo.
echo 🌐 External Access URLs:
echo    Frontend: http://89.138.168.239:3000
echo    Backend:  http://89.138.168.239:3001
echo    Health:   http://89.138.168.239:3001/health
echo.
echo ✅ External access configuration activated!
echo.
echo 💡 To switch back to local access, run: scripts\switch-to-local.bat
pause
