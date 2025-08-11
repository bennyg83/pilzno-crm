@echo off
echo 🔄 Switching to Simple Nginx Proxy Configuration...
echo.

echo 📋 Stopping current containers...
docker-compose down

echo.
echo 🚀 Starting containers with Nginx proxy...
docker-compose -f docker-compose.simple.yml up -d

echo.
echo ⏳ Waiting for services to start...
timeout /t 15 /nobreak >nul

echo.
echo 📊 Checking container status...
docker ps

echo.
echo 🌐 Access URLs:
echo    Main Site: http://89.138.168.239:8080
echo    Health:   http://89.138.168.239:8080/health
echo    API:      http://89.138.168.239:8080/api/health
echo.
echo 💡 Benefits of this setup:
echo    - Single port (80) for external access
echo    - Easy to add more systems later
echo    - Better security (no direct service exposure)
echo    - Centralized logging and monitoring
echo.
echo ✅ Simple proxy configuration activated!
echo.
echo 💡 To switch back to direct access, run: scripts\switch-to-external.bat
pause
