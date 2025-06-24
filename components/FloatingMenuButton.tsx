"use client";

import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { MagneticButton } from "./MagneticButton";

interface FloatingMenuButtonProps {
  onClick: () => void;
  colorClass: string;
  hoverColorClass: string;
}

export const FloatingMenuButton = ({ onClick, colorClass, hoverColorClass }: FloatingMenuButtonProps) => (
  <motion.div
    className="fixed bottom-8 right-8 z-50"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <MagneticButton
      onClick={onClick}
      className={`rounded-full shadow-lg h-16 w-16 flex items-center justify-center ${colorClass} ${hoverColorClass}`}
    >
      <Menu size={24} />
    </MagneticButton>
  </motion.div>
); 