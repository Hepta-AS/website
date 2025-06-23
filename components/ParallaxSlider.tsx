'use client';

import { Fragment, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useParallaxSlider } from '@/hooks/useParallaxSlider';
import { randomId } from '@/lib/utils';

interface ParallaxSliderProps {
  children: ReactNode;
  repeat?: number;
  baseVelocity: number;
}

export function ParallaxSlider({ children, repeat = 2, baseVelocity }: ParallaxSliderProps) {
  const x = useParallaxSlider(baseVelocity);

  return (
    <div className='flex flex-nowrap overflow-hidden whitespace-nowrap'>
      <motion.div style={{ x }}>
        {Array.from({ length: repeat }, () => {
          const id = randomId();
          return <Fragment key={id}>{children}</Fragment>;
        })}
      </motion.div>
    </div>
  );
} 