'use client';

import { useEffect, useRef } from 'react';

interface UseTimeOutProps {
  callback: () => void;
  duration: number;
  deps?: any[];
}

export function useTimeOut({ callback, duration, deps = [] }: UseTimeOutProps) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(callback, duration);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, deps);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
} 