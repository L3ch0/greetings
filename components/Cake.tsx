'use client';

import { SCENE } from '@/lib/scene-colors';
import { config } from '@/lib/config';
import Candle from './Candle';

const RIMS = [
  { r: 1.5, y: 0.0 },
  { r: 1.5, y: -0.8 },
  { r: 1.0, y: 0.6 },
  { r: 1.0, y: 0.0 },
];

interface CakeProps {
  extinguished: boolean[];
  onExtinguish: (index: number) => void;
}

export default function Cake({ extinguished, onExtinguish }: CakeProps) {
  return (
    <group>
      {/* Bottom tier */}
      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.8, 64]} />
        <meshStandardMaterial color={SCENE.PRIMARY_DEEP} roughness={0.55} metalness={0.05} />
      </mesh>

      {/* Top tier */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.0, 1.0, 0.6, 64]} />
        <meshStandardMaterial color={SCENE.PRIMARY} roughness={0.55} metalness={0.05} />
      </mesh>

      {/* 4 decorative torus rims */}
      {RIMS.map((rim, i) => (
        <mesh key={i} position={[0, rim.y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[rim.r, 0.035, 14, 64]} />
          <meshStandardMaterial color={SCENE.ACCENT} roughness={0.28} metalness={0.85} />
        </mesh>
      ))}

      {/* 16 decorative dots around base */}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 1.5, -0.4, Math.sin(a) * 1.5]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial color={SCENE.ACCENT} roughness={0.28} metalness={0.85} />
          </mesh>
        );
      })}

      {/* Candles */}
      {Array.from({ length: config.candles_count }, (_, i) => {
        const a = (i / config.candles_count) * Math.PI * 2;
        const x = Math.cos(a) * 0.6;
        const z = Math.sin(a) * 0.6;
        const waxColor = i % 2 === 0 ? SCENE.WAX : SCENE.WAX_ALT;
        return (
          <Candle
            key={i}
            index={i}
            x={x}
            z={z}
            waxColor={waxColor}
            isLit={!extinguished[i]}
            onExtinguish={() => onExtinguish(i)}
          />
        );
      })}
    </group>
  );
}
