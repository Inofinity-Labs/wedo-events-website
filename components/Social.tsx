import { SOCIALS } from "@/lib/content";
import { ArrowUpRight } from "./icons";
import { SectionHead } from "./SectionHead";

export function Social() {
  return (
    <section id="connect" className="section" aria-labelledby="connect-title">
      <div className="wrap" style={{ gap: 32, paddingBottom: 40 }}>
        <SectionHead id="connect-title" index="06" eyebrow="Connect" title="Join the Crowd" accent="cyan" />
        <div className="socials glass">
          {SOCIALS.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">
              <span className="socials__name">{s.name}</span>
              <span className="socials__handle">{s.handle}</span>
              <ArrowUpRight size={36} strokeWidth={2} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
