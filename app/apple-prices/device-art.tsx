import type { Device } from "./data";

/**
 * Line drawings of each device, so the picker and summary read at a glance. They draw in
 * currentColor; the screen glow is the only fixed colour.
 */
export function DeviceArt({ device, wide, className }: { device: Device; wide?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 64 40" fill="none" aria-hidden className={className}>
      {device === "macbook-pro" && <MacBook wide={wide} />}
      {device === "mac-mini" && <MacMini />}
      {device === "iphone" && <IPhone wide={wide} />}
    </svg>
  );
}

const line = { stroke: "currentColor", strokeOpacity: 0.7, strokeWidth: 1.2, strokeLinejoin: "round" as const };

function MacBook({ wide }: { wide?: boolean }) {
  // The 16-inch gets a slightly larger lid on the same base line.
  const [x, w, h] = wide ? [7, 50, 31] : [10, 44, 28];
  const top = 33 - h;
  return (
    <>
      <rect x={x} y={top} width={w} height={h} rx={2.5} fill="currentColor" fillOpacity={0.06} {...line} />
      <rect x={x + 2} y={top + 2} width={w - 4} height={h - 3.5} rx={1} className="fill-sky-400/25" />
      <rect x={32 - 3} y={top + 2} width={6} height={1.6} rx={0.8} className="fill-gray-950" />
      <path d="M3 33h58l-2.6 3.6a1.5 1.5 0 0 1-1.2.6H6.8a1.5 1.5 0 0 1-1.2-.6z" fill="currentColor" fillOpacity={0.2} {...line} />
      <path d="M27 33h10l-.7 1h-8.6z" fill="currentColor" fillOpacity={0.5} />
    </>
  );
}

function MacMini() {
  return (
    <>
      <rect x={10} y={19} width={44} height={14} rx={4.5} fill="currentColor" fillOpacity={0.2} {...line} />
      <rect x={10} y={9} width={44} height={19} rx={6} fill="currentColor" fillOpacity={0.08} {...line} />
      <rect x={16} y={29.5} width={2.4} height={1.2} rx={0.6} fill="currentColor" fillOpacity={0.6} />
      <rect x={20} y={29.5} width={2.4} height={1.2} rx={0.6} fill="currentColor" fillOpacity={0.6} />
      <circle cx={48} cy={30.1} r={0.7} className="fill-emerald-400" />
    </>
  );
}

function IPhone({ wide }: { wide?: boolean }) {
  // The foldable opens to nearly twice the width.
  const w = wide ? 34 : 20;
  const x = 32 - w / 2;
  return (
    <>
      <rect x={x} y={1.5} width={w} height={37} rx={4} fill="currentColor" fillOpacity={0.08} {...line} />
      <rect x={x + 1.6} y={3.1} width={w - 3.2} height={33.8} rx={2.8} className="fill-sky-400/25" />
      <rect x={29} y={4.6} width={6} height={1.8} rx={0.9} className="fill-gray-950" />
      {wide && <path d="M32 3.1v33.8" stroke="currentColor" strokeOpacity={0.25} strokeWidth={0.6} />}
    </>
  );
}
