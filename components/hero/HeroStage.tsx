"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Wraps the hero and feeds pointer position to CSS as --px / --py (-1…1),
 * which each layer uses for its own parallax depth. Mouse only; skipped for
 * touch devices and prefers-reduced-motion.
 */
export function HeroStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let frame = 0;
    let tx = 0, ty = 0, x = 0, y = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };
    const tick = () => {
      // Ease towards the pointer so layers glide instead of snapping.
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--px", x.toFixed(4));
      el.style.setProperty("--py", y.toFixed(4));
      frame = requestAnimationFrame(tick);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="hero__stage">
      {children}
    </div>
  );
}
