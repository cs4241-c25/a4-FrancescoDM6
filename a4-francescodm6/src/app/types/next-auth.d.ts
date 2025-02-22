// src/types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            name?: string | null;
            email?: string | null;
            image?: string | null;
            username?: string;
        }
    }

    interface User {
        username?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        username?: string;
    }
}