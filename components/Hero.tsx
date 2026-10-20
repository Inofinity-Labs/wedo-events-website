import type { WeDoEvent } from "@/lib/types";
import { HeroStage } from "./hero/HeroStage";
import { NextTicket } from "./hero/NextTicket";
import { Wordmark } from "./hero/Wordmark";
import { ArrowRight, ArrowUpRight } from "./icons";

export function Hero({ next, marqueeItems }: { next?: WeDoEvent; marqueeItems: string[] }) {
  return (
    <section id="top" className="hero" aria-label="Introduction">
      <HeroStage>
        <div className="hero__bg" aria-hidden="true">
          <span className="hero__glow hero__glow--a" />
          <span className="hero__glow hero__glow--b" />
          <span className="hero__beam hero__beam--a" />
          <span className="hero__beam hero__beam--b" />
          <span className="hero__floor" />
        </div>
        <Wordmark />

        <div className="wrap hero__inner">
          <div className="hero__copy">
            <div className="eyebrow hero__kicker reveal">
              <span className="rings" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              Live music · Sri Lanka
            </div>
            <h1 className="hero__title">
              <span className="line">
                <span>We do</span>
              </span>
              <span className="line">
                <span>the night</span>
              </span>
              <span className="line">
                <span className="gradient-text">you remember.</span>
              </span>
            </h1>
            <div className="hero__ctas reveal" style={{ animationDelay: "0.3s" }}>
              <a href="#coming-up" className="btn btn--gradient btn--lg">
                Get tickets <ArrowUpRight />
              </a>
              <a href="#the-nights" className="btn btn--ghost btn--lg">
                Relive the nights <ArrowRight />
              </a>
            </div>
          </div>

          {next && <NextTicket event={next} />}
        </div>
      </HeroStage>

      <Marquee items={marqueeItems} />
    </section>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = items.map((t, i) => (
    <span className="marquee__item" key={i}>
      {t}
    </span>
  ));
  return (
    <div className="marquee">
      <div className="marquee__track">
        <div style={{ display: "flex" }}>{row}</div>
        <div style={{ display: "flex" }} aria-hidden="true">
          {row}
        </div>
      </div>
    </div>
  );
}
