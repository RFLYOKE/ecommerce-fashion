import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User } from "@/types/user";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
  },
  // debug: true,
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        // Step 1: Login untuk mendapatkan token
        const loginRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          }
        );

        const loginData = await loginRes.json();

        if (!loginRes.ok || !loginData?.data?.token) return null;

        const token = loginData.data.token;

        // Step 2: Ambil data user dari /me
        const meRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const meData = await meRes.json();
        const user: User = meData?.data;

        if (!meRes.ok || !user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          token: token,
          roles: user.roles || [],
          shop: user.shop,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.phone = user.phone;
        token.token = user.token;
        token.roles = user.roles;
        token.shop = user.shop;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.token = token.token as string;
        session.user.roles = token.roles as User["roles"];
        session.user.shop = token.shop as User["shop"];
      }
      return session;
    },
  },
};
