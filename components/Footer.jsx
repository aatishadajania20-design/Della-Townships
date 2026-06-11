'use client';

import { useScrollTo } from './motion/SmoothScroll';
import styles from './Footer.module.css';

export default function Footer() {
  const scrollTo = useScrollTo();

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.top}>
        <div>
          <p className={styles.wordmark}>
            DELLA <span>TOWNSHIPS</span>
          </p>
          <p className={styles.tagline}>Redefining How India Lives, Works &amp; Dreams.</p>
        </div>

        <nav className={styles.col} aria-label="Explore">
          <p className={styles.heading}>Explore</p>
          <button onClick={() => scrollTo('#statement')}>Vision</button>
          <button onClick={() => scrollTo('#themes')}>Townships</button>
          <button onClick={() => scrollTo('#founder')}>Founder</button>
          <button onClick={() => scrollTo('#proof')}>Portfolio</button>
        </nav>

        <nav className={styles.col} aria-label="Partner">
          <p className={styles.heading}>Partner</p>
          <button onClick={() => scrollTo('#audience')}>Landowners</button>
          <button onClick={() => scrollTo('#audience')}>Memberships</button>
          <button onClick={() => scrollTo('#proof')}>Investors</button>
        </nav>

        <div className={styles.col} aria-label="Contact">
          <p className={styles.heading}>Contact</p>
          <a href="mailto:hello@dellatownships.com">hello@dellatownships.com</a>
          <p className={styles.address}>
            Della House, Mumbai
            <br />
            Maharashtra, India
          </p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} DELLA Group. All rights reserved.</p>
        <p>DELLA Resorts &middot; Lonavala</p>
      </div>
    </footer>
  );
}
