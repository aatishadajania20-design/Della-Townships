'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import cityState from './cityState';

const KEYS = [
  { j: 0.0, pos: [0, 1.7, 9.5], look: [0, 1.4, -8] },
  { j: 0.14, pos: [0, 3.0, 11.5], look: [0, 0.4, -3] },
  { j: 0.36, pos: [0, 5.2, 15], look: [0, 0.6, 0] },
  { j: 0.5, pos: [0, 8.5, 19.5], look: [0, 1.8, 0] },
  { j: 0.7, pos: [7.5, 6.0, 15.5], look: [0, 2.0, 0] },
  { j: 0.86, pos: [3, 8.5, 20], look: [0, 2.4, 0] },
  { j: 1.0, pos: [0, 11.5, 25], look: [0, 2.8, 0] },
];

export default function CameraRig() {
  const posTarget = useRef(new THREE.Vector3(0, 1.7, 9.5));
  const lookTarget = useRef(new THREE.Vector3(0, 1.4, -8));
  const lookCurrent = useRef(new THREE.Vector3(0, 1.4, -8));

  useFrame(({ camera, clock }, delta) => {
    const j = THREE.MathUtils.clamp(cityState.journey, 0, 1);
    let a = KEYS[0];
    let b = KEYS[KEYS.length - 1];
    for (let i = 0; i < KEYS.length - 1; i += 1) {
      if (j >= KEYS[i].j && j <= KEYS[i + 1].j) {
        a = KEYS[i];
        b = KEYS[i + 1];
        break;
      }
    }
    const t = (j - a.j) / (b.j - a.j || 1);
    const e = t * t * (3 - 2 * t);

    const time = clock.getElapsedTime();
    const driftX = Math.sin(time * 0.14) * 0.18 + cityState.px * 0.9;
    const driftY = Math.cos(time * 0.11) * 0.1 - cityState.py * 0.5;

    posTarget.current.set(
      a.pos[0] + (b.pos[0] - a.pos[0]) * e + driftX,
      a.pos[1] + (b.pos[1] - a.pos[1]) * e + driftY,
      a.pos[2] + (b.pos[2] - a.pos[2]) * e
    );
    lookTarget.current.set(
      a.look[0] + (b.look[0] - a.look[0]) * e,
      a.look[1] + (b.look[1] - a.look[1]) * e,
      a.look[2] + (b.look[2] - a.look[2]) * e
    );

    const k = 1 - Math.exp(-4 * delta);
    camera.position.lerp(posTarget.current, k);
    lookCurrent.current.lerp(lookTarget.current, k);
    camera.lookAt(lookCurrent.current);
  });

  return null;
}
