"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import { LoginModal } from "@/components/login-modal";
import { ContactFormModal } from "@/components/contact-form-modal";
import { useAuth } from "@/contexts/auth-context";
import { ServiceCards } from "@/components/serviceCards";
import { BigTextGrid } from "@/components/BigTextGrid";
import { TextAndImage } from "@/components/TextAndImage";
import { ContactCallToAction } from "@/components/ContactCallToAction";
import { SimpleAnimation } from "@/components/SimpleAnimation";
import Image from "next/image";
import useIntersectionObserverInit from "@/hooks/useIntersectionObserverInit";

export default function Home() {
  const auth = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const previousPath = useRef(pathname);

  // Check auth state on mount
  useEffect(() => {
    auth.checkAuth();
  }, [auth]);

  // Track scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-close contact modal on route change
  useEffect(() => {
    if (isContactModalOpen && pathname !== previousPath.current) {
      setIsContactModalOpen(false);
    }
    previousPath.current = pathname;
  }, [pathname, isContactModalOpen]);

  const handleLoginClick = () => setIsLoginModalOpen(true);
  const handleStartClick = () => setIsContactModalOpen(true);
  const handleServiceNavigation = () => router.push("/tjenester");

  const services = [
    {
      title: "AI og automasjon",
      content: "Effektiviser forretningsprosessene dine med skreddersydde AI-løsninger og automatiserte arbeidsflyter som sparer tid og øker lønnsomheten.",
      slug: "AI",
      image: "/group11.jpg",
    },
    {
      title: "Videoproduksjon",
      content: "Fra konsept til ferdig film - vi produserer engasjerende videoinnhold som styrker ditt merke og når din målgruppe effektivt.",
      slug: "Videoproduksjon",
      image: "/IMG_9003.JPG",
    },
    {
      title: "Digital markedsføring",
      content: "Databaserte markedsføringsstrategier som treffer riktig målgruppe, øker synlighet og genererer målbare resultater for din bedrift.",
      slug: "Digitalmarkedsforing",
      image: "/ai.jpg",
    },
    {
      title: "Utvikling",
      content: "Skalerbare tekniske løsninger fra webapplikasjoner til avansert infrastruktur - vi bygger fremtidens digitale plattformer.",
      slug: "Utvikling",
      image: "/consulting.jpg",
    },
  ];

  const triggerSectionRef = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserverInit(triggerSectionRef, {
    threshold: 0.4,
    freezeOnceVisible: false,
  });
  const shouldPageBeWhite = !!entry?.isIntersecting;

  const section1Data = {
    imageSrc: "/samarbeid.jpg",
    altText: "Strategisk samarbeid mellom Hepta og klient",
    title: "Din strategiske teknologipartner",
    paragraphs: [
      "Vi er mer enn bare leverandører - vi blir din forlengede arm innen digital utvikling. Med dype fagkunnskap og forståelse for moderne forretningsutfordringer hjelper vi deg å realisere digitale ambisjoner.",
      "Gjennom transparent kommunikasjon og brukerorientert design sikrer vi at hver løsning bidrar til din langsiktige konkurransekraft og vekst.",
    ],
    imageContainerCustomClass: "aspect-[4/3] bg-gray-300 dark:bg-gray-700",
  };

  const section2Data = {
    imageSrc: "/creativity.jpg",
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

  const blueResponsiveFontSize = "text-[clamp(1rem,_0.5rem_+_2vw,_2.5rem)]";
  const blueTextStyle = `font-bold ${blueResponsiveFontSize} text-blue-500 leading-tight tracking-tight`;

  const mainNavHeight = "5rem";

  return (
    <div
      className={`w-full transition-colors duration-1000 ease-in-out overflow-x-hidden ${
        shouldPageBeWhite ? `${whitePageBg} ${whitePageFg}` : `${defaultPageBg} ${defaultPageFg}`
      }`}
    >
      <div className="space-y-32 overflow-x-hidden">
        {/* HERO SECTION */}
        <section
          className="relative flex flex-col overflow-hidden h-screen"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <div
            className={`absolute inset-0 z-0 ${
              shouldPageBeWhite ? "opacity-0" : defaultPageBg
            } transition-opacity duration-1000`}
          />
          {/* Hero video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
          >
            <source src="/videos/network.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60 z-0" />
          <div
            className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent ${
              shouldPageBeWhite ? "to-white dark:to-gray-100" : "to-gray-900 dark:to-black"
            } z-0`}
          />
          <div className="absolute left-0 w-full bottom-1/3 top-auto translate-y-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-10 px-6 sm:px-12">
            <h1 className="font-serif text-white text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-tight tracking-tight drop-shadow-lg text-left select-none opacity-0 animate-fade-in">
              Digitale løsninger som driver din bedrift fremover
            </h1>
          </div>
        </section>

        <SimpleAnimation />

        <BigTextGrid
          line1Text="VI SKAPER DIGITALE"
          line2Text="OPPLEVELSER SOM"
          line3Text="ENGASJERER OG KONVERTERER."
          line4Text="TEKNOLOGI ER VÅR LIDENSKAP."
        />

        <section>
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight">Ekspertise som gir resultater</h2>
              <p className="mt-4 text-xl text-gray-400 dark:text-gray-500">
                Fra AI-automatisering til visuelt innhold - vi leverer skreddersydde digitale løsninger som transformerer måten du driver forretning på
              </p>
            </div>
            <div className="mt-16">
              <ServiceCards services={services} />
            </div>
          </div>
        </section>

        <section ref={triggerSectionRef} className="py-16 sm:py-24 lg:py-32">
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
        />

        <div className="mt-8 sm:mt-10 md:mt-12 text-center w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl px-4">
          <p className={`${blueTextStyle}`}></p>
        </div>

        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        <ContactFormModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      </div>
    </div>
  );
}
