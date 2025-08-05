import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

// Extend next-auth types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id: string;
      role?: string;
    } & DefaultSession["user"]
  }

  interface User {
    role?: string;
  }
}

const handler = NextAuth({
  // 빌드 시에는 어댑터를 사용하지 않음
  adapter: process.env.SKIP_DATABASE_CONNECTION !== 'true'
    ? DrizzleAdapter(db)
    : undefined,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("이메일과 비밀번호를 입력해주세요.");
        }

        if (process.env.SKIP_DATABASE_CONNECTION === 'true') {
          return {
            id: '1',
            email: 'dummy@example.com',
            name: 'Dummy User',
            role: 'user',
          };
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email),
        });

        if (!user || !user.password) {
          throw new Error("등록되지 않은 이메일입니다.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("비밀번호가 일치하지 않습니다.");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
})

export { handler as GET, handler as POST } 