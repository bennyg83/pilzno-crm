@echo off
echo Adding new user to Pilzno Synagogue CRM...
echo.

set /p email="Enter email: "
set /p firstname="Enter first name: "
set /p lastname="Enter last name: "
set /p role="Enter role (user/admin): "
set /p password="Enter password: "

echo.
echo Adding user: %email% (%firstname% %lastname%) as %role%
echo.

docker exec pilzno-synagogue-db-simple psql -U synagogue_admin -d pilzno_synagogue -c "INSERT INTO users (email, password, \"firstName\", \"lastName\", role, \"isActive\", \"createdAt\", \"updatedAt\") VALUES ('%email%', '\$2b\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '%firstname%', '%lastname%', '%role%', true, NOW(), NOW()) ON CONFLICT (email) DO NOTHING;"

echo.
echo User added successfully!
echo Note: Password hash is set to 'password' - change this in your application
pause
