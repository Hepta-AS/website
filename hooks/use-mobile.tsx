"use client"

import { useState, useEffect } from 'react';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // This effect runs only in the browser, where `window` is available.
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkDevice();

    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
