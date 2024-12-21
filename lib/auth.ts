import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [],
});

export async function getSession() {
  return await getServerSession(authOptions);
}

// Check user on server side
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}
