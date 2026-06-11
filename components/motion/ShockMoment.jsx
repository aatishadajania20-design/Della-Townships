'use client';

import { useCallback } from 'react';
import ScrollSequence from './ScrollSequence';
import cityState from '../scenes/cityState';
import MasterplanSketch from '../scenes/MasterplanSketch';
import styles from './ShockMoment.module.css';

export default function ShockMoment() {
  const onProgress = useCallback((p) => {
    cityState.rise = p;
  }, []);

  return (
    <ScrollSequence
      className={styles.moment}
      length={1.7}
      onProgress={onProgress}
      ariaLabel="The township rises"
    >
      <div className={styles.plan} aria-hidden="true">
        <div className={styles.planFrame}>
          <MasterplanSketch />
        </div>
      </div>

      <div className={styles.corners} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <p className={styles.tagline}>Redefining How India Lives, Works &amp; Dreams.</p>
      <div className={styles.rule} aria-hidden="true" />
      <p className={styles.plate} aria-hidden="true">
        Masterplan &mdash; 4,288 Acres &middot; 10 Cities
      </p>
    </ScrollSequence>
  );
}
