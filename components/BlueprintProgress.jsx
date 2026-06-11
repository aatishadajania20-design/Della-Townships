'use client';

import { useEffect, useRef } from 'react';
import cityState from './scenes/cityState';
import styles from './BlueprintProgress.module.css';

const PHASES = ['Survey', 'Roads', 'Districts', 'Rise', 'City', 'Legacy'];

export default function BlueprintProgress() {
  const railRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf;
    let lastPhase = -1;
    let lastJourney = -1;
    const tick = () => {
      const j = cityState.journey;
      // no scroll → no style writes
      if (j !== lastJourney) {
        lastJourney = j;
        if (fillRef.current) fillRef.current.style.transform = `scaleY(${j.toFixed(4)})`;
        const phase = Math.min(PHASES.length - 1, Math.floor(j * PHASES.length));
        if (phase !== lastPhase && railRef.current) {
          lastPhase = phase;
          railRef.current.dataset.phase = phase;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={styles.rail} ref={railRef} data-phase="0" aria-hidden="true">
      <span className={styles.phases}>
        {PHASES.map((phase, i) => (
          <span className={styles.phase} key={phase}>
            <i>{String(i + 1).padStart(2, '0')}</i>
            {phase}
          </span>
        ))}
      </span>
      <span className={styles.line}>
        <span className={styles.fill} ref={fillRef} />
      </span>
    </div>
  );
}
