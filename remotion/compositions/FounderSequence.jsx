import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { BG, GOLD, GOLD_LIGHT } from './palette';

export default function FounderSequence() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const phase = (frame / durationInFrames) * Math.PI * 2;

  const glowX = 50 + Math.sin(phase) * 14;
  const glowY = 48 + Math.cos(phase) * 8;
  const streak = 50 + Math.sin(phase + Math.PI / 3) * 30;
  const breathe = 0.32 + Math.sin(phase * 2) * 0.06;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 55% at ${glowX}% ${glowY}%, rgba(214,181,91,${breathe}) 0%, rgba(10,10,10,0) 65%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(115deg, transparent ${streak - 12}%, rgba(234,217,172,0.10) ${streak}%, transparent ${streak + 12}%)`,
        }}
      />
      {[22, 50, 78].map((top, i) => (
        <div
          key={top}
          style={{
            position: 'absolute',
            top: `${top}%`,
            left: 0,
            right: 0,
            height: 1,
            background: GOLD,
            opacity: 0.1 + Math.sin(phase + i * 1.6) * 0.05,
            transform: `translateY(${Math.sin(phase * 1.5 + i) * 16}px)`,
          }}
        />
      ))}
      <AbsoluteFill
        style={{
          border: `1px solid ${GOLD_LIGHT}`,
          opacity: 0.12,
          margin: 48,
          width: 'auto',
          height: 'auto',
        }}
      />
      <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.05 }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 30} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
}
