// next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth"

// Extend the default session and JWT types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      email: string;
      name?: string | null;
      image?: string | null;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}