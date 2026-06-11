import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { GOLD, GOLD_LIGHT, WHITE, BODY } from './palette';

export const MASTERPLAN_FRAMES = 240;

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };

const S = 1080;
const C = S / 2;
const RINGS = [140, 240, 340, 430];
const DISTRICTS = ['Wellness', 'Golf', 'Equestrian', 'Lakefront', 'Vineyard', 'Nature'];

// deterministic plot positions — Remotion renders must be pure
const PLOTS = Array.from({ length: 24 }).map((_, i) => {
  const ang = ((i * 15 + (i % 3) * 4 - 90) * Math.PI) / 180;
  const r = 165 + (i % 3) * 82 + ((i * 37) % 40);
  return { x: C + Math.cos(ang) * r, y: C + Math.sin(ang) * r, i };
});

export default function Masterplan() {
  const frame = useCurrentFrame();

  const axes = interpolate(frame, [0, 50], [0, 1], CLAMP);
  const diag = interpolate(frame, [14, 68], [0, 1], CLAMP);
  const pulse = interpolate(frame, [196, 236], [0, 1], CLAMP);

  return (
    <AbsoluteFill>
      <svg width="100%" height="100%" viewBox={`0 0 ${S} ${S}`} fill="none">
        {/* survey axes */}
        <line x1={C - 500 * axes} y1={C} x2={C + 500 * axes} y2={C} stroke={GOLD} strokeWidth="1" opacity="0.32" />
        <line x1={C} y1={C - 500 * axes} x2={C} y2={C + 500 * axes} stroke={GOLD} strokeWidth="1" opacity="0.32" />
        <line x1={C - 354 * diag} y1={C - 354 * diag} x2={C + 354 * diag} y2={C + 354 * diag} stroke={GOLD} strokeWidth="1" opacity="0.18" />
        <line x1={C - 354 * diag} y1={C + 354 * diag} x2={C + 354 * diag} y2={C - 354 * diag} stroke={GOLD} strokeWidth="1" opacity="0.18" />

        {/* ring roads — infrastructure drawing itself */}
        {RINGS.map((r, i) => {
          const draw = interpolate(frame, [20 + i * 20, 96 + i * 20], [0, 1], CLAMP);
          const circ = 2 * Math.PI * r;
          return (
            <circle
              key={r}
              cx={C}
              cy={C}
              r={r}
              stroke={GOLD}
              strokeWidth={i === RINGS.length - 1 ? 1.5 : 1}
              opacity={0.52 - i * 0.07}
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - draw)}
              transform={`rotate(-90 ${C} ${C})`}
            />
          );
        })}

        {/* district ticks + labels stamping in around the outer ring */}
        {DISTRICTS.map((district, i) => {
          const ang = ((-90 + i * 60) * Math.PI) / 180;
          const x1 = C + Math.cos(ang) * 430;
          const y1 = C + Math.sin(ang) * 430;
          const x2 = C + Math.cos(ang) * 462;
          const y2 = C + Math.sin(ang) * 462;
          const lx = C + Math.cos(ang) * 502;
          const ly = C + Math.sin(ang) * 502;
          const on = interpolate(frame, [104 + i * 11, 126 + i * 11], [0, 1], CLAMP);
          return (
            <g key={district} opacity={on}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD_LIGHT} strokeWidth="1" />
              <text
                x={lx}
                y={ly}
                fill={WHITE}
                fontFamily={BODY}
                fontSize="16"
                letterSpacing="5"
                textAnchor="middle"
                dominantBaseline="middle"
                opacity="0.78"
              >
                {district.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* plots — experiences filling the districts */}
        {PLOTS.map(({ x, y, i }) => {
          const on = interpolate(frame, [132 + i * 3, 154 + i * 3], [0, 1], CLAMP);
          return (
            <rect
              key={i}
              x={x - 5}
              y={y - 5}
              width="10"
              height="10"
              stroke={GOLD}
              strokeWidth="1"
              opacity={on * 0.55}
              fill={`rgba(214,181,91,${(on * 0.14).toFixed(3)})`}
            />
          );
        })}

        {/* the city ignites */}
        <circle cx={C} cy={C} r={26 + pulse * 12} stroke={GOLD_LIGHT} strokeWidth="1.5" opacity={pulse * 0.9} />
        <circle cx={C} cy={C} r={64 + pulse * 30} stroke={GOLD_LIGHT} strokeWidth="1" opacity={pulse * 0.3} />
        <circle cx={C} cy={C} r={5} fill={GOLD_LIGHT} opacity={pulse} />
        <text
          x={C}
          y={C + 110}
          fill={GOLD_LIGHT}
          fontFamily={BODY}
          fontSize="19"
          letterSpacing="14"
          textAnchor="middle"
          opacity={pulse * 0.9}
        >
          DELLA
        </text>
      </svg>
    </AbsoluteFill>
  );
}
