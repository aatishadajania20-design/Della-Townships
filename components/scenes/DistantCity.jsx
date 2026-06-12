'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import cityState from './cityState';
import { isLowPowerDevice } from './perf';

// The world beyond the masterplan: a horizon of ghost districts rising from
// the valley floor. Hidden until the ignition wave passes — the moment the
// city stops being an object and becomes a civilization. One instanced draw.
const VERTEX = /* glsl */ `
  attribute float aSeed;
  attribute float aDist;
  uniform float uWaveR;
  varying float vSeed;
  varying vec3 vPos;
  varying float vG;
  #include <fog_pars_vertex>
  void main() {
    float g = clamp((uWaveR - aDist) / 6.0, 0.0, 1.0);
    g = 1.0 - pow(1.0 - g, 3.0);
    vec3 p = position;
    p.y *= g;
    vG = g;
    vSeed = aSeed;
    vPos = p;
    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const FRAGMENT = /* glsl */ `
  uniform float uSystem;
  uniform float uTime;
  uniform vec3 uGold;
  uniform vec3 uDeep;
  varying float vSeed;
  varying vec3 vPos;
  varying float vG;
  #include <fog_pars_fragment>
  float hash11(float n) {
    return fract(sin(n) * 43758.5453);
  }
  void main() {
    if (vG < 0.02) discard;
    vec3 col = vec3(0.045, 0.042, 0.036);
    col += uDeep * clamp(vPos.y * 0.5, 0.0, 0.18);
    float band = floor(vPos.y * 4.0 + vSeed * 10.0);
    float lit = step(0.82, hash11(band + vSeed * 91.7));
    col += uGold * lit * uSystem * (0.45 + 0.35 * sin(uTime * (0.5 + vSeed) + vSeed * 30.0)) * 0.5;
    gl_FragColor = vec4(col, 0.88);
    #include <fog_fragment>
  }
`;

export default function DistantCity() {
  const low = isLowPowerDevice();
  const matRef = useRef(null);

  const { count, matrices, seeds, dists, uniforms } = useMemo(() => {
    const n = low ? 140 : 320;
    const m = new Float32Array(n * 16);
    const s = new Float32Array(n);
    const d = new Float32Array(n);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < n; i += 1) {
      const theta = Math.random() * Math.PI * 2;
      const r = 12 + Math.random() ** 0.7 * 14;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      const near = 1 - (r - 12) / 14;
      const h = 0.8 + Math.random() * 1.6 + near * Math.random() * 4.2;
      dummy.position.set(x, -2.4, z);
      dummy.scale.set(0.7 + Math.random() * 0.9, h, 0.7 + Math.random() * 0.9);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.updateMatrix();
      dummy.matrix.toArray(m, i * 16);
      s[i] = Math.random();
      d[i] = r;
    }
    return {
      count: n,
      matrices: m,
      seeds: s,
      dists: d,
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          uWaveR: { value: 0 },
          uSystem: { value: 0 },
          uTime: { value: 0 },
          uGold: { value: new THREE.Color('#d4af37') },
          uDeep: { value: new THREE.Color('#b8860b') },
        },
      ]),
    };
  }, [low]);

  const meshRef = useRef(null);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.instanceMatrix.array.set(matrices);
    mesh.instanceMatrix.needsUpdate = true;
    if (!mesh.geometry.userData.prepped) {
      mesh.geometry.userData.prepped = true;
      mesh.geometry.translate(0, 0.5, 0);
    }
    mesh.geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));
    mesh.geometry.setAttribute('aDist', new THREE.InstancedBufferAttribute(dists, 1));
    mesh.frustumCulled = false;
  }, [matrices, seeds, dists]);

  useFrame(({ clock }) => {
    const { rise, complete, final } = cityState;
    const w = THREE.MathUtils.clamp((rise - 0.55) / 0.45, 0, 1);
    const wave = Math.max(w * w * (3 - 2 * w), complete, final);
    uniforms.uWaveR.value = wave * 34;
    uniforms.uSystem.value = Math.max(rise * 0.4, complete, final * 0.9);
    uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} renderOrder={0}>
      <boxGeometry args={[1, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        fog
      />
    </instancedMesh>
  );
}
