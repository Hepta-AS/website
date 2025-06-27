"use client";

import { useState } from 'react';
import { MainNav } from './main-nav';
import { Footer } from './footer';
import { LoginModal } from './login-modal';

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <MainNav onLoginClick={() => setIsLoginModalOpen(true)} />
      <main className="pt-20 flex-grow">{children}</main>
      <Footer />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
} 