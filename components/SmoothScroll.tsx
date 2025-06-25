"use client";

import { useEffect } from 'react';
import Lenis from 'lenis';

const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.07, // Lower value makes scrolling "heavier"
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
};

export default SmoothScroll; 