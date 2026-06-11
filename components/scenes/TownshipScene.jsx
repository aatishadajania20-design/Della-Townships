'use client';

import { Canvas } from '@react-three/fiber';
import CameraRig from './CameraRig';
import GoldLandscape from './GoldLandscape';
import RoadNetwork from './RoadNetwork';
import CityBlocks from './CityBlocks';
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
      <fog attach="fog" args={['#0a0a0a', 9, 46]} />
      <CameraRig />
      <AtmosphereLayer />
      <GoldLandscape />
      <RoadNetwork />
      <CityBlocks />
      <HeroParticles />
    </Canvas>
  );
}
