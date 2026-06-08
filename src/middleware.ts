// NextAuth v5 middleware - protects routes and persists session
export { auth as middleware } from "@/auth";

// Only run middleware on page routes (not API, not static files)
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes (/api/*) - including NextAuth's own routes
     * - Static files (_next/static, _next/image)
     * - Images (favicon.ico, robots.txt, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
