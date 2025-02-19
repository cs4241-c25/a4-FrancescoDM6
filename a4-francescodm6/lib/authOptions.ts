// lib/authOptions.ts
import { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from 'next-auth/providers/github';
import { JWT } from "next-auth/jwt";

const users = {
    'admin': { username: 'admin', password: 'admin123' },
    'demo': { username: 'demo', password: 'demo123' },
    'test': { username: 'test', password: 'test123' }
} as const;

export const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    name: profile.name || profile.login,
                    username: profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                }
            }
        }),
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
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // For GitHub users, user.username will be their GitHub login
                // For credentials users, it will be their username
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (token && session.user) {
                // Ensure username is always available in the session
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
}