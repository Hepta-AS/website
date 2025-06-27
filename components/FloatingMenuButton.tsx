"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import useIsMobile from '../hooks/use-mobile';
import { MagneticButton } from './MagneticButton';

interface MenuButtonProps {
  onClick: () => void;
}

export const FloatingMenuButton = ({ onClick }: MenuButtonProps) => {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const showOnMobile = window.scrollY > window.innerHeight;
      const showOnDesktop = window.scrollY > 100;

      if (isMobile) {
        setIsVisible(showOnMobile);
      } else {
        setIsVisible(showOnDesktop);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed z-50 bottom-8 right-8 md:top-8 md:bottom-auto"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MagneticButton 
            onClick={onClick}
            className="p-0 rounded-full aspect-square"
          >
            <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center">
              <Menu size={32} />
            </div>
          </MagneticButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 