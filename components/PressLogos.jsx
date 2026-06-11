'use client';

import Reveal from './motion/Reveal';
import styles from './PressLogos.module.css';

const PRESS = [
  'The Economic Times',
  'Forbes India',
  'Architectural Digest',
  'Hindustan Times',
  'CNBC-TV18',
  'GQ India',
];

export default function PressLogos() {
  return (
    <section className={styles.press} aria-label="Press coverage">
      <Reveal as="p" className={styles.label}>
        As Featured In
      </Reveal>
      <Reveal as="ul" className={styles.list} delay={0.1}>
        {PRESS.map((name) => (
          <li className={styles.name} key={name}>
            {name}
          </li>
        ))}
      </Reveal>
    </section>
  );
}
