'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { config } from '@/lib/config';
import { Gift } from '@/lib/types';

const CakeScene = dynamic(() => import('@/components/CakeScene'), { ssr: false });
const GiftsScene = dynamic(() => import('@/components/GiftsScene'), { ssr: false });
const FinalMessage = dynamic(() => import('@/components/FinalMessage'), { ssr: false });

type Scene = 'cake' | 'transition' | 'gifts' | 'final';

export default function HomeClient({ gifts }: { gifts: Gift[] }) {
  const [scene, setScene] = useState<Scene>('cake');
  const [extinguished, setExtinguished] = useState<boolean[]>(
    () => new Array(config.candles_count).fill(false)
  );

  const handleExtinguish = (i: number) => {
    setExtinguished((prev) => {
      if (prev[i]) return prev;
      const next = [...prev];
      next[i] = true;
      return next;
    });
  };

  useEffect(() => {
    if (extinguished.length === 0 || !extinguished.every(Boolean)) return;

    import('canvas-confetti').then(({ default: confetti }) => {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.55 }, disableForReducedMotion: true });
      setTimeout(() => {
        confetti({ particleCount: 80, spread: 120, origin: { y: 0.45 }, disableForReducedMotion: true });
      }, 280);
    });

    const t1 = setTimeout(() => setScene('transition'), 1800);
    const t2 = setTimeout(() => setScene('gifts'), 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [extinguished]);

  const handleAllGiftsOpened = () => {
    setTimeout(() => setScene('final'), 500);
  };

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-bg">
      {scene === 'cake' && (
        <CakeScene extinguished={extinguished} onExtinguish={handleExtinguish} />
      )}

      {scene === 'transition' && (
        <div className="h-full w-full flex items-center justify-center bg-bg" />
      )}

      {scene === 'gifts' && (
        <GiftsScene gifts={gifts} onAllOpened={handleAllGiftsOpened} />
      )}

      {scene === 'final' && <FinalMessage />}
    </div>
  );
}
