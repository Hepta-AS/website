"use client"

import { ContactFormModal } from "@/components/contact-form-modal";
import { VideoHero } from '@/components/video-hero';
import { ImageTextSplitSection } from '@/components/image-text-split-section';
import InteractiveCtaSection from "@/components/InteractiveCtaSection";

import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function OmOssContent() {
    const router = useRouter();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    const teamImages = [
        "/Molde.jpg",
    ];

    const teknologiImages = [
        "/technology_compressed.jpg",
    ];

    const kreativitetImages = [
        "/creativity_compressed.jpg",
    ];

    return (
        <div className="w-full overflow-x-hidden">
            {/* Video Hero Section - Fixed height to prevent getting stuck */}
            <section className="relative h-screen max-h-[800px] min-h-[600px] overflow-hidden">
                <VideoHero
                    videoSrc="/videos/omosshero_compressed.mp4"
                    title="HEPTA"
                    subtitle="Din partner for digital transformasjon"
                />
            </section>

            {/* Introductory Text Section */}
            <section className="min-h-[60vh] flex flex-col items-center justify-center text-center py-16 bg-black text-white px-4">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6 text-white">
                        Vi bygger fremtidens digitale løsninger
                    </h1>
                    <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Hepta er et innovativt konsulentselskap som kombinerer teknologisk ekspertise med kreativ tenkning. 
                        Vi hjelper bedrifter med å navigere den digitale transformasjonen og skape løsninger som gir varig verdi.
                    </p>
                </div>
            </section>

            {/* Vår Historie og Verdier */}
            <div className="bg-neutral-900 py-16">
                <ImageTextSplitSection
                    imageSrc={teamImages[0]}
                    altText="Molde - hvor Hepta har sine røtter"
                    title="Vår Historie og Visjon"
                    paragraphs={[
                        "Hepta ble grunnlagt med en klar visjon: å være den foretrukne partneren for bedrifter som ønsker å utnytte teknologiens kraft for å skape varig verdi. Vi kombinerer dyp teknisk kunnskap med kreativ problemløsning.",
                        "Vårt team består av erfarne konsulenter innen teknologi, design, kommunikasjon og strategi. Vi tror på at de beste løsningene oppstår når ulike perspektiver møtes og skaper noe helt nytt sammen.",
                        "Fra små startups til etablerte virksomheter - vi tilpasser våre tjenester etter dine unike behov og mål."
                    ]}
                    imageOnLeft={true}
                    isTextBlack={false}
                />
            </div>

            {/* Teknologi og Innovasjon */}
            <div className="bg-black py-16">
                <ImageTextSplitSection
                    imageSrc={teknologiImages[0]}
                    altText="Avansert teknologi og innovasjon"
                    title="Teknologi som Driver Endring"
                    paragraphs={[
                        "Vi lever og ånder for teknologi. Vår tilnærming er bygget på å utnytte kraften i moderne verktøy og plattformer for å skape robuste, skalerbare og fremtidsrettede løsninger.",
                        "Fra AI og maskinlæring til moderne webapplikasjoner og mobile løsninger - vi holder oss i forkant av teknologisk utvikling for å gi våre kunder det beste.",
                        "Våre løsninger er designet for å vokse med din virksomhet og tilpasse seg endringer i markedet og teknologilandskapet."
                    ]}
                    imageOnLeft={false}
                    isTextBlack={false}
                />
            </div>

            {/* Kreativitet og Strategi */}
            <div className="bg-neutral-900 py-16">
                <ImageTextSplitSection
                    imageSrc={kreativitetImages[0]}
                    altText="Kreativ prosess og strategisk tenkning"
                    title="Kreativitet Møter Strategi"
                    paragraphs={[
                        "God teknologi er bare halvparten av ligningen. Vi kombinerer teknisk ekspertise med kreativ tenkning og strategisk innsikt for å skape løsninger som virkelig engasjerer.",
                        "Våre tjenester spenner fra digital markedsføring og innholdsproduksjon til strategisk rådgivning og merkevarebygging. Vi forstår at hver bedrift har sin unike historie å fortelle.",
                        "Gjennom kreativ problemløsning og databaserte beslutninger hjelper vi våre kunder med å nå sine mål og overgå forventningene."
                    ]}
                    imageOnLeft={true}
                    isTextBlack={false}
                />
            </div>

            {/* Våre Kjerneverdier */}
            <section className="py-16 bg-black">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 text-white">Våre Kjerneverdier</h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Disse verdiene styrer alt vi gjør og former hvordan vi samarbeider med våre kunder.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-white">I</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-white">Innovasjon</h3>
                            <p className="text-gray-300">
                                Vi utforsker kontinuerlig nye teknologier og metoder for å finne de beste løsningene for våre kunder.
                            </p>
                        </div>
                        
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-white">K</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-white">Kvalitet</h3>
                            <p className="text-gray-300">
                                Vi setter høye standarder for alt vi leverer og går aldri på kompromiss med kvaliteten.
                            </p>
                        </div>
                        
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-white">S</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-white">Samarbeid</h3>
                            <p className="text-gray-300">
                                Vi tror på kraften i samarbeid og bygger langsiktige partnerskap med våre kunder.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* New Interactive CTA Section */}
            <InteractiveCtaSection />

            {/* Contact Form Modal */}
            <ContactFormModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
        </div>
    );
} 