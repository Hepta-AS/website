"use client";

import { useRef, useState, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const MagneticButton = ({ children, onClick, className }: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x, y });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export function MagneticButton({ 
  children, 
  variant = 'default', 
  className, 
  ...props 
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      style={{ 
        position: 'relative',
        x: position.x,
        y: position.y,
      }}
      transition={{ type: "spring", stiffness: 350, damping: 5, mass: 0.5 }}
    >
      <Button
        ref={ref}
        variant={variant}
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          "before:absolute before:inset-0 before:bg-blue-600 before:translate-y-full before:transition-transform before:duration-300",
          "hover:before:translate-y-0 hover:text-white",
          className
        )}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </Button>
    </motion.div>
  );
} 