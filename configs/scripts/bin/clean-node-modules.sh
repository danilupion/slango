#!/usr/bin/env sh

# This script removes all node_modules directories in the monorepo.
echo "Removing all node_modules directories..."

# Find and remove all node_modules folders
find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +

echo "All node_modules directories removed."
