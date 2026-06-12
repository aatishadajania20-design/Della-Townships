import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { BG, GOLD, GOLD_LIGHT, WHITE, DISPLAY, BODY } from './palette';

const STATS = [
  { end: 4288, label: 'Acres', format: (n) => Math.round(n).toLocaleString('en-IN') },
  { end: 46480, label: 'Cr GDV', format: (n) => `₹${Math.round(n).toLocaleString('en-IN')}` },
  { end: 12, label: 'Projects', format: (n) => `${Math.round(n)}` },
  { end: 10, label: 'Cities', format: (n) => `${Math.round(n)}` },
];

export default function ProofTransition() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 140,
      }}
    >
      {STATS.map((stat, i) => {
        const start = 20 + i * 24;
        const t = interpolate(frame, [start, start + 70], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const eased = 1 - (1 - t) ** 3;
        const lineHeight = interpolate(frame, [start - 10, start + 30], [0, 120], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            <div style={{ width: 1, height: lineHeight, background: GOLD, opacity: 0.5 }} />
            <div>
              <div
                style={{
                  fontFamily: DISPLAY,
                  fontSize: 92,
                  fontWeight: 500,
                  color: WHITE,
                  opacity: 0.2 + eased * 0.8,
                }}
              >
                {stat.format(stat.end * eased)}
              </div>
              <div
                style={{
                  fontFamily: BODY,
                  fontSize: 16,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: GOLD_LIGHT,
                  opacity: eased,
                }}
              >
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}
