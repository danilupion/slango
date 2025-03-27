#!/bin/bash

# This script removes all dist directories in the monorepo.
echo "Removing all dist directories..."

# Find and remove all dist folders
find . -name 'dist' -type d -prune -exec rm -rf '{}' +
# Find and remove all tsbuildinfo files
find . -name '*.tsbuildinfo' -type f -prune -exec rm -rf '{}' +

echo "All dist directories removed."
