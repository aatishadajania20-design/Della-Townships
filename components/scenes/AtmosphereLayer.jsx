'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec3 night = vec3(0.039, 0.039, 0.039);
    vec3 gold = vec3(0.839, 0.710, 0.357);
    float horizon = smoothstep(0.62, 0.38, vUv.y) * smoothstep(0.05, 0.34, vUv.y);
    float breathe = 0.85 + sin(uTime * 0.3) * 0.15;
    float center = 1.0 - smoothstep(0.0, 0.75, abs(vUv.x - 0.5));
    vec3 color = night + gold * horizon * center * 0.34 * breathe;
    gl_FragColor = vec4(color, horizon * center * 0.9);
  }
`;

export default function AtmosphereLayer() {
  const material = useRef(null);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame(({ clock }) => {
    if (material.current) {
      material.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh position={[0, 1.5, -26]} scale={[80, 36, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
