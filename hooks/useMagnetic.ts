'use client';

import { useCallback, useState, RefObject } from 'react';

export function useMagnetic(element: RefObject<HTMLButtonElement>) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMagneticMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!element.current) return;
      
      const { clientX, clientY } = event;
      const { width, height, left, top } = element.current.getBoundingClientRect();

      const x = (clientX - (left + width / 2)) * 0.35;
      const y = (clientY - (top + height / 2)) * 0.35;
      setPosition(prePosition => ({ ...prePosition, x, y }));
    },
    [element],
  );

  const handleMagneticOut = useCallback(() => setPosition({ x: 0, y: 0 }), []);

  return { position, handleMagneticMove, handleMagneticOut };
} 