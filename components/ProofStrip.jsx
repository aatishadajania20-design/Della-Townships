'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionTransition from './motion/SectionTransition';
import Reveal from './motion/Reveal';
import styles from './ProofStrip.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const STATS = [
  { value: 4288, prefix: '', unit: 'Acres', label: 'Under Design' },
  { value: 46480, prefix: '₹', unit: 'Cr', label: 'Gross Development Value' },
  { value: 12, prefix: '', unit: 'Projects', label: 'Across India' },
  { value: 10, prefix: '', unit: 'Cities', label: 'And Growing' },
];

function Stat({ value, prefix, unit, label }) {
  const numberRef = useRef(null);

  useEffect(() => {
    const el = numberRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      el.textContent = prefix + value.toLocaleString('en-IN');
      return undefined;
    }
    const counter = { v: 0 };
    const tween = gsap.to(counter, {
      v: value,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => {
        el.textContent = prefix + Math.round(counter.v).toLocaleString('en-IN');
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, prefix]);

  return (
    <div className={styles.stat}>
      <dt className={styles.label}>{label}</dt>
      <dd className={styles.value}>
        <span ref={numberRef}>{prefix}0</span>
        <span className={styles.unit}> {unit}</span>
      </dd>
    </div>
  );
}

export default function ProofStrip() {
  return (
    <SectionTransition
      className={styles.proof}
      id="proof"
      ariaLabel="Della Townships portfolio scale: 4,288 acres, ₹46,480 Cr GDV, 12 projects, 10 cities"
    >
      <svg className={styles.gridBg} data-depth="-0.3" viewBox="0 0 1200 400" aria-hidden="true">
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 100} y1="0" x2={600 + (i - 6) * 260} y2="400" />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 100} x2="1200" y2={i * 100} />
        ))}
      </svg>

      <div className={styles.inner}>
        <Reveal as="p" className="eyebrow">
          The Portfolio
        </Reveal>

        <dl className={styles.grid}>
          {STATS.map((stat) => (
            <Stat key={stat.label} {...stat} />
          ))}
        </dl>

        <Reveal className={styles.cta}>
          <a className="btn btnGhost" href="#investors">
            View Investment Thesis <span className="btnArrow">&rarr;</span>
          </a>
        </Reveal>
      </div>
    </SectionTransition>
  );
}
