"use client";

import { useRef, useState, useEffect } from 'react';
import { useInView } from "framer-motion";
import { services } from '@/lib/services';
import { VideoHero } from '@/components/video-hero';
import { ServiceCards } from '@/components/serviceCards';
import { TextAndImage } from '@/components/TextAndImage';
import InteractiveCtaSection from '@/components/InteractiveCtaSection';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Preloader } from '@/components/preloader';

export default function Home() {
    const whiteSection1Ref = useRef<HTMLDivElement>(null);
    const isInWhiteSection = useInView(whiteSection1Ref, { amount: 0.2 });
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    const handleServiceNavigation = () => router.push("/tjenester");

    const section1Data = {
        imageSrc: "/samarbeid_compressed.jpg",
        altText: "Strategisk samarbeid mellom Hepta og klient",
        title: "Din strategiske teknologipartner",
        paragraphs: [
          "Vi er mer enn bare leverandører - vi blir din forlengede arm innen digital utvikling. Med dype fagkunnskap og forståelse for moderne forretningsutfordringer hjelper vi deg å realisere digitale ambisjoner.",
          "Gjennom transparent kommunikasjon og brukerorientert design sikrer vi at hver løsning bidrar til din langsiktige konkurransekraft og vekst.",
        ],
        imagePosition: 'left' as const
    };
    
    const section2Data = {
        imageSrc: "/creativity_compressed.jpg",
        altText: "Innovativ teknologi og kreativ problemløsning",
        title: "Der innovasjon møter håndverk",
        paragraphs: [
          "Vi forener kreativ problemløsning med solid teknisk ekspertise. Våre løsninger er ikke bare funksjonelle, men også intuitive og skalerbare for fremtidens behov.",
          "Fra AI-drevne automatiseringer til engasjerende videoinnhold - kvalitet og innovation er grunnpilaren i alt vi leverer.",
        ],
        imagePosition: 'right' as const
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && sessionStorage.getItem('hepta-visited')) {
          setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return <Preloader onComplete={() => setIsLoading(false)} />;
    }

    return (
        <main className="flex-grow">
            <VideoHero 
                videoSrc="/videos/ork_compressed.mp4#t=0.1"
                title="Digitale løsninger som driver din bedrift fremover"
                subtitle=""
            />

            <AnimatedSection className="py-20 sm:py-32 text-center">
                <div className="container mx-auto px-4">
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
            
            <AnimatedSection className="py-24 sticky top-0 z-10">
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

            <div className="bg-white relative z-20">
                <AnimatedSection forwardedRef={whiteSection1Ref} className="text-black py-24">
                    <TextAndImage {...section1Data} />
                </AnimatedSection>
                <AnimatedSection className="text-black py-24">
                    <TextAndImage {...section2Data} />
                </AnimatedSection>
            </div>

            <AnimatedSection>
                <InteractiveCtaSection />
            </AnimatedSection>
        </main>
    );
}
