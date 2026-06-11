'use client';

import { Canvas } from '@react-three/fiber';
import CameraRig from './CameraRig';
import GoldLandscape from './GoldLandscape';
import RoadNetwork from './RoadNetwork';
import CityBlocks from './CityBlocks';
import HeroParticles from './HeroParticles';
import AtmosphereLayer from './AtmosphereLayer';

export default function TownshipScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
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
