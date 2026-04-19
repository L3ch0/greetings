import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from '@/lib/types';
import { config } from '@/lib/config';
import GiftContent from './GiftContent';

interface GiftBoxProps {
  gift: Gift;
  index: number;
  isOpened: boolean;
  onOpen: () => void;
}

export default function GiftBox({ gift, index, isOpened, onOpen }: GiftBoxProps) {
  const [showContent, setShowContent] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isOpened || isAnimating) return;

    setIsAnimating(true);
    setTimeout(() => {
      setShowContent(true);
      onOpen();
      setIsAnimating(false);
    }, 300);
  };

  const handleCloseContent = () => {
    setShowContent(false);
  };

  return (
    <>
      <motion.div
        className="relative aspect-square cursor-pointer"
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
      >
        <motion.div
          className={`
            absolute inset-0 rounded-xl overflow-hidden
            bg-gradient-to-br from-primary to-primary/70
            shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]
            transition-all duration-300
            ${isOpened ? 'opacity-30 scale-90' : 'opacity-100 hover:scale-105'}
          `}
          animate={isAnimating ? {
            y: -120,
            rotate: -25,
            opacity: 0,
          } : {}}
          transition={{ duration: 0.6 }}
          style={{
            background: isOpened
              ? 'linear-gradient(135deg, rgba(255, 181, 197, 0.3) 0%, rgba(255, 181, 197, 0.2) 100%)'
              : `linear-gradient(135deg, ${config.primary_color} 0%, ${config.primary_color}B3 100%)`,
          }}
        >
          {/* Ribbon - horizontal */}
          <div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8"
            style={{ backgroundColor: config.accent_color }}
          />

          {/* Ribbon - vertical */}
          <div
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8"
            style={{ backgroundColor: config.accent_color }}
          />

          {/* Bow center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div
              className="w-12 h-12 rounded-full"
              style={{ backgroundColor: config.accent_color }}
            />
            <div
              className="absolute inset-0 w-12 h-12 rounded-full"
              style={{
                backgroundColor: config.accent_color,
                opacity: 0.7,
                filter: 'blur(4px)',
              }}
            />
          </div>

          {/* Gift number badge */}
          {!isOpened && (
            <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-bg flex items-center justify-center text-xs font-body font-semibold text-ink">
              {index + 1}
            </div>
          )}
        </motion.div>

        {/* Title below box */}
        <div className="absolute -bottom-8 left-0 right-0 text-center">
          <p className={`text-xs md:text-sm font-body text-ink ${isOpened ? 'opacity-50' : ''}`}>
            {gift.title}
          </p>
        </div>
      </motion.div>

      {/* Gift content modal */}
      <AnimatePresence>
        {showContent && (
          <GiftContent gift={gift} onClose={handleCloseContent} />
        )}
      </AnimatePresence>
    </>
  );
}
