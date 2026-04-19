'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SCENE } from '@/lib/scene-colors';

interface FlameProps {
  x: number;
  z: number;
  isLit: boolean;
  phase: number;
  onExtinguish: () => void;
}

export default function Flame({ x, z, isLit, phase, onExtinguish }: FlameProps) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const extinguishProgress = useRef(0);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (!isLit && extinguishProgress.current < 1) {
      extinguishProgress.current = Math.min(1, extinguishProgress.current + delta * 2);
    }

    const fade = 1 - extinguishProgress.current;
    if (fade <= 0) return;

    const flicker =
      1 +
      Math.sin(t * 7 + phase) * 0.10 +
      Math.sin(t * 13 + phase * 0.5) * 0.04;

    if (outerRef.current) {
      outerRef.current.scale.set(flicker * fade, 1.55 * flicker * fade, flicker * fade);
      (outerRef.current.material as THREE.MeshBasicMaterial).opacity = 0.55 * fade;
    }
    if (innerRef.current) {
      innerRef.current.scale.set(
        flicker * 0.92 * fade,
        1.5 * flicker * 0.92 * fade,
        flicker * 0.92 * fade
      );
      (innerRef.current.material as THREE.MeshBasicMaterial).opacity = fade;
    }
    if (lightRef.current) {
      lightRef.current.intensity = (0.32 + Math.sin(t * 11 + phase) * 0.10) * fade;
    }
  });

  return (
    <group position={[x, 1.05, z]}>
      {/* Outer halo */}
      <mesh ref={outerRef} scale={[1, 1.55, 1]}>
        <sphereGeometry args={[0.09, 18, 18]} />
        <meshBasicMaterial color={SCENE.FLAME_OUTER} transparent opacity={0.55} />
      </mesh>

      {/* Inner core */}
      <mesh ref={innerRef} scale={[1, 1.5, 1]} position={[0, -0.01, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color={SCENE.FLAME_INNER} transparent opacity={1} />
      </mesh>

      {/* Warm point light */}
      <pointLight
        ref={lightRef}
        color={SCENE.POINT_LIGHT}
        intensity={0.35}
        distance={1.6}
        decay={2}
        position={[0, 0.10, 0]}
      />

      {/* Invisible hitbox */}
      <mesh
        onClick={(e) => { e.stopPropagation(); onExtinguish(); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'default'; }}
        visible={false}
      >
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
