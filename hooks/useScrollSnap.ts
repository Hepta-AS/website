"use client";

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export const useScrollSnap = (
  sectionsSelector: string,
  lenisInstance: Lenis | null
) => {
  const isScrolling = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!lenisInstance) return;

    const sections = document.querySelectorAll(sectionsSelector);
    if (sections.length === 0) return;

    const handleScroll = () => {
      if (isScrolling.current) return;

      const viewportCenter = window.innerHeight / 2;

      let closestSection: Element | null = null;
      let minDistance = Infinity;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - sectionCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestSection = section;
        }
      });

      if (closestSection) {
        // Debounce the scroll-to logic
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          isScrolling.current = true;
          lenisInstance.scrollTo(closestSection as HTMLElement, {
            offset: -window.innerHeight / 2 + closestSection!.getBoundingClientRect().height / 2,
            duration: 1.2, // Adjust duration for a smoother/heavier feel
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo-out easing
            onComplete: () => {
              // Add a small delay before allowing scrolling again
              setTimeout(() => {
                isScrolling.current = false;
              }, 200);
            },
          });
        }, 300); // Wait for scrolling to settle
      }
    };

    lenisInstance.on('scroll', handleScroll);

    return () => {
      lenisInstance.off('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [lenisInstance, sectionsSelector]);
}; 