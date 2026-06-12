'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import CameraRig from './CameraRig';
import GoldLandscape from './GoldLandscape';
import RoadNetwork from './RoadNetwork';
import CityModel from './CityModel';
import DistantCity from './DistantCity';
import HeroParticles from './HeroParticles';
import AtmosphereLayer from './AtmosphereLayer';
import { isLowPowerDevice } from './perf';

export default function TownshipScene() {
  const low = isLowPowerDevice();
  return (
    <Canvas
      dpr={low ? 1 : [1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false }}
      camera={{ position: [0, 1.7, 9.5], fov: 44, near: 0.1, far: 90 }}
      style={{ pointerEvents: 'none' }}
    >
      <fog attach="fog" args={['#0a0a0a', 9, 60]} />
      <CameraRig />
      <AtmosphereLayer />
      <GoldLandscape />
      <RoadNetwork />
      <DistantCity />
      <Suspense fallback={null}>
        <CityModel />
      </Suspense>
      <HeroParticles />
    </Canvas>
  );
}
