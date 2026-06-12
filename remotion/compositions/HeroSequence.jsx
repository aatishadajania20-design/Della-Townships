import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { BG, GOLD, GOLD_LIGHT, WHITE, DISPLAY, BODY } from './palette';

const LINES = ["We Don't Build Cities.", 'We Design How India Lives.'];

export default function HeroSequence() {
  const frame = useCurrentFrame();

  const horizonWidth = interpolate(frame, [10, 80], [0, 62], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const gridOpacity = interpolate(frame, [40, 110], [0, 0.16], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const gridShift = frame * 0.4;
  const subOpacity = interpolate(frame, [180, 220], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: 'hidden' }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', opacity: gridOpacity }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={`${(i / 13) * 100}%`}
            y1="58%"
            x2={`${50 + (i / 13 - 0.5) * 280}%`}
            y2="120%"
            stroke={GOLD}
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="0%"
            y1={`${58 + i * 7 + (gridShift % 7)}%`}
            x2="100%"
            y2={`${58 + i * 7 + (gridShift % 7)}%`}
            stroke={GOLD}
            strokeWidth="1"
          />
        ))}
      </svg>

      <div
        style={{
          position: 'absolute',
          top: '58%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${horizonWidth}%`,
          height: 2,
          background: `linear-gradient(to right, transparent, ${GOLD_LIGHT}, transparent)`,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          paddingBottom: 120,
        }}
      >
        {LINES.map((line, i) => {
          const start = 70 + i * 40;
          const opacity = interpolate(frame, [start, start + 36], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const y = interpolate(frame, [start, start + 36], [44, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={line}
              style={{
                fontFamily: DISPLAY,
                fontSize: 96,
                fontWeight: 500,
                lineHeight: 1.08,
                color: WHITE,
                opacity,
                transform: `translateY(${y}px)`,
              }}
            >
              {line}
            </div>
          );
        })}
        <div
          style={{
            marginTop: 48,
            fontFamily: BODY,
            fontSize: 20,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: GOLD_LIGHT,
            opacity: subOpacity,
          }}
        >
          Asset-light &nbsp;&middot;&nbsp; Theme-based &nbsp;&middot;&nbsp; Longevity-led
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
