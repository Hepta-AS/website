'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dot } from 'lucide-react';

const words = [
  'Innovasjon',
  'Teknologi', 
  'Kreativitet',
  'Kvalitet',
  'Fremtid'
];

export function SimpleAnimation() {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      if (index < words.length - 1) {
        setIndex(prev => prev + 1);
      } else {
        setIsVisible(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [index]);

  if (!isVisible) return null;

  return (
    <motion.section 
      className="relative z-20 h-[60vh] w-full bg-gray-900 text-white flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex items-center text-3xl md:text-4xl font-bold"
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Dot size={48} className="me-3 text-blue-500" />
        <p>{words[index]}</p>
      </motion.div>
    </motion.section>
  );
} 