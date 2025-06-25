"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import { ContactFormModal } from "@/components/contact-form-modal";
import { useAuth } from "@/components/auth-provider";

import { ServiceCards } from "@/components/serviceCards";

import { TextAndImage } from "@/components/TextAndImage";
import { Preloader } from "@/components/preloader";
import useIntersectionObserverInit from "@/hooks/useIntersectionObserverInit";
import InteractiveCtaSection from "@/components/InteractiveCtaSection";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";

function AnimatedSection({ children, className = "", forwardedRef }: { children: React.ReactNode, className?: string, forwardedRef?: React.RefObject<HTMLElement> }) {
  const internalRef = useRef<HTMLElement>(null);
  const sectionRef = forwardedRef || internalRef;
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <motion.section
      ref={sectionRef}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}

export default function Home() {
  const auth = useAuth();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(() => {
    // Only show preloader on first visit (no sessionStorage item)
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('hepta-visited');
    }
    return true;
  });
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isInWhiteSection, setIsInWhiteSection] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const videoRef = useRef<HTMLVideoElement>(null);
  const whiteSection1Ref = useRef<HTMLDivElement>(null);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check auth state on mount
  useEffect(() => {
    auth.checkAuth();
  }, [auth]);

  // Auto-close contact modal on route change
  useEffect(() => {
    if (isContactModalOpen && pathname !== previousPath.current) {
      setIsContactModalOpen(false);
    }
    previousPath.current = pathname;
  }, [pathname, isContactModalOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
            setIsInWhiteSection(true);
          } else if (!entry.isIntersecting && isInWhiteSection) {
            // Only set to false if we're scrolling back up past the white sections
            const rect = entry.boundingClientRect;
            if (rect.bottom < 0) {
              setIsInWhiteSection(false);
            }
          }
        });
      },
      { 
        threshold: [0, 0.2, 0.5, 1],
        rootMargin: '-50px 0px -50px 0px'
      }
    );

    const target = whiteSection1Ref.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [isInWhiteSection]);

  const handleStartClick = () => setIsContactModalOpen(true);
  const handleServiceNavigation = () => router.push("/tjenester");

  const services = [
    {
      title: "AI og automasjon",
      content: "Effektiviser forretningsprosessene dine med skreddersydde AI-løsninger og automatiserte arbeidsflyter som sparer tid og øker lønnsomheten.",
      slug: "AI",
      image: "/group11_compressed.jpg",
    },
    {
      title: "Videoproduksjon",
      content: "Fra konsept til ferdig film - vi produserer engasjerende videoinnhold som styrker ditt merke og når din målgruppe effektivt.",
      slug: "Videoproduksjon",
      image: "/IMG_9003_compressed.JPG",
    },
    {
      title: "Digital markedsføring",
      content: "Databaserte markedsføringsstrategier som treffer riktig målgruppe, øker synlighet og genererer målbare resultater for din bedrift.",
      slug: "Digitalmarkedsforing",
      image: "/ai_compressed.jpg",
    },
    {
      title: "Utvikling",
      content: "Skalerbare tekniske løsninger fra webapplikasjoner til avansert infrastruktur - vi bygger fremtidens digitale plattformer.",
      slug: "Utvikling",
      image: "/consulting_compressed.jpg",
    },
  ];

  const section1Data = {
    imageSrc: "/samarbeid_compressed.jpg",
    altText: "Strategisk samarbeid mellom Hepta og klient",
    title: "Din strategiske teknologipartner",
    paragraphs: [
      "Vi er mer enn bare leverandører - vi blir din forlengede arm innen digital utvikling. Med dype fagkunnskap og forståelse for moderne forretningsutfordringer hjelper vi deg å realisere digitale ambisjoner.",
      "Gjennom transparent kommunikasjon og brukerorientert design sikrer vi at hver løsning bidrar til din langsiktige konkurransekraft og vekst.",
    ],
    imageContainerCustomClass: "aspect-[4/3] bg-gray-300 dark:bg-gray-700",
  };

  const section2Data = {
    imageSrc: "/creativity_compressed.jpg",
    altText: "Innovativ teknologi og kreativ problemløsning",
    title: "Der innovasjon møter håndverk",
    paragraphs: [
      "Vi forener kreativ problemløsning med solid teknisk ekspertise. Våre løsninger er ikke bare funksjonelle, men også intuitive og skalerbare for fremtidens behov.",
      "Fra AI-drevne automatiseringer til engasjerende videoinnhold - kvalitet og innovation er grunnpilaren i alt vi leverer.",
    ],
    imageContainerCustomClass: "aspect-[4/3] bg-gray-400 dark:bg-gray-600",
  };

  const contactAdventureData = {
    line1: "KLAR FOR DIGITAL",
    line2: "TRANSFORMASJON?",
    line3: "LA OSS BYGGE",
    line4: "FREMTIDEN SAMMEN.",
    button: "START DIN DIGITALE REISE",
  };

  // Define colors for motion
  const darkBg = "#000000";
  const darkFg = "#F3F4F6"; // text-gray-100
  const lightBg = "#FFFFFF";
  const lightFg = "#1F2937"; // text-gray-800

  useEffect(() => {
    // Only handle video on client
    if (typeof window !== 'undefined' && videoRef.current) {
      // If preloader is done, try to play
      if (!isLoading) {
        const video = videoRef.current;
        video.play().catch(error => {
          console.error("Video autoplay was prevented:", error);
          // Optional: Add a custom play button here if needed
        });
      }
    }
  }, [isLoading]);

  if (!mounted) {
    return (
      <div className="w-full bg-gray-900 dark:bg-black text-gray-100 dark:text-gray-50 overflow-x-hidden">
        <div className="space-y-32 overflow-x-hidden">
          {/* Static hero section for SSR */}
          <section className="relative flex flex-col overflow-hidden h-screen">
            <div className="absolute inset-0 z-0 bg-gray-900 dark:bg-black" />
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
              style={{
                WebkitAppearance: 'none',
                appearance: 'none',
              }}
            >
              <source src="/videos/ork_compressed.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/20 z-0" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900 dark:to-black z-0" />
            
            <div className="absolute left-0 w-full bottom-1/3 top-auto translate-y-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-10 px-6 sm:px-12">
              <div>
                <h1 className="font-serif text-white text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-tight tracking-tight drop-shadow-lg text-left select-none mb-8">
                  Digitale løsninger som driver din bedrift fremover
                </h1>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <>
      <MainNav shouldPageBeWhite={isInWhiteSection} />
      {isLoading && <Preloader onComplete={() => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('hepta-visited', 'true');
        }
        setIsLoading(false);
      }} />}
      <div
        className={`w-full overflow-x-hidden bg-black text-white ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500 h-screen overflow-y-scroll snap-y snap-mandatory`}
      >
        <div className="overflow-x-hidden">
          {/* HERO SECTION */}
          <section
            className="relative flex flex-col justify-center overflow-hidden h-screen snap-start"
            style={{ touchAction: 'auto' }}
          >
            <div className="absolute inset-0 z-0 bg-black" />
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
            >
              <source src="/videos/ork_compressed.mp4#t=0.1" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/20 z-0" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black z-0" />
            
            <div className="absolute left-0 w-full bottom-1/3 top-auto translate-y-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-10 px-6 sm:px-12">
              <div>
                <h1 className="font-serif text-white text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-tight tracking-tight drop-shadow-lg text-left select-none mb-8">
                  Digitale løsninger som driver din bedrift fremover
                </h1>
              </div>
            </div>
          </section>

          <AnimatedSection className="h-screen flex items-center justify-center snap-start">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
                Teknologi i kjernen av alt vi gjør
              </h2>
              <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-300">
                Vi bygger ikke bare nettsider, vi skaper digitale økosystemer. Fra avanserte webapplikasjoner til AI-drevne automatiseringsløsninger, bruker vi den nyeste teknologien for å gi deg et konkurransefortrinn.
              </p>
              <div className="mt-10">
                <Button onClick={handleServiceNavigation} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105">
                  Utforsk våre tjenester
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection className="h-screen flex items-center justify-center snap-start">
              <div className="container mx-auto px-4">
                  <div className="text-center">
                      <h2 className="text-4xl font-bold tracking-tight">
                          Ekspertise som gir resultater
                      </h2>
                      <p className="mt-4 text-xl text-gray-300">
                          Fra AI-automatisering til visuelt innhold - vi leverer skreddersydde digitale løsninger som transformerer måten du driver forretning på
                      </p>
                  </div>
                  <div className="mt-16">
                      <ServiceCards services={services} shouldPageBeWhite={isInWhiteSection} />
                  </div>
              </div>
          </AnimatedSection>

          <AnimatedSection forwardedRef={whiteSection1Ref} className="bg-white text-black h-screen flex items-center justify-center snap-start">
            <TextAndImage {...section1Data} imagePosition="left" />
          </AnimatedSection>

          <AnimatedSection className="bg-white text-black h-screen flex items-center justify-center snap-start">
            <TextAndImage {...section2Data} imagePosition="right" />
          </AnimatedSection>

          <AnimatedSection className="h-screen flex items-center justify-center snap-start">
             <InteractiveCtaSection />
          </AnimatedSection>
          
          <footer className="h-screen snap-start flex items-center justify-center">
            <Footer />
          </footer>
        </div>
      </div>
      <ContactFormModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </>
  );
}
