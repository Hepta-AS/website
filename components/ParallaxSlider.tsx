'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'framer-motion';

function useParallaxSlider(baseVelocity = 100) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, v => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return x;
}

interface ParallaxSliderProps {
  children: React.ReactNode;
  baseVelocity?: number;
  className?: string;
}

function ParallaxText({ children, baseVelocity = 100, className }: ParallaxSliderProps) {
  const x = useParallaxSlider(baseVelocity);

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div className="flex whitespace-nowrap" style={{ x }}>
        <span className="block mr-8">{children} </span>
        <span className="block mr-8">{children} </span>
        <span className="block mr-8">{children} </span>
        <span className="block mr-8">{children} </span>
      </motion.div>
    </div>
  );
}

export function ParallaxSlider() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.section 
      style={{ opacity }}
      className="py-8 bg-transparent"
    >
      <ParallaxText baseVelocity={-5} className="text-4xl md:text-6xl font-bold text-gray-300 dark:text-gray-600">
        INNOVASJON • TEKNOLOGI • KREATIVITET • KVALITET • FREMTID •
      </ParallaxText>
      <ParallaxText baseVelocity={5} className="text-4xl md:text-6xl font-bold text-gray-300 dark:text-gray-600 mt-4">
        DESIGN • UTVIKLING • STRATEGI • LØSNINGER • DIGITAL •
      </ParallaxText>
    </motion.section>
  );
} 