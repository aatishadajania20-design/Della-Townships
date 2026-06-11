'use client';

import { useRef } from 'react';
import Image from 'next/image';
import SectionTransition from './motion/SectionTransition';
import Reveal from './motion/Reveal';
import styles from './ThemesGrid.module.css';

const THEMES = [
  {
    name: 'Wellness & Longevity',
    note: 'Designed around the science of living longer',
    image:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80',
    alt: 'Serene spa setting with natural stones and soft light',
  },
  {
    name: 'Golf Estates',
    note: 'Championship fairways at your doorstep',
    image:
      'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=900&q=80',
    alt: 'Manicured golf course fairway winding through green hills',
  },
  {
    name: 'Equestrian Living',
    note: 'Stables, trails, and open country',
    image:
      'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=900&q=80',
    alt: 'Horse galloping across an open field at golden hour',
  },
  {
    name: 'Lakefront Retreats',
    note: 'Still water, slow mornings',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    alt: 'Calm mountain lake reflecting forested peaks',
  },
  {
    name: 'Vineyard Residences',
    note: 'Living among the vines',
    image:
      'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?auto=format&fit=crop&w=900&q=80',
    alt: 'Rows of grapevines stretching across a sunlit vineyard',
  },
  {
    name: 'Adventure & Nature',
    note: 'The Della Resorts DNA, citywide',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    alt: 'Sunlight breaking over a dramatic mountain valley',
  },
];

export default function ThemesGrid() {
  return (
    <SectionTransition className={styles.themes} id="themes" ariaLabel="Theme-based townships">
      <span className={styles.ghost} data-depth="-0.45" aria-hidden="true">
        Themes
      </span>

      <div className={styles.head}>
        <Reveal as="p" className="eyebrow">
          Theme-Based Townships
        </Reveal>
        <Reveal as="h2" className="sectionTitle" delay={0.08}>
          Every Township Begins
          <br />
          With a Way of Life
        </Reveal>
        <Reveal as="p" className={styles.intro} delay={0.16}>
          Not plots and towers &mdash; living themes. Each Della township is designed around a
          single way of life, then built outward: homes, hospitality, wellness, and work, all in
          service of it.
        </Reveal>
      </div>

      <div className={styles.grid}>
        {THEMES.map((theme, index) => (
          <Reveal as="figure" className={styles.card} key={theme.name} delay={(index % 3) * 0.08}>
            <Exhibit theme={theme} index={index} />
          </Reveal>
        ))}
      </div>
    </SectionTransition>
  );
}

function Exhibit({ theme, index }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width;
    const my = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${((0.5 - my) * 8).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((mx - 0.5) * 10).toFixed(2)}deg`);
    el.style.setProperty('--mx', `${(mx * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(my * 100).toFixed(1)}%`);
  };

  const handleLeave = () => {
    const el = ref.current;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <div
      ref={ref}
      className={styles.exhibit}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className={styles.media}>
        <div className={styles.mediaInner} data-depth="0.22">
          <Image
            src={theme.image}
            alt={theme.alt}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <span className={styles.plot} aria-hidden="true" />
        <span className={styles.spotlight} aria-hidden="true" />
      </div>
      <figcaption className={styles.caption}>
        <span className={styles.index}>District {String(index + 1).padStart(2, '0')}</span>
        <h3 className={styles.name}>{theme.name}</h3>
        <p className={styles.note}>{theme.note}</p>
      </figcaption>
    </div>
  );
}
