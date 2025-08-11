@echo off
echo 🔄 Switching to Local Access Configuration...
echo.

echo 📋 Stopping external containers...
docker-compose -f docker-compose.external.yml down

echo.
echo 🚀 Starting containers with local access...
docker-compose --profile dev up -d

echo.
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

echo.
echo 📊 Checking container status...
docker ps

echo.
echo 🏠 Local Access URLs:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo    Health:   http://localhost:3001/health
echo.
echo ✅ Local access configuration activated!
echo.
echo 💡 To switch to external access, run: scripts\switch-to-external.bat
pause
