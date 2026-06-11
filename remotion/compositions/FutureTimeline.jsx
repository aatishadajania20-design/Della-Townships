import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { BG, GOLD, GOLD_LIGHT, WHITE, DISPLAY, BODY } from './palette';

export const TIMELINE_FRAMES = 360;

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };

const CHAPTERS = [
  { year: '2025', label: 'Blueprint' },
  { year: '2030', label: 'Structure' },
  { year: '2040', label: 'Township' },
  { year: '2050', label: 'Legacy' },
];

const BUILDINGS = [
  [70, 64, 150], [160, 52, 235], [235, 78, 120], [330, 58, 300],
  [405, 70, 195], [490, 88, 360], [595, 62, 230], [675, 80, 290],
  [770, 68, 420], [855, 56, 185], [930, 84, 320], [1030, 58, 250],
  [1105, 72, 150], [1190, 48, 210],
];

const W = 1280;
const H = 720;
const BASE = 600;

export default function FutureTimeline() {
  const frame = useCurrentFrame();
  const chapter = Math.min(3, Math.floor(frame / 90));

  const gridDraw = interpolate(frame, [0, 70], [0, 1], CLAMP);
  const glow = interpolate(frame, [255, 330], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        <line
          x1={W / 2 - (W / 2) * gridDraw}
          y1={BASE}
          x2={W / 2 + (W / 2) * gridDraw}
          y2={BASE}
          stroke={GOLD}
          strokeWidth="1.5"
          opacity="0.7"
        />
        {Array.from({ length: 11 }).map((_, i) => {
          const x = (i / 10) * W;
          return (
            <line
              key={`g${i}`}
              x1={x}
              y1={BASE}
              x2={W / 2 + (x - W / 2) * 3}
              y2={H}
              stroke={GOLD}
              strokeWidth="1"
              opacity={0.14 * gridDraw}
            />
          );
        })}
        {[22, 52, 95].map((dy) => (
          <line
            key={`h${dy}`}
            x1="0"
            y1={BASE + dy}
            x2={W}
            y2={BASE + dy}
            stroke={GOLD}
            strokeWidth="1"
            opacity={0.12 * gridDraw}
          />
        ))}

        {BUILDINGS.map(([x, w, h], i) => {
          const rise = interpolate(frame, [85 + i * 5, 150 + i * 5], [0, 1], CLAMP);
          const fill = interpolate(frame, [180 + i * 4, 235 + i * 4], [0, 0.16], CLAMP);
          const hh = h * rise;
          const floors = Math.floor(hh / 36);
          return (
            <g key={`b${i}`} opacity={rise === 0 ? 0 : 0.9}>
              <rect
                x={x}
                y={BASE - hh}
                width={w}
                height={Math.max(hh, 0.01)}
                fill={`rgba(214,181,91,${fill + glow * 0.08})`}
                stroke={GOLD}
                strokeWidth="1"
              />
              {fill > 0.02 &&
                Array.from({ length: floors }).map((_, r) => (
                  <line
                    key={`w${r}`}
                    x1={x + 8}
                    y1={BASE - 20 - r * 36}
                    x2={x + w - 8}
                    y2={BASE - 20 - r * 36}
                    stroke={GOLD_LIGHT}
                    strokeWidth="1.5"
                    opacity={Math.min(0.45, fill * 3)}
                  />
                ))}
            </g>
          );
        })}

        <circle
          cx={W * 0.78}
          cy={BASE - 340}
          r={46}
          fill="none"
          stroke={GOLD_LIGHT}
          strokeWidth="1.5"
          opacity={glow * 0.8}
        />
        <circle cx={W * 0.78} cy={BASE - 340} r={8} fill={GOLD_LIGHT} opacity={glow * 0.9} />
      </svg>

      <div style={{ position: 'absolute', right: 56, bottom: 40, height: 170 }}>
        {CHAPTERS.map((c, i) => {
          const opacity = interpolate(
            frame,
            [i * 90 - 14, i * 90 + 14, (i + 1) * 90 - 14, (i + 1) * 90 + 14],
            [i === 0 ? 1 : 0, 1, 1, i === 3 ? 1 : 0],
            CLAMP
          );
          return (
            <div
              key={c.year}
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                fontFamily: DISPLAY,
                fontWeight: 500,
                fontSize: 170,
                lineHeight: 1,
                color: 'transparent',
                WebkitTextStroke: `2px rgba(214,181,91,0.4)`,
                opacity,
              }}
            >
              {c.year}
            </div>
          );
        })}
      </div>

      <div style={{ position: 'absolute', left: 56, bottom: 52, height: 30 }}>
        {CHAPTERS.map((c, i) => {
          const opacity = interpolate(
            frame,
            [i * 90 - 14, i * 90 + 14, (i + 1) * 90 - 14, (i + 1) * 90 + 14],
            [i === 0 ? 1 : 0, 1, 1, i === 3 ? 1 : 0],
            CLAMP
          );
          return (
            <div
              key={c.label}
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                fontFamily: BODY,
                fontSize: 15,
                letterSpacing: '0.34em',
                textTransform: 'uppercase',
                color: WHITE,
                opacity: opacity * 0.85,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ color: GOLD, marginRight: 18 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {c.label}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: 2,
          width: `${(frame / (TIMELINE_FRAMES - 1)) * 100}%`,
          background: GOLD,
          opacity: 0.7,
        }}
      />
    </AbsoluteFill>
  );
}
