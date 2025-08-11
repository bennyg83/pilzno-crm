-- Reset admin password to a known value
-- This will update the admin@pilzno.org user's password

-- First, let's see the current password hash
SELECT email, role, "passwordHash" FROM users WHERE email = 'admin@pilzno.org';

-- Note: The password hash below is for 'password123' (you'll need to generate this properly)
-- For now, let's create a simple test password

-- Update the admin password (this is a placeholder - we need the actual hash)
-- UPDATE users SET "passwordHash" = 'new_hash_here' WHERE email = 'admin@pilzno.org';

-- Let's also check if there are any other users we can test with
SELECT email, role FROM users;
