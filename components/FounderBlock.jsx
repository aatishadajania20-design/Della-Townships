'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from './motion/Reveal';
import TimelineSketch from './scenes/TimelineSketch';
import styles from './FounderBlock.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const QUOTE_LINES = ['I don’t follow the future.', 'I design it.'];

export default function FounderBlock() {
  const ref = useRef(null);
  const filmRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const film = filmRef.current;
    const lines = el.querySelectorAll(`.${styles.quoteLine}`);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(lines, { opacity: 1, y: 0 });
      film.style.setProperty('--seq', '0.85');
      return undefined;
    }

    const tl = gsap
      .timeline({ paused: true })
      .fromTo(
        lines,
        { opacity: 0, y: 70 },
        { opacity: 1, y: 0, stagger: 0.55, ease: 'power2.out', duration: 1 }
      );

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: '+=130%',
      pin: true,
      scrub: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        tl.progress(Math.min(1, self.progress * 1.5));
        film.style.setProperty('--seq', self.progress.toFixed(4));
      },
    });

    return () => {
      trigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <section className={styles.founder} id="founder" ref={ref} aria-label="The founder">
      <div className={styles.film} ref={filmRef} style={{ '--seq': 0 }} aria-hidden="true">
        <TimelineSketch />
      </div>
      <div className={styles.scrim} aria-hidden="true" />
      <span className={styles.ghost} aria-hidden="true">
        Visionary
      </span>

      <div className={styles.inner}>
        <p className="eyebrow">The Founder</p>

        <blockquote className={styles.quote}>
          {QUOTE_LINES.map((line) => (
            <p className={styles.quoteLine} key={line}>
              &ldquo;{line}&rdquo;
            </p>
          ))}
        </blockquote>

        <Reveal className={styles.person}>
          <p className={styles.name}>Jimmy Mistry</p>
          <p className={styles.role}>Founder &amp; CMD, DELLA Group</p>
          <p className={styles.bio}>
            From a single design practice to DELLA Resorts, Lonavala &mdash; India&rsquo;s
            benchmark for experiential luxury &mdash; Jimmy Mistry has spent three decades
            designing how India escapes. DELLA Townships is how India will live.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
