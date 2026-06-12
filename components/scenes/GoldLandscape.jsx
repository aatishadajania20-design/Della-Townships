'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

export default function GoldLandscape() {
  const geometry = useMemo(() => {
    // 64 segments reads identically to 96 at 0.1-opacity wireframe — half the triangles
    const geo = new THREE.PlaneGeometry(80, 80, 64, 64);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const r = Math.hypot(x, z);
      const ridge =
        Math.sin(x * 0.3) * Math.cos(z * 0.26) * 0.9 + Math.sin(x * 0.11 + z * 0.14) * 1.6;
      // flat construction plain in the centre, mountains ringing the city
      const f = THREE.MathUtils.smoothstep(r, 13, 26);
      pos.setY(i, ridge * f - 2.4);
    }
    return geo;
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color="#d4af37" wireframe transparent opacity={0.1} />
    </mesh>
  );
}
