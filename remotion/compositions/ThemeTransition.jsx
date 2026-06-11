import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { BG, GOLD, GOLD_LIGHT, WHITE, DISPLAY, BODY } from './palette';

const THEMES = [
  'Wellness & Longevity',
  'Golf Estates',
  'Equestrian Living',
  'Lakefront Retreats',
  'Vineyard Residences',
  'Adventure & Nature',
];

export default function ThemeTransition() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const per = durationInFrames / THEMES.length;
  const index = Math.min(THEMES.length - 1, Math.floor(frame / per));
  const local = frame - index * per;

  const opacity = interpolate(local, [0, 14, per - 14, per], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slide = interpolate(local, [0, per], [30, -30]);
  const glow = interpolate(local, [0, per / 2, per], [0.12, 0.3, 0.12]);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: 'center', alignItems: 'center' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 45% at 50% 55%, rgba(201,168,76,${glow}) 0%, transparent 70%)`,
        }}
      />
      <div
        style={{
          fontFamily: BODY,
          fontSize: 15,
          letterSpacing: '0.34em',
          textTransform: 'uppercase',
          color: GOLD,
          marginBottom: 36,
        }}
      >
        {String(index + 1).padStart(2, '0')} / {String(THEMES.length).padStart(2, '0')}
      </div>
      <div
        style={{
          fontFamily: DISPLAY,
          fontSize: 110,
          fontWeight: 500,
          fontStyle: 'italic',
          color: WHITE,
          opacity,
          transform: `translateX(${slide}px)`,
        }}
      >
        {THEMES[index]}
      </div>
      <div
        style={{
          marginTop: 48,
          width: 220,
          height: 1,
          background: `linear-gradient(to right, transparent, ${GOLD_LIGHT}, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
}
