@echo off
echo Creating test users for Pilzno Synagogue CRM...
echo.

echo Running SQL script to create users...
docker exec pilzno-synagogue-db-simple psql -U synagogue_admin -d pilzno_synagogue -f /tmp/create-users.sql

echo.
echo Users created successfully!
echo.
echo Test Login Credentials:
echo =======================
echo Admin:    admin@pilzno.org / admin123
echo Test:     test@pilzno.org / test123  
echo Staff:    staff@pilzno.org / staff123
echo Rabbi:    rabbi@pilzno.org / rabbi123
echo.
echo These users will persist across container restarts.
pause
