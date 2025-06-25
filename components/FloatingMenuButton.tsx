"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { MagneticButton } from './MagneticButton';

interface MenuButtonProps {
  onClick: () => void;
}

export const FloatingMenuButton = ({ onClick }: MenuButtonProps) => {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(!isMobile);

  useEffect(() => {
    if (!isMobile) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      // Show button only after scrolling past the first screen height
      if (window.scrollY > window.innerHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed z-50 top-8 right-8 md:top-8 md:right-8 bottom-auto md:bottom-auto"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MagneticButton onClick={onClick}>
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center">
              <Menu size={24} />
            </div>
          </MagneticButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 