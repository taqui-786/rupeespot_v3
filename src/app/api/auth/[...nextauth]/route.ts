import { authOpitions } from "@/lib/authentication/AuthOptions";
import NextAuth from "next-auth/next";

const handler = NextAuth(authOpitions);

export { handler as GET, handler as POST };
