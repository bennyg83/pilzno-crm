# PowerShell script to configure Windows Firewall for external access
# Run this script as Administrator

Write-Host "🔧 Configuring Windows Firewall for External Access..." -ForegroundColor Green

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Please right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green

# Configure Firewall rules for the application
Write-Host "📡 Creating Firewall rules..." -ForegroundColor Yellow

# Frontend (Port 3000)
New-NetFirewallRule -DisplayName "Pilzno Frontend External Access" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -Profile Any -Description "Allow external access to Pilzno Synagogue Frontend"

# Backend (Port 3001) 
New-NetFirewallRule -DisplayName "Pilzno Backend External Access" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow -Profile Any -Description "Allow external access to Pilzno Synagogue Backend"

# Database (Port 5433) - Optional, remove if you don't want external DB access
New-NetFirewallRule -DisplayName "Pilzno Database External Access" -Direction Inbound -Protocol TCP -LocalPort 5433 -Action Allow -Profile Any -Description "Allow external access to Pilzno Synagogue Database"

Write-Host "✅ Firewall rules created successfully!" -ForegroundColor Green

# Display current external IP
Write-Host "🌐 Your external IP address: 89.138.168.239" -ForegroundColor Cyan

# Display access URLs
Write-Host "`n🔗 External Access URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://89.138.168.239:3000" -ForegroundColor White
Write-Host "   Backend:  http://89.138.168.239:3001" -ForegroundColor White
Write-Host "   Health:   http://89.138.168.239:3001/health" -ForegroundColor White

Write-Host "`n⚠️  Security Notes:" -ForegroundColor Yellow
Write-Host "   - Your application is now accessible from the internet" -ForegroundColor White
Write-Host "   - Consider using HTTPS in production" -ForegroundColor White
Write-Host "   - Monitor access logs regularly" -ForegroundColor White
Write-Host "   - Consider implementing IP whitelisting if needed" -ForegroundColor White

Write-Host "`n🚀 Next steps:" -ForegroundColor Green
Write-Host "   1. Restart your Docker containers with external configuration" -ForegroundColor White
Write-Host "   2. Test external access from another device/network" -ForegroundColor White
Write-Host "   3. Update your router port forwarding if behind NAT" -ForegroundColor White

Write-Host "`n✅ Firewall configuration complete!" -ForegroundColor Green
