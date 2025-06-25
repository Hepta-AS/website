"use client";

import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { useIsMobile } from '../hooks/use-mobile';

interface FloatingMenuButtonProps {
  onClick: () => void;
  isMenuOpen: boolean;
}

export const FloatingMenuButton = ({ onClick, isMenuOpen }: FloatingMenuButtonProps) => {
  const isMobile = useIsMobile();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setShowButton(true);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  if (!showButton && !isMenuOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 md:top-8 md:bottom-auto">
      <MagneticButton onClick={onClick}>
        <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
          <motion.div
            animate={{ rotate: isMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </div>
      </MagneticButton>
    </div>
  );
}; 