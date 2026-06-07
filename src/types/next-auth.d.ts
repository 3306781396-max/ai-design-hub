import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      provider?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    provider?: string;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role?: string;
  }
}
