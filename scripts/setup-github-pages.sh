#!/bin/bash

# GitHub Pages Migration Setup Script for Pilzno CRM
# This script automates the setup process for migrating to GitHub Pages

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

echo -e "${BLUE}🚀 Pilzno CRM GitHub Pages Migration Setup${NC}"
echo "=================================================="

# Check prerequisites
check_prerequisites() {
    echo -e "\n${YELLOW}Checking prerequisites...${NC}"
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed. Please install Node.js 16+ first.${NC}"
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        echo -e "${RED}❌ Node.js version 16+ is required. Current version: $(node -v)${NC}"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
        exit 1
    fi
    
    # Check if git is installed
    if ! command -v git &> /dev/null; then
        echo -e "${RED}❌ Git is not installed. Please install Git first.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All prerequisites met${NC}"
}

# Install IP monitor dependencies
install_ip_monitor() {
    echo -e "\n${YELLOW}Installing IP monitor dependencies...${NC}"
    
    cd "$SCRIPT_DIR"
    
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ package.json not found in scripts directory${NC}"
        exit 1
    fi
    
    npm install
    echo -e "${GREEN}✅ IP monitor dependencies installed${NC}"
}

# Create environment file
setup_environment() {
    echo -e "\n${YELLOW}Setting up environment configuration...${NC}"
    
    ENV_FILE="$SCRIPT_DIR/.env"
    TEMPLATE_FILE="$SCRIPT_DIR/environment-template.env"
    
    if [ ! -f "$TEMPLATE_FILE" ]; then
        echo -e "${RED}❌ Environment template not found${NC}"
        exit 1
    fi
    
    if [ -f "$ENV_FILE" ]; then
        echo -e "${YELLOW}⚠️  .env file already exists. Backing up...${NC}"
        cp "$ENV_FILE" "$ENV_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    fi
    
    cp "$TEMPLATE_FILE" "$ENV_FILE"
    
    echo -e "${GREEN}✅ Environment file created: $ENV_FILE${NC}"
    echo -e "${YELLOW}⚠️  Please edit $ENV_FILE with your GitHub credentials${NC}"
}

# Create required directories
create_directories() {
    echo -e "\n${YELLOW}Creating required directories...${NC}"
    
    mkdir -p "$PROJECT_ROOT/data"
    mkdir -p "$PROJECT_ROOT/logs"
    
    echo -e "${GREEN}✅ Directories created${NC}"
}

# Setup frontend for GitHub Pages
setup_frontend() {
    echo -e "\n${YELLOW}Setting up frontend for GitHub Pages...${NC}"
    
    if [ ! -d "$FRONTEND_DIR" ]; then
        echo -e "${RED}❌ Frontend directory not found: $FRONTEND_DIR${NC}"
        exit 1
    fi
    
    cd "$FRONTEND_DIR"
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ Frontend package.json not found${NC}"
        exit 1
    fi
    
    # Add GitHub Pages build script
    if ! grep -q "build:pages" package.json; then
        echo -e "${YELLOW}Adding GitHub Pages build script...${NC}"
        
        # Create a temporary file with the new script
        cat > temp_package.json << EOF
{
  "scripts": {
    "build:pages": "vite build --base=/pilzno-crm-frontend/",
    "preview:pages": "vite preview --port 4173"
  }
}
EOF
        
        # Merge with existing package.json (simplified approach)
        echo -e "${YELLOW}⚠️  Please manually add the following script to your frontend package.json:${NC}"
        echo -e "${BLUE}  \"build:pages\": \"vite build --base=/pilzno-crm-frontend/\"${NC}"
    fi
    
    echo -e "${GREEN}✅ Frontend setup complete${NC}"
}

# Create deployment instructions
create_deployment_instructions() {
    echo -e "\n${YELLOW}Creating deployment instructions...${NC}"
    
    INSTRUCTIONS_FILE="$PROJECT_ROOT/docs/GITHUB_PAGES_DEPLOYMENT.md"
    
    cat > "$INSTRUCTIONS_FILE" << 'EOF'
# GitHub Pages Deployment Instructions

## Prerequisites
- GitHub account with a Personal Access Token (PAT)
- Node.js 16+ installed
- Git installed

## Step 1: Create GitHub Repository
1. Go to GitHub and create a new repository named `pilzno-crm-frontend`
2. Make it public (required for GitHub Pages)
3. Clone it to your local machine

## Step 2: Configure Environment
1. Copy `scripts/environment-template.env` to `scripts/.env`
2. Edit `scripts/.env` with your GitHub credentials:
   - `GITHUB_OWNER`: Your GitHub username
   - `GITHUB_REPO`: `pilzno-crm-frontend`
   - `GITHUB_PAT`: Your Personal Access Token

## Step 3: Extract Frontend
1. Copy the `frontend` directory to your new repository
2. Update the repository's package.json with:
   ```json
   "scripts": {
     "build:pages": "vite build --base=/pilzno-crm-frontend/"
   }
   ```

## Step 4: Configure GitHub Pages
1. Go to repository Settings > Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: / (root)
5. Save

## Step 5: Deploy
1. Push your code to GitHub
2. GitHub Actions will automatically build and deploy
3. Your site will be available at: `https://yourusername.github.io/pilzno-crm-frontend/`

## Step 6: Start IP Monitor
1. Run: `cd scripts && npm start`
2. The service will automatically update the frontend when your IP changes

## Troubleshooting
- Check GitHub Actions logs for build errors
- Verify your PAT has the correct permissions
- Ensure the repository is public
- Check the IP monitor logs in `logs/ip-monitor.log`
EOF
    
    echo -e "${GREEN}✅ Deployment instructions created: $INSTRUCTIONS_FILE${NC}"
}

# Test IP monitor service
test_ip_monitor() {
    echo -e "\n${YELLOW}Testing IP monitor service...${NC}"
    
    cd "$SCRIPT_DIR"
    
    # Check if .env is configured
    if [ ! -f ".env" ]; then
        echo -e "${RED}❌ .env file not found. Please configure it first.${NC}"
        return 1
    fi
    
    # Test IP detection
    echo -e "${BLUE}Testing IP detection...${NC}"
    node -e "
    const axios = require('axios');
    (async () => {
        try {
            const response = await axios.get('https://api.ipify.org');
            console.log('✅ Current IP:', response.data);
        } catch (error) {
            console.log('❌ IP detection failed:', error.message);
        }
    })();
    "
    
    echo -e "${GREEN}✅ IP monitor test complete${NC}"
}

# Main setup function
main() {
    echo -e "${BLUE}Starting setup process...${NC}"
    
    check_prerequisites
    install_ip_monitor
    setup_environment
    create_directories
    setup_frontend
    create_deployment_instructions
    test_ip_monitor
    
    echo -e "\n${GREEN}🎉 Setup complete!${NC}"
    echo -e "\n${YELLOW}Next steps:${NC}"
    echo -e "1. Edit $SCRIPT_DIR/.env with your GitHub credentials"
    echo -e "2. Create the GitHub repository: pilzno-crm-frontend"
    echo -e "3. Follow the deployment instructions in docs/GITHUB_PAGES_DEPLOYMENT.md"
    echo -e "4. Start the IP monitor: cd scripts && npm start"
    
    echo -e "\n${BLUE}For help, see: docs/GITHUB_PAGES_DEPLOYMENT.md${NC}"
}

# Run main function
main "$@"
