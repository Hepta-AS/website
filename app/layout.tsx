// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { LayoutProvider } from "@/components/LayoutProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Hepta",
    description: "Hepta - Fremtidens digitale løsninger",
    icons: {
        icon: "/A_white_hepta.png",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="no" suppressHydrationWarning className="overflow-x-hidden">
            <body className={`${inter.className} flex flex-col min-h-screen`}>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                    <AuthProvider>
                        <LayoutProvider>{children}</LayoutProvider>
                        <Toaster />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}