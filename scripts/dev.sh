#!/bin/bash

# Pilzno Synagogue Management System - Development Environment Script
# Usage: ./scripts/dev.sh [start|stop|restart|logs|status]

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
    echo -e "${GREEN}[DEV]${NC} $1"
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

# Function to start development environment
start_dev() {
    log "Starting Pilzno Synagogue Management System development environment..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    # Start the development environment
    docker-compose --profile dev up -d
    
    log "Development environment started successfully!"
    info "Frontend: http://localhost:3000"
    info "Backend API: http://localhost:3001"
    info "Database: localhost:5433"
    info ""
    info "Use 'docker-compose --profile dev logs -f' to view logs"
    info "Use './scripts/dev.sh logs' for a simplified logs view"
}

# Function to stop development environment
stop_dev() {
    log "Stopping Pilzno Synagogue Management System development environment..."
    docker-compose --profile dev down
    log "Development environment stopped!"
}

# Function to restart development environment
restart_dev() {
    log "Restarting development environment..."
    stop_dev
    sleep 2
    start_dev
}

# Function to show logs
show_logs() {
    log "Showing development environment logs..."
    info "Press Ctrl+C to exit logs view"
    sleep 2
    docker-compose --profile dev logs -f
}

# Function to show status
show_status() {
    log "Development environment status:"
    echo
    docker-compose --profile dev ps
    echo
    
    # Health check
    info "Health check results:"
    
    # Check database
    if docker-compose --profile dev exec -T pilzno-synagogue-db pg_isready -U synagogue_admin -d pilzno_synagogue > /dev/null 2>&1; then
        echo -e "  Database: ${GREEN}✓ Healthy${NC}"
    else
        echo -e "  Database: ${RED}✗ Unhealthy${NC}"
    fi
    
    # Check backend
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        echo -e "  Backend:  ${GREEN}✓ Healthy${NC}"
    else
        echo -e "  Backend:  ${RED}✗ Unhealthy${NC}"
    fi
    
    # Check frontend
    if curl -s http://localhost:3000/health > /dev/null 2>&1; then
        echo -e "  Frontend: ${GREEN}✓ Healthy${NC}"
    else
        echo -e "  Frontend: ${RED}✗ Unhealthy${NC}"
    fi
}

# Function to show help
show_help() {
    echo "Pilzno Synagogue Management System - Development Script"
    echo
    echo "Usage: $0 [command]"
    echo
    echo "Commands:"
    echo "  start    Start the development environment (default)"
    echo "  stop     Stop the development environment"
    echo "  restart  Restart the development environment"
    echo "  logs     Show and follow logs from all services"
    echo "  status   Show the status of all services"
    echo "  help     Show this help message"
    echo
    echo "Examples:"
    echo "  $0 start    # Start development environment"
    echo "  $0 logs     # View logs"
    echo "  $0 status   # Check service health"
}

# Main script logic
case "${1:-start}" in
    start)
        start_dev
        ;;
    stop)
        stop_dev
        ;;
    restart)
        restart_dev
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
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