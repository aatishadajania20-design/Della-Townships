'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from './motion/Reveal';
import FutureTimeline, { TIMELINE_FRAMES } from '../remotion/compositions/FutureTimeline';
import styles from './FounderBlock.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Player = dynamic(() => import('@remotion/player').then((m) => m.Player), { ssr: false });

const QUOTE_LINES = ['I don’t follow the future.', 'I design it.'];

export default function FounderBlock() {
  const ref = useRef(null);
  const playerRef = useRef(null);
  const lastFrame = useRef(-1);
  const [showFilm, setShowFilm] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowFilm(entry.isIntersecting),
      { rootMargin: '400px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    const lines = el.querySelectorAll(`.${styles.quoteLine}`);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(lines, { opacity: 1, y: 0 });
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
        const frame = Math.round(self.progress * (TIMELINE_FRAMES - 1));
        if (playerRef.current && frame !== lastFrame.current) {
          lastFrame.current = frame;
          playerRef.current.seekTo(frame);
        }
      },
    });

    return () => {
      trigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <section className={styles.founder} id="founder" ref={ref} aria-label="The founder">
      <div className={styles.film} aria-hidden="true">
        {showFilm && (
          <Player
            ref={playerRef}
            component={FutureTimeline}
            durationInFrames={TIMELINE_FRAMES}
            fps={30}
            compositionWidth={1280}
            compositionHeight={720}
            initialFrame={0}
            controls={false}
            clickToPlay={false}
            doubleClickToFullscreen={false}
            spaceKeyToPlayOrPause={false}
            style={{ width: '100%', height: '100%' }}
          />
        )}
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
          <p className={styles.role}>Founder &amp; CMD, Della Group</p>
          <p className={styles.bio}>
            From a single design practice to Della Resorts, Lonavala &mdash; India&rsquo;s
            benchmark for experiential luxury &mdash; Jimmy Mistry has spent three decades
            designing how India escapes. Della Townships is how India will live.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
