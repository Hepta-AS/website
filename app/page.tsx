"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import { ContactFormModal } from "@/components/contact-form-modal";
import { useAuth } from "@/contexts/auth-context";

import { ServiceCards } from "@/components/serviceCards";

import { TextAndImage } from "@/components/TextAndImage";
import { ContactCallToAction } from "@/components/ContactCallToAction";
import { Preloader } from "@/components/preloader";
import useIntersectionObserverInit from "@/hooks/useIntersectionObserverInit";



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
  const router = useRouter();
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const triggerSectionRef = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserverInit(triggerSectionRef, {
    threshold: 0.4,
    freezeOnceVisible: false,
  });
  const shouldPageBeWhite = mounted ? !!entry?.isIntersecting : false;

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

  const defaultPageBg = "bg-gray-900 dark:bg-black";
  const defaultPageFg = "text-gray-100 dark:text-gray-50";
  const whitePageBg = "bg-white dark:bg-gray-100";
  const whitePageFg = "text-gray-900 dark:text-gray-800";

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
      {isLoading && <Preloader onComplete={() => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('hepta-visited', 'true');
        }
        setIsLoading(false);
      }} />}
      <div
        className={`w-full overflow-x-hidden ${
          shouldPageBeWhite ? `${whitePageBg} ${whitePageFg}` : `${defaultPageBg} ${defaultPageFg}`
        } ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        style={{ scrollBehavior: 'auto' }}
      >
      <div className="space-y-32 overflow-x-hidden">
        {/* HERO SECTION */}
        <section
          className="relative flex flex-col overflow-hidden h-screen"
          style={{ touchAction: 'auto' }}
        >
          <div
            className={`absolute inset-0 z-0 ${
              shouldPageBeWhite ? "opacity-0" : defaultPageBg
            }`}
          />
          {/* Hero video with fallback */}
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
          <div
            className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent ${
              shouldPageBeWhite ? "to-white dark:to-gray-100" : "to-gray-900 dark:to-black"
            } z-0`}
          />
          
          <div className="absolute left-0 w-full bottom-1/3 top-auto translate-y-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-10 px-6 sm:px-12">
            <div>
              <h1 className="font-serif text-white text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-tight tracking-tight drop-shadow-lg text-left select-none mb-8">
                Digitale løsninger som driver din bedrift fremover
              </h1>
            </div>
          </div>
        </section>



        <section className="py-20 sm:py-32">
          <div className="container mx-auto px-4 text-center">
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight ${shouldPageBeWhite ? 'text-gray-900' : 'text-white'}`}>
              Teknologi i kjernen av alt vi gjør
            </h2>
            <p className={`mt-6 max-w-3xl mx-auto text-lg sm:text-xl ${shouldPageBeWhite ? 'text-gray-600' : 'text-gray-300'}`}>
              Vi bygger ikke bare nettsider, vi skaper digitale økosystemer. Fra avanserte webapplikasjoner til AI-drevne automatiseringsløsninger, bruker vi den nyeste teknologien for å gi deg et konkurransefortrinn.
            </p>
            <div className="mt-10">
              <Button onClick={handleServiceNavigation} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105">
                Utforsk våre tjenester
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        <section className={`py-24 ${shouldPageBeWhite ? whitePageBg : defaultPageBg}`}>
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className={`text-4xl font-bold tracking-tight ${shouldPageBeWhite ? whitePageFg : defaultPageFg}`}>
                Ekspertise som gir resultater
              </h2>
              <p className={`mt-4 text-xl ${shouldPageBeWhite ? 'text-gray-600' : 'text-gray-400 dark:text-gray-500'}`}>
                Fra AI-automatisering til visuelt innhold - vi leverer skreddersydde digitale løsninger som transformerer måten du driver forretning på
              </p>
            </div>
            <div className="mt-16">
              <ServiceCards services={services} shouldPageBeWhite={shouldPageBeWhite} />
            </div>
          </div>
        </section>

        <section ref={triggerSectionRef} className={`py-16 sm:py-24 lg:py-32 ${shouldPageBeWhite ? whitePageBg : defaultPageBg}`}>
          <div className="container mx-auto px-4">
            <div className="mb-16 md:mb-24">
              <TextAndImage {...section1Data} imageOnLeft={false} useDarkText={shouldPageBeWhite} />
            </div>
            <div>
              <TextAndImage {...section2Data} imageOnLeft={true} useDarkText={shouldPageBeWhite} />
            </div>
          </div>
        </section>

        <ContactCallToAction
          id="kontakt-oss"
          line1={contactAdventureData.line1}
          line2={contactAdventureData.line2}
          line3={contactAdventureData.line3}
          buttonText={contactAdventureData.button}
          onButtonClick={handleStartClick}
          shouldPageBeWhite={shouldPageBeWhite}
        />

        

        <ContactFormModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      </div>
    </div>
    </>
  );
}
