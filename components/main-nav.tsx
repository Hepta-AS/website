"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { LoginModal } from "@/components/login-modal";
import { Menu, X } from "lucide-react";

export function MainNav() {
  const { logout, checkAuth } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const { isLoggedIn: loginStatus } = await checkAuth();
      setIsLoggedIn(loginStatus);
    };
    checkLoginStatus();
  }, [checkAuth]);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleLogoutClick = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    if (pathname !== "/") {
      router.push("/");
    }
  };

  const handleContactClick = () => {
    router.push("/contact");
    setIsMobileMenuOpen(false);
  };

  const getLinkClass = (path: string) => {
    const baseStyle = "font-medium text-sm hover:text-blue-400 transition-colors";
    return pathname === path
      ? `text-blue-500 ${baseStyle}`
      : `text-neutral-300 ${baseStyle}`;
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-800 px-4 md:px-6 py-2 shadow-sm flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="Hepta Hjem">
          <div className="relative h-5 w-auto aspect-[4/1]">
            <Image
              src="/A_white_hepta.png"
              alt="Hepta Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-4 ml-4">
          {isLoggedIn ? (
            <>
              <Link href="/" className={getLinkClass("/")}>Hjem</Link>
              <Link href="/dashboard" className={getLinkClass("/dashboard")}>Dashboard</Link>
            </>
          ) : (
            <>
              <Link href="/" className={getLinkClass("/")}>Hjem</Link>
              <Link href="/tjenester" className={getLinkClass("/tjenester")}>Tjenester</Link>
              <Link href="/om-oss" className={getLinkClass("/om-oss")}>Om oss</Link>
            </>
          )}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-3 ml-auto">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-1.5 rounded-full text-sm"
            onClick={handleContactClick}
          >
            Kontakt
          </Button>
          <Button
            className={`${isLoggedIn
                ? "bg-neutral-100 hover:bg-neutral-200 text-neutral-900"
                : "bg-white hover:bg-gray-100 text-blue-700"
              } font-medium px-4 py-1.5 rounded-full text-sm`}
            onClick={isLoggedIn ? handleLogoutClick : handleLoginClick}
          >
            {isLoggedIn ? "Logg ut" : "Logg inn"}
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden ml-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:bg-neutral-800"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 top-16 bg-neutral-950 z-40 md:hidden flex flex-col items-center justify-center animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <nav className="flex flex-col items-center gap-8 text-center">
            {isLoggedIn ? (
              <>
                <Link href="/" className={`${getLinkClass("/")} text-2xl`}>Hjem</Link>
                <Link href="/dashboard" className={`${getLinkClass("/dashboard")} text-2xl`}>Dashboard</Link>
              </>
            ) : (
              <>
                <Link href="/" className={`${getLinkClass("/")} text-2xl`}>Hjem</Link>
                <Link href="/tjenester" className={`${getLinkClass("/tjenester")} text-2xl`}>Tjenester</Link>
                <Link href="/om-oss" className={`${getLinkClass("/om-oss")} text-2xl`}>Om oss</Link>
              </>
            )}
            <div className="mt-8 flex flex-col gap-4 w-full px-8">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-full text-base w-full"
                onClick={handleContactClick}
              >
                Kontakt
              </Button>
              <Button
                className={`${isLoggedIn
                    ? "bg-neutral-700 hover:bg-neutral-600 text-white"
                    : "bg-white hover:bg-gray-200 text-blue-700"
                  } font-medium px-6 py-3 rounded-full text-base w-full`}
                onClick={isLoggedIn ? handleLogoutClick : handleLoginClick}
              >
                {isLoggedIn ? "Logg ut" : "Logg inn"}
              </Button>
            </div>
          </nav>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
