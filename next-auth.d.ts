// next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth"

// Extend the default session and JWT types
declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
  }
}


declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}