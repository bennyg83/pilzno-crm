-- Create test users for Pilzno Synagogue CRM
-- This script creates users that will persist across container restarts

-- Admin user (password: admin123)
INSERT INTO users (email, password, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt") 
VALUES ('admin@pilzno.org', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Test user (password: test123)
INSERT INTO users (email, password, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt") 
VALUES ('test@pilzno.org', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test', 'User', 'user', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Staff user (password: staff123)
INSERT INTO users (email, password, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt") 
VALUES ('staff@pilzno.org', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Staff', 'Member', 'user', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Rabbi user (password: rabbi123)
INSERT INTO users (email, password, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt") 
VALUES ('rabbi@pilzno.org', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Rabbi', 'Cohen', 'admin', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Display created users
SELECT id, email, "firstName", "lastName", role, "isActive", "createdAt" FROM users ORDER BY "createdAt";
