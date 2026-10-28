"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (onChange: () => void) => {
  const mq = window.matchMedia(motionQuery);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

export function useReducedMotion() {
  return useSyncExternalStore(subscribeMotion, () => window.matchMedia(motionQuery).matches, () => false);
}

/** Eases a number from 0 up to `target` once, after `delay` ms. */
export function useCountUp(target: number, duration = 1600, delay = 0) {
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    const start = performance.now() + (reduced ? 0 : delay);
    const length = reduced ? 0 : duration;
    let frame = 0;
    const tick = (now: number) => {
      const t = length === 0 ? 1 : Math.min(1, Math.max(0, (now - start) / length));
      setValue(target * (1 - (1 - t) ** 3));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, delay, reduced]);
  return value;
}

/** A number that counts up from zero. Safe to drop into server components. */
export function CountUp({ value, duration, delay, decimals = 0 }: { value: number; duration?: number; delay?: number; decimals?: number }) {
  const n = useCountUp(value, duration, delay);
  return <>{n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>;
}

/** Pops its children in, with a little overshoot, the first time they scroll into view. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-500 [transition-timing-function:cubic-bezier(.2,.9,.3,1.5)] motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none ${
        shown ? "scale-100 opacity-100" : "scale-75 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
