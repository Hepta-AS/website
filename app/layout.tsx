// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Footer } from "@/components/footer";
import { ProgressBar } from "@/components/progress-bar";
import { CookieConsent } from "@/components/cookie-consent";
import { Providers } from "./providers";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { MainNav } from '@/components/main-nav';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Hepta",
    description: "Hepta - Din partner for digitalisering",
    icons: {
        icon: "/A_white_hepta.png",
        apple: "/A_white_hepta.png",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="no" suppressHydrationWarning className="overflow-x-hidden">
            <body className={`${inter.className} bg-background text-foreground overflow-x-hidden`}>
                <SmoothScroll />
                <ProgressBar />
                <Providers>
                    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                        <AuthProvider>
                            <MainNav />
                            <main className="pt-20">
                                {children}
                            </main>
                            <Footer />
                            <Toaster />
                        </AuthProvider>
                    </ThemeProvider>
                </Providers>
                {/* Analytics and SpeedInsights temporarily removed due to build issues */}
            </body>
        </html>
    );
}