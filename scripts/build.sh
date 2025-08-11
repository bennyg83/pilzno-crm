#!/bin/bash

# Pilzno Synagogue Management System - Build Script
# Usage: ./scripts/build.sh [dev|prod|clean]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[BUILD]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Function to build for development
build_dev() {
    log "Building Pilzno Synagogue Management System for DEVELOPMENT..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    # Build with development profile
    docker-compose --profile dev build --parallel
    log "Development build completed successfully!"
    
    info "To start the development environment:"
    info "  docker-compose --profile dev up -d"
}

# Function to build for production
build_prod() {
    log "Building Pilzno Synagogue Management System for PRODUCTION..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    # Update docker-compose to use production targets
    sed -i.bak 's/target: development/target: production/g' docker-compose.yml
    
    # Build with production profile
    docker-compose --profile prod build --parallel --no-cache
    
    # Restore original docker-compose
    mv docker-compose.yml.bak docker-compose.yml
    
    log "Production build completed successfully!"
    
    info "To start the production environment:"
    info "  docker-compose --profile prod up -d"
}

# Function to clean up build artifacts
clean() {
    log "Cleaning up build artifacts..."
    
    # Remove containers
    docker-compose down --remove-orphans
    
    # Remove images
    docker-compose --profile dev --profile prod down --rmi all --volumes
    
    # Clean up dangling images
    docker image prune -f
    
    # Clean up volumes (careful!)
    read -p "Do you want to remove database volumes? This will delete all data! (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker volume rm $(docker volume ls -q --filter name=pilzno) 2>/dev/null || true
        warn "Database volumes removed!"
    fi
    
    log "Cleanup completed!"
}

# Function to show help
show_help() {
    echo "Pilzno Synagogue Management System - Build Script"
    echo
    echo "Usage: $0 [command]"
    echo
    echo "Commands:"
    echo "  dev     Build for development (default)"
    echo "  prod    Build for production"
    echo "  clean   Clean up build artifacts and containers"
    echo "  help    Show this help message"
    echo
    echo "Examples:"
    echo "  $0 dev     # Build development environment"
    echo "  $0 prod    # Build production environment"
    echo "  $0 clean   # Clean everything up"
}

# Main script logic
case "${1:-dev}" in
    dev)
        build_dev
        ;;
    prod)
        build_prod
        ;;
    clean)
        clean
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac 