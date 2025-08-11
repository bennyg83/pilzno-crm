#!/bin/bash

echo "Building Pilzno Synagogue Management System Containers..."
echo

echo "Building Backend Container..."
docker compose -f docker-compose.prod.yml build pilzno-synagogue-backend
if [ $? -ne 0 ]; then
    echo "ERROR: Backend build failed!"
    exit 1
fi

echo
echo "Building Frontend Container..."
docker compose -f docker-compose.prod.yml build pilzno-synagogue-frontend
if [ $? -ne 0 ]; then
    echo "ERROR: Frontend build failed!"
    exit 1
fi

echo
echo "All containers built successfully!"
echo
echo "To start the system, run:"
echo "docker compose -f docker-compose.prod.yml up -d"
echo
