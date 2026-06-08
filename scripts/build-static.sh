#!/bin/bash
# Build and fix static export for deployment
set -e

echo "=== Building AI Design Hub (Static Export) ==="
npm run prebuild
npx next build

echo ""
echo "--- Fixing relative paths ---"
python3 scripts/fix-relative-paths.py

echo ""
echo "=== Build complete! Output in ./out/ ==="
