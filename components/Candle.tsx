'use client';

import { SCENE } from '@/lib/scene-colors';
import Flame from './Flame';

interface CandleProps {
  index: number;
  x: number;
  z: number;
  waxColor: string;
  isLit: boolean;
  onExtinguish: () => void;
}

export default function Candle({ index, x, z, waxColor, isLit, onExtinguish }: CandleProps) {
  return (
    <group>
      {/* Candle body */}
      <mesh position={[x, 0.79, z]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.38, 20]} />
        <meshStandardMaterial color={waxColor} roughness={0.4} />
      </mesh>

      {/* Wick */}
      <mesh position={[x, 1.00, z]}>
        <cylinderGeometry args={[0.008, 0.008, 0.05, 8]} />
        <meshStandardMaterial color={SCENE.WICK} roughness={0.9} />
      </mesh>

      {isLit && (
        <Flame
          x={x}
          z={z}
          isLit={isLit}
          phase={index * 1.7}
          onExtinguish={onExtinguish}
        />
      )}
    </group>
  );
}
