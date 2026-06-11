'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import cityState from './cityState';

const dummy = new THREE.Object3D();

export default function CityBlocks() {
  const meshRef = useRef(null);
  const beaconRef = useRef(null);
  const haloRef = useRef(null);

  const blocks = useMemo(() => {
    const arr = [];
    for (let x = -12; x <= 12; x += 2) {
      for (let z = -12; z <= 12; z += 2) {
        const dist = Math.hypot(x, z);
        if (dist < 2.4 || dist > 13.5) continue;
        if (Math.abs(x) < 0.9 || Math.abs(z) < 0.9) continue;
        if (Math.random() < 0.16) continue;
        const h = (1.25 - dist / 16) * (0.7 + Math.random() * 3.6) + 0.3;
        arr.push({
          x: x + (Math.random() - 0.5) * 0.7,
          z: z + (Math.random() - 0.5) * 0.7,
          h,
          delay: dist / 16,
        });
      }
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const rise = cityState.rise;
    const settle = Math.max(cityState.complete, cityState.final);
    const t = clock.getElapsedTime();

    for (let i = 0; i < blocks.length; i += 1) {
      const b = blocks[i];
      const local = THREE.MathUtils.clamp(rise * 1.7 - b.delay * 0.95, 0, 1);
      const e = 1 - (1 - local) ** 3;
      const h = b.h * e;
      dummy.position.set(b.x, h / 2 - 0.4, b.z);
      dummy.scale.set(0.8, Math.max(h, 0.001), 0.8);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.material.opacity = 0.13 + settle * 0.12 + Math.sin(t * 0.8) * 0.015;

    if (beaconRef.current) {
      const bh = 9.5 * cityState.final;
      beaconRef.current.scale.set(1, Math.max(bh, 0.001), 1);
      beaconRef.current.position.y = bh / 2 - 0.4;
      beaconRef.current.material.opacity = cityState.final * 0.55;
    }
    if (haloRef.current) {
      haloRef.current.material.opacity = cityState.final * (0.5 + Math.sin(t * 1.4) * 0.15);
      haloRef.current.position.y = 9.1 * cityState.final - 0.4;
    }
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined, undefined, blocks.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          color="#c9a84c"
          transparent
          opacity={0.13}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>
      <mesh ref={beaconRef}>
        <cylinderGeometry args={[0.06, 0.06, 1, 6]} />
        <meshBasicMaterial
          color="#e8d5a3"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshBasicMaterial
          color="#e8d5a3"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
