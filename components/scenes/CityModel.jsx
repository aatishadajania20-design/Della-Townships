'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import cityState from './cityState';
import { isLowPowerDevice } from './perf';

const MODEL_URL = '/Images/3d-model/city.glb';
const FOOTPRINT = 19; // world units the masterplan occupies, matches the road grid
const GROUND_Y = -0.4;

// Shared vertex stage for both building layers: buildings grow from their base
// with a per-block stagger, float apart in the blueprint state, and briefly
// reflow under scroll acceleration. All driven by uniforms — zero CPU geometry work.
const GROW_VERTEX = /* glsl */ `
  uniform float uBuild;
  uniform float uTime;
  uniform float uVel;
  uniform float uLift;
  varying vec3 vPos;
  varying vec3 vNormal;
  varying float vG;
  #include <fog_pars_vertex>
  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  void main() {
    vNormal = normal;
    vec3 p = position;
    vec2 cell = floor(p.xz / 1.35);
    float seed = hash21(cell);
    float g = clamp(uBuild * 2.1 - seed * 1.1, 0.0, 1.0);
    g = 1.0 - pow(1.0 - g, 3.0);
    // the blueprint state holds a phantom skyline before construction begins
    g = max(g, uLift * (0.3 + 0.9 * seed));
    p.y *= g;
    p.y += sin(uTime * 0.5 + seed * 6.2831) * 0.1 * (1.0 - g);
    float sway = uVel * (0.25 + seed * 0.35);
    p.x += sin(p.y * 1.4 + uTime * 2.2 + seed * 9.0) * sway;
    p.z += cos(p.y * 1.1 + uTime * 1.8 + seed * 7.0) * sway;
    vPos = p;
    vG = g;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const SOLID_FRAGMENT = /* glsl */ `
  uniform float uSolid;
  uniform float uSystem;
  uniform float uCalm;
  uniform float uVel;
  uniform float uTime;
  uniform float uWaveR;
  uniform float uWaveAmp;
  uniform vec3 uGold;
  uniform vec3 uDeep;
  varying vec3 vPos;
  varying vec3 vNormal;
  varying float vG;
  #include <fog_pars_fragment>
  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(269.5, 183.3))) * 43758.5453);
  }
  void main() {
    if (vG < 0.02 || uSolid < 0.01) discard;
    vec2 grid = vec2(vPos.x + vPos.z * 0.7, vPos.y) * vec2(2.2, 3.0);
    vec2 id = floor(grid);
    vec2 f = fract(grid);
    float win = step(0.6, f.x) * step(f.x, 0.86) * step(0.5, f.y) * step(f.y, 0.84);
    float r = hash21(id);
    float occupied = step(r, 0.24 + uCalm * 0.18);
    float flicker = 0.7 + 0.3 * sin(uTime * (0.8 + r * 2.4) + r * 40.0);
    float pulse = 0.55 + 0.45 * sin(vPos.y * 1.6 - uTime * (1.8 - uCalm * 1.2));
    // a slow illumination sweep circles the districts — the city never sleeps
    float sweep = 0.78 + 0.22 * sin(atan(vPos.z, vPos.x) * 2.0 - uTime * 0.12);
    // warm key light: architectural definition, gold reflections on facades
    vec3 n = normalize(vNormal);
    float kd = max(dot(n, normalize(vec3(0.55, 0.75, 0.35))), 0.0);
    vec3 col = vec3(0.052, 0.048, 0.04);
    col += uDeep * kd * 0.11;
    col += uGold * pow(kd, 6.0) * 0.05;
    col += uDeep * clamp(vPos.y * 0.045, 0.0, 0.22);
    col += uGold * win * occupied * flicker * sweep * uSystem * (0.45 + 0.4 * pulse);
    // the ignition wavefront sweeping outward through the masterplan
    col += uGold * exp(-abs(length(vPos.xz) - uWaveR) * 0.5) * uWaveAmp * 0.55;
    col += uGold * abs(uVel) * 0.14;
    gl_FragColor = vec4(col, uSolid);
    #include <fog_fragment>
  }
`;

const WIRE_FRAGMENT = /* glsl */ `
  uniform float uWire;
  uniform vec3 uDeep;
  varying vec3 vPos;
  varying float vG;
  #include <fog_pars_fragment>
  void main() {
    gl_FragColor = vec4(uDeep, uWire * (0.35 + 0.65 * vG));
    #include <fog_fragment>
  }
`;

const NET_VERTEX = /* glsl */ `
  attribute float aT;
  attribute float aSeed;
  varying float vT;
  varying float vSeed;
  #include <fog_pars_vertex>
  void main() {
    vT = aT;
    vSeed = aSeed;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const NET_FRAGMENT = /* glsl */ `
  uniform float uDraw;
  uniform float uNet;
  uniform float uTime;
  uniform float uVel;
  uniform float uCalm;
  uniform vec3 uGold;
  uniform vec3 uDeep;
  varying float vT;
  varying float vSeed;
  #include <fog_pars_fragment>
  void main() {
    float reach = clamp(uDraw * 1.7 - vSeed * 0.7, 0.0, 1.0);
    if (vT > reach) discard;
    float head = smoothstep(0.12, 0.0,
      abs(vT - fract(uTime * (0.07 + vSeed * 0.09) * (1.5 - uCalm) + vSeed * 7.0)));
    vec3 col = mix(uDeep, uGold, head);
    float a = (0.12 + head * 0.8 + abs(uVel) * 0.35) * uNet;
    gl_FragColor = vec4(col, a);
    #include <fog_fragment>
  }
`;

const GLOW_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const HAZE_FRAGMENT = /* glsl */ `
  uniform float uA;
  varying vec2 vUv;
  void main() {
    float a = pow(max(0.0, 1.0 - length(vUv - 0.5) * 2.0), 2.0) * uA;
    gl_FragColor = vec4(0.831, 0.686, 0.216, a);
  }
`;

const SHAFT_FRAGMENT = /* glsl */ `
  uniform float uA;
  varying vec2 vUv;
  void main() {
    float a = pow(1.0 - vUv.y, 1.8) * pow(max(0.0, 1.0 - abs(vUv.x - 0.5) * 2.0), 2.0) * uA;
    gl_FragColor = vec4(0.831, 0.686, 0.216, a);
  }
`;

const NODE_VERTEX = /* glsl */ `
  attribute float aSeed;
  varying float vSeed;
  void main() {
    vSeed = aSeed;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = (30.0 / -mvPosition.z) * (1.3 + aSeed);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const NODE_FRAGMENT = /* glsl */ `
  uniform float uDraw;
  uniform float uNet;
  uniform float uTime;
  uniform float uVel;
  uniform float uCalm;
  uniform vec3 uGold;
  varying float vSeed;
  void main() {
    if (vSeed > uDraw * 1.6) discard;
    float d = length(gl_PointCoord - 0.5);
    float disc = smoothstep(0.5, 0.05, d);
    float tw = 0.6 + 0.4 * sin(uTime * (1.2 + vSeed * 2.0) * (1.3 - uCalm) + vSeed * 20.0);
    gl_FragColor = vec4(uGold, disc * uNet * (0.25 + 0.55 * tw + abs(uVel) * 0.4));
  }
`;

function smoothstep01(x) {
  const t = THREE.MathUtils.clamp(x, 0, 1);
  return t * t * (3 - 2 * t);
}

export default function CityModel() {
  const gltf = useLoader(GLTFLoader, MODEL_URL);
  const low = isLowPowerDevice();
  const groupRef = useRef(null);
  const beaconRef = useRef(null);
  const haloRef = useRef(null);
  const rot = useRef(-0.5);
  const vel = useRef(0);

  const built = useMemo(() => {
    gltf.scene.updateMatrixWorld(true);
    const baked = [];
    gltf.scene.traverse((node) => {
      if (node.isMesh && node.name.includes('The_City')) {
        const geo = node.geometry.clone();
        geo.applyMatrix4(node.matrixWorld);
        if (!geo.attributes.normal) geo.computeVertexNormals();
        baked.push(geo);
      }
    });

    // normalize the baked city: centred on origin, base at y = 0
    const box = new THREE.Box3();
    baked.forEach((geo) => {
      geo.computeBoundingBox();
      box.union(geo.boundingBox);
    });
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = FOOTPRINT / Math.max(size.x, size.z);
    const m = new THREE.Matrix4()
      .makeScale(s, s, s)
      .multiply(new THREE.Matrix4().makeTranslation(-center.x, -box.min.y, -center.z));
    baked.forEach((geo) => geo.applyMatrix4(m));
    const height = size.y * s;

    // the gold network: nodes sampled from the rooftops of the model itself,
    // each wired to its nearest neighbours — the city's nervous system
    const cellMap = new Map();
    baked.forEach((geo) => {
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i += 5) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        if (y < height * 0.18) continue;
        const key = `${Math.round(x / 1.7)},${Math.round(z / 1.7)}`;
        const prev = cellMap.get(key);
        if (!prev || y > prev.y) cellMap.set(key, { x, y, z });
      }
    });
    const nodes = [...cellMap.values()]
      .sort((a, b) => b.y - a.y)
      .slice(0, low ? 40 : 80);

    const edgeKeys = new Set();
    const edges = [];
    for (let i = 0; i < nodes.length; i += 1) {
      const dists = [];
      for (let k = 0; k < nodes.length; k += 1) {
        if (k === i) continue;
        const dx = nodes[i].x - nodes[k].x;
        const dy = nodes[i].y - nodes[k].y;
        const dz = nodes[i].z - nodes[k].z;
        dists.push({ k, d: dx * dx + dy * dy + dz * dz });
      }
      dists.sort((a, b) => a.d - b.d);
      for (let n = 0; n < 3 && n < dists.length; n += 1) {
        const k = dists[n].k;
        const key = i < k ? `${i}-${k}` : `${k}-${i}`;
        if (!edgeKeys.has(key) && dists[n].d < 50) {
          edgeKeys.add(key);
          edges.push([nodes[i], nodes[k]]);
        }
      }
    }

    // trunk routes: transport lines descending from the core into the valley,
    // toward the distant districts — they activate late, as the world completes
    const routes = [];
    for (let i = 0; i < 12; i += 1) {
      const theta = (i / 12) * Math.PI * 2 + 0.26;
      const r = 20 + (i % 3) * 4;
      routes.push([
        { x: Math.cos(theta) * 2.5, y: 0.3, z: Math.sin(theta) * 2.5 },
        { x: Math.cos(theta) * r, y: -2.1, z: Math.sin(theta) * r },
      ]);
    }

    const all = [...edges, ...routes];
    const linePos = new Float32Array(all.length * 6);
    const lineT = new Float32Array(all.length * 2);
    const lineSeed = new Float32Array(all.length * 2);
    all.forEach(([a, b], e) => {
      linePos.set([a.x, a.y, a.z, b.x, b.y, b.z], e * 6);
      lineT.set([0, 1], e * 2);
      const seed = e < edges.length ? (e * 0.6180339887) % 1 : 0.7 + ((e * 0.37) % 1) * 0.3;
      lineSeed.set([seed, seed], e * 2);
    });
    const netGeo = new THREE.BufferGeometry();
    netGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    netGeo.setAttribute('aT', new THREE.BufferAttribute(lineT, 1));
    netGeo.setAttribute('aSeed', new THREE.BufferAttribute(lineSeed, 1));

    const nodePos = new Float32Array(nodes.length * 3);
    const nodeSeed = new Float32Array(nodes.length);
    nodes.forEach((n, i) => {
      nodePos.set([n.x, n.y, n.z], i * 3);
      nodeSeed[i] = i / nodes.length;
    });
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
    nodeGeo.setAttribute('aSeed', new THREE.BufferAttribute(nodeSeed, 1));

    const gold = new THREE.Color('#d4af37');
    const deep = new THREE.Color('#b8860b');
    const shared = {
      uBuild: { value: 0 },
      uTime: { value: 0 },
      uVel: { value: 0 },
    };
    const stage = {
      uSolid: { value: 0 },
      uSystem: { value: 0 },
      uCalm: { value: 0 },
      uWire: { value: 0.025 },
      uDraw: { value: 0 },
      uNet: { value: 0 },
      uWaveR: { value: 0 },
      uWaveAmp: { value: 0 },
    };

    const solidMaterial = new THREE.ShaderMaterial({
      vertexShader: GROW_VERTEX,
      fragmentShader: SOLID_FRAGMENT,
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {}]),
      transparent: true,
      fog: true,
    });
    Object.assign(solidMaterial.uniforms, shared, {
      uLift: { value: 0 },
      uSolid: stage.uSolid,
      uSystem: stage.uSystem,
      uCalm: stage.uCalm,
      uWaveR: stage.uWaveR,
      uWaveAmp: stage.uWaveAmp,
      uGold: { value: gold },
      uDeep: { value: deep },
    });

    const wireMaterial = new THREE.ShaderMaterial({
      vertexShader: GROW_VERTEX,
      fragmentShader: WIRE_FRAGMENT,
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {}]),
      transparent: true,
      wireframe: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: true,
    });
    Object.assign(wireMaterial.uniforms, shared, {
      uLift: { value: 0.5 },
      uWire: stage.uWire,
      uDeep: { value: deep },
    });

    const netMaterial = new THREE.ShaderMaterial({
      vertexShader: NET_VERTEX,
      fragmentShader: NET_FRAGMENT,
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {}]),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: true,
    });
    Object.assign(netMaterial.uniforms, {
      uTime: shared.uTime,
      uVel: shared.uVel,
      uDraw: stage.uDraw,
      uNet: stage.uNet,
      uCalm: stage.uCalm,
      uGold: { value: gold },
      uDeep: { value: deep },
    });

    const hazeMaterial = new THREE.ShaderMaterial({
      vertexShader: GLOW_VERTEX,
      fragmentShader: HAZE_FRAGMENT,
      uniforms: { uA: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const shaftMaterial = new THREE.ShaderMaterial({
      vertexShader: GLOW_VERTEX,
      fragmentShader: SHAFT_FRAGMENT,
      uniforms: { uA: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    const nodeMaterial = new THREE.ShaderMaterial({
      vertexShader: NODE_VERTEX,
      fragmentShader: NODE_FRAGMENT,
      uniforms: {
        uTime: shared.uTime,
        uVel: shared.uVel,
        uDraw: stage.uDraw,
        uNet: stage.uNet,
        uCalm: stage.uCalm,
        uGold: { value: gold },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return {
      geometries: baked,
      height,
      netGeo,
      nodeGeo,
      solidMaterial,
      wireMaterial,
      netMaterial,
      nodeMaterial,
      hazeMaterial,
      shaftMaterial,
      shared,
      stage,
    };
  }, [gltf, low]);

  useEffect(
    () => () => {
      built.geometries.forEach((geo) => geo.dispose());
      built.netGeo.dispose();
      built.nodeGeo.dispose();
      built.solidMaterial.dispose();
      built.wireMaterial.dispose();
      built.netMaterial.dispose();
      built.nodeMaterial.dispose();
      built.hazeMaterial.dispose();
      built.shaftMaterial.dispose();
    },
    [built]
  );

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const { draw, districts, rise, complete, final, journey } = cityState;
    const { shared, stage, height } = built;
    const t = clock.getElapsedTime();
    const k = 1 - Math.exp(-4 * delta);

    // scroll acceleration, smoothed and decayed — the city's reflex
    cityState.vel *= Math.exp(-2.5 * delta);
    vel.current += (cityState.vel - vel.current) * (1 - Math.exp(-6 * delta));

    // the model settles to its canonical orientation before the camera dives in
    const introTurn = 1 - smoothstep01(journey / 0.45);
    rot.current += (-0.5 * introTurn + Math.sin(t * 0.05) * 0.03 * final - rot.current) * k;
    group.rotation.y = rot.current;

    const construct = Math.min(1, districts * 0.3 + rise * 0.85 + Math.max(complete, final));
    shared.uBuild.value = construct;
    shared.uTime.value = t;
    shared.uVel.value = vel.current;

    stage.uSolid.value = Math.min(1, construct * 1.8) * 0.96;
    stage.uSystem.value = Math.max(rise * 0.55, complete, final * 0.9);
    stage.uCalm.value = final;

    // the ignition wave: fires in the back half of the rise, sweeps to the horizon
    const w = smoothstep01((rise - 0.55) / 0.45);
    stage.uWaveR.value = Math.max(w, complete, final) * 34;
    stage.uWaveAmp.value = w * (1 - w) * 4;
    stage.uWire.value = Math.max(0.012, 0.032 + draw * 0.018 + districts * 0.012 - construct * 0.028);
    stage.uDraw.value = Math.min(1, 0.08 + draw * 0.3 + districts * 0.5 + rise * 0.6 + complete);
    stage.uNet.value = Math.min(1, 0.3 + districts * 0.2 + complete * 0.3 + final * 0.2);

    if (beaconRef.current) {
      const bh = (height + 4.5) * final;
      beaconRef.current.scale.set(1, Math.max(bh, 0.001), 1);
      beaconRef.current.position.y = bh / 2;
      beaconRef.current.material.opacity = final * 0.55;
    }
    if (haloRef.current) {
      haloRef.current.material.opacity = final * 0.5;
      haloRef.current.position.y = (height + 4.1) * final;
    }
    built.hazeMaterial.uniforms.uA.value =
      0.05 + stage.uSystem.value * 0.05 + stage.uWaveAmp.value * 0.04;
    built.shaftMaterial.uniforms.uA.value =
      (stage.uSystem.value * 0.05 + stage.uWaveAmp.value * 0.03) *
      (0.8 + 0.2 * Math.sin(t * 0.4));
  });

  return (
    <group position={[0, GROUND_Y, 0]} ref={groupRef}>
      {built.geometries.map((geo) => (
        <group key={geo.uuid}>
          <mesh geometry={geo} material={built.solidMaterial} renderOrder={1} />
          <mesh geometry={geo} material={built.wireMaterial} renderOrder={2} />
        </group>
      ))}
      <lineSegments geometry={built.netGeo} material={built.netMaterial} renderOrder={3} />
      <points geometry={built.nodeGeo} material={built.nodeMaterial} renderOrder={4} />
      <mesh
        material={built.hazeMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.03, 0]}
        renderOrder={0}
      >
        <circleGeometry args={[15, 40]} />
      </mesh>
      {[
        [0, 0, 0, 0.9, 11],
        [4.2, 0, -3.4, 0.6, 8],
        [-5.2, 0, 2.2, 0.5, 7],
      ].map(([x, , z, w, h]) => (
        <group key={`${x}:${z}`} position={[x, h / 2, z]}>
          <mesh material={built.shaftMaterial} scale={[w, h, 1]} renderOrder={5}>
            <planeGeometry args={[1, 1]} />
          </mesh>
          <mesh
            material={built.shaftMaterial}
            scale={[w, h, 1]}
            rotation={[0, Math.PI / 2, 0]}
            renderOrder={5}
          >
            <planeGeometry args={[1, 1]} />
          </mesh>
        </group>
      ))}
      <mesh ref={beaconRef}>
        <cylinderGeometry args={[0.06, 0.06, 1, 6]} />
        <meshBasicMaterial
          color="#e6c860"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshBasicMaterial
          color="#e6c860"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
