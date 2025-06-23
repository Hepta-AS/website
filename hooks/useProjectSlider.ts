'use client';

import { useScroll, useTransform } from 'framer-motion';
import { RefObject } from 'react';

export function useProjectSlider(element: RefObject<HTMLElement>) {
  const { scrollYProgress } = useScroll({
    target: element,
    offset: ['start end', 'end start'],
  });

  const transformX1 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const transformX2 = useTransform(scrollYProgress, [0, 1], [-250, 0]);
  const transformY = useTransform(scrollYProgress, [0, 0.9], [250, 0]);

  return { transformX1, transformX2, transformY };
} 