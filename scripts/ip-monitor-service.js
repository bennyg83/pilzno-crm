#!/usr/bin/env node

/**
 * IP Monitor Service for Pilzno CRM
 * 
 * This service monitors the local external IP address and automatically
 * updates the GitHub repository when changes are detected.
 * 
 * Features:
 * - IP change detection
 * - GitHub API integration
 * - Automatic updates
 * - Logging and monitoring
 * - Rate limiting protection
 */

const path = require('path');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '.env') });

const axios = require('axios');
const fs = require('fs').promises;

// Configuration
const CONFIG = {
  // IP checking services (multiple for redundancy)
  IP_SERVICES: [
    'https://api.ipify.org',
    'https://ipinfo.io/ip',
    'https://icanhazip.com'
  ],
  
  // GitHub configuration
  GITHUB: {
    OWNER: process.env.GITHUB_OWNER,
    REPO: process.env.GITHUB_REPO,
    BRANCH: process.env.GITHUB_BRANCH || 'main',
    PAT: process.env.GITHUB_PAT,
    COMMIT_MESSAGE: 'Update backend IP address',
    COMMIT_AUTHOR: {
      name: 'IP Monitor Service',
      email: 'ip-monitor@pilzno-crm.local'
    }
  },
  
  // Monitoring settings
  CHECK_INTERVAL: parseInt(process.env.IP_CHECK_INTERVAL) || 300000, // 5 minutes
  IP_FILE: path.join(__dirname, '../data/current-ip.txt'),
  LOG_FILE: path.join(__dirname, '../logs/ip-monitor.log'),
  
  // Rate limiting
  MAX_UPDATE_FREQUENCY: 600000, // 10 minutes between updates
  LAST_UPDATE_FILE: path.join(__dirname, '../data/last-update.txt')
};

class IPMonitorService {
  constructor() {
    this.currentIP = null;
    this.lastUpdateTime = 0;
    this.isRunning = false;
    this.updateQueue = [];
  }

  /**
   * Initialize the service
   */
  async init() {
    try {
      await this.ensureDirectories();
      await this.loadCurrentIP();
      await this.loadLastUpdateTime();
      
      console.log('IP Monitor Service initialized');
      console.log(`Current IP: ${this.currentIP || 'Unknown'}`);
      console.log(`Check interval: ${CONFIG.CHECK_INTERVAL / 1000} seconds`);
      
    } catch (error) {
      console.error('Failed to initialize IP Monitor Service:', error);
      throw error;
    }
  }

  /**
   * Ensure required directories exist
   */
  async ensureDirectories() {
    const dirs = [
      path.dirname(CONFIG.IP_FILE),
      path.dirname(CONFIG.LOG_FILE),
      path.dirname(CONFIG.LAST_UPDATE_FILE)
    ];

    for (const dir of dirs) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
      }
    }
  }

  /**
   * Load current IP from file
   */
  async loadCurrentIP() {
    try {
      const data = await fs.readFile(CONFIG.IP_FILE, 'utf8');
      this.currentIP = data.trim();
    } catch (error) {
      console.log('No previous IP found, will detect on first check');
    }
  }

  /**
   * Load last update time from file
   */
  async loadLastUpdateTime() {
    try {
      const data = await fs.readFile(CONFIG.LAST_UPDATE_FILE, 'utf8');
      this.lastUpdateTime = parseInt(data.trim());
    } catch (error) {
      console.log('No previous update time found');
    }
  }

  /**
   * Save current IP to file
   */
  async saveCurrentIP(ip) {
    try {
      await fs.writeFile(CONFIG.IP_FILE, ip);
      this.currentIP = ip;
    } catch (error) {
      console.error('Failed to save IP:', error);
    }
  }

  /**
   * Save last update time to file
   */
  async saveLastUpdateTime() {
    try {
      const now = Date.now();
      await fs.writeFile(CONFIG.LAST_UPDATE_FILE, now.toString());
      this.lastUpdateTime = now;
    } catch (error) {
      console.error('Failed to save update time:', error);
    }
  }

  /**
   * Get current external IP address
   */
  async getCurrentIP() {
    for (const service of CONFIG.IP_SERVICES) {
      try {
        const response = await axios.get(service, { timeout: 10000 });
        const ip = response.data.trim();
        
        // Validate IP format
        if (this.isValidIP(ip)) {
          return ip;
        }
      } catch (error) {
        console.warn(`Failed to get IP from ${service}:`, error.message);
      }
    }
    
    throw new Error('All IP services failed');
  }

  /**
   * Validate IP address format
   */
  isValidIP(ip) {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    if (ipv4Regex.test(ip)) {
      const parts = ip.split('.');
      return parts.every(part => parseInt(part) >= 0 && parseInt(part) <= 255);
    }
    
    return ipv6Regex.test(ip);
  }

  /**
   * Check if IP has changed
   */
  async checkIPChange() {
    try {
      const newIP = await this.getCurrentIP();
      
      if (newIP !== this.currentIP) {
        console.log(`IP change detected: ${this.currentIP} → ${newIP}`);
        
        // Check if enough time has passed since last update
        const timeSinceLastUpdate = Date.now() - this.lastUpdateTime;
        if (timeSinceLastUpdate < CONFIG.MAX_UPDATE_FREQUENCY) {
          console.log(`Skipping update - too soon since last update (${Math.round(timeSinceLastUpdate / 1000)}s ago)`);
          return false;
        }
        
        // Queue the update
        this.updateQueue.push(newIP);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to check IP change:', error);
      return false;
    }
  }

  /**
   * Update GitHub repository with new IP
   */
  async updateGitHub(newIP) {
    try {
      console.log(`Updating GitHub with new IP: ${newIP}`);
      
      // Create GitHub API client
      const github = axios.create({
        baseURL: 'https://api.github.com',
        headers: {
          'Authorization': `token ${CONFIG.GITHUB.PAT}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Pilzno-CRM-IP-Monitor'
        }
      });

      // Get current file content
      const filePath = 'frontend/src/config/backend-config.js';
      let currentContent = '';
      let currentSha = null;
      
      try {
        const fileResponse = await github.get(
          `/repos/${CONFIG.GITHUB.OWNER}/${CONFIG.GITHUB.REPO}/contents/${filePath}`,
          { params: { ref: CONFIG.GITHUB.BRANCH } }
        );
        currentContent = Buffer.from(fileResponse.data.content, 'base64').toString();
        currentSha = fileResponse.data.sha;
      } catch (error) {
        if (error.response?.status !== 404) {
          throw error;
        }
        // File doesn't exist, we'll create it
      }

      // Create new content
      const newContent = this.generateBackendConfig(newIP);
      
      // Update file on GitHub
      const updateResponse = await github.put(
        `/repos/${CONFIG.GITHUB.OWNER}/${CONFIG.GITHUB.REPO}/contents/${filePath}`,
        {
          message: `${CONFIG.GITHUB.COMMIT_MESSAGE}: ${newIP}`,
          content: Buffer.from(newContent).toString('base64'),
          sha: currentSha,
          branch: CONFIG.GITHUB.BRANCH,
          author: CONFIG.GITHUB.COMMIT_AUTHOR
        }
      );

      console.log('GitHub update successful:', updateResponse.data.commit.sha);
      await this.saveCurrentIP(newIP);
      await this.saveLastUpdateTime();
      
      return true;
    } catch (error) {
      console.error('Failed to update GitHub:', error);
      if (error.response) {
        console.error('GitHub API response:', error.response.data);
      }
      return false;
    }
  }

  /**
   * Generate backend configuration file content
   */
  generateBackendConfig(ip) {
    return `// Auto-generated backend configuration
// Last updated: ${new Date().toISOString()}
// IP: ${ip}

export const BACKEND_CONFIG = {
  API_BASE_URL: 'http://${ip}:3000',
  WS_URL: 'ws://${ip}:3000',
  HEALTH_CHECK_URL: 'http://${ip}:3000/health',
  
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
`;
  }

  /**
   * Log message to file
   */
  async log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    
    try {
      await fs.appendFile(CONFIG.LOG_FILE, logEntry);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
    
    console.log(message);
  }

  /**
   * Process update queue
   */
  async processUpdateQueue() {
    if (this.updateQueue.length === 0) return;
    
    const newIP = this.updateQueue.shift();
    const success = await this.updateGitHub(newIP);
    
    if (success) {
      await this.log(`Successfully updated GitHub with new IP: ${newIP}`);
    } else {
      await this.log(`Failed to update GitHub with new IP: ${newIP}`);
      // Re-queue for retry (with exponential backoff)
      setTimeout(() => {
        this.updateQueue.unshift(newIP);
      }, 60000); // 1 minute delay
    }
  }

  /**
   * Start the monitoring service
   */
  async start() {
    if (this.isRunning) {
      console.log('Service is already running');
      return;
    }

    this.isRunning = true;
    await this.log('IP Monitor Service started');

    // Initial check
    await this.checkIPChange();
    await this.processUpdateQueue();

    // Set up periodic checking
    this.checkInterval = setInterval(async () => {
      try {
        const hasChange = await this.checkIPChange();
        if (hasChange) {
          await this.processUpdateQueue();
        }
      } catch (error) {
        await this.log(`Error in periodic check: ${error.message}`);
      }
    }, CONFIG.CHECK_INTERVAL);

    // Set up queue processing
    this.queueInterval = setInterval(async () => {
      await this.processUpdateQueue();
    }, 30000); // Process queue every 30 seconds
  }

  /**
   * Stop the monitoring service
   */
  async stop() {
    if (!this.isRunning) {
      console.log('Service is not running');
      return;
    }

    this.isRunning = false;
    
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    
    if (this.queueInterval) {
      clearInterval(this.queueInterval);
    }

    await this.log('IP Monitor Service stopped');
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      currentIP: this.currentIP,
      lastUpdateTime: this.lastUpdateTime,
      queueLength: this.updateQueue.length,
      nextCheckIn: this.isRunning ? CONFIG.CHECK_INTERVAL - (Date.now() % CONFIG.CHECK_INTERVAL) : 0
    };
  }
}

// CLI interface
if (require.main === module) {
  const service = new IPMonitorService();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    await service.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\nShutting down gracefully...');
    await service.stop();
    process.exit(0);
  });

  // Start the service
  service.init()
    .then(() => service.start())
    .catch(error => {
      console.error('Failed to start service:', error);
      process.exit(1);
    });
}

module.exports = IPMonitorService;
