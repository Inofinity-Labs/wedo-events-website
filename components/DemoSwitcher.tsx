"use client";

import { useEffect, useRef, useState } from "react";
import { withBase } from "@/lib/paths";
import type { VersionId } from "./HomePage";

const VERSIONS: { id: VersionId; label: string; href: string }[] = [
  { id: "a", label: "Futuristic + glass", href: "/" },
  { id: "b", label: "Classic + glass", href: "/classic/" },
  { id: "c", label: "Futuristic, flat", href: "/flat/" },
  { id: "d", label: "Flat, rounded", href: "/rounded/" },
  { id: "e", label: "Glass + WEDO reveal", href: "/reveal/" },
];

/**
 * Version picker for client review builds, collapsed to a small pill until
 * opened. Only rendered when built with NEXT_PUBLIC_DEMO=1 (scripts/build-demo.mjs).
 */
export function DemoSwitcher({ current }: { current: VersionId }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (process.env.NEXT_PUBLIC_DEMO !== "1") return null;
  return (
    <div className="demo-switcher" ref={ref} data-open={open}>
      <button
        className="demo-switcher__toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="demo-versions"
      >
        Demo · <strong>{current.toUpperCase()}</strong>
      </button>
      {open && (
        <nav id="demo-versions" className="demo-switcher__menu" aria-label="Design versions">
          {VERSIONS.map((v) => (
            <a key={v.id} href={withBase(v.href)} aria-current={v.id === current ? "page" : undefined}>
              <span className="demo-switcher__id">{v.id.toUpperCase()}</span>
              {v.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
