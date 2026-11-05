import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    memberId?: string;
    role?: "MEMBER" | "ADMIN";
  }
  interface Session {
    user: User & { memberId?: string; role?: "MEMBER" | "ADMIN" };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    memberId?: string;
    role?: "MEMBER" | "ADMIN";
  }
}
