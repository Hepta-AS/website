// components/TextAndImage.tsx
"use client";

import Image from 'next/image';
import React from 'react';

interface TextAndImageProps {
  imageSrc: string;
  altText: string;
  title: string;
  paragraphs: string[];
  imageOnLeft?: boolean;
  imageClassName?: string;
  textContainerClassName?: string;
  imageContainerClassName?: string;
  // Adding 'imageContainerCustomClass' to the interface, as it's used in your Home page
  imageContainerCustomClass?: string;
}

// Added 'export' to the const declaration
export const TextAndImage: React.FC<TextAndImageProps> = ({
                                                            imageSrc,
                                                            altText,
                                                            title,
                                                            paragraphs,
                                                            imageOnLeft = false,
                                                            imageClassName = "object-cover",
                                                            textContainerClassName = "",
                                                            imageContainerClassName = "aspect-[3/4] sm:aspect-[2/3]", // Default value
                                                            imageContainerCustomClass // This will be used if provided from Home page
                                                          }) => {
  const textContent = (
      <div className={`space-y-4 md:space-y-6 ${textContainerClassName} md:p-0 p-4`}>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          {title}
        </h2>
        {paragraphs.map((p, index) => (
            <p key={index} className="text-base sm:text-lg  leading-relaxed">
              {p}
            </p>
        ))}
      </div>
  );

  const imageContent = (
      <div className={`relative w-full ${imageContainerCustomClass || imageContainerClassName} overflow-hidden rounded-lg shadow-lg`}>
        <Image
            src={imageSrc}
            alt={altText}
            fill
            className={`${imageClassName} w-full h-full`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/30 md:hidden" />
        <div className="md:hidden absolute bottom-0 left-0 right-0 text-white">
          {textContent}
        </div>
      </div>
  );

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
        {imageOnLeft ? (
            <>
              {imageContent}
              <div className="hidden md:block">{textContent}</div>
            </>
        ) : (
            <>
              <div className="hidden md:block">{textContent}</div>
              {imageContent}
            </>
        )}
      </div>
  );
};

// Removed 'export default TextAndImage;'