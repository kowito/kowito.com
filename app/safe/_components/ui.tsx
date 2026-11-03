import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { INK, Panel, buttonClass, display, ink, smallShadow } from "@/components/comic";
import { cn } from "@/lib/utils";

/*
 * The Safe page's building blocks, drawn with the site's comic kit. Money is on the
 * line, so text stays large and every state has its own ink.
 */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "go" | "secondary" | "danger" | "link";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

const fills: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-[#FFD400]",
  go: "bg-[#2DD881]",
  secondary: "bg-white",
  danger: "bg-[#FF3B30] text-white",
  link: "",
};

export function Button({ variant = "primary", size = "md", loading, className, disabled, children, ...props }: ButtonProps) {
  if (variant === "link") {
    return (
      <button
        {...props}
        disabled={disabled}
        className={cn("inline-flex items-center gap-1.5 font-bold underline decoration-2 underline-offset-4 hover:text-[#A855F7] disabled:opacity-40", className)}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        buttonClass(size, fills[variant]),
        "disabled:pointer-events-none disabled:opacity-45 disabled:shadow-none",
        className,
      )}
    >
      {loading && <Loader2 className="h-5 w-5 animate-spin" strokeWidth={3} />}
      {children}
    </button>
  );
}

export function Card({
  title,
  subtitle,
  actions,
  color = "#fff",
  children,
  className,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  color?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Panel color={color} className={cn("p-5 sm:p-7", className)}>
      {(title || actions) && (
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className={`${display} text-3xl leading-none sm:text-4xl`}>{title}</h2>
            {subtitle && <p className="mt-2 text-base text-neutral-700">{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </Panel>
  );
}

export const inputClass = cn(
  "h-14 w-full bg-white px-4 text-lg font-bold text-black outline-none transition-shadow",
  ink,
  "placeholder:font-normal placeholder:text-neutral-400 focus:shadow-[4px_4px_0_0_#000] disabled:opacity-60",
);

export const textareaClass = cn(
  "w-full bg-white px-4 py-3 font-mono text-sm text-black outline-none transition-shadow",
  ink,
  "placeholder:text-neutral-400 focus:shadow-[4px_4px_0_0_#000]",
);

export function Field({ label, hint, error, children }: { label: ReactNode; hint?: ReactNode; error?: ReactNode; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-lg font-bold">{label}</span>
      {children}
      {error ? (
        <span className="text-base font-bold text-[#E5221A]">{error}</span>
      ) : (
        hint && <span className="text-sm text-neutral-700">{hint}</span>
      )}
    </label>
  );
}

export type Tone = "neutral" | "success" | "warning" | "danger" | "accent";

const toneFill: Record<Tone, string> = {
  neutral: "#fff",
  success: INK.green,
  warning: INK.yellow,
  danger: INK.red,
  accent: INK.cyan,
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap border-2 border-black px-2.5 py-0.5 text-sm font-bold shadow-[2px_2px_0_0_#000]",
        tone === "danger" ? "text-white" : "text-black",
      )}
      style={{ backgroundColor: toneFill[tone] }}
    >
      {children}
    </span>
  );
}

/** A narration box: yellow for heads-ups, red for stop signs, green for good news. */
export function Notice({ tone = "neutral", title, children }: { tone?: Exclude<Tone, "accent">; title?: ReactNode; children?: ReactNode }) {
  return (
    <div
      className={cn("px-4 py-3 text-base", ink, smallShadow, tone === "danger" ? "text-white" : "text-black")}
      style={{ backgroundColor: tone === "neutral" ? INK.paper : toneFill[tone] }}
    >
      {title && <p className={`${display} text-xl leading-tight`}>{title}</p>}
      {children && <div className={cn("break-words", title && "mt-1")}>{children}</div>}
    </div>
  );
}

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-lg font-bold">
      <Loader2 className="h-9 w-9 animate-spin" strokeWidth={3} />
      {label}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="border-[3px] border-dashed border-black bg-white/70 px-6 py-10 text-center text-lg font-bold">{children}</p>
  );
}

export function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:gap-6">
      <span className="text-base font-bold text-neutral-700">{label}</span>
      <div className="min-w-0 break-all text-base">{children}</div>
    </div>
  );
}

/** Collapsible section for things most people never need (hashes, raw data, nonces). */
export function Details({ summary, children }: { summary: ReactNode; children: ReactNode }) {
  return (
    <details className={cn("group bg-white [&_summary::-webkit-details-marker]:hidden", "border-2 border-black")}>
      <summary className="flex cursor-pointer list-none select-none items-center justify-between gap-3 px-4 py-3 text-base font-bold hover:bg-[#FFF4DC]">
        {summary}
        <ChevronDown className="h-5 w-5 transition group-open:rotate-180" strokeWidth={3} />
      </summary>
      <div className="flex flex-col gap-6 border-t-2 border-black px-4 pb-5 pt-4">{children}</div>
    </details>
  );
}

/** Big numbered step heading for guided flows. */
export function Step({ number, title, children }: { number: number; title: ReactNode; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className={`${display} flex items-center gap-3 text-2xl sm:text-3xl`}>
        <span className="grid h-10 w-10 shrink-0 place-items-center border-[3px] border-black bg-black text-xl text-[#FFD400]">
          {number}
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}
