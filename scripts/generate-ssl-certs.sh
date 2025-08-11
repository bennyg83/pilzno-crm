#!/bin/bash

# Generate self-signed SSL certificates for development
# This script creates the necessary SSL certificates for nginx HTTPS

echo "🔐 Generating self-signed SSL certificates for development..."

# Create SSL directory
mkdir -p nginx/ssl

# Generate private key
openssl genrsa -out nginx/ssl/nginx.key 2048

# Generate certificate signing request
openssl req -new -key nginx/ssl/nginx.key -out nginx/ssl/nginx.csr -subj "/C=US/ST=State/L=City/O=Organization/CN=46.116.134.216"

# Generate self-signed certificate
openssl x509 -req -days 365 -in nginx/ssl/nginx.csr -signkey nginx/ssl/nginx.key -out nginx/ssl/nginx.crt

# Set proper permissions
chmod 600 nginx/ssl/nginx.key
chmod 644 nginx/ssl/nginx.crt

echo "✅ SSL certificates generated successfully!"
echo "📁 Location: nginx/ssl/"
echo "🔑 Private key: nginx/ssl/nginx.key"
echo "📜 Certificate: nginx/ssl/nginx.crt"
echo ""
echo "⚠️  Note: These are self-signed certificates for development only."
echo "   For production, use proper SSL certificates from a trusted CA."
