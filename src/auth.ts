import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Required for Vercel deployments (behind proxy)
  trustHost: true,

  // Explicit cookies config for production (Vercel)
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      // Request user email scope
      authorization: { params: { scope: "read:user user:email" } },
    }),
    // Simple admin credentials fallback
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (
          adminEmail &&
          adminPassword &&
          credentials.email === adminEmail &&
          credentials.password === adminPassword
        ) {
          return {
            id: "admin",
            email: adminEmail,
            name: "Admin",
            role: "admin",
          };
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Persist user info from provider into the JWT token
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
        token.provider = account?.provider;
      }
      // Save GitHub username for display
      if (account?.provider === "github" && profile) {
        token.github_username = (profile as any).login;
        token.avatar_url = (profile as any).avatar_url;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role || "user";
        (session.user as any).provider = token.provider;
        (session.user as any).github_username = token.github_username;
      }
      return session;
    },
    async signIn({ account, profile }) {
      // Optional: only allow certain users (add your logic here)
      return true;
    },
  },

  pages: {
    signIn: "/",
    error: "/",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Only enable debug in development
  debug: process.env.NODE_ENV === "development",
});
