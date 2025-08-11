// Alternative HTTP backend configuration for development
// Last updated: 2025-08-11T12:28:50.283Z
// IP: 46.116.134.216

export const BACKEND_CONFIG = {
  API_BASE_URL: 'http://46.116.134.216:8080',
  WS_URL: 'ws://46.116.134.216:8080',
  HEALTH_CHECK_URL: 'http://46.116.134.216:8080/health',
  
  // Connection settings
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  
  // Feature flags
  ENABLE_WEBSOCKETS: true,
  ENABLE_REAL_TIME_UPDATES: true,
  
  // Security
  ALLOW_INSECURE_CONNECTIONS: true, // Allow HTTP for development
  VALIDATE_SSL: false // No SSL validation needed for HTTP
};

export default BACKEND_CONFIG;
