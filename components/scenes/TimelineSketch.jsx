// Scroll-scrubbed 2025→2050 timeline. Renders once; the founder pin writes
// --seq on the film container and every animation resolves in CSS — no player,
// no seeks, no React work. Visual twin of remotion/compositions/FutureTimeline.jsx.

const F = 360;
const W = 1280;
const H = 720;
const BASE = 600;
const GOLD = '#d4af37';
const GOLD_LIGHT = '#e6c860';
const WHITE = '#f5f5f0';

const seg = (s, d) => `clamp(0, calc((var(--seq, 0) * ${F} - ${s}) / ${d}), 1)`;
const fade = (s, d) => `clamp(0, calc((${s} - var(--seq, 0) * ${F}) / ${d}), 1)`;

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

const GRID = seg(0, 70);
const GLOW = seg(255, 75);

export default function TimelineSketch() {
  return (
    <div style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
      {/* baseline + perspective grid */}
      <line
        x1="0"
        y1={BASE}
        x2={W}
        y2={BASE}
        pathLength="1"
        stroke={GOLD}
        strokeWidth="1.5"
        opacity="0.7"
        style={{ strokeDasharray: 1, strokeDashoffset: `calc(1 - ${GRID})` }}
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
            style={{ opacity: `calc(0.14 * ${GRID})` }}
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
          style={{ opacity: `calc(0.12 * ${GRID})` }}
        />
      ))}

      {/* skyline rising, then lighting up */}
      {BUILDINGS.map(([x, w, h], i) => {
        const rise = seg(85 + i * 5, 65);
        const fill = seg(180 + i * 4, 55);
        const floors = Math.floor(h / 36);
        return (
          <g key={`b${i}`} style={{ opacity: `min(calc(${rise} * 24), 0.9)` }}>
            <rect
              x={x}
              y={BASE - h}
              width={w}
              height={h}
              stroke={GOLD}
              strokeWidth="1"
              fill={GOLD}
              style={{
                fillOpacity: `calc(${fill} * 0.16 + ${GLOW} * 0.08)`,
                transform: `scaleY(${rise})`,
                transformBox: 'fill-box',
                transformOrigin: '50% 100%',
              }}
            />
            {Array.from({ length: floors }).map((_, r) => (
              <line
                key={`w${r}`}
                x1={x + 8}
                y1={BASE - 20 - r * 36}
                x2={x + w - 8}
                y2={BASE - 20 - r * 36}
                stroke={GOLD_LIGHT}
                strokeWidth="1.5"
                style={{ opacity: `min(calc(${fill} * 0.48), 0.45)` }}
              />
            ))}
          </g>
        );
      })}

      <circle cx={W * 0.78} cy={BASE - 340} r="46" stroke={GOLD_LIGHT} strokeWidth="1.5" style={{ opacity: `calc(${GLOW} * 0.8)` }} />
      <circle cx={W * 0.78} cy={BASE - 340} r="8" fill={GOLD_LIGHT} style={{ opacity: `calc(${GLOW} * 0.9)` }} />

      </svg>

      {/* chapter years + labels pinned to the container edges, crossfading */}
      {CHAPTERS.map((c, i) => {
        const fadeIn = i === 0 ? '1' : seg(i * 90 - 14, 28);
        const fadeOut = i === 3 ? '1' : fade((i + 1) * 90 + 14, 28);
        const vis = `min(${fadeIn}, ${fadeOut})`;
        return (
          <div key={c.year}>
            <div
              style={{
                position: 'absolute',
                right: 56,
                bottom: 40,
                fontFamily: 'var(--font-display), Georgia, serif',
                fontWeight: 500,
                fontSize: 170,
                lineHeight: 1,
                color: 'transparent',
                WebkitTextStroke: '2px rgba(212, 175, 55, 0.4)',
                opacity: vis,
              }}
            >
              {c.year}
            </div>
            <div
              style={{
                position: 'absolute',
                left: 56,
                bottom: 52,
                fontFamily: 'var(--font-ui)',
                fontSize: 15,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: WHITE,
                whiteSpace: 'nowrap',
                opacity: `calc(${vis} * 0.85)`,
              }}
            >
              <span style={{ color: GOLD, marginRight: 18 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {c.label}
            </div>
          </div>
        );
      })}

      {/* journey progress */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: 2,
          width: '100%',
          background: GOLD,
          opacity: 0.7,
          transform: 'scaleX(calc(var(--seq, 0)))',
          transformOrigin: '0 0',
        }}
      />
    </div>
  );
}
