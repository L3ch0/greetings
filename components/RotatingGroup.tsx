'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function RotatingGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const idleRotate = useRef(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFrame(() => {
    if (idleRotate.current && groupRef.current) {
      groupRef.current.rotation.y += 0.0035;
    }
  });

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
    idleRotate.current = false;
    if (idleTimer.current) clearTimeout(idleTimer.current);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !groupRef.current) return;
    groupRef.current.rotation.y += (e.clientX - lastX.current) * 0.008;
    lastX.current = e.clientX;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    idleTimer.current = setTimeout(() => { idleRotate.current = true; }, 2500);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  return (
    <group
      ref={groupRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {children}
    </group>
  );
}
