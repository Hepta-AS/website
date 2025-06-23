'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const fade = {
  initial: { opacity: 0, y: 30 },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

interface ParallaxFadeProps {
  children: ReactNode;
  delay?: number;
}

export function ParallaxFade({ children, delay = 0 }: ParallaxFadeProps) {
  return (
    <motion.div 
      variants={fade} 
      initial='initial' 
      whileInView='open'
      viewport={{ once: true }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
} 