import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getSession } from "@/actions/user/user.actions";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Dashboard | AskFlow",
    description: "Manage your forms, conversations and settings",
};

type Props = {
    children: React.ReactNode;
    admin: React.ReactNode;
    user: React.ReactNode;
};

async function RoleBasedContent({ children, admin, user }: Props) {
    const session = await getSession();
    const currentUser = session?.user;


    if (!currentUser) redirect("/login");

    const isAdmin = String(currentUser.role).toLowerCase() === "admin";
    console.log("current user is admin from layout", isAdmin)

    return (
        <DashboardShell>
            {children}
            {isAdmin ? admin : user}
        </DashboardShell>
    );
}

export default function DashboardLayout(props: Props) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full">
                <Suspense fallback={<div className="p-6">Loading...</div>}>
                    <RoleBasedContent {...props} />
                </Suspense>
            </body>
        </html>
    );
}