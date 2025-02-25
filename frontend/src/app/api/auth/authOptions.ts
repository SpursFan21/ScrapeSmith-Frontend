// src/app/api/auth/authOptions.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { db } from "@/server/db";

// Custom interface extending the user with isAdmin
interface UserWithAdmin {
  id: string;
  username: string;
  hashedPassword: string;
  isAdmin: boolean;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Your username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const creds = credentials as { username: string; password: string };
        if (!creds.username || !creds.password) {
          throw new Error("Missing username or password");
        }
        // Explicitly select isAdmin (and other fields) from the user record.
        const user = await db.user.findUnique({
          where: { username: creds.username },
          select: {
            id: true,
            username: true,
            hashedPassword: true,
            isAdmin: true, // explicitly include isAdmin
            name: true,
            email: true,
            image: true,
          },
        });
        if (!user) throw new Error("No user found with that username");
        if (!user.hashedPassword) throw new Error("User has no password set");

        const isValid = await bcrypt.compare(creds.password, user.hashedPassword);
        if (!isValid) throw new Error("Invalid password");

        // Cast the user as our extended type.
        return user as UserWithAdmin;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Use a cast to inform TS about isAdmin (cast via unknown first)
        token.isAdmin = (user as unknown as UserWithAdmin).isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
