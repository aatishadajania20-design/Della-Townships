'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionTransition from './motion/SectionTransition';
import Reveal from './motion/Reveal';
import styles from './Statement.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SENTENCE = "The world's great cities didn't happen by accident.".split(' ');
const ACCENT = 'Neither do ours.'.split(' ');

export default function Statement() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const words = ref.current.querySelectorAll(`.${styles.word}`);
    const tween = gsap.fromTo(
      words,
      { opacity: 0.13 },
      {
        opacity: 1,
        stagger: 0.06,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 72%',
          end: 'top 18%',
          scrub: true,
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <SectionTransition className={styles.statement} id="statement" ariaLabel="The Della thesis">
      <span className={styles.ghost} data-depth="-0.5" aria-hidden="true">
        Design
      </span>
      <div className={styles.glow} data-depth="-0.25" aria-hidden="true" />

      <div className={styles.inner}>
        <p className="eyebrow">The DELLA Thesis</p>
        <h2 className={styles.text} ref={ref}>
          {SENTENCE.map((word, i) => (
            <span className={styles.word} key={`s${i}`}>
              {word}{' '}
            </span>
          ))}
          <em>
            {ACCENT.map((word, i) => (
              <span className={styles.word} key={`a${i}`}>
                {word}{' '}
              </span>
            ))}
          </em>
        </h2>

        <Reveal className={styles.body}>
          <p>
            DELLA Townships designs theme-based luxury townships across India &mdash; without
            owning the land. Landowners keep their asset. DELLA brings the design, the brand, and
            the demand. Every township is built around one idea: people live longer, better lives
            in places designed for how they actually want to live.
          </p>
          <p>
            The proof already exists. DELLA Resorts, Lonavala &mdash; conceived, designed, and
            operated by DELLA &mdash; set the standard for experiential luxury in India. Townships
            are that standard, at the scale of a city.
          </p>
        </Reveal>
      </div>
    </SectionTransition>
  );
}
