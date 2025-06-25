"use client";

import { useEffect, useState } from 'react';
import Lenis from 'lenis';

export const useLenis = () => {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const newLenis = new Lenis({
      lerp: 0.07, // Lower value makes scrolling "heavier"
      smoothWheel: true,
    });

    setLenis(newLenis);

    function raf(time: number) {
      newLenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      newLenis.destroy();
      setLenis(null);
    };
  }, []);

  return lenis;
};

const SmoothScroll = () => {
  useLenis(); // Initialize Lenis
  return null;
};

export default SmoothScroll; 