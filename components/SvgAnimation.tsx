'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dot } from 'lucide-react';
import { Center } from './Center';
import { preloaderWords } from '@/data';
import { useDimensions, useTimeOut } from '@/hooks';

const MotionComponent = motion(Center);

const fade = {
  initial: { opacity: 0 },
  enter: { 
    opacity: 1,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] }
  }
};

const slideUp = {
  initial: { 
    top: 0,
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] }
  },
  exit: { 
    top: "-100vh",
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 }
  }
};

export function SvgAnimation() {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { width, height } = useDimensions();

  useTimeOut({
    callback: () => {
      if (index < preloaderWords.length - 1) {
        setIndex(prevIndex => prevIndex + 1);
      } else {
        // Animation complete, hide the component
        setTimeout(() => setIsVisible(false), 1000);
      }
    },
    duration: index === 0 ? 1000 : 800,
    deps: [index],
  });

  if (!isVisible) return null;

  const initialPath = `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${
    height + 300
  } 0 ${height}  L0 0`;
  const targetPath = `M0 0 L${width} 0 L${width} ${height} Q${
    width / 2
  } ${height} 0 ${height}  L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
    },
  };

  return (
    <MotionComponent
      className='relative z-20 h-[80vh] w-full bg-gray-900 text-white'
      variants={slideUp}
      initial='initial'
      animate={index >= preloaderWords.length - 1 ? 'exit' : 'initial'}
    >
      {width > 0 ? (
        <>
          <MotionComponent
            className='text-3xl md:text-4xl font-bold'
            variants={fade}
            initial='initial'
            animate='enter'
            key={index}
          >
            <Dot size={48} className='me-3 text-blue-500' />
            <p>{preloaderWords[index]}</p>
          </MotionComponent>
          <motion.svg className='absolute top-0 -z-10 h-[calc(100%+300px)] w-full'>
            <motion.path
              className='fill-gray-900'
              variants={curve}
              initial='initial'
              animate={index >= preloaderWords.length - 1 ? 'exit' : 'initial'}
            />
          </motion.svg>
        </>
      ) : null}
    </MotionComponent>
  );
} 