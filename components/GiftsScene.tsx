'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { config } from '@/lib/config';
import GiftBox from './GiftBox';

interface GiftsSceneProps {
  onAllOpened: () => void;
}

export default function GiftsScene({ onAllOpened }: GiftsSceneProps) {
  const [openedIds, setOpenedIds] = useState<Set<number>>(new Set());

  const handleOpen = (index: number) => {
    setOpenedIds((prev) => new Set([...prev, index]));
  };

  useEffect(() => {
    if (openedIds.size === config.gifts.length) {
      onAllOpened();
    }
  }, [openedIds, onAllOpened]);

  return (
    <div className="h-full w-full overflow-y-auto bg-bg">
      <div className="min-h-full flex flex-col items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1
            className="font-heading text-3xl md:text-5xl mb-2 md:mb-4"
            style={{ color: config.text_color }}
          >
            З Днем народження, {config.recipient_name}!
          </h1>
          <p
            className="font-body text-sm md:text-base"
            style={{ color: config.text_color, opacity: 0.8 }}
          >
            Відкрий кожен подарунок
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-4 p-4 max-w-lg mx-auto md:grid-cols-3 md:gap-6 md:p-6 md:max-w-4xl w-full"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {config.gifts.map((gift, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.8, y: 20 },
                visible: { opacity: 1, scale: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className="mb-10"
            >
              <GiftBox
                gift={gift}
                index={index}
                isOpened={openedIds.has(index)}
                onOpen={() => handleOpen(index)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
