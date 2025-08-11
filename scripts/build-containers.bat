@echo off
echo Building Pilzno Synagogue Management System Containers...
echo.

echo Building Backend Container...
docker compose -f docker-compose.prod.yml build pilzno-synagogue-backend
if %errorlevel% neq 0 (
    echo ERROR: Backend build failed!
    pause
    exit /b 1
)

echo.
echo Building Frontend Container...
docker compose -f docker-compose.prod.yml build pilzno-synagogue-frontend
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)

echo.
echo All containers built successfully!
echo.
echo To start the system, run:
echo docker compose -f docker-compose.prod.yml up -d
echo.
pause
