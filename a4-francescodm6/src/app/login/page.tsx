// src/app/login/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "@/app/components/LoginForm";

export default async function LoginPage() {
    const session = await getServerSession();

    if (session) {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <LoginForm />
        </div>
    );
}