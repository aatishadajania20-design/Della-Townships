'use client';

import { useCallback } from 'react';
import ScrollSequence from './motion/ScrollSequence';
import { useScrollTo } from './motion/SmoothScroll';
import cityState from './scenes/cityState';
import styles from './Hero.module.css';

export default function Hero() {
  const scrollTo = useScrollTo();

  const handleProgress = useCallback((p) => {
    cityState.hero = p;
  }, []);

  return (
    <ScrollSequence
      className={styles.hero}
      length={1.5}
      onProgress={handleProgress}
      ariaLabel="Della Townships introduction"
    >
      <div className={styles.atmosphere} aria-hidden="true" />

      <div className={styles.plane} aria-hidden="true">
        <span>Masterplan 01 &mdash; Theme-Based Township</span>
      </div>
      <div className={styles.planeAlt} aria-hidden="true">
        <span>Survey Grid &mdash; N 18.45&deg; E 73.40&deg;</span>
      </div>
      <div className={styles.ticks} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className={styles.content}>
        <p className={styles.eyebrow}>Redefining How India Lives, Works &amp; Dreams.</p>
        <h1 className={styles.headline}>
          We Don&rsquo;t Build Cities.
          <br />
          <em>We Design How India Lives.</em>
        </h1>
        <p className={styles.sub}>Asset-light. Theme-based. Longevity-led.</p>
        <button className="btn btnSolid" onClick={() => scrollTo('#audience')}>
          Explore Townships <span className="btnArrow">&darr;</span>
        </button>
      </div>

      <div className={styles.foot} aria-hidden="true">
        <span>Della Group &mdash; Est. 1996</span>
        <span className={styles.scrollHint}>Scroll</span>
        <span>Lonavala &middot; And 10 Cities Beyond</span>
      </div>
    </ScrollSequence>
  );
}
