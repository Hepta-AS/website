"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { LoginModal } from "@/components/login-modal";
import Image from "next/image";
import { FloatingMenuButton } from "./FloatingMenuButton";
import { FullscreenMenu } from "./FullscreenMenu";

const navItems = [
  { name: 'Hjem', href: '/' },
  { name: 'Tjenester', href: '/tjenester' },
  { name: 'Om oss', href: '/om-oss' },
];

interface MainNavProps {
  shouldPageBeWhite?: boolean;
}

export function MainNav({ shouldPageBeWhite = false }: MainNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isFloatingButtonVisible, setIsFloatingButtonVisible] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, checkAuth } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      setIsFloatingButtonVisible(currentScrollY > 100);
      setIsNavHidden(currentScrollY > 200);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    if (pathname !== "/") {
      router.push("/");
    }
  };

  const primaryColor = shouldPageBeWhite ? 'text-blue-600' : 'text-blue-500';
  const floatingButtonColor = shouldPageBeWhite ? 'bg-black text-white' : 'bg-white text-black';
  const floatingButtonHoverColor = shouldPageBeWhite ? 'hover:bg-blue-600' : 'hover:bg-blue-500';

  return (
    <>
      <header
        className={`absolute top-0 left-0 right-0 z-40 transition-colors duration-300 transform transition-transform ${
          isNavHidden ? '-translate-y-full' : 'translate-y-0'
        } ${
          scrolled 
            ? 'bg-neutral-950/90 backdrop-blur-lg border-b border-neutral-800/50' 
            : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/A_white_hepta.png" alt="Hepta" width={32} height={32} />
              <span className={`font-semibold text-lg ${shouldPageBeWhite ? 'text-black' : 'text-white'}`}>Hepta</span>
            </Link>

            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href} className={`text-sm font-medium transition-colors ${shouldPageBeWhite ? 'text-black hover:text-blue-600' : 'text-neutral-300 hover:text-white'}`}>
                    {item.name}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center space-x-4">
               <Button
                onClick={() => router.push('/contact')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Kontakt
              </Button>
              <AnimatePresence mode="wait" initial={false}>
                {mounted && user ? (
                  <motion.div
                    key="user-loggedin"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center space-x-4"
                  >
                    <Link href="/dashboard">
                      <Button variant="ghost" className={`${shouldPageBeWhite ? 'text-black hover:text-blue-600 hover:bg-neutral-200' : 'text-white hover:bg-neutral-800'}`}>
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      onClick={handleLogout} 
                      variant="outline"
                      className="border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    >
                      Logg ut
                    </Button>
                  </motion.div>
                ) : mounted ? (
                  <motion.div
                    key="user-loggedout"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button 
                      onClick={handleLoginClick} 
                      variant="outline"
                      className="border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    >
                      Logg inn
                    </Button>
                  </motion.div>
                ) : (
                  <div style={{ height: '40px' }} />
                )}
              </AnimatePresence>
            </div>

            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md ${shouldPageBeWhite ? 'text-black' : 'text-gray-400'} hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white`}
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="lg:hidden"
                id="mobile-menu"
              >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {navItems.map((item) => (
                    <Link key={item.name} href={item.href} className={`block px-3 py-2 rounded-md text-base font-medium ${shouldPageBeWhite ? 'text-black hover:bg-neutral-200' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`}>
                        {item.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-700 pt-4 space-y-2">
                     <Button
                        onClick={() => {
                          router.push('/contact');
                          setIsOpen(false);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Kontakt
                      </Button>
                    <AnimatePresence mode="wait" initial={false}>
                      {mounted && user ? (
                        <motion.div
                          key="mobile-user-loggedin"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col space-y-2"
                        >
                          <Link href="/dashboard">
                            <Button variant="ghost" className={`w-full justify-start ${shouldPageBeWhite ? 'text-black hover:bg-neutral-200' : 'text-white hover:bg-neutral-800'}`}>
                              Dashboard
                            </Button>
                          </Link>
                          <Button onClick={handleLogout} variant="secondary" className={`w-full text-white hover:bg-neutral-800`}>
                            Logg ut
                          </Button>
                        </motion.div>
                      ) : mounted ? (
                        <motion.div
                          key="mobile-user-loggedout"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button onClick={handleLoginClick} variant="secondary" className={`w-full text-white hover:bg-neutral-800`}>
                            Logg inn
                          </Button>
                        </motion.div>
                      ) : (
                        <div style={{ height: '40px' }} />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      <AnimatePresence>
        {isFloatingButtonVisible && (
          <FloatingMenuButton
            onClick={() => setIsMenuVisible(true)}
            colorClass={floatingButtonColor}
            hoverColorClass={floatingButtonHoverColor}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuVisible && (
          <FullscreenMenu
            onClose={() => setIsMenuVisible(false)}
            navItems={navItems}
            shouldPageBeWhite={shouldPageBeWhite}
          />
        )}
      </AnimatePresence>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
