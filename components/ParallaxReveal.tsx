'use client';

import { motion } from 'framer-motion';

const reveal = {
  initial: { y: '100%' },
  open: (i: number) => ({
    y: '0%',
    transition: {
      duration: 0.5,
      delay: 0.02 * i,
    },
  }),
};

interface ParallaxRevealProps {
  paragraph: string;
  className?: string;
}

export function ParallaxReveal({ paragraph, className = '' }: ParallaxRevealProps) {
  const words = paragraph
    .split(' ')
    .map((word, index) => ({ id: index, word }));

  const text = words.map(({ id, word }) => (
    <span key={id} className='me-2 inline-flex overflow-hidden'>
      <motion.span
        custom={id}
        variants={reveal}
        initial='initial'
        whileInView='open'
        className={className}
      >
        {word}
      </motion.span>
    </span>
  ));

  return <>{text}</>;
} 