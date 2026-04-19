'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { config } from '@/lib/config';

export default function FinalMessage() {
  const [confettiInterval, setConfettiInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    import('canvas-confetti').then(({ default: confetti }) => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        disableForReducedMotion: true,
      });

      const interval = setInterval(() => {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { x: Math.random(), y: Math.random() * 0.5 + 0.3 },
          disableForReducedMotion: true,
        });
      }, 4000);

      setConfettiInterval(interval);
    });

    return () => {
      if (confettiInterval) {
        clearInterval(confettiInterval);
      }
    };
  }, []);

  return (
    <div
      className="h-full w-full flex items-center justify-center px-4"
      style={{ backgroundColor: config.background_color }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center max-w-2xl"
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1
            className="font-heading text-2xl md:text-4xl leading-relaxed mb-8 whitespace-pre-wrap"
            style={{ color: config.text_color }}
          >
            {config.final_message}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex gap-4 justify-center"
        >
          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="text-2xl md:text-4xl"
            >
              ❤️
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

