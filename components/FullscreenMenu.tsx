"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { MagneticButton } from "./MagneticButton";

interface FullscreenMenuProps {
  onClose: () => void;
  onLoginClick: () => void;
  navItems: { name: string; href: string }[];
  shouldPageBeWhite?: boolean;
}

export const FullscreenMenu = ({ onClose, onLoginClick, navItems, shouldPageBeWhite = false }: FullscreenMenuProps) => {
  const router = useRouter();

  const textColor = shouldPageBeWhite ? "text-black" : "text-white";
  const hoverColor = shouldPageBeWhite ? "hover:text-blue-600" : "hover:text-blue-500";
  const bgColor = shouldPageBeWhite ? "bg-white" : "bg-black";
  const buttonTextColor = shouldPageBeWhite ? "text-white" : "text-white";

  return (
    <motion.div
      className={`fixed inset-0 ${bgColor} bg-opacity-90 backdrop-blur-sm z-50 flex flex-col items-center justify-center`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center space-y-8">
        {navItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Link
              href={item.href}
              onClick={onClose}
              className={`text-4xl font-bold ${textColor} ${hoverColor} transition-colors`}
            >
              {item.name}
            </Link>
          </motion.div>
        ))}
        <motion.div
          className="pt-8 flex space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * navItems.length }}
        >
          <Button
            onClick={() => {
              onLoginClick();
              onClose();
            }}
            variant="outline"
            className={`border-blue-600 hover:bg-blue-600/10 ${textColor} text-xl py-3 px-8 rounded-full`}
          >
            Logg inn
          </Button>
          <Button
            onClick={() => {
              router.push('/contact');
              onClose();
            }}
            className={`bg-blue-600 hover:bg-blue-700 ${buttonTextColor} text-xl py-3 px-8 rounded-full`}
          >
            Kontakt
          </Button>
        </motion.div>
      </div>
      <div className="fixed bottom-8 right-8 z-50">
        <MagneticButton 
          onClick={onClose}
          className="p-0 rounded-full aspect-square w-24 h-24 bg-blue-600 text-white flex items-center justify-center"
        >
          <X size={40} />
        </MagneticButton>
      </div>
    </motion.div>
  );
}; 