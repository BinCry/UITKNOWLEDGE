import { AdminStatus, Role } from "@prisma/client";
import { addMinutes, isAfter, subMinutes } from "date-fns";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { redirect } from "next/navigation";
import {
  ADMIN_PATH_PREFIX,
  CHANGE_PASSWORD_PATH,
  LOCK_DURATION_MINUTES,
  LOCK_MAX_ATTEMPTS,
  LOCK_WINDOW_MINUTES,
  LOGIN_PATH,
} from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/security/password";
import { loginSchema } from "@/lib/zod-schemas/auth";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: LOGIN_PATH,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email hoặc username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = loginSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const identifier = parsed.data.identifier.trim().toLowerCase();
        const user = await prisma.adminUser.findFirst({
          where: {
            OR: [{ email: identifier }, { username: identifier }],
          },
        });

        if (!user || user.status === AdminStatus.DISABLED) {
          return null;
        }

        const now = new Date();
        if (user.lockUntil && isAfter(user.lockUntil, now)) {
          return null;
        }

        const passwordOk = await verifyPassword(parsed.data.password, user.passwordHash);
        if (!passwordOk) {
          const withinWindow =
            user.lastFailedLoginAt && isAfter(user.lastFailedLoginAt, subMinutes(now, LOCK_WINDOW_MINUTES));
          const failedLoginAttempts = withinWindow ? user.failedLoginAttempts + 1 : 1;
          const shouldLock = failedLoginAttempts >= LOCK_MAX_ATTEMPTS;

          await prisma.adminUser.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts,
              lastFailedLoginAt: now,
              status: shouldLock ? AdminStatus.LOCKED : user.status,
              lockUntil: shouldLock ? addMinutes(now, LOCK_DURATION_MINUTES) : null,
            },
          });

          return null;
        }

        await prisma.adminUser.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lastFailedLoginAt: null,
            lockUntil: null,
            status: AdminStatus.ACTIVE,
          },
        });

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: Role.ADMIN,
          mustChangePassword: user.mustChangePassword,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.mustChangePassword = user.mustChangePassword;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.username = token.username ?? "";
        session.user.role = token.role ?? Role.ADMIN;
        session.user.mustChangePassword = Boolean(token.mustChangePassword);
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getAuthSession = () => getServerSession(authOptions);

const getCurrentAdminState = async (userId: string) =>
  prisma.adminUser.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      status: true,
      mustChangePassword: true,
    },
  });

export const requireAuth = async () => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect(LOGIN_PATH);
  }
  return session;
};

export const requireAdmin = async (options?: { allowPasswordChange?: boolean }) => {
  const session = await requireAuth();
  const user = await getCurrentAdminState(session.user.id);

  if (!user || user.status === AdminStatus.DISABLED) {
    redirect(LOGIN_PATH);
  }

  const resolvedSession = {
    ...session,
    user: {
      ...session.user,
      username: user.username,
      email: user.email,
      name: user.displayName ?? session.user.name ?? user.username,
      mustChangePassword: user.mustChangePassword,
    },
  };

  if (user.mustChangePassword && !options?.allowPasswordChange) {
    redirect(CHANGE_PASSWORD_PATH);
  }

  return resolvedSession;
};

export const requirePasswordChange = async () => {
  const session = await requireAuth();
  const user = await getCurrentAdminState(session.user.id);

  if (!user || user.status === AdminStatus.DISABLED) {
    redirect(LOGIN_PATH);
  }

  if (!user.mustChangePassword) {
    redirect(ADMIN_PATH_PREFIX);
  }

  return {
    ...session,
    user: {
      ...session.user,
      username: user.username,
      email: user.email,
      name: user.displayName ?? session.user.name ?? user.username,
      mustChangePassword: user.mustChangePassword,
    },
  };
};
