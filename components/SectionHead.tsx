import type { ReactNode } from "react";

interface SectionHeadProps {
  /** Used by the parent section's aria-labelledby. */
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  /** Eyebrow colour — the design rotates green / cyan / blue per section. */
  accent: "green" | "cyan" | "blue";
  children?: ReactNode;
}

export function SectionHead({ id, index, eyebrow, title, accent, children }: SectionHeadProps) {
  return (
    <div className="section-head">
      <div className="section-head__titles">
        <span className="eyebrow" style={{ color: `var(--${accent})` }}>
          {index} — {eyebrow}
        </span>
        <h2 id={id} className="section-title">{title}</h2>
      </div>
      {children}
    </div>
  );
}
