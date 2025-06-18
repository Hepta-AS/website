"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';

const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900/90 backdrop-blur-sm p-4 shadow-lg animate-fade-in">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-neutral-300">
          Vi bruker informasjonskapsler (cookies) for å forbedre opplevelsen din, håndtere innlogging, sikre betalinger (via Stripe), og analysere trafikk (via TikTok).
          Ved å fortsette godtar du vår bruk av disse. Les mer i vår{' '}
          <Link href="/privacy" className="underline hover:text-white">
            personvernerklæring
          </Link>.
        </p>
        <Button 
          onClick={handleAccept} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md whitespace-nowrap"
        >
          Jeg forstår
        </Button>
      </div>
    </div>
  );
} 