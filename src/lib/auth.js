import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import jsonStore, { hydrateDoc } from '@/lib/jsonStore';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/calendar.events',
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isDemoBypass: { label: "Demo Bypass", type: "text" }
      },
      async authorize(credentials) {
        if (credentials?.isDemoBypass === 'true') {
          return {
            id: 'mock-user-123',
            name: 'Demo User',
            email: 'demo@taskflow.dev',
            image: '',
          };
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const user = jsonStore.users.findOne({ email: credentials.email.toLowerCase() });

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image || '',
        };
      }
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        let dbUser = hydrateDoc(jsonStore.users.findOne({ email: user.email.toLowerCase() }), 'users');
        if (!dbUser) {
          dbUser = jsonStore.users.create({
            email: user.email.toLowerCase(),
            name: user.name,
            image: user.image,
            googleAccessToken: account.access_token,
            googleRefreshToken: account.refresh_token,
            emailVerified: Date.now(),
          });
        } else {
          dbUser.googleAccessToken = account.access_token;
          if (account.refresh_token) {
            dbUser.googleRefreshToken = account.refresh_token;
          }
          await dbUser.save();
        }
        user.id = dbUser._id.toString();
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id;
      }
      // Mock tokens
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      if (account?.refresh_token) {
        token.refreshToken = account.refresh_token;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET || 'fallback_secret_for_demo_purposes_only',
};

export default NextAuth(authOptions);
