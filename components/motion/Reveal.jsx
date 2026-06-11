'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Reveal({ children, as: Tag = 'div', delay = 0, y = 48, variant = 'fade', className }) {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const el = ref.current;
    const mask = variant === 'mask';
    const tween = gsap.fromTo(
      el,
      mask ? { clipPath: 'inset(100% 0% 0% 0%)', y: 0, opacity: 1 } : { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration: mask ? 1.4 : 1,
        delay,
        ease: mask ? 'power4.inOut' : 'power3.out',
        ...(mask && { clipPath: 'inset(0% 0% 0% 0%)' }),
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, y, variant]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
