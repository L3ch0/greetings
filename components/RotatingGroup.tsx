'use client';

import { useRef } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
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

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    isDragging.current = true;
    lastX.current = e.nativeEvent.clientX;
    idleRotate.current = false;
    if (idleTimer.current) clearTimeout(idleTimer.current);
    (e.nativeEvent.target as Element).setPointerCapture(e.nativeEvent.pointerId);
  };

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current || !groupRef.current) return;
    groupRef.current.rotation.y += (e.nativeEvent.clientX - lastX.current) * 0.008;
    lastX.current = e.nativeEvent.clientX;
  };

  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    idleTimer.current = setTimeout(() => { idleRotate.current = true; }, 2500);
    (e.nativeEvent.target as Element).releasePointerCapture(e.nativeEvent.pointerId);
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
