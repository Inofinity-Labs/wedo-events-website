import { withBase } from "@/lib/paths";
import type { VersionId } from "./HomePage";

const VERSIONS: { id: VersionId; label: string; href: string }[] = [
  { id: "a", label: "A · Futuristic + glass", href: "/" },
  { id: "b", label: "B · Classic + glass", href: "/classic/" },
  { id: "c", label: "C · Futuristic, flat", href: "/flat/" },
];

/**
 * Floating version picker for client review builds. Only rendered when the
 * site is built with NEXT_PUBLIC_DEMO=1 (see scripts/build-demo.mjs).
 */
export function DemoSwitcher({ current }: { current: VersionId }) {
  if (process.env.NEXT_PUBLIC_DEMO !== "1") return null;
  return (
    <nav className="demo-switcher" aria-label="Design versions">
      <span className="demo-switcher__label">Demo</span>
      {VERSIONS.map((v) => (
        <a key={v.id} href={withBase(v.href)} aria-current={v.id === current ? "page" : undefined}>
          {v.label}
        </a>
      ))}
    </nav>
  );
}
