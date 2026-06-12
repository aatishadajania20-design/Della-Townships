'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import cityState from './scenes/cityState';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TownshipScene = dynamic(() => import('./scenes/TownshipScene'), { ssr: false });

export default function ExperienceLayer() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const make = (sel, key, start, end) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start,
        end,
        onUpdate: (self) => {
          cityState[key] = self.progress;
        },
      });
    };

    const triggers = [
      make('#statement', 'draw', 'top 92%', 'top 18%'),
      make('#audience', 'districts', 'top 88%', 'bottom 45%'),
      make('#proof', 'complete', 'top 95%', 'top 30%'),
      make('#contact', 'final', 'top bottom', 'bottom bottom'),
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          cityState.journey = self.progress;
          cityState.vel = Math.max(-1, Math.min(1, self.getVelocity() / 3500));
        },
      }),
    ];
    if (reduced) {
      triggers.push(make('#themes', 'rise', 'top bottom', 'top 35%'));
    }

    // mousemove can outpace the frame rate — coalesce style writes into one rAF
    let pointerRaf = 0;
    const flushPointer = () => {
      pointerRaf = 0;
      document.documentElement.style.setProperty('--px', cityState.px.toFixed(3));
      document.documentElement.style.setProperty('--py', cityState.py.toFixed(3));
    };
    const onMove = (e) => {
      cityState.px = (e.clientX / window.innerWidth) * 2 - 1;
      cityState.py = (e.clientY / window.innerHeight) * 2 - 1;
      if (!pointerRaf) pointerRaf = requestAnimationFrame(flushPointer);
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      triggers.filter(Boolean).forEach((t) => t.kill());
      window.removeEventListener('mousemove', onMove);
      if (pointerRaf) cancelAnimationFrame(pointerRaf);
    };
  }, []);

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <TownshipScene />
      </Suspense>
    </div>
  );
}
