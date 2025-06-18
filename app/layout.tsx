// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { MainNav } from "@/components/main-nav";
import { AuthProvider } from "@/contexts/auth-context";
import { Footer } from "@/components/footer";
import { ProgressBar } from "@/components/progress-bar";
import { Analytics } from "@vercel/analytics/next"
import { CookieConsent } from "@/components/cookie-consent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Hepta",
    description: "Hepta - Din partner for digitalisering",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="no" suppressHydrationWarning className="h-full overflow-x-hidden">
            <body className={`${inter.className} h-full bg-background text-foreground overflow-x-hidden`}>
                <ProgressBar />
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                    <AuthProvider>
                        <div className="flex flex-col min-h-screen">
                            <MainNav />
                            <main className="flex-grow overflow-x-hidden w-full relative">
                                <Suspense fallback={<div>Loading...</div>}>
                                    {children}
                                </Suspense>
                            </main>
                            <Footer />
                        </div>
                    </AuthProvider>
                </ThemeProvider>
                <CookieConsent />
            </body>
        </html>
    );
}