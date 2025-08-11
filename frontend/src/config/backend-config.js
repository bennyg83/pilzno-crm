// Auto-generated backend configuration
// Last updated: 2025-08-11T12:28:50.852Z
// IP: 46.116.134.216

export const BACKEND_CONFIG = {
  API_BASE_URL: 'http://46.116.134.216:3000',
  WS_URL: 'ws://46.116.134.216:3000',
  HEALTH_CHECK_URL: 'http://46.116.134.216:3000/health',
  
  // Connection settings
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  
  // Feature flags
  ENABLE_WEBSOCKETS: true,
  ENABLE_REAL_TIME_UPDATES: true,
  
  // Security
  ALLOW_INSECURE_CONNECTIONS: true, // Only for local development
  VALIDATE_SSL: false // Only for local development
};

export default BACKEND_CONFIG;
