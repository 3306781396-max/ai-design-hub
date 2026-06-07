export { auth as middleware } from "@/auth";

// Matcher: run middleware on all pages except static assets
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
