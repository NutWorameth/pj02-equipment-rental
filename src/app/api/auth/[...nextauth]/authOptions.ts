import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import userLogIn from "@/libs/userLogIn";
import userLogOut from "@/libs/userLogOut";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        return await userLogIn(credentials.email, credentials.password);
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as unknown as AuthUser;
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (typeof token?.token !== "string") return;

      try {
        await userLogOut(token.token);
      } catch {
        return;
      }
    },
  },
};
