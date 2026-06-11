'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import cityState from './cityState';

const Y = -0.4;

function subdivide(points, segsPerEdge = 16) {
  const verts = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const [x1, z1] = points[i];
    const [x2, z2] = points[i + 1];
    for (let s = 0; s < segsPerEdge; s += 1) {
      const t = s / segsPerEdge;
      verts.push(x1 + (x2 - x1) * t, Y, z1 + (z2 - z1) * t);
    }
  }
  const [lx, lz] = points[points.length - 1];
  verts.push(lx, Y, lz);
  return verts;
}

function ring(r) {
  return [
    [-r, -r],
    [r, -r],
    [r, r],
    [-r, r],
    [-r, -r],
  ];
}

export default function RoadNetwork() {
  const { group, items, mats } = useMemo(() => {
    const g = new THREE.Group();
    const list = [];
    const matArterial = new THREE.LineBasicMaterial({
      color: '#d6b55b',
      transparent: true,
      opacity: 0.5,
    });
    const matStreet = new THREE.LineBasicMaterial({
      color: '#d6b55b',
      transparent: true,
      opacity: 0.24,
    });

    const add = (pts, mat, groupKey, idx) => {
      const arr = subdivide(pts);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
      geo.setDrawRange(0, 0);
      const line = new THREE.Line(geo, mat);
      line.frustumCulled = false;
      g.add(line);
      list.push({ geo, count: arr.length / 3, groupKey, idx });
    };

    // arterials + rings — drawn during hero and statement
    let i = 0;
    add([[0, 15], [0, -15]], matArterial, 'a', i++);
    add([[-15, 0], [15, 0]], matArterial, 'a', i++);
    add([[-11, -11], [11, 11]], matArterial, 'a', i++);
    add([[-11, 11], [11, -11]], matArterial, 'a', i++);
    [3.5, 7, 10.5, 14].forEach((r) => add(ring(r), matArterial, 'a', i++));

    // district streets — filled in at the audience split
    let k = 0;
    for (let x = -12; x <= 12; x += 3) {
      if (Math.abs(x) < 1) continue;
      add([[x, -13], [x, 13]], matStreet, 'b', k++);
      add([[-13, x], [13, x]], matStreet, 'b', k++);
    }

    return { group: g, items: list, mats: { a: matArterial, b: matStreet } };
  }, []);

  const last = useRef({ draw: -1, districts: -1 });

  useFrame(({ clock }) => {
    const draw = Math.max(cityState.hero * 0.45, cityState.draw);
    const districts = cityState.districts;
    const energy = Math.max(cityState.complete, cityState.final);
    mats.a.opacity = 0.5 + energy * (0.22 + Math.sin(clock.getElapsedTime() * 1.3) * 0.06);
    mats.b.opacity = 0.24 + energy * 0.12;
    // draw ranges only change while their scroll bands are active
    if (draw !== last.current.draw || districts !== last.current.districts) {
      last.current.draw = draw;
      last.current.districts = districts;
      for (const it of items) {
        const base =
          it.groupKey === 'a' ? draw * 1.7 - it.idx * 0.07 : districts * 1.7 - it.idx * 0.04;
        const p = THREE.MathUtils.clamp(base, 0, 1);
        it.geo.setDrawRange(0, Math.floor(p * it.count));
      }
    }
  });

  return <primitive object={group} />;
}
