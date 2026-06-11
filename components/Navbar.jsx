'use client';

import { useEffect, useState } from 'react';
import { useScrollTo } from './motion/SmoothScroll';
import styles from './Navbar.module.css';

const LINKS = [
  { label: 'Vision', target: '#statement' },
  { label: 'Townships', target: '#themes' },
  { label: 'Partners', target: '#audience' },
  { label: 'Founder', target: '#founder' },
];

export default function Navbar() {
  const scrollTo = useScrollTo();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <button
        className={styles.brand}
        onClick={() => scrollTo(0)}
        aria-label="Della Townships — back to top"
      >
        DELLA <span>TOWNSHIPS</span>
      </button>

      <nav className={styles.links} aria-label="Primary">
        {LINKS.map((link) => (
          <button key={link.target} className={styles.link} onClick={() => scrollTo(link.target)}>
            {link.label}
          </button>
        ))}
      </nav>

      <button className={styles.cta} onClick={() => scrollTo('#audience')}>
        Become a Member
      </button>
    </header>
  );
}
