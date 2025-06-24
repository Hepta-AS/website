"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FullscreenMenuProps {
  onClose: () => void;
  navItems: { name: string; href: string }[];
}

export const FullscreenMenu = ({ onClose, navItems }: FullscreenMenuProps) => {
  const router = useRouter();

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.button
        className="absolute top-8 right-8 text-white"
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X size={32} />
      </motion.button>
      <motion.div className="flex flex-col items-center space-y-8">
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
              className="text-4xl font-bold text-white hover:text-blue-500 transition-colors"
            >
              {item.name}
            </Link>
          </motion.div>
        ))}
        <motion.div
          className="pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * navItems.length }}
        >
          <Button
            onClick={() => {
              router.push('/contact');
              onClose();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xl py-3 px-8 rounded-full"
          >
            Kontakt
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}; 