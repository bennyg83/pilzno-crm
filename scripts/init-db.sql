-- Pilzno Synagogue Database Initialization
-- This script runs when the database container is first created

-- Ensure UTF8 encoding for Hebrew text support
ALTER DATABASE pilzno_synagogue SET timezone = 'America/New_York';

-- Create additional user for read-only access if needed
-- CREATE USER pilzno_readonly WITH PASSWORD 'readonly_pass';
-- GRANT CONNECT ON DATABASE pilzno_synagogue TO pilzno_readonly;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Create indexes for better performance (will be created by TypeORM migrations)
-- These are here as documentation of expected indexes

-- Create test user for development (admin@pilzno.org / pilzno2024)
-- Note: This will only work after the users table is created by TypeORM
-- The actual user creation should be handled by the backend application

-- Log the initialization
INSERT INTO pg_stat_statements_info(stats_reset) VALUES (NULL) ON CONFLICT DO NOTHING;

-- Database is ready
SELECT 'Pilzno Synagogue Database initialized successfully' AS status; 