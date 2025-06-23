"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { LoginModal } from "@/components/login-modal";
import Image from "next/image";

const navItems = [
  { name: 'Hjem', href: '/' },
  { name: 'Tjenester', href: '/tjenester' },
  { name: 'Om oss', href: '/om-oss' },
  { name: 'Kontakt', href: '/contact' },
];

interface MainNavProps {
  shouldPageBeWhite?: boolean;
}

export function MainNav({ shouldPageBeWhite = false }: MainNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const lastScrollY = useRef(0);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, checkAuth } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Check if scrolled
      setScrolled(currentScrollY > 20);
      
      // Hide/show navbar based on scroll direction
      if (currentScrollY > 100) { // Only hide after scrolling past 100px
        if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
          // Scrolling down
          setIsHidden(true);
          setIsOpen(false); // Close mobile menu when hiding
        } else {
          // Scrolling up
          setIsHidden(false);
        }
      } else {
        // Near top of page, always show
        setIsHidden(false);
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleDashboard = () => {
    router.push('/dashboard');
    setIsOpen(false);
  };

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

  const handleShowNav = () => {
    setIsHidden(false);
  };

  const primaryColor = shouldPageBeWhite ? 'text-blue-600' : 'text-blue-500';
  
  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-neutral-950/90 backdrop-blur-lg border-b border-neutral-800/50' 
            : 'bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-800'
        }`}
        initial={{ y: -100 }}
        animate={{ y: isHidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <nav className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/" className="flex items-center">
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
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {user ? (
                <>
                  <motion.div whileHover={{ y: -2 }}>
                    <Link
                      href="/"
                      className={`relative text-sm font-medium transition-colors ${
                        pathname === '/'
                          ? 'text-blue-500'
                          : 'text-neutral-300 hover:text-white'
                      }`}
                    >
                      Hjem
                      {pathname === '/' && (
                        <motion.div
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                          layoutId="activeTab"
                        />
                      )}
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }}>
                    <Link
                      href="/dashboard"
                      className={`relative text-sm font-medium transition-colors ${
                        pathname === '/dashboard'
                          ? primaryColor
                          : 'text-neutral-300 hover:text-white'
                      }`}
                    >
                      Dashboard
                      {pathname === '/dashboard' && (
                        <motion.div
                          className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${
                            shouldPageBeWhite ? 'bg-blue-600' : 'bg-blue-500'
                          }`}
                          layoutId="activeTab"
                        />
                      )}
                    </Link>
                  </motion.div>
                </>
              ) : (
                navItems.map((item) => (
                  <motion.div key={item.name} whileHover={{ y: -2 }}>
                    <Link
                      href={item.href}
                      className={`relative text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? primaryColor
                          : 'text-neutral-300 hover:text-white'
                      }`}
                    >
                      {item.name}
                      {pathname === item.href && (
                        <motion.div
                          className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${
                            shouldPageBeWhite ? 'bg-blue-600' : 'bg-blue-500'
                          }`}
                          layoutId="activeTab"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))
              )}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {!user && (
                <Button
                  onClick={() => router.push('/contact')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Kontakt
                </Button>
              )}
              {user ? (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                >
                  Logg ut
                </Button>
              ) : (
                <Button
                  onClick={handleLoginClick}
                  variant="outline"
                  className="border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                >
                  Logg inn
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden p-2 rounded-lg text-neutral-300"
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="lg:hidden absolute top-full left-0 right-0 bg-neutral-950 border-b border-neutral-800 shadow-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-6 py-4 space-y-4">
                  {user ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0 * 0.1 }}
                      >
                        <Link
                          href="/"
                          className={`block text-lg font-medium transition-colors ${
                            pathname === '/'
                              ? primaryColor
                              : 'text-neutral-300 hover:text-white'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          Hjem
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 * 0.1 }}
                      >
                        <Link
                          href="/dashboard"
                          className={`block text-lg font-medium transition-colors ${
                            pathname === '/dashboard'
                              ? primaryColor
                              : 'text-neutral-300 hover:text-white'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          Dashboard
                        </Link>
                      </motion.div>
                    </>
                  ) : (
                    navItems.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className={`block text-lg font-medium transition-colors ${
                            pathname === item.href
                              ? primaryColor
                              : 'text-neutral-300 hover:text-white'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    ))
                  )}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (user ? 2 : navItems.length) * 0.1 }}
                    className="pt-4 border-t border-neutral-800"
                  >
                    {!user && (
                      <Button
                        onClick={() => {
                          router.push('/contact');
                          setIsOpen(false);
                        }}
                        className="w-full mb-3 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Kontakt
                      </Button>
                    )}
                    {user ? (
                      <Button
                        onClick={handleLogout}
                        className="w-full bg-neutral-800 hover:bg-neutral-700 text-white"
                      >
                        Logg ut
                      </Button>
                    ) : (
                      <Button
                        onClick={handleLoginClick}
                        className="w-full bg-neutral-800 hover:bg-neutral-700 text-white"
                      >
                        Logg inn
                      </Button>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>

      {/* Floating Nav Button - Shows when navbar is hidden */}
      <AnimatePresence>
        {isHidden && (
          <motion.button
            className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg backdrop-blur-sm border border-blue-500/20"
            onClick={handleShowNav}
            initial={{ opacity: 0, scale: 0, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
