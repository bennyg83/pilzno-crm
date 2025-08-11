// Auto-generated backend configuration
// Last updated: 2025-08-11T12:28:50.283Z
// IP: 46.116.134.216

export const BACKEND_CONFIG = {
  API_BASE_URL: 'https://46.116.134.216:8443',
  WS_URL: 'wss://46.116.134.216:8443',
  HEALTH_CHECK_URL: 'https://46.116.134.216:8443/health',
  
  // Connection settings
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  
  // Feature flags
  ENABLE_WEBSOCKETS: true,
  ENABLE_REAL_TIME_UPDATES: true,
  
  // Security
  ALLOW_INSECURE_CONNECTIONS: false, // HTTPS required for production
  VALIDATE_SSL: true // Validate SSL certificates
};

export default BACKEND_CONFIG;
