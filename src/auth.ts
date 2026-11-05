import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/db";

async function nextMemberId(): Promise<string> {
  const latest = await prisma.user.findFirst({
    orderBy: { createdAt: "desc" },
    select: { memberId: true },
  });
  const number = latest ? Number.parseInt(latest.memberId.replace("ARISE-", ""), 10) + 1 : 1;
  return `ARISE-${String(Number.isNaN(number) ? 1 : number).padStart(4, "0")}`;
}

export const authConfig: NextAuthOptions = {
  providers: [
    GitHub({ clientId: process.env.GITHUB_ID ?? "", clientSecret: process.env.GITHUB_SECRET ?? "" }),
    Google({ clientId: process.env.GOOGLE_CLIENT_ID ?? "", clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "" }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }) {
      if (!user.email || !user.name) return false;
      const existing = await prisma.user.findUnique({ where: { email: user.email } });
      if (!existing) {
        await prisma.user.create({
          data: { email: user.email, name: user.name, image: user.image, memberId: await nextMemberId() },
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const record = await prisma.user.findUnique({
          where: { email: user.email },
          select: { memberId: true, role: true },
        });
        if (record) {
          token.memberId = record.memberId;
          token.role = record.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.memberId = token.memberId;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};

export const auth = () => getServerSession(authConfig);
export default NextAuth(authConfig);
