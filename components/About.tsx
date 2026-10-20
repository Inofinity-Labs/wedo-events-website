import { ABOUT_STATS, SITE, STORY_SHOWS } from "@/lib/content";
import { SectionHead } from "./SectionHead";
import { StoryCarousel } from "./StoryCarousel";

export function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="wrap about__grid">
        <div className="about__copy">
          <SectionHead id="about-title" index="01" eyebrow="Who we are" title="We Live for the Encore" accent="cyan" />
          <div className="about__text">
            {SITE.about.map((p, i) => (
              <p key={i} className={i === 0 ? "about__lede" : undefined}>
                {p}
              </p>
            ))}
          </div>
          <dl className="about__stats">
            {ABOUT_STATS.map((s) => (
              <div key={s.label}>
                <dt className="hud__key">{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <StoryCarousel shows={STORY_SHOWS} />
      </div>
    </section>
  );
}
