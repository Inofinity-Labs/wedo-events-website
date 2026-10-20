"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { shortDate } from "@/lib/format";
import type { PastEvent } from "@/lib/types";

const INTERVAL = 6000;
/** Below this, UAT sales data is likely incomplete, so the fan count isn't shown. */
const MIN_FANS_SHOWN = 300;

/** "3,178" → "3,100+" */
const roundedFans = (n: number) => `${(Math.floor(n / 100) * 100).toLocaleString("en-US")}+`;

function factsFor(show: PastEvent) {
  const facts = [{ label: "Date", value: shortDate(show.date) }];
  if (show.fans >= MIN_FANS_SHOWN) facts.push({ label: "Fans", value: roundedFans(show.fans) });
  if (show.artistCount) facts.push({ label: "Artists", value: String(show.artistCount) });
  if (facts.length < 3) facts.push({ label: "City", value: show.city });
  return facts;
}

/**
 * Circular "story" carousel: one past show per slide, its image in a dashed
 * ring with facts arranged around the circle and the title across the bottom.
 */
export function StoryCarousel({ shows }: { shows: PastEvent[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const uid = useId().replace(/:/g, "");

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (shows.length < 2 || paused || reduced) return;
    const t = setTimeout(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % shows.length);
    }, INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, reduced, shows.length]);

  if (shows.length === 0) return null;
  const show = shows[index];
  const facts = factsFor(show);

  return (
    <div
      className="story"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Shows we've produced"
    >
      <div className="story__stage" style={{ "--turn": `${index * 20}deg` } as React.CSSProperties}>
        {/* Soft ring with a fading light trail; turns a little with each slide. */}
        <div className="story__ring" aria-hidden="true">
          <span />
        </div>

        <div className="story__photo">
          {shows.map((s, i) => (
            <Image
              key={s.slug}
              src={s.poster as string}
              alt={i === index ? `${s.title} ${s.date.slice(0, 4)}` : ""}
              fill
              sizes="(max-width: 900px) 80vw, 440px"
              data-active={i === index}
            />
          ))}
        </div>

        <dl className="story__facts" key={`facts-${index}`}>
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="hud__key">{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>

        {shows.length > 1 && (
          <button className="story__next" onClick={() => setIndex((i) => (i + 1) % shows.length)}>
            Next
            <br />
            show
          </button>
        )}

        {/* Name, and the venue beneath it, run along arcs concentric with the photo. */}
        <svg className="story__arcs" viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            <path id={`${uid}-name`} d="M 5.2 50 A 44.8 44.8 0 0 0 94.8 50" />
            <path id={`${uid}-venue`} d="M 1.4 50 A 48.6 48.6 0 0 0 98.6 50" />
          </defs>
          <text
            key={`name-${index}`}
            className={`story__arc-name${show.title.length > 18 ? " story__arc-name--long" : ""}`}
          >
            <textPath href={`#${uid}-name`} startOffset="50%" textAnchor="middle">
              {show.title}
            </textPath>
          </text>
          <text key={`venue-${index}`} className="story__arc-venue">
            <textPath href={`#${uid}-venue`} startOffset="50%" textAnchor="middle">
              {show.venue}
            </textPath>
          </text>
        </svg>
        <h3 className="sr-only" aria-live="polite">
          {show.title}, {show.venue}
        </h3>
      </div>
    </div>
  );
}
