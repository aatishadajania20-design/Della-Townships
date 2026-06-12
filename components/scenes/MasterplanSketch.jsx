// Scroll-scrubbed masterplan blueprint. Renders once; every animation is a CSS
// expression of the section's --seq variable, so scrubbing costs zero JS and
// zero React renders. Visual twin of remotion/compositions/Masterplan.jsx.

const F = 240;
const S = 1080;
const C = S / 2;
const RINGS = [140, 240, 340, 430];
const DISTRICTS = ['Wellness', 'Golf', 'Equestrian', 'Lakefront', 'Vineyard', 'Nature'];
const GOLD = '#d4af37';
const GOLD_LIGHT = '#e6c860';
const WHITE = '#f5f5f0';

const seg = (s, d) => `clamp(0, calc((var(--seq, 0) * ${F} - ${s}) / ${d}), 1)`;
const draw = (s, d) => ({ strokeDasharray: 1, strokeDashoffset: `calc(1 - ${seg(s, d)})` });

// deterministic plot positions, same seed math as the Remotion composition
const PLOTS = Array.from({ length: 24 }).map((_, i) => {
  const ang = ((i * 15 + (i % 3) * 4 - 90) * Math.PI) / 180;
  const r = 165 + (i % 3) * 82 + ((i * 37) % 40);
  return { x: C + Math.cos(ang) * r, y: C + Math.sin(ang) * r, i };
});

const PULSE = seg(196, 40);
const pulseRing = (grow) => ({
  opacity: `calc(${PULSE} * ${grow})`,
  transform: `scale(calc(1 + ${PULSE} * 0.46))`,
  transformBox: 'fill-box',
  transformOrigin: 'center',
});

export default function MasterplanSketch() {
  return (
    <svg viewBox={`0 0 ${S} ${S}`} width="100%" height="100%" fill="none" aria-hidden="true">
      {/* survey axes */}
      <line x1={C - 500} y1={C} x2={C + 500} y2={C} pathLength="1" stroke={GOLD} strokeWidth="1" opacity="0.32" style={draw(0, 50)} />
      <line x1={C} y1={C - 500} x2={C} y2={C + 500} pathLength="1" stroke={GOLD} strokeWidth="1" opacity="0.32" style={draw(0, 50)} />
      <line x1={C - 354} y1={C - 354} x2={C + 354} y2={C + 354} pathLength="1" stroke={GOLD} strokeWidth="1" opacity="0.18" style={draw(14, 54)} />
      <line x1={C - 354} y1={C + 354} x2={C + 354} y2={C - 354} pathLength="1" stroke={GOLD} strokeWidth="1" opacity="0.18" style={draw(14, 54)} />

      {/* ring roads — infrastructure drawing itself */}
      {RINGS.map((r, i) => (
        <circle
          key={r}
          cx={C}
          cy={C}
          r={r}
          pathLength="1"
          stroke={GOLD}
          strokeWidth={i === RINGS.length - 1 ? 1.5 : 1}
          opacity={0.52 - i * 0.07}
          transform={`rotate(-90 ${C} ${C})`}
          style={draw(20 + i * 20, 76)}
        />
      ))}

      {/* district ticks + labels stamping in around the outer ring */}
      {DISTRICTS.map((district, i) => {
        const ang = ((-90 + i * 60) * Math.PI) / 180;
        const cos = Math.cos(ang);
        const sin = Math.sin(ang);
        return (
          <g key={district} style={{ opacity: seg(104 + i * 11, 22) }}>
            <line x1={C + cos * 430} y1={C + sin * 430} x2={C + cos * 462} y2={C + sin * 462} stroke={GOLD_LIGHT} strokeWidth="1" />
            <text
              x={C + cos * 502}
              y={C + sin * 502}
              fill={WHITE}
              fontFamily="var(--font-ui)"
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
      {PLOTS.map(({ x, y, i }) => (
        <rect
          key={i}
          x={x - 5}
          y={y - 5}
          width="10"
          height="10"
          stroke={GOLD}
          strokeWidth="1"
          fill="rgba(212, 175, 55, 0.2)"
          style={{ opacity: `calc(${seg(132 + i * 3, 22)} * 0.55)` }}
        />
      ))}

      {/* the city ignites */}
      <circle cx={C} cy={C} r={26} stroke={GOLD_LIGHT} strokeWidth="1.5" style={pulseRing(0.9)} />
      <circle cx={C} cy={C} r={64} stroke={GOLD_LIGHT} strokeWidth="1" style={pulseRing(0.3)} />
      <circle cx={C} cy={C} r={5} fill={GOLD_LIGHT} style={{ opacity: PULSE }} />
      <text
        x={C}
        y={C + 110}
        fill={GOLD_LIGHT}
        fontFamily="var(--font-ui)"
        fontSize="19"
        letterSpacing="14"
        textAnchor="middle"
        style={{ opacity: `calc(${PULSE} * 0.9)` }}
      >
        DELLA
      </text>
    </svg>
  );
}
