'use client';

import styles from './Ticker.module.css';

const ITEMS = [
  '4,288 Acres',
  '₹46,480 Cr GDV',
  '12 Projects',
  '10 Cities',
  'Asset-Light',
  'Theme-Based',
  'Longevity-Led',
];

function TickerRow() {
  return (
    <div className={styles.row} aria-hidden="true">
      {ITEMS.map((item) => (
        <span className={styles.item} key={item}>
          {item}
          <span className={styles.dot} />
        </span>
      ))}
    </div>
  );
}

export default function Ticker() {
  return (
    <section
      className={styles.ticker}
      aria-label="Della Townships at a glance: 4,288 acres, ₹46,480 Cr GDV, 12 projects, 10 cities"
    >
      <div className={styles.track}>
        <TickerRow />
        <TickerRow />
        <TickerRow />
      </div>
    </section>
  );
}
