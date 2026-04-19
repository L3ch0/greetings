'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { config } from '@/lib/config';
import Cake from './Cake';
import RotatingGroup from './RotatingGroup';

interface CakeSceneProps {
  extinguished: boolean[];
  onExtinguish: (index: number) => void;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

export default function CakeScene({ extinguished, onExtinguish }: CakeSceneProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    if (extinguished.some(Boolean)) {
      setShowHint(false);
    }
  }, [extinguished]);

  return (
    <div className="relative h-[100dvh] w-full">
      <Canvas
        shadows={!isMobile}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{
          fov: isMobile ? 55 : 42,
          position: isMobile ? [0, 2.5, 7] : [0, 2.2, 6.2],
          near: 0.1,
          far: 100,
        }}
        style={{ height: '100dvh', width: '100%', touchAction: 'none' }}
        onCreated={({ gl }) => { gl.outputColorSpace = THREE.SRGBColorSpace; }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[5, 8, 4]}
          intensity={0.9}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={1}
          shadow-camera-far={20}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
        />
        <directionalLight position={[-4, 3, -2]} intensity={0.25} color="#FFD6E0" />

        {/* Shadow catcher */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.82, 0]} receiveShadow>
          <planeGeometry args={[12, 12]} />
          <shadowMaterial opacity={0.18} />
        </mesh>

        <RotatingGroup>
          <Cake extinguished={extinguished} onExtinguish={onExtinguish} />
        </RotatingGroup>
      </Canvas>

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="absolute left-0 right-0 text-center pointer-events-none px-4 no-select"
            style={{ top: 'calc(env(safe-area-inset-top) + 16px)' }}
          >
            <p className="text-sm md:text-base text-ink/70">
              Торкнися вогника, щоб задути свічку
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
