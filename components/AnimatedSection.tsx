"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  forwardedRef?: React.RefObject<HTMLElement>;
}

export const AnimatedSection = ({ children, className = "", forwardedRef }: AnimatedSectionProps) => {
  const internalRef = useRef<HTMLElement>(null);
  const sectionRef = forwardedRef || internalRef;
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <motion.section
      ref={sectionRef}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}; 