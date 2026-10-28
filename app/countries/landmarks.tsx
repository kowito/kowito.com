import { useId, type ReactNode } from "react";

/**
 * Manga-style landmark panels, one per country: ink outlines, screentone shading and focus lines,
 * all drawn on a 160 × 100 canvas with the ground at y = 88.
 */

type Kit = { tone: string; light: string; hatch: string; dark: string };

/* ── Shared bits ── */

const ground = (k: Kit, fill = k.light) => <path d="M0 88 H160 V100 H0 Z" fill={fill} />;

function water(k: Kit, y = 86) {
  const waves = Array.from({ length: 3 }, (_, row) => {
    const yy = y + 4 + row * 4;
    const offset = row % 2 ? 6 : 0;
    let d = "";
    for (let x = -offset; x < 160; x += 14) d += `M${x} ${yy} q3.5 -2 7 0 `;
    return <path key={row} d={d} fill="none" strokeWidth={1} />;
  });
  return (
    <>
      <path d={`M0 ${y} H160 V100 H0 Z`} fill={k.light} />
      {waves}
    </>
  );
}

/** Battlements along a wall top. */
const crenels = (x0: number, x1: number, y: number, step = 6) =>
  Array.from({ length: Math.floor((x1 - x0) / step) }, (_, i) => (
    <rect key={i} x={x0 + i * step} y={y - 3} width={step / 2} height={3} fill="#fff" strokeWidth={1.2} />
  ));

const palm = (x: number, y: number, h: number, key?: string) => (
  <g key={key}>
    <path d={`M${x} ${y} Q${x + 4} ${y - h / 2} ${x + 2} ${y - h}`} fill="none" strokeWidth={2.4} />
    {[
      [-13, 5],
      [13, 5],
      [-10, -4],
      [10, -4],
      [0, -8],
    ].map(([dx, dy], i) => (
      <path
        key={i}
        d={`M${x + 2} ${y - h} q${dx / 2} ${dy - 5} ${dx} ${dy} q${-dx / 3} ${-2} ${-dx} ${-dy}`}
        fill="#111"
        strokeWidth={0.8}
      />
    ))}
  </g>
);

const mirror = (points: [number, number][]) => points.map(([x, y]) => [160 - x, y] as [number, number]);
const poly = (points: [number, number][]) => points.map((p) => p.join(",")).join(" ");

/* ── The drawings ── */

const draw: Record<string, (k: Kit) => ReactNode> = {
  CA: (k) => (
    <>
      {ground(k)}
      <rect x="34" y="60" width="14" height="28" fill={k.tone} />
      <rect x="50" y="70" width="12" height="18" fill={k.light} />
      <rect x="100" y="56" width="14" height="32" fill={k.tone} />
      <rect x="116" y="68" width="14" height="20" fill={k.light} />
      <line x1="80" y1="4" x2="80" y2="26" />
      <polygon points="75,88 78.5,40 79,26 81,26 81.5,40 85,88" fill="#fff" />
      <ellipse cx="80" cy="40" rx="11" ry="4.5" fill={k.tone} />
      <ellipse cx="80" cy="27" rx="4" ry="2" fill={k.dark} />
    </>
  ),

  CN: (k) => (
    <>
      <path d="M0 64 Q30 40 60 56 T120 46 T160 52 V100 H0 Z" fill={k.light} />
      <path d="M0 82 Q40 60 80 72 T160 68 V100 H0 Z" fill={k.tone} />
      <path d="M0 80 Q40 58 80 70 T160 66" fill="none" stroke="#000" strokeWidth={8} />
      <path d="M0 80 Q40 58 80 70 T160 66" fill="none" stroke="#fff" strokeWidth={5} />
      <path d="M0 77 Q40 55 80 67 T160 63" fill="none" strokeWidth={2.4} strokeDasharray="2.5 2.5" strokeLinecap="butt" />
      <rect x="29" y="54" width="11" height="13" fill="#fff" />
      {crenels(29, 41, 54, 4)}
      <rect x="114" y="61" width="11" height="13" fill="#fff" />
      {crenels(114, 126, 61, 4)}
    </>
  ),

  JP: (k) => (
    <>
      <circle cx="122" cy="22" r="11" fill={k.tone} />
      <path d="M12 88 L66 30 Q80 26 94 30 L148 88 Z" fill={k.light} />
      <path d="M66 30 Q80 26 94 30 L105 42 L97 39 L91 46 L84 40 L77 46 L70 39 L55 42 Z" fill="#fff" />
      <path d="M0 88 H160" />
      <path d="M18 54 Q37 49 56 54 L55 58.5 Q37 54.5 19 58.5 Z" fill={k.dark} />
      <rect x="23" y="63" width="28" height="3" fill={k.dark} />
      <rect x="26.5" y="57" width="3.5" height="31" fill={k.dark} />
      <rect x="44" y="57" width="3.5" height="31" fill={k.dark} />
    </>
  ),

  MY: (k) => {
    const tower = (cx: number) => (
      <g key={cx}>
        <polygon
          points={`${cx - 9},88 ${cx - 9},46 ${cx - 7},42 ${cx - 7},32 ${cx - 5},28 ${cx - 5},22 ${cx - 3},18 ${cx - 1.5},12 ${cx},2 ${cx + 1.5},12 ${cx + 3},18 ${cx + 5},22 ${cx + 5},28 ${cx + 7},32 ${cx + 7},42 ${cx + 9},46 ${cx + 9},88`}
          fill={k.tone}
        />
        <line x1={cx} y1="88" x2={cx} y2="46" strokeWidth={0.8} />
      </g>
    );
    return (
      <>
        {ground(k)}
        {tower(62)}
        {tower(98)}
        <line x1="75" y1="55" x2="71" y2="66" />
        <line x1="85" y1="55" x2="89" y2="66" />
        <rect x="71" y="52" width="18" height="3" fill="#fff" />
      </>
    );
  },

  NL: (k) => (
    <>
      {ground(k, k.tone)}
      {[18, 28, 38, 122, 132, 142].map((x) => (
        <path key={x} d={`M${x} 88 V81 M${x - 2.5} 81 q0 -5 2.5 -5 q2.5 0 2.5 5 z`} fill="#111" strokeWidth={1} />
      ))}
      <path d="M66 88 L71 46 H89 L94 88 Z" fill="#fff" />
      <path d="M76 88 V80 Q80 75 84 80 V88" fill={k.dark} />
      <rect x="78" y="58" width="4" height="5" fill={k.dark} />
      <path d="M69 47 Q80 32 91 47 Z" fill={k.dark} />
      {/* Sails turn when the card is hovered. */}
      <g
        className="motion-safe:group-hover:animate-[spin_4s_linear_infinite]"
        style={{ transformOrigin: "80px 42px", transformBox: "view-box" }}
      >
        {[15, 105, 195, 285].map((a) => (
          <g key={a} transform={`rotate(${a} 80 42)`}>
            <line x1="80" y1="42" x2="80" y2="7" />
            <rect x="81" y="8" width="7" height="27" fill={k.light} strokeWidth={1.2} />
          </g>
        ))}
        <circle cx="80" cy="42" r="2.5" fill={k.dark} />
      </g>
    </>
  ),

  SG: (k) => (
    <>
      {water(k)}
      {[46, 72, 98].map((x) => (
        <path key={x} d={`M${x} 86 L${x + 2} 38 H${x + 14} L${x + 16} 86 Z`} fill={k.tone} />
      ))}
      <path d="M36 38 H128 Q133 38 131 33 H40 Q35 33 36 38 Z" fill={k.dark} />
      {[18, 142].map((x) => (
        <g key={x}>
          <path d={`M${x - 3} 86 L${x} 62 L${x + 3} 86`} fill={k.tone} strokeWidth={1.2} />
          <path d={`M${x - 10} 62 Q${x} 54 ${x + 10} 62 Z`} fill={k.hatch} strokeWidth={1.2} />
        </g>
      ))}
    </>
  ),

  TW: (k) => (
    <>
      <path d="M0 72 Q30 50 60 66 Q110 40 160 62 V88 H0 Z" fill={k.light} />
      {ground(k, "#fff")}
      <path d="M68 88 L70 70 H90 L92 88 Z" fill={k.tone} />
      {Array.from({ length: 8 }, (_, i) => {
        const yb = 70 - i * 6.5;
        const yt = yb - 6.5;
        return <polygon key={i} points={`72,${yb} 70.5,${yt} 89.5,${yt} 88,${yb}`} fill={i % 2 ? "#fff" : k.tone} />;
      })}
      <path d="M74 18 L76 12 H84 L86 18 Z" fill="#fff" />
      <line x1="80" y1="12" x2="80" y2="2" />
    </>
  ),

  US: (k) => (
    <>
      {water(k)}
      <path d="M62 88 L66 66 H94 L98 88 Z" fill={k.tone} />
      <rect x="64" y="62" width="32" height="4" fill="#fff" />
      <path d="M72 62 L74 40 Q76 33 80 33 Q84 33 86 40 L88 62 Z" fill={k.light} />
      <path d="M84 37 L90 14 L93 15 L88 39" fill="#fff" />
      <rect x="70" y="40" width="5" height="9" fill="#fff" transform="rotate(-15 72 44)" />
      <circle cx="80" cy="29" r="4.5" fill="#fff" />
      {[
        [76, 25, 72, 20],
        [78, 24, 77, 17.5],
        [80, 24, 80, 17],
        [82, 24, 83, 17.5],
        [84, 25, 88, 20],
      ].map(([x1, y1, x2, y2]) => (
        <line key={x2} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={1.2} />
      ))}
      <path d="M88 14 L95 14 L93.5 10 H89.5 Z" fill={k.dark} />
      <path d="M91.5 10 Q88 6 91.5 1.5 Q95 6 91.5 10 Z" fill="#fff" />
    </>
  ),

  LA: (k) => (
    <>
      {ground(k)}
      <rect x="32" y="72" width="96" height="16" fill={k.tone} />
      <rect x="48" y="62" width="64" height="10" fill="#fff" />
      {[37, 44, 116, 123].map((x) => (
        <polygon key={x} points={`${x - 2.5},72 ${x},61 ${x + 2.5},72`} fill="#fff" strokeWidth={1.2} />
      ))}
      {[53, 60, 100, 107].map((x) => (
        <polygon key={x} points={`${x - 2.5},62 ${x},50 ${x + 2.5},62`} fill="#fff" strokeWidth={1.2} />
      ))}
      <path d="M66 62 Q66 48 74 44 Q78 30 80 8 Q82 30 86 44 Q94 48 94 62 Z" fill={k.tone} />
      <path d="M68 52 Q80 48 92 52" fill="none" strokeWidth={1.2} />
    </>
  ),

  TH: (k) => {
    const prang = (cx: number, s: number) => (
      <g key={cx}>
        <polygon points={`${cx - 16 * s},86 ${cx + 16 * s},86 ${cx + 12 * s},${86 - 22 * s} ${cx - 12 * s},${86 - 22 * s}`} fill={k.tone} />
        <polygon points={`${cx - 11 * s},${86 - 22 * s} ${cx + 11 * s},${86 - 22 * s} ${cx + 7 * s},${86 - 42 * s} ${cx - 7 * s},${86 - 42 * s}`} fill="#fff" />
        <path d={`M${cx - 7 * s} ${86 - 42 * s} Q${cx - 7 * s} ${86 - 60 * s} ${cx} ${86 - 70 * s} Q${cx + 7 * s} ${86 - 60 * s} ${cx + 7 * s} ${86 - 42 * s} Z`} fill={k.tone} />
        <line x1={cx} y1={86 - 70 * s} x2={cx} y2={86 - 80 * s} />
        {[8, 14].map((dy) => (
          <line key={dy} x1={cx - (16 - dy / 5.5) * s} y1={86 - dy * s} x2={cx + (16 - dy / 5.5) * s} y2={86 - dy * s} strokeWidth={0.9} />
        ))}
      </g>
    );
    return (
      <>
        {water(k)}
        {prang(36, 0.55)}
        {prang(124, 0.55)}
        {prang(80, 1)}
      </>
    );
  },

  MX: (k) => (
    <>
      {ground(k)}
      {Array.from({ length: 5 }, (_, i) => {
        const hb = 60 - i * 10;
        return (
          <polygon key={i} points={`${80 - hb},${86 - i * 10} ${80 + hb},${86 - i * 10} ${80 + hb - 3},${76 - i * 10} ${80 - hb + 3},${76 - i * 10}`} fill={i % 2 ? "#fff" : k.tone} />
        );
      })}
      <path d="M73 86 L75.5 36 H84.5 L87 86 Z" fill="#fff" />
      {Array.from({ length: 16 }, (_, i) => (
        <line key={i} x1={74 + i * 0.1} y1={39 + i * 3} x2={86 - i * 0.1} y2={39 + i * 3} strokeWidth={0.8} />
      ))}
      <rect x="68" y="24" width="24" height="12" fill="#fff" />
      <rect x="66" y="21" width="28" height="3" fill={k.dark} />
      <rect x="77" y="28" width="6" height="8" fill={k.dark} />
    </>
  ),

  AR: (k) => (
    <>
      <path d="M0 70 H160 V100 H0 Z" fill={k.light} />
      {[
        [4, 52, 14],
        [20, 58, 12],
        [34, 62, 10],
        [116, 62, 10],
        [128, 56, 12],
        [142, 50, 14],
      ].map(([x, y, w]) => (
        <rect key={x} x={x} y={y} width={w} height={70 - y} fill={k.tone} strokeWidth={1.2} />
      ))}
      <path d="M8 100 L74 70 H86 L152 100 Z" fill="#fff" />
      <line x1="80" y1="100" x2="80" y2="74" strokeDasharray="4 3" strokeWidth={1.2} />
      <path d="M75 72 L77.5 16 L80 8 L82.5 16 L85 72 Z" fill="#fff" />
      <path d="M80 8 L82.5 16 L85 72 H80 Z" fill={k.tone} stroke="none" />
      <path d="M75 72 L77.5 16 L80 8 L82.5 16 L85 72 Z" fill="none" />
      <rect x="79" y="18" width="2" height="3" fill={k.dark} strokeWidth={0.6} />
    </>
  ),

  CO: (k) => (
    <>
      {ground(k)}
      {palm(22, 88, 34)}
      {palm(140, 88, 30)}
      <rect x="44" y="58" width="72" height="30" fill={k.tone} />
      {crenels(44, 116, 58, 8)}
      <path d="M70 88 V70 Q80 60 90 70 V88 Z" fill={k.dark} />
      <rect x="68" y="32" width="24" height="26" fill="#fff" />
      <circle cx="80" cy="43" r="6.5" fill="#fff" />
      <path d="M80 43 V39 M80 43 L83 44.5" fill="none" strokeWidth={1.2} />
      <path d="M66 32 Q80 14 94 32 Z" fill={k.tone} />
      <line x1="80" y1="20" x2="80" y2="7" />
      <circle cx="80" cy="6" r="1.5" fill={k.dark} />
    </>
  ),

  TR: (k) => {
    const minaret = (x: number) => (
      <g key={x}>
        <rect x={x - 1.6} y="26" width="3.2" height="62" fill="#fff" strokeWidth={1.2} />
        <polygon points={`${x - 1.6},26 ${x},12 ${x + 1.6},26`} fill={k.dark} strokeWidth={1} />
        <line x1={x - 3} y1="44" x2={x + 3} y2="44" strokeWidth={1.2} />
        <line x1={x - 3} y1="60" x2={x + 3} y2="60" strokeWidth={1.2} />
      </g>
    );
    return (
      <>
        {ground(k)}
        {[26, 34, 126, 134].map(minaret)}
        <rect x="40" y="60" width="80" height="28" fill="#fff" />
        <path d="M40 66 Q40 52 54 52 V66 Z" fill={k.light} />
        <path d="M120 66 Q120 52 106 52 V66 Z" fill={k.light} />
        <path d="M54 60 Q54 30 80 28 Q106 30 106 60 Z" fill={k.tone} />
        <line x1="80" y1="28" x2="80" y2="21" />
        {[50, 62, 74, 86, 98, 110].map((x) => (
          <path key={x} d={`M${x - 2} 82 V74 Q${x} 71 ${x + 2} 74 V82 Z`} fill={k.dark} strokeWidth={0.8} />
        ))}
      </>
    );
  },

  ID: (k) => {
    const left: [number, number][] = [
      [30, 88], [30, 74], [34, 74], [34, 62], [38, 62], [38, 50], [42, 50], [42, 40],
      [46, 40], [46, 30], [52, 24], [58, 18], [64, 10], [68, 10], [68, 88],
    ];
    return (
      <>
        <path d="M44 88 L72 40 Q80 36 88 40 L116 88 Z" fill="#fff" />
        <path d="M72 40 Q80 44 88 40" fill="none" />
        {ground(k, k.tone)}
        <polygon points={poly(left)} fill={k.dark} />
        <polygon points={poly(mirror(left))} fill={k.dark} />
        {[50, 62, 74].map((y) => (
          <g key={y}>
            <line x1="30" y1={y + 4} x2="68" y2={y + 4} stroke="#fff" strokeWidth={0.9} />
            <line x1="92" y1={y + 4} x2="130" y2={y + 4} stroke="#fff" strokeWidth={0.9} />
          </g>
        ))}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={68 - i * 2} y={80 + i * 2} width={24 + i * 4} height="2" fill="#fff" strokeWidth={1} />
        ))}
      </>
    );
  },

  PE: (k) => (
    <>
      <path d="M0 62 L18 40 L36 58 L50 44 L60 52 V88 H0 Z" fill={k.light} />
      <path d="M112 50 L130 34 L146 52 L160 42 V88 H112 Z" fill={k.light} />
      <path d="M58 88 Q62 50 76 26 Q84 14 92 20 Q104 32 114 88 Z" fill={k.tone} />
      <path d="M0 88 V66 H18 V70 H30 V74 H42 V78 H54 V82 H66 V88 Z" fill="#fff" />
      {[70, 74, 78, 82].map((y, i) => (
        <line key={y} x1={0} y1={y} x2={18 + i * 12} y2={y} strokeWidth={0.8} />
      ))}
      {[
        [104, 72, 10, 8],
        [116, 74, 9, 6],
        [127, 70, 11, 10],
      ].map(([x, y, w, h]) => (
        <g key={x}>
          <rect x={x} y={y} width={w} height={h} fill="#fff" strokeWidth={1.2} />
          <path d={`M${x + w / 2 - 1.5} ${y + h} L${x + w / 2 - 1} ${y + 2} H${x + w / 2 + 1} L${x + w / 2 + 1.5} ${y + h}`} fill={k.dark} strokeWidth={0.6} />
        </g>
      ))}
      <path d="M100 88 H160" />
    </>
  ),

  KR: (k) => (
    <>
      <path d="M30 88 Q70 52 110 58 Q132 64 160 88 Z" fill={k.light} />
      <polygon points="88.5,58 90,26 92,26 93.5,58" fill="#fff" />
      <rect x="85" y="22" width="12" height="6" rx="2" fill={k.tone} />
      <rect x="87" y="18" width="8" height="4" fill="#fff" />
      <line x1="91" y1="18" x2="91" y2="3" />
      {ground(k)}
      <rect x="28" y="70" width="64" height="18" fill="#fff" />
      {[36, 44, 52, 60, 68, 76, 84].map((x) => (
        <line key={x} x1={x} y1="72" x2={x} y2="88" strokeWidth={1} />
      ))}
      <path d="M34 60 Q60 54 86 60 L80 54 Q60 50 40 54 Z" fill={k.dark} />
      <rect x="40" y="60" width="40" height="6" fill="#fff" />
      <path d="M14 72 Q60 63 106 72 L97 63 Q60 57 23 63 Z" fill={k.dark} />
    </>
  ),

  GE: (k) => (
    <>
      <path d="M0 88 V64 Q30 40 70 46 Q110 30 160 52 V88 Z" fill={k.tone} />
      <path d="M18 54 L50 44 L70 46 L100 38 L132 40" fill="none" stroke="#000" strokeWidth={5} />
      <path d="M18 54 L50 44 L70 46 L100 38 L132 40" fill="none" stroke="#fff" strokeWidth={2.4} />
      {[
        [46, 34],
        [96, 28],
        [128, 30],
      ].map(([x, y]) => (
        <g key={x}>
          <rect x={x} y={y} width="9" height="11" fill="#fff" />
          {crenels(x, x + 10, y, 3)}
        </g>
      ))}
      <rect x="54" y="60" width="16" height="12" fill="#fff" />
      <rect x="59" y="52" width="6" height="8" fill="#fff" />
      <polygon points="58,52 62,43 66,52" fill={k.dark} />
      {[
        [8, 74, 14],
        [26, 70, 12],
        [86, 72, 14],
        [104, 76, 12],
        [120, 70, 16],
        [140, 74, 14],
      ].map(([x, y, w]) => (
        <g key={x}>
          <rect x={x} y={y} width={w} height={88 - y} fill="#fff" strokeWidth={1.2} />
          <line x1={x} y1={y + 6} x2={x + w} y2={y + 6} strokeWidth={0.8} />
        </g>
      ))}
      <path d="M0 88 H160" />
    </>
  ),

  ZA: (k) => (
    <>
      {water(k, 84)}
      <path d="M118 84 Q128 50 140 52 Q148 56 156 84 Z" fill={k.light} />
      <path d="M4 84 L26 48 Q30 42 38 42 H112 Q118 42 120 46 L138 84 Z" fill={k.tone} />
      <path d="M36 44 Q42 36 52 40 Q60 32 72 38 Q82 32 92 38 Q102 32 114 43 Z" fill="#fff" />
      {[30, 42, 52, 64, 96, 108, 120].map((x, i) => (
        <rect key={x} x={x} y={78 - (i % 3) * 2} width="6" height={6 + (i % 3) * 2} fill="#fff" strokeWidth={1} />
      ))}
    </>
  ),

  PT: (k) => (
    <>
      {water(k)}
      <path d="M46 86 V64 H114 V86 Z" fill={k.tone} />
      {crenels(46, 114, 64, 7)}
      <rect x="64" y="26" width="32" height="38" fill="#fff" />
      {crenels(64, 96, 26, 5)}
      {[
        [71, 34],
        [80, 34],
        [89, 34],
        [75, 50],
        [85, 50],
      ].map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x - 2.2} ${y + 8} V${y + 2} Q${x} ${y - 1} ${x + 2.2} ${y + 2} V${y + 8} Z`} fill={k.dark} strokeWidth={1} />
      ))}
      <line x1="64" y1="46" x2="96" y2="46" strokeWidth={1.2} strokeDasharray="1.5 1.5" />
      {[
        [64, 23],
        [96, 23],
        [46, 61],
        [114, 61],
      ].map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x - 3.5} ${y} Q${x} ${y - 9} ${x + 3.5} ${y} Z`} fill={k.dark} strokeWidth={1} />
      ))}
    </>
  ),

  IT: (k) => (
    <>
      {ground(k)}
      <rect x="122" y="22" width="14" height="66" fill="#fff" />
      {[34, 50, 66].map((y) => (
        <line key={y} x1="122" y1={y} x2="136" y2={y} strokeWidth={1} />
      ))}
      <rect x="120" y="19" width="18" height="3" fill={k.dark} />
      <rect x="28" y="68" width="98" height="20" fill={k.light} />
      {[38, 52, 66, 94, 108].map((x) => (
        <path key={x} d={`M${x - 3} 88 V80 Q${x} 76 ${x + 3} 80 V88 Z`} fill={k.dark} strokeWidth={0.8} />
      ))}
      <rect x="48" y="56" width="64" height="12" fill="#fff" />
      {[58, 70, 90, 102].map((x) => (
        <circle key={x} cx={x} cy="62" r="2" fill={k.dark} strokeWidth={0.8} />
      ))}
      <path d="M50 56 Q50 22 80 18 Q110 22 110 56 Z" fill={k.tone} />
      <path d="M80 18 Q66 26 63 56 M80 18 Q94 26 97 56 M80 18 V56" fill="none" strokeWidth={1.4} />
      <rect x="76" y="10" width="8" height="8" fill="#fff" />
      <polygon points="76,10 80,4 84,10" fill={k.dark} />
    </>
  ),

  BR: (k) => (
    <>
      <path d="M0 74 Q14 64 26 70 Q36 60 50 68 Q58 62 66 70 L60 88 H0 Z" fill="#fff" />
      <path d="M26 88 Q58 72 68 52 Q75 40 84 40 Q93 46 100 60 Q120 76 146 88 Z" fill={k.tone} />
      <path d="M110 80 Q122 72 134 78 Q144 70 156 78 Q160 80 160 88 H106 Z" fill="#fff" />
      <rect x="76" y="35" width="8" height="5" fill="#fff" />
      <rect x="62" y="17" width="36" height="3.5" fill="#fff" />
      <path d="M77.5 35 L78.5 19 H81.5 L82.5 35 Z" fill="#fff" />
      <circle cx="80" cy="14.5" r="2.6" fill="#fff" />
      <path d="M0 88 H160" />
    </>
  ),

  ES: (k) => {
    const spire = (cx: number, top: number, w: number) => (
      <g key={cx}>
        <path d={`M${cx - w} 88 V56 Q${cx - w} ${top + 18} ${cx} ${top} Q${cx + w} ${top + 18} ${cx + w} 56 V88 Z`} fill={k.tone} />
        {[top + 22, top + 32, top + 42].map((y) => (
          <ellipse key={y} cx={cx} cy={y} rx={w * 0.35} ry="1.6" fill="#fff" strokeWidth={0.8} />
        ))}
        <circle cx={cx} cy={top - 1.5} r="1.6" fill={k.dark} strokeWidth={0.8} />
      </g>
    );
    return (
      <>
        {ground(k)}
        <line x1="134" y1="88" x2="134" y2="12" />
        <line x1="138" y1="88" x2="138" y2="12" />
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1="134" y1={86 - i * 8} x2="138" y2={80 - i * 8} strokeWidth={0.8} />
        ))}
        <path d="M104 12 H156 M104 12 L136 6 L156 12" fill="none" strokeWidth={1.2} />
        <line x1="112" y1="12" x2="112" y2="30" strokeWidth={0.8} />
        {spire(52, 24, 6)}
        {spire(108, 24, 6)}
        {spire(66, 12, 7)}
        {spire(94, 12, 7)}
        {spire(80, 4, 8)}
        <rect x="40" y="62" width="80" height="26" fill="#fff" />
        <path d="M72 88 V74 Q80 64 88 74 V88 Z" fill={k.dark} />
      </>
    );
  },

  GR: (k) => (
    <>
      <path d="M0 88 Q40 78 80 80 Q120 78 160 88 V100 H0 Z" fill={k.tone} />
      <rect x="28" y="76" width="104" height="5" fill="#fff" />
      <rect x="32" y="72" width="96" height="4" fill="#fff" />
      {Array.from({ length: 8 }, (_, i) => {
        const x = 35 + i * 12.4;
        return (
          <g key={i}>
            <rect x={x} y="44" width="6" height="28" fill="#fff" />
            <rect x={x + 3.2} y="44.6" width="2.4" height="26.8" fill={k.tone} stroke="none" />
          </g>
        );
      })}
      <rect x="32" y="38" width="96" height="6" fill={k.light} />
      <path d="M32 38 L80 22 L104 30 L101 34 L109 38 Z" fill="#fff" />
    </>
  ),

  MA: (k) => (
    <>
      <path d="M0 88 Q30 80 60 86 Q100 78 160 86 V100 H0 Z" fill={k.light} />
      {palm(28, 88, 36)}
      {palm(134, 88, 32)}
      <rect x="68" y="24" width="24" height="64" fill={k.tone} />
      <rect x="66" y="21" width="28" height="4" fill="#fff" />
      {crenels(66, 94, 21, 4)}
      {[34, 54].map((y) => (
        <path key={y} d={`M76 ${y + 10} V${y + 3} Q80 ${y - 1} 84 ${y + 3} V${y + 10} Z`} fill="#fff" strokeWidth={1.2} />
      ))}
      <rect x="74" y="12" width="12" height="9" fill="#fff" />
      <path d="M74 12 Q80 6 86 12 Z" fill={k.dark} />
      <line x1="80" y1="7" x2="80" y2="1" strokeWidth={1.2} />
      <circle cx="80" cy="4.5" r="1.3" fill={k.dark} strokeWidth={0.6} />
      <circle cx="80" cy="1.8" r="1" fill={k.dark} strokeWidth={0.6} />
    </>
  ),

  VN: (k) => (
    <>
      {water(k, 72)}
      <path d="M8 72 Q6 40 22 28 Q36 34 32 72 Z" fill={k.tone} />
      <path d="M38 72 Q36 50 48 44 Q60 50 58 72 Z" fill={k.light} />
      <path d="M108 72 Q104 34 124 24 Q142 34 138 72 Z" fill={k.tone} />
      <path d="M140 72 Q140 52 150 50 Q160 56 158 72 Z" fill={k.light} />
      <path d="M72 78 V44 Q90 52 87 78 Z" fill="#fff" />
      {[52, 60, 68].map((y) => (
        <path key={y} d={`M72 ${y} Q80 ${y + 2} 88 ${y + 1}`} fill="none" strokeWidth={0.8} />
      ))}
      <path d="M89 78 V54 Q100 60 99 78 Z" fill="#fff" />
      <path d="M58 80 Q80 90 106 80 L101 76 H63 Z" fill={k.dark} />
    </>
  ),

  IS: (k) => (
    <>
      <path d="M0 30 Q40 8 80 24 T160 16 L160 28 Q120 34 80 34 T0 42 Z" fill={k.light} strokeWidth={1} />
      {ground(k)}
      <polygon points="72,88 74,24 80,4 86,24 88,88" fill={k.tone} />
      <circle cx="80" cy="30" r="3" fill="#fff" strokeWidth={1} />
      {[
        [64, 40],
        [56, 50],
        [48, 58],
        [40, 66],
      ].map(([x, y]) => (
        <g key={x}>
          <rect x={x} y={y} width="8" height={88 - y} fill="#fff" />
          <rect x={160 - x - 8} y={y} width="8" height={88 - y} fill="#fff" />
        </g>
      ))}
    </>
  ),

  NZ: (k) => (
    <>
      <path d="M0 62 L14 44 L22 52 L36 26 L46 40 L54 30 L66 48 L80 34 L92 50 L104 28 L116 44 L128 36 L142 52 L160 40 V72 H0 Z" fill={k.tone} />
      {[
        [36, 26],
        [54, 30],
        [104, 28],
        [128, 36],
      ].map(([x, y]) => (
        <polygon key={x} points={`${x - 5},${y + 7} ${x},${y} ${x + 5},${y + 7} ${x + 2},${y + 5} ${x},${y + 8} ${x - 2},${y + 5}`} fill="#fff" strokeWidth={1} />
      ))}
      <rect x="0" y="72" width="160" height="28" fill="#fff" />
      {[76, 81, 86, 91, 96].map((y, i) => (
        <line key={y} x1={10 + i * 7} y1={y} x2={150 - i * 9} y2={y} strokeWidth={0.8} strokeDasharray="6 4" />
      ))}
      <path d="M100 82 H126 L122 86 H104 Z" fill={k.dark} />
      <rect x="110" y="76" width="4" height="6" fill="#fff" strokeWidth={1} />
      <path d="M112 76 Q114 70 120 70" fill="none" strokeWidth={1} />
    </>
  ),

  CR: (k) => (
    <>
      <path d="M18 88 L66 28 Q80 24 94 28 L142 88 Z" fill={k.tone} />
      <circle cx="84" cy="20" r="5" fill="#fff" />
      <circle cx="91" cy="12" r="6" fill="#fff" />
      <circle cx="100" cy="6" r="6" fill="#fff" />
      {ground(k)}
      <path d="M0 100 Q8 70 34 74 Q20 86 0 100 Z" fill={k.dark} />
      <path d="M0 92 Q20 76 44 86 Q22 88 0 96 Z" fill={k.dark} />
      <path d="M160 100 Q150 72 126 76 Q140 86 160 100 Z" fill={k.dark} />
      {palm(132, 88, 30)}
    </>
  ),

  DE: (k) => (
    <>
      {ground(k)}
      <rect x="28" y="82" width="104" height="6" fill="#fff" />
      {Array.from({ length: 6 }, (_, i) => {
        const x = 32 + i * 19;
        return (
          <g key={i}>
            <rect x={x} y="46" width="6" height="36" fill="#fff" />
            <rect x={x + 3.2} y="46.6" width="2.4" height="34.8" fill={k.tone} stroke="none" />
          </g>
        );
      })}
      <rect x="28" y="38" width="104" height="8" fill={k.light} />
      <rect x="54" y="26" width="52" height="12" fill="#fff" />
      <path d="M66 26 Q68 16 74 18 Q80 12 86 18 Q92 16 94 26 Z" fill={k.dark} />
      <line x1="80" y1="16" x2="80" y2="4" strokeWidth={1.2} />
      <circle cx="80" cy="4" r="2" fill="none" strokeWidth={1} />
    </>
  ),

  CZ: (k) => (
    <>
      {water(k, 82)}
      <rect x="0" y="74" width="160" height="10" fill={k.tone} />
      {[14, 46, 114, 146].map((x) => (
        <path key={x} d={`M${x - 12} 92 V88 Q${x} 76 ${x + 12} 88 V92 Z`} fill={k.light} />
      ))}
      {[20, 36, 124, 140].map((x) => (
        <path key={x} d={`M${x - 2} 74 V66 Q${x} 62 ${x + 2} 66 V74 Z`} fill={k.dark} strokeWidth={0.8} />
      ))}
      <rect x="62" y="30" width="36" height="44" fill="#fff" />
      <path d="M72 74 V58 Q80 50 88 58 V74 Z" fill={k.dark} />
      <path d="M58 30 L80 6 L102 30 Z" fill={k.tone} />
      {[60, 100].map((x) => (
        <polygon key={x} points={`${x - 2},30 ${x},20 ${x + 2},30`} fill="#fff" strokeWidth={1} />
      ))}
      <rect x="68" y="38" width="5" height="8" fill={k.dark} strokeWidth={0.8} />
      <rect x="87" y="38" width="5" height="8" fill={k.dark} strokeWidth={0.8} />
    </>
  ),

  JO: (k) => (
    <>
      <rect x="30" y="0" width="100" height="100" fill={k.light} stroke="none" />
      <path d="M0 0 H36 Q42 30 32 60 Q40 80 36 100 H0 Z" fill={k.tone} />
      <path d="M160 0 H124 Q118 30 128 60 Q120 80 124 100 H160 Z" fill={k.tone} />
      <rect x="44" y="56" width="72" height="32" fill="#fff" />
      {[52, 62, 98, 108].map((x) => (
        <line key={x} x1={x} y1="58" x2={x} y2="88" strokeWidth={1.4} />
      ))}
      <path d="M44 56 L80 44 L116 56 Z" fill="#fff" />
      <rect x="75" y="70" width="10" height="18" fill={k.dark} />
      <rect x="46" y="28" width="18" height="16" fill="#fff" />
      <path d="M46 28 L64 22 V28 Z" fill="#fff" />
      <rect x="96" y="28" width="18" height="16" fill="#fff" />
      <path d="M114 28 L96 22 V28 Z" fill="#fff" />
      <rect x="70" y="22" width="20" height="22" fill="#fff" />
      <polygon points="69,22 80,12 91,22" fill={k.light} />
      <circle cx="80" cy="10" r="1.6" fill={k.dark} strokeWidth={0.8} />
      <path d="M0 88 H160" />
    </>
  ),

  FR: (k) => (
    <>
      {ground(k)}
      {[24, 136].map((x) => (
        <g key={x}>
          <line x1={x} y1="88" x2={x} y2="76" />
          <circle cx={x} cy="70" r="8" fill={k.tone} />
        </g>
      ))}
      <path d="M46 88 Q62 70 70 52 L76 22 L78.5 8 H81.5 L84 22 L90 52 Q98 70 114 88 H100 Q90 70 80 70 Q70 70 60 88 Z" fill={k.hatch} />
      <rect x="63" y="50" width="34" height="3" fill="#fff" />
      <rect x="73" y="34" width="14" height="2.5" fill="#fff" />
      <rect x="76.5" y="20" width="7" height="2" fill="#fff" />
      <line x1="80" y1="8" x2="80" y2="2" />
    </>
  ),

  HR: (k) => (
    <>
      {water(k, 80)}
      {[
        [48, 54, 12],
        [62, 50, 12],
        [92, 52, 12],
        [104, 56, 10],
      ].map(([x, y, w]) => (
        <g key={x}>
          <rect x={x} y={y} width={w} height={66 - y} fill="#fff" strokeWidth={1.2} />
          <polygon points={`${x - 1},${y} ${x + w / 2},${y - 6} ${x + w + 1},${y}`} fill={k.hatch} strokeWidth={1.2} />
        </g>
      ))}
      <rect x="78" y="38" width="8" height="28" fill="#fff" />
      <path d="M77 38 Q82 30 87 38 Z" fill={k.dark} />
      <path d="M0 80 V72 H40 L50 66 H116 L126 72 H160 V80 Z" fill={k.tone} />
      {crenels(50, 116, 66, 6)}
      <rect x="114" y="40" width="22" height="34" fill="#fff" />
      {crenels(114, 137, 40, 5)}
      <line x1="130" y1="44" x2="130" y2="74" stroke={k.tone} strokeWidth={5} />
      <rect x="114" y="40" width="22" height="34" fill="none" />
    </>
  ),

  GB: (k) => (
    <>
      {ground(k)}
      <rect x="88" y="56" width="66" height="32" fill={k.light} />
      {Array.from({ length: 11 }, (_, i) => (
        <polygon key={i} points={`${90 + i * 6},56 ${91.5 + i * 6},50 ${93 + i * 6},56`} fill="#fff" strokeWidth={0.9} />
      ))}
      {[96, 106, 116, 126, 136, 146].map((x) => (
        <line key={x} x1={x} y1="62" x2={x} y2="84" strokeWidth={1} />
      ))}
      <rect x="64" y="28" width="18" height="60" fill="#fff" />
      {[70, 76].map((x) => (
        <line key={x} x1={x} y1="46" x2={x} y2="88" strokeWidth={0.9} />
      ))}
      <rect x="62" y="28" width="22" height="16" fill="#fff" />
      <circle cx="73" cy="36" r="6" fill="#fff" />
      <path d="M73 36 V32 M73 36 L76 37" fill="none" strokeWidth={1.2} />
      <rect x="65" y="20" width="16" height="8" fill={k.tone} />
      <polygon points="63,20 73,2 83,20" fill={k.dark} />
    </>
  ),
};

/** Manga focus lines, drawn once and shared: thin wedges aimed at the landmark. */
const focusLines = Array.from({ length: 56 }, (_, i) => {
  const rand = (n: number) => {
    const x = Math.sin(i * 91.7 + n * 47.3) * 9631.17;
    return x - Math.floor(x);
  };
  const a = (i / 56) * Math.PI * 2 + rand(1) * 0.05;
  const inner = 46 + rand(2) * 26;
  const spread = 0.008 + rand(3) * 0.014;
  const [fx, fy, outer] = [80, 34, 140];
  const pt = (r: number, da: number) => `${(fx + r * Math.cos(a + da)).toFixed(1)},${(fy + r * Math.sin(a + da)).toFixed(1)}`;
  return `${pt(outer, -spread)} ${pt(outer, spread)} ${pt(inner, 0)}`;
});

export function Landmark({ code, className }: { code: string; className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const art = draw[code];
  const kit: Kit = { tone: `url(#${id}t)`, light: `url(#${id}l)`, hatch: `url(#${id}h)`, dark: "#111" };
  return (
    <svg viewBox="0 0 160 100" className={className} aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={`${id}t`} width="3.2" height="3.2" patternUnits="userSpaceOnUse">
          <rect width="3.2" height="3.2" fill="#fff" />
          <circle cx="1.6" cy="1.6" r="0.85" fill="#000" />
        </pattern>
        <pattern id={`${id}l`} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#fff" />
          <circle cx="2" cy="2" r="0.55" fill="#000" />
        </pattern>
        <pattern id={`${id}h`} width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="3" height="3" fill="#fff" />
          <line x1="0" y1="0" x2="0" y2="3" stroke="#000" strokeWidth="1.1" />
        </pattern>
      </defs>
      <rect width="160" height="100" fill="#fff" />
      <g
        className="transition-transform duration-500 ease-out motion-safe:group-hover:scale-110"
        style={{ transformOrigin: "80px 34px", transformBox: "view-box" }}
      >
        {focusLines.map((points, i) => (
          <polygon key={i} points={points} fill="#000" />
        ))}
      </g>
      <g
        stroke="#000"
        strokeWidth={1.6}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="#fff"
        className="transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5"
      >
        {art?.(kit)}
      </g>
    </svg>
  );
}
