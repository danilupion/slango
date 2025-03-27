#!/bin/bash

# This script removes all cache artifacts in the monorepo.
echo "Removing all cache artifacts..."

# Find and remove all .turbo folders
find . -name '.turbo' -type d -prune -exec rm -rf '{}' +
# Find and remove all .eslintcache files
find . -name '.eslintcache' -type f -prune -exec rm -rf '{}' +
# Find and remove all tsbuildinfo files
find . -name '*.tsbuildinfo' -type f -prune -exec rm -rf '{}' +

echo "All cache artifacts removed."