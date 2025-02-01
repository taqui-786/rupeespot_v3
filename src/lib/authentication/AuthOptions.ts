import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";
import { user_db } from "../db/db_connect";
import { sql } from "drizzle-orm";
import GoogleProvider from "next-auth/providers/google";
export const authOpitions: AuthOptions = {
  pages: {
    signIn: "/api/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          Placeholder: "your email address",
        },
        password: {
          label: "Password",
          type: "text",
        },
      },
      async authorize(credentials, req) {
        console.log("credentials", credentials);

        const [myUser]: any = await user_db.execute(
          sql`SELECT * FROM user WHERE email = ${credentials?.email}`
        );

        if (!myUser[0] || !myUser[0]?.password)
          throw new Error("No User Found !");
        const passwordsMatch = await bcrypt.compare(
          // @ts-ignore
          credentials?.password,
          myUser[0]?.password
        );
        if (!passwordsMatch) {
          throw new Error("The Password you entered is invalid");
        }
        if (myUser[0].isVerified === 0) {
          throw new Error("Please Verify Your email first");
        }
        return myUser[0];
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) token.user = user as myUser;
      return token;
    },
    async session({ token, session }: any) {
      session.user = token.user as myUser;
      return session;
    },
    async signIn({ account, profile }: any) {
      if (account?.provider === "google") {
        const [ifUserExists]: any = await user_db.execute(
          sql`SELECT * FROM user WHERE email = ${profile?.email}`
        );

        if (!ifUserExists.length) {
          let parts = profile.name.split(" ");

          let firstName = parts[0];
          let lastName = parts.slice(1).join(" ");
          await user_db.execute(
            sql`INSERT INTO user(firstname, lastname, email, isVerified, type) VALUES (${firstName}, ${lastName}, ${profile.email}, 1, 'google')`
          );

          return true;
        }
        return true;
      }
      return true;
    },
  },
};
