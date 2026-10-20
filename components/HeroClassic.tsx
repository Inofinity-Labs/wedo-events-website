import { SITE, STORY_SHOWS } from "@/lib/content";
import { colomboParts } from "@/lib/format";
import type { WeDoEvent } from "@/lib/types";
import { Countdown } from "./Countdown";
import { Marquee } from "./Hero";
import { ImageSlot } from "./ImageSlot";

/** The original hero from the Claude Design file: headline + next-up card, photo with spinning ring. */
export function HeroClassic({ next, marqueeItems }: { next?: WeDoEvent; marqueeItems: string[] }) {
  const parts = next && colomboParts(next.startsAt);

  return (
    <section id="top" className="hero chero" aria-label="Introduction">
      <div className="wrap chero__grid">
        <div className="chero__copy">
          <div className="chero__intro">
            <div className="eyebrow hero__kicker reveal">
              <span className="rings" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              Live music · Sri Lanka
            </div>
            <h1 className="chero__title">
              <span className="line">We do</span>
              <span className="line">the night</span>
              <span className="line gradient-text">you remember.</span>
            </h1>
            <p className="hero__lead reveal" style={{ animationDelay: "0.25s" }}>
              {SITE.description}
            </p>
          </div>

          {next && parts && (
            <a href="#coming-up" className="next-up chero__next reveal" style={{ animationDelay: "0.35s" }}>
              <div className="next-up__head">
                <span>
                  <span className="live-dot" />
                  Next up
                </span>
                <span>
                  {parts.weekday} {parts.day} {parts.month}
                </span>
              </div>
              <div className="next-up__body">
                <div>
                  <h3>{next.title}</h3>
                  <p>
                    {next.venue}, {next.city}
                  </p>
                </div>
                <Countdown target={next.startsAt} />
              </div>
            </a>
          )}
        </div>

        <div className="chero__media">
          <ImageSlot
            src={STORY_SHOWS[0]?.poster}
            alt="Latest WeDo concert"
            placeholder="Hero photo — concert crowd / stage"
            sizes="(max-width: 960px) 100vw, 50vw"
            priority
          />
          <div className="chero__ring" aria-hidden="true" />
          <div className="chero__caption" aria-hidden="true">
            <span>Remembered always</span>
            <span style={{ color: "var(--cyan)" }}>Est. Colombo</span>
          </div>
        </div>
      </div>

      <Marquee items={marqueeItems} />
    </section>
  );
}
