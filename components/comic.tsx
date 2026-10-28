import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * The comic-book kit every page is drawn with: flat inks, thick black outlines,
 * hard offset shadows, Ben-Day dots and Bangers lettering on cream paper.
 * Server-safe; the animated pieces live in comic-motion.tsx.
 */

export const INK = {
  red: "#FF3B30",
  yellow: "#FFD400",
  cyan: "#4CC9F0",
  purple: "#A855F7",
  green: "#2DD881",
  pink: "#FF7AB6",
  orange: "#FF8A1F",
  paper: "#FFF4DC",
} as const;

/** Darker red for red text on paper, where the flat ink is too light to read. */
export const RED_TEXT = "#E5221A";

export const display = "font-display tracking-wide";
export const ink = "border-[3px] border-black";
export const hardShadow = "shadow-[5px_5px_0_0_#000]";
export const smallShadow = "shadow-[3px_3px_0_0_#000]";
/** Buttons press into the page: they lift on hover and drop onto their own shadow when clicked. */
export const press =
  "transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[2px_2px_0_0_#000] motion-reduce:transition-none";
/** Cards that tilt straight and lift when hovered. */
export const lift =
  "transition-[transform,box-shadow] duration-200 hover:z-10 hover:rotate-0 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000] motion-reduce:transition-none";
/** A slight, varied tilt so a grid of panels looks pasted in by hand. */
export const tilts = ["-rotate-1", "rotate-1", "rotate-[0.5deg]", "-rotate-[1.5deg]"];

/** Ben-Day dots, the printed shading of old comics. */
export const halftone = (dot = "rgba(0,0,0,0.16)", size = 7): CSSProperties => ({
  backgroundImage: `radial-gradient(${dot} 1.3px, transparent 1.7px)`,
  backgroundSize: `${size}px ${size}px`,
});

/** Outlined, drop-shadowed lettering for big titles. */
export const lettering = (stroke = 3, shadow = 5): CSSProperties => ({
  WebkitTextStroke: `${stroke}px #000`,
  paintOrder: "stroke fill",
  textShadow: `${shadow}px ${shadow}px 0 #000`,
});

/** A jagged starburst with a sound effect in it. Spikes are seeded so every render matches. */
export function Burst({ text, color = INK.yellow, className = "" }: { text: string; color?: string; className?: string }) {
  const spikes = 13;
  const points = Array.from({ length: spikes * 2 }, (_, i) => {
    const r = i % 2 ? 31 + ((i * 37) % 7) : 48 - ((i * 53) % 5);
    const a = (Math.PI * i) / spikes - Math.PI / 2;
    return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <polygon points={points} fill={color} stroke="#000" strokeWidth="3" strokeLinejoin="round" />
      <text
        x="50"
        y="57"
        textAnchor="middle"
        fontSize={text.length > 6 ? 15 : 19}
        fill={INK.red}
        stroke="#000"
        strokeWidth="1.2"
        style={{ fontFamily: "var(--font-bangers)", paintOrder: "stroke", letterSpacing: "0.5px" }}
        transform="rotate(-8 50 50)"
      >
        {text}
      </text>
    </svg>
  );
}

/** The yellow narration box comics use for "Meanwhile…". */
export function Caption({ children, color = INK.yellow, className = "" }: { children: ReactNode; color?: string; className?: string }) {
  return (
    <span
      className={cn(`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-black ${ink} ${smallShadow}`, className)}
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  );
}

/** A small outlined tag. */
export function Sticker({ children, color = "#fff", className = "", style }: { children: ReactNode; color?: string; className?: string; style?: CSSProperties }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 border-2 border-black px-2 py-0.5 text-[11px] font-bold leading-snug text-black shadow-[2px_2px_0_0_#000]", className)}
      style={{ backgroundColor: color, ...style }}
    >
      {children}
    </span>
  );
}

/** An inked panel: white (or coloured) box, black outline, hard shadow. */
export function Panel({
  children,
  color = "#fff",
  dots,
  className = "",
  style,
}: {
  children: ReactNode;
  color?: string;
  /** Shade the panel with Ben-Day dots. */
  dots?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn(`relative bg-white text-black ${ink} ${hardShadow}`, className)}
      style={{ backgroundColor: color, ...(dots ? halftone("rgba(0,0,0,0.12)", 6) : null), ...style }}
    >
      {children}
    </div>
  );
}

/**
 * Classes for a pressable comic button; pair with a Link, an anchor or a button.
 * Pass colours through `extra` (e.g. "bg-[#FF3B30] text-white") so they merge over the defaults.
 */
export const buttonClass = (size: "sm" | "md" | "lg" = "md", extra?: string) =>
  cn(
    `inline-flex items-center justify-center gap-1.5 bg-white ${display} text-black ${ink} ${press}`,
    size === "sm" && `px-3 py-1 text-lg ${smallShadow}`,
    size === "md" && `px-4 py-1.5 text-xl ${hardShadow}`,
    size === "lg" && `px-5 py-2.5 text-2xl ${hardShadow}`,
    extra,
  );

type HeaderLink = { href: string; label: string; icon?: LucideIcon; external?: boolean };

/** "Kowit C." on the left, comic buttons on the right. The last link is "Back" unless `back` is false. */
export function SiteHeader({
  links = [],
  back = { href: "/", label: "Back" },
  className = "",
}: {
  links?: HeaderLink[];
  back?: { href: string; label: string } | false;
  className?: string;
}) {
  const items: HeaderLink[] = back ? [...links, { ...back, icon: ArrowLeft }] : links;
  return (
    <header className={cn("container mx-auto flex items-center justify-between gap-3 px-4 py-6", className)}>
      <Link href="/" className={`${display} shrink-0 text-2xl text-black`}>
        Kowit C.
      </Link>
      <nav className="flex flex-wrap items-center justify-end gap-2.5">
        {items.map(({ href, label, icon: Icon, external }) => (
          <Link
            key={href + label}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={buttonClass("sm")}
          >
            {Icon && <Icon className="h-4 w-4" strokeWidth={3} />}
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

/** The opening splash of a page: narration caption, big lettered title, then a line or two of intro. */
export function PageTitle({
  kicker,
  title,
  color = INK.yellow,
  children,
  compact,
  className = "",
}: {
  kicker: ReactNode;
  title: ReactNode;
  color?: string;
  children?: ReactNode;
  /** A smaller title, for pages where the content should start near the top. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4 animate-in fade-in slide-in-from-left-8 duration-700 motion-reduce:animate-none", className)}>
      <Caption className="-rotate-2">{kicker}</Caption>
      <h1
        className={cn(`${display} -rotate-2 pb-2 leading-[0.9]`, compact ? "text-5xl md:text-6xl" : "text-6xl md:text-8xl")}
        style={{ ...lettering(3, 6), color }}
      >
        {title}
      </h1>
      {children}
    </div>
  );
}

/** A section heading: lettered title with a caption box beside it. */
export function SectionTitle({
  title,
  sub,
  color = INK.cyan,
  id,
  className = "",
}: {
  title: ReactNode;
  sub?: ReactNode;
  color?: string;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-4 gap-y-2", className)}>
      <h2 id={id} className={`${display} -rotate-1 text-4xl leading-none md:text-5xl`} style={{ ...lettering(2.5, 4), color }}>
        {title}
      </h2>
      {sub && <Caption className="rotate-1">{sub}</Caption>}
    </div>
  );
}
