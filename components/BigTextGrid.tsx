// components/BigTextGrid.tsx
"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from "next/image";
import { useProjectSlider } from '@/hooks/useProjectSlider';

interface BigTextGridProps {
  line1Text: string;
  line2Text: string;
  line3Text: string;
  line4Text: string;
  shouldPageBeWhite?: boolean;
}

// --- Placeholder Height (Increased) ---
const placeholderHeight = "h-[120px] sm:h-[160px] md:h-[200px] lg:h-[280px] xl:h-[350px]";

// Temporary styling for visualizing placeholders
const placeholderVisualizeStyle = "border border-dashed border-neutral-700 bg-neutral-800/30 flex items-center justify-center text-xs text-neutral-500 p-1";

// --- Main Text Styling (Increased MAX_SIZE in clamp) ---
const responsiveFontSize = "text-[clamp(1rem,_0.5rem_+_2vw,_2.5rem)]";

// --- Styling for the LAST line ("INNOVATION DRIVES...") (Increased MAX_SIZE) ---
const lastLineResponsiveFontSize = "text-[clamp(1.25rem,_0.75rem_+_3vw,_3.5rem)]";

// Blue text styling (Increased)
const blueResponsiveFontSize = "text-[clamp(1rem,_0.5rem_+_2vw,_2.25rem)]";

// Added 'export' to the const declaration
export const BigTextGrid: React.FC<BigTextGridProps> = ({ line1Text, line2Text, line3Text, line4Text, shouldPageBeWhite = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { transformX1, transformX2, transformY } = useProjectSlider(containerRef);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const mainTextStyle = `font-bold ${responsiveFontSize} tracking-tighter leading-tight uppercase ${shouldPageBeWhite ? 'text-gray-800' : 'text-white'} break-words`;
  const lastLineTextStyle = `font-bold ${lastLineResponsiveFontSize} tracking-tighter leading-tight uppercase ${shouldPageBeWhite ? 'text-gray-800' : 'text-white'} break-words`;
  const blueTextStyle = `font-bold ${blueResponsiveFontSize} ${shouldPageBeWhite ? 'text-blue-600' : 'text-blue-500'} leading-tight tracking-tight`;
  const bgColor = shouldPageBeWhite ? 'bg-white' : 'bg-black';
  const textColor = shouldPageBeWhite ? 'text-gray-800' : 'text-white';
  const borderColor = shouldPageBeWhite ? 'border-gray-300' : 'border-neutral-800';
    return (
        <div ref={containerRef} className={`relative ${bgColor} ${textColor} min-h-screen flex flex-col justify-center items-center py-16 sm:py-24 px-2 overflow-hidden transition-colors duration-1000`}>
            {/* Decorative circles container */}
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute top-0 left-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] border ${borderColor} rounded-full -translate-x-1/2 -translate-y-1/2`} />
                <div className={`absolute bottom-0 right-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] border ${borderColor} rounded-full translate-x-1/2 translate-y-1/2`} />
            </div>

            <div className="relative z-10 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl px-4 overflow-hidden">
                <div className="flex flex-col space-y-2 sm:space-y-3 md:space-y-4">
                    {/* ----- ROW 1: "WE CRAFT DIGITAL" + Image Placeholder ----- */}
                    <motion.div 
                        className="flex items-center justify-between space-x-3 sm:space-x-4 overflow-hidden"
                        style={{ x: mounted ? transformX1 : 0 }}
                    >
                        <h1 className={`${mainTextStyle} flex-shrink min-w-0`}>
                            {line1Text}
                        </h1>
                        <div
                            className={`flex-grow flex-shrink-0 basis-[20%] sm:basis-[40%] md:basis-[45%] ${placeholderHeight} rounded-lg overflow-hidden relative`}
                        >
                            <Image
                                src="/2_compressed.jpg"
                                alt="Digital graphic"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                    </motion.div>
                    {/* ----- ROW 2: Image Placeholder + "EXPERIENCES THAT" ----- */}
                    <motion.div 
                        className="flex items-center justify-between space-x-3 sm:space-x-4"
                        style={{ x: mounted ? transformX2 : 0 }}
                    >
                        <div
                            className={`flex-grow flex-shrink-0 basis-[20%] sm:basis-[45%] md:basis-[50%] ${placeholderHeight} rounded-lg overflow-hidden relative bg-neutral-800/30`}
                        >
                            <Image
                                src="/1_compressed.jpg"
                                alt="Experiences concept"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        <h1 className={`${mainTextStyle} text-right flex-shrink min-w-0`}>
                            {line2Text}
                        </h1>
                    </motion.div>


                    {/* ----- ROW 3: "TRULY RESONATE DEEPLY." + Image Placeholder ----- */}
                    <motion.div 
                        className="flex items-center justify-between space-x-3 sm:space-x-4"
                        style={{ x: mounted ? transformX1 : 0 }}
                    >
                        <h1 className={`${mainTextStyle} flex-shrink min-w-0`}>
                            {line3Text}
                        </h1>
                        <div
                            className={`flex-grow flex-shrink-0 basis-[35%] sm:basis-[45%] md:basis-[45%] ${placeholderHeight} rounded-lg overflow-hidden relative bg-neutral-800/30`}
                        >
                            <Image
                                src="/3_compressed.jpg"
                                alt="Visual concept"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </motion.div>


                    {/* ----- ROW 4: "INNOVATION DRIVES OUR EVERY MOVE." (Full width) ----- */}
                    <div className="w-full pt-12 md:pt-2 mt-10">
                        <h1 className={`${lastLineTextStyle} text-left`}>
                            {line4Text}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="mt-10 sm:mt-12 md:mt-14 text-center w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl px-4">
                <p className={`${blueTextStyle}`}>
                    Together, we create growth.
                </p>
            </div>
        </div>
    );
};

// Removed 'export default BigTextGrid;'