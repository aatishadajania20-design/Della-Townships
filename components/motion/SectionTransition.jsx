'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SectionTransition({ children, as: Tag = 'section', className, id, ariaLabel }) {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const el = ref.current;
    const layers = el.querySelectorAll('[data-depth]');
    const tweens = [...layers].map((layer) => {
      const depth = parseFloat(layer.dataset.depth) || 0;
      return gsap.fromTo(
        layer,
        { y: depth * 110 },
        {
          y: depth * -110,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );
    });
    return () =>
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
  }, []);

  return (
    <Tag ref={ref} id={id} className={className} aria-label={ariaLabel}>
      {children}
    </Tag>
  );
}
