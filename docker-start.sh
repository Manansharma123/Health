#!/bin/bash

# Quick start script for Docker setup
# This script helps you get started with the Dockerized notebook

set -e

echo "=========================================="
echo "Sentiment Analysis Notebook - Docker Setup"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo "Please install Docker from: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is installed and running"
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "⚠️  docker-compose not found, using 'docker compose' instead"
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Build and start
echo "🔨 Building Docker image..."
$DOCKER_COMPOSE build

echo ""
echo "🚀 Starting Jupyter Lab container..."
$DOCKER_COMPOSE up -d

echo ""
echo "✅ Container started successfully!"
echo ""
echo "=========================================="
echo "Access your notebook at:"
echo "👉 http://localhost:8888"
echo "=========================================="
echo ""
echo "Useful commands:"
echo "  Stop:    $DOCKER_COMPOSE down"
echo "  Logs:    $DOCKER_COMPOSE logs -f"
echo "  Restart: $DOCKER_COMPOSE restart"
echo ""
echo "See DOCKER.md for more information"
