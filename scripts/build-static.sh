#!/bin/bash
# Build static export version for CloudStudio deployment
# This script temporarily replaces dynamic pages/routes with static versions,
# builds the static site, then restores the original files.

set -e

PROFILE_PAGE="src/app/(main)/profile/page.tsx"
PROFILE_BACKUP="src/app/(main)/profile/page.bak.tsx"
AUTH_ROUTE="src/app/api/auth"
AUTH_ROUTE_BACKUP=".static-build-backup/auth"
MIDDLEWARE_FILE="src/middleware.ts"
MIDDLEWARE_BACKUP=".static-build-backup/middleware.ts"

cleanup() {
  echo ""
  echo "--- Cleaning up ---"
  # Restore profile page
  if [ -f "$PROFILE_BACKUP" ]; then
    mv "$PROFILE_BACKUP" "$PROFILE_PAGE"
    echo "✓ Restored $PROFILE_PAGE"
  fi
  # Restore auth route
  if [ -d "$AUTH_ROUTE_BACKUP" ]; then
    rm -rf "$AUTH_ROUTE"
    mv "$AUTH_ROUTE_BACKUP" "$AUTH_ROUTE"
    echo "✓ Restored $AUTH_ROUTE"
  fi
  # Restore middleware
  if [ -f "$MIDDLEWARE_BACKUP" ]; then
    mv "$MIDDLEWARE_BACKUP" "$MIDDLEWARE_FILE"
    echo "✓ Restored $MIDDLEWARE_FILE"
  fi
  # Clean up backup dir
  rm -rf .static-build-backup
}
trap cleanup EXIT

echo "=== Building static export for CloudStudio ==="

# Create backup directory (outside src/app/ to avoid Next.js discovering it)
mkdir -p .static-build-backup

# 1. Backup and replace dynamic profile page
cp "$PROFILE_PAGE" "$PROFILE_BACKUP"
cat > "$PROFILE_PAGE" << 'STATIC_EOF'
// Static export version — no server-side auth available
import Link from "next/link";
import { User, ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <User className="h-10 w-10 text-gray-400" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        请先登录
      </h1>
      <p className="mb-6 max-w-md text-gray-500 dark:text-gray-400">
        个人主页需要登录后才能查看。请使用电脑访问完整版网站进行登录。
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        返回首页
      </Link>
    </div>
  );
}
STATIC_EOF
echo "✓ Replaced profile page with static version"

# 2. Move API auth route OUT of src/app/ (NextAuth can't be static exported)
if [ -d "$AUTH_ROUTE" ]; then
  mv "$AUTH_ROUTE" "$AUTH_ROUTE_BACKUP"
  echo "✓ Moved $AUTH_ROUTE out of app directory"
fi

# 3. Replace middleware with no-op (middleware requires server)
if [ -f "$MIDDLEWARE_FILE" ]; then
  cp "$MIDDLEWARE_FILE" "$MIDDLEWARE_BACKUP"
  cat > "$MIDDLEWARE_FILE" << 'MIDDLEWARE_EOF'
// Static export — middleware is not needed
export const config = { matcher: [] };
MIDDLEWARE_EOF
  echo "✓ Replaced middleware with no-op"
fi

# 4. Run static build
echo ""
echo "--- Building static site ---"
STATIC_EXPORT=true npm run build

# 5. Fix relative paths (for file:// compatibility)
echo ""
echo "--- Fixing relative paths ---"
python3 scripts/fix-relative-paths.py

echo ""
echo "=== Static build complete! Output in ./out/ ==="
echo "Ready for CloudStudio deployment."
