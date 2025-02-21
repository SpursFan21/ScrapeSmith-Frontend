// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { db } from "@/server/db";

const handler = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Your username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Explicitly cast credentials to the expected type
        const creds = credentials as { username: string; password: string };
        if (!creds.username || !creds.password) {
          throw new Error("Missing username or password");
        }
        // Look up the user by username
        const user = await db.user.findUnique({
          where: { username: creds.username },
        });
        if (!user) {
          throw new Error("No user found with that username");
        }
        if (!user.hashedPassword) {
          throw new Error("User has no password set");
        }
        // Validate the password
        const isValid = await bcrypt.compare(creds.password, user.hashedPassword);
        if (!isValid) {
          throw new Error("Invalid password");
        }
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
