'use client';

import Image from 'next/image';
import SectionTransition from './motion/SectionTransition';
import Reveal from './motion/Reveal';
import styles from './AudienceSplit.module.css';

const PANELS = [
  {
    id: 'landowners',
    eyebrow: 'For Landowners',
    title: 'You Own the Land. We Bring Everything Else.',
    body: 'Della partners with landowners across India through an asset-light model. You retain ownership. We bring three decades of design, the Della brand, and proven demand — and transform your land into a destination.',
    cta: 'Partner With Us',
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    alt: 'Golden farmland at sunset, open land awaiting development',
  },
  {
    id: 'members',
    eyebrow: 'For Members',
    title: 'One Membership. Every Della Township.',
    body: 'Della Resort Memberships open the door before the first township does — privileged access to Della Resorts, Lonavala today, and to every theme-based township as it rises across 10 cities.',
    cta: 'Become a Member',
    image:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    alt: 'Infinity pool of a luxury resort overlooking the landscape at dusk',
  },
];

export default function AudienceSplit() {
  return (
    <SectionTransition
      className={styles.audience}
      id="audience"
      ariaLabel="Partnership paths for landowners and members"
    >
      {PANELS.map((panel) => (
        <article className={styles.panel} key={panel.id}>
          <div className={styles.media}>
            <div className={styles.mediaInner} data-depth="0.35">
              <Image
                src={panel.image}
                alt={panel.alt}
                fill
                sizes="(max-width: 860px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          <div className={styles.content}>
            <Reveal as="p" className="eyebrow">
              {panel.eyebrow}
            </Reveal>
            <Reveal as="h3" className={styles.title} delay={0.08}>
              {panel.title}
            </Reveal>
            <Reveal as="p" className={styles.body} delay={0.16}>
              {panel.body}
            </Reveal>
            <Reveal delay={0.24}>
              <a className="btn btnGhost" href={`#${panel.id}`}>
                {panel.cta} <span className="btnArrow">&rarr;</span>
              </a>
            </Reveal>
          </div>
        </article>
      ))}
    </SectionTransition>
  );
}
