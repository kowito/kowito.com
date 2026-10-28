import { INK } from "@/components/comic";
import type { Device } from "./data";

/**
 * Inked drawings of each device, so the picker and summary read at a glance. Outlines draw in
 * currentColor (black ink on this page); the fills are flat comic inks: white bodies, cyan screens.
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

const line = { stroke: "currentColor", strokeWidth: 2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
/** Two short white strokes: the comic-book glint on a screen. */
const glint = { stroke: "#fff", strokeWidth: 1.4, strokeLinecap: "round" as const };

function MacBook({ wide }: { wide?: boolean }) {
  // The 16-inch gets a slightly larger lid on the same base line.
  const [x, w, h] = wide ? [7, 50, 31] : [10, 44, 28];
  const top = 33 - h;
  return (
    <>
      <rect x={x} y={top} width={w} height={h} rx={2.5} fill="#fff" {...line} />
      <rect x={x + 2.6} y={top + 2.6} width={w - 5.2} height={h - 4.6} rx={1} fill={INK.cyan} />
      <path d={`M${x + 6} ${top + 11}l5-5.5M${x + 6} ${top + 16}l9.5-10`} {...glint} />
      <rect x={32 - 3} y={top + 2.6} width={6} height={1.6} rx={0.8} fill="currentColor" />
      <path d="M3 33h58l-2.6 3.6a1.5 1.5 0 0 1-1.2.6H6.8a1.5 1.5 0 0 1-1.2-.6z" fill="#fff" {...line} />
      <path d="M27 33h10l-.7 1.2h-8.6z" fill="currentColor" />
    </>
  );
}

function MacMini() {
  return (
    <>
      <rect x={10} y={19} width={44} height={14} rx={4.5} fill="#C8C8C8" {...line} />
      <rect x={10} y={9} width={44} height={19} rx={6} fill="#fff" {...line} />
      <rect x={16} y={29.4} width={2.6} height={1.4} rx={0.7} fill="currentColor" />
      <rect x={20.4} y={29.4} width={2.6} height={1.4} rx={0.7} fill="currentColor" />
      <circle cx={48} cy={30.1} r={0.9} fill={INK.green} />
    </>
  );
}

function IPhone({ wide }: { wide?: boolean }) {
  // The foldable opens to nearly twice the width.
  const w = wide ? 34 : 20;
  const x = 32 - w / 2;
  return (
    <>
      <rect x={x} y={1.5} width={w} height={37} rx={4} fill="#fff" {...line} />
      <rect x={x + 2.2} y={3.7} width={w - 4.4} height={32.6} rx={2.4} fill={INK.cyan} />
      <path d={`M${x + 4.5} 15l4-4.5M${x + 4.5} 20l6.5-7.3`} {...glint} />
      <rect x={29} y={5.2} width={6} height={1.8} rx={0.9} fill="currentColor" />
      {wide && <path d="M32 3.7v32.6" stroke="currentColor" strokeWidth={1.2} />}
    </>
  );
}
