"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { LoginModal } from "@/components/login-modal";
import { ContactFormModal } from "@/components/contact-form-modal";
import { useAuth } from "@/contexts/auth-context";
import { ServiceCards } from "@/components/serviceCards";
import { BigTextGrid } from "@/components/BigTextGrid";
import { TextAndImage } from "@/components/TextAndImage";
import { ContactCallToAction } from "@/components/ContactCallToAction";
import useIntersectionObserverInit from "@/hooks/useIntersectionObserverInit";

export default function Home() {
  const auth = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const previousPath = useRef(pathname);

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

  const handleLoginClick = () => setIsLoginModalOpen(true);
  const handleStartClick = () => setIsContactModalOpen(true);
  const handleServiceNavigation = () => router.push("/tjenester");

  const services = [
    {
      title: "Ai og automasjon",
      content: "Trenger din bedrift raskere prossesser? Utforsk mulighetene AI kan ha i din bedrift.",
      slug: "AI",
      image: "/group11.png",
    },
    {
      title: "Videoproduksjon",
      content: "Vi kan bistå med redigering, eller videoproduksjon ved behov",
      slug: "Videoproduksjon",
      image: "/IMG_9003.JPG",
    },
    {
      title: "Digital markedsføring",
      content: "Behov for markedsføring? Vi bruker data for å treffe riktig målgruppe",
      slug: "Digitalmarkedsforing",
      image: "/ai.jpg",
    },
    {
      title: "Utvikling",
      content: "Behov for tekniske løsninger? Vi har bred erfaring i utvikling av alt fra Web løsninger, infrastruktur og mikrokontrollere",
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
    altText: "Strategisk samarbeid",
    title: "Strategisk Partnerskap",
    paragraphs: [
      "Vi går dypere enn bare utførelse. Vi blir din strategiske partner, dedikert til å forstå din kjernevirksomhet og dine mål.",
      "Vår prosess er transparent, samarbeidsorientert og alltid fokusert på din langsiktige suksess og vekst.",
    ],
    imageContainerCustomClass: "aspect-[4/3] bg-gray-300 dark:bg-gray-700",
  };

  const section2Data = {
    imageSrc: "/creativity.jpg",
    altText: "Placeholder image 2",
    title: "Kreativitet og Teknologi",
    paragraphs: [
      "Vi kombinerer nyskapende design med den nyeste teknologien for å skape løsninger som ikke bare ser bra ut, men som også fungerer feilfritt.",
      "Kvalitet og innovasjon er kjernen i alt vi gjør, fra konsept til ferdig produkt.",
    ],
    imageContainerCustomClass: "aspect-[4/3] bg-gray-400 dark:bg-gray-600",
  };

  const contactAdventureData = {
    line1: "ET NYTT KAPITTEL",
    line2: "VENTER PÅ DEG.",
    line3: "TRYKK FOR Å AVDEKKE",
    line4: "POTENSIALET SAMMEN.",
    button: "START DITT NESTE KAPITTEL",
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
        >
          <div
            className={`absolute inset-0 z-0 ${
              shouldPageBeWhite ? "opacity-0" : defaultPageBg
            } transition-opacity duration-1000`}
          />
          <Image
            src="/herobg.jpg"
            alt=""
            fill
            priority
            quality={100}
            className="object-cover opacity-70 z-0"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60 z-0" />
          <div
            className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent ${
              shouldPageBeWhite ? "to-white dark:to-gray-100" : "to-gray-900 dark:to-black"
            } z-0`}
          />
          <div className="absolute left-0 w-full top-[60%] md:top-1/2 -translate-y-1/4 md:-translate-y-1/2 z-10 px-6 sm:px-12">
            <h1 className="font-serif text-white text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-tight tracking-tight drop-shadow-lg text-left select-none opacity-0 animate-fade-in">
              Vi hjelper deg med å ta det neste steget
            </h1>
          </div>
        </section>

        <BigTextGrid
          line1Text="WE CRAFT DIGITAL"
          line2Text="EXPERIENCES THAT"
          line3Text="TRULY RESONATE DEEPLY."
          line4Text="INNOVATION DRIVES OUR EVERY MOVE."
        />

        <section>
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight">Hva vi gjør</h2>
              <p className="mt-4 text-xl text-gray-400 dark:text-gray-500">
                Vi tilbyr en rekke tjenester for å hjelpe din bedrift å vokse og lykkes
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
