#!/usr/bin/env bash
set -euo pipefail

echo " Cleaning up Docker..."

echo "Removing dangling images..."
docker image prune -f

echo " Removing unused containers..."
docker container prune -f

echo " Removing unused networks..."
docker network prune -f

echo " Docker cleanup completed."
