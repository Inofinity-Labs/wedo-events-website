"use client";

import { useEffect, useRef, useState, type HTMLAttributes } from "react";

/**
 * A list that turns into a horizontal swipe rail on phones / tablets (the CSS
 * decides when, via `.rail`), with a thin progress bar showing how far along
 * the user is. On desktop it renders exactly like a plain div.
 */
export function Rail({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState({ start: 0, size: 1 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setBar(scrollWidth > clientWidth + 1 ? { start: scrollLeft / scrollWidth, size: clientWidth / scrollWidth } : { start: 0, size: 1 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [children]);

  return (
    <>
      <div ref={ref} className={`rail ${className}`} {...rest}>
        {children}
      </div>
      <div className="rail-progress" data-scrollable={bar.size < 1} aria-hidden="true">
        <span style={{ left: `${bar.start * 100}%`, width: `${bar.size * 100}%` }} />
      </div>
    </>
  );
}
