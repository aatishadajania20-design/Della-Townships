'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import cityState from './cityState';

// Scroll = navigation through the city. The path descends from the survey
// view into the streets, threads the dense cluster while it constructs
// itself, pauses at the founder's node, then climbs out to the finished
// civilization. Catmull-Rom keeps the flight fluid between keys.
const KEYS = [
  { j: 0.0, pos: [0, 1.8, 10], look: [0, 1.6, -8] },
  { j: 0.12, pos: [0, 2.8, 11.5], look: [0, 0.8, -4] },
  { j: 0.3, pos: [-3.2, 5.0, 13.5], look: [0, 1.2, 0] },
  { j: 0.42, pos: [-4.6, 2.6, 8], look: [0, 2.2, 0] },
  { j: 0.52, pos: [-2.4, 1.8, 3.6], look: [2.5, 2.8, -3] },
  { j: 0.58, pos: [-0.5, 2.3, 1.0], look: [3.0, 3.4, -5] },
  { j: 0.66, pos: [1.4, 2.6, -2.2], look: [4.5, 3.0, -8] },
  { j: 0.74, pos: [3.6, 3.8, -4.8], look: [0, 2.6, 0] },
  { j: 0.85, pos: [5.8, 7.8, 10], look: [0, 2.2, 0] },
  { j: 1.0, pos: [0, 11.5, 22], look: [0, 2.6, 0] },
];

const posCurve = new THREE.CatmullRomCurve3(
  KEYS.map((key) => new THREE.Vector3(...key.pos)),
  false,
  'centripetal',
  0.5
);
const lookCurve = new THREE.CatmullRomCurve3(
  KEYS.map((key) => new THREE.Vector3(...key.look)),
  false,
  'centripetal',
  0.5
);

export default function CameraRig() {
  const posTarget = useRef(new THREE.Vector3(0, 1.8, 10));
  const lookTarget = useRef(new THREE.Vector3(0, 1.6, -8));
  const lookCurrent = useRef(new THREE.Vector3(0, 1.6, -8));
  const fov = useRef(44);

  useFrame(({ camera, clock }, delta) => {
    const j = THREE.MathUtils.clamp(cityState.journey, 0, 1);
    let i = 0;
    for (let n = 0; n < KEYS.length - 1; n += 1) {
      if (j >= KEYS[n].j && j <= KEYS[n + 1].j) {
        i = n;
        break;
      }
    }
    const span = KEYS[i + 1].j - KEYS[i].j || 1;
    const t = (j - KEYS[i].j) / span;
    const e = t * t * (3 - 2 * t);
    const u = (i + e) / (KEYS.length - 1);

    posCurve.getPoint(u, posTarget.current);
    lookCurve.getPoint(u, lookTarget.current);

    // pointer drift fades as the camera flies low between buildings
    const driftScale = THREE.MathUtils.clamp((posTarget.current.y - 1.5) / 4, 0.3, 1);
    const time = clock.getElapsedTime();
    posTarget.current.x += (Math.sin(time * 0.14) * 0.18 + cityState.px * 0.9) * driftScale;
    posTarget.current.y += (Math.cos(time * 0.11) * 0.1 - cityState.py * 0.5) * driftScale;

    const k = 1 - Math.exp(-4 * delta);
    camera.position.lerp(posTarget.current, k);
    lookCurrent.current.lerp(lookTarget.current, k);
    camera.lookAt(lookCurrent.current);

    // scroll acceleration widens the lens — speed you can feel
    const fovTarget = 44 + Math.min(1, Math.abs(cityState.vel)) * 5;
    fov.current += (fovTarget - fov.current) * k;
    if (Math.abs(camera.fov - fov.current) > 0.01) {
      camera.fov = fov.current;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
