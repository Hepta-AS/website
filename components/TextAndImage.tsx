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
  imageContainerCustomClass?: string;
  useDarkText?: boolean;
}

export const TextAndImage: React.FC<TextAndImageProps> = ({
                                                            imageSrc,
                                                            altText,
                                                            title,
                                                            paragraphs,
                                                            imageOnLeft = false,
                                                            imageClassName = "object-cover",
                                                            textContainerClassName = "",
                                                            imageContainerClassName = "aspect-[3/4] sm:aspect-[2/3]",
                                                            imageContainerCustomClass,
                                                            useDarkText = false
                                                          }) => {

  const textColorClass = useDarkText ? 'text-gray-800' : 'text-gray-200';
  const titleColorClass = useDarkText ? 'text-black' : 'text-white';

  const textContent = (
      <div className={`space-y-4 md:space-y-6 ${textContainerClassName}`}>
        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${titleColorClass}`}>
          {title}
        </h2>
        {paragraphs.map((p, index) => (
            <p key={index} className={`text-base sm:text-lg leading-relaxed ${textColorClass}`}>
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
      </div>
  );

  return (
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-center">
        <div className={`w-full md:w-1/2 ${imageOnLeft ? 'md:order-2' : 'md:order-1'}`}>
          {textContent}
        </div>
        <div className={`w-full md:w-1/2 ${imageOnLeft ? 'md:order-1' : 'md:order-2'}`}>
          {imageContent}
        </div>
      </div>
  );
};

// Removed 'export default TextAndImage;'