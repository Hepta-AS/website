"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/MagneticButton";
import { ArrowRight, Code, PenTool, Wind } from "lucide-react";
import Image from "next/image";

const InteractiveCtaSection = () => {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.section
      id="kontakt-oss"
      className="relative bg-black text-white py-24 sm:py-32 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column: Text */}
          <div className="text-center md:text-left">
            <motion.h2
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg"
            >
              Har du en idé? La oss realisere den.
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl mx-auto md:mx-0 text-lg sm:text-xl text-gray-300 drop-shadow-md"
            >
              Vi omdanner konsepter til digitale mesterverk. Ta kontakt for å se hvordan vi kan bygge fremtiden sammen.
            </motion.p>
          </div>

          {/* Right Column: Artsy Collage */}
          <motion.div
            className="relative h-[300px] md:h-[500px]"
            variants={containerVariants}
          >
            <motion.div
              variants={itemVariants}
              className="absolute top-0 right-0 w-2/3 h-2/3 rounded-lg overflow-hidden shadow-2xl"
              style={{ rotate: 5 }}
            >
              <Image
                src="/creativity_compressed.jpg"
                alt="Kreativitet"
                layout="fill"
                objectFit="cover"
              />
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="absolute bottom-0 left-0 w-1/2 h-1/2 rounded-lg overflow-hidden shadow-2xl border-4 border-neutral-800"
              style={{ rotate: -8 }}
            >
              <Image
                src="/technology_compressed.jpg"
                alt="Teknologi"
                layout="fill"
                objectFit="cover"
              />
            </motion.div>
            <motion.div
                variants={itemVariants}
                className="absolute top-[20%] left-[10%] w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center"
                style={{ rotate: 15 }}
            >
                <Code className="w-10 h-10 text-indigo-300" />
            </motion.div>
             <motion.div
                variants={itemVariants}
                className="absolute bottom-[25%] right-[15%] w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center"
                style={{ rotate: -25 }}
            >
                <PenTool className="w-8 h-8 text-blue-300" />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Centered Button Section */}
        <motion.div 
          variants={itemVariants} 
          className="mt-20 text-center"
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <MagneticButton
            onClick={() => router.push("/contact")}
            variant="default"
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-6 px-12 rounded-full text-xl shadow-2xl hover:shadow-indigo-500/40 transition-shadow duration-300 whitespace-nowrap"
          >
            Start et prosjekt
          </MagneticButton>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default InteractiveCtaSection; 