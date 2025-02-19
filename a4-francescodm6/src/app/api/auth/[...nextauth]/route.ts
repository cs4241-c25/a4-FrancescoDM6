// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';

const users = {
    'admin': { username: 'admin', password: 'admin123' },
    'demo': { username: 'demo', password: 'demo123' },
    'test': { username: 'test', password: 'test123' }
} as const;

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                const user = users[credentials.username as keyof typeof users];

                if (user && user.password === credentials.password) {
                    return {
                        id: credentials.username,
                        name: credentials.username,
                        username: credentials.username
                    };
                }
                return null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (token && session.user) {
                session.user.username = token.username;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: '/login',
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };