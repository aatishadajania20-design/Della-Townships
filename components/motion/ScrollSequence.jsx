'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollSequence({ children, length = 1.6, className, onProgress, ariaLabel }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--seq', '0.25');
      return undefined;
    }
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: () => `+=${window.innerHeight * length}`,
      pin: true,
      scrub: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        el.style.setProperty('--seq', self.progress.toFixed(4));
        onProgress?.(self.progress);
      },
    });
    return () => trigger.kill();
  }, [length, onProgress]);

  return (
    <section ref={ref} className={className} style={{ '--seq': 0 }} aria-label={ariaLabel}>
      {children}
    </section>
  );
}
