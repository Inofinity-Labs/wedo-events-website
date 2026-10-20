"use client";

import { useState } from "react";
import { CONCERT_VIDEOS, FEATURED_CONCERTS } from "@/lib/content";
import { pad2, shortDate } from "@/lib/format";
import { PAST_EVENTS } from "@/lib/past-events";
import type { PastEvent } from "@/lib/types";
import { ImageSlot } from "./ImageSlot";
import { Play } from "./icons";
import { PastShowsSlider } from "./PastShowsSlider";
import { SectionHead } from "./SectionHead";

const YEARS = [...new Set(PAST_EVENTS.map((e) => e.date.slice(0, 4)))];

export function Concerts() {
  const [featured, setFeatured] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [year, setYear] = useState<string | null>(null);
  const show = FEATURED_CONCERTS[featured];
  const video = CONCERT_VIDEOS[show.slug];
  const pastShows = year ? PAST_EVENTS.filter((e) => e.date.startsWith(year)) : PAST_EVENTS;

  const select = (i: number) => {
    setFeatured(i);
    setPlaying(false);
  };
  const watchHandler = (e: PastEvent) => {
    const i = FEATURED_CONCERTS.findIndex((f) => f.slug === e.slug);
    if (i < 0 || !CONCERT_VIDEOS[e.slug]) return undefined;
    return () => {
      select(i);
      document.getElementById("concert-player")?.scrollIntoView({ behavior: "smooth", block: "center" });
    };
  };

  return (
    <section id="the-nights" className="section section--alt" aria-labelledby="the-nights-title">
      <div className="wrap">
        <SectionHead id="the-nights-title" index="03" eyebrow="The archive" title="The Nights We Made" accent="cyan">
          <p className="lead">
            {PAST_EVENTS.length} shows and counting. Relive the nights we&apos;ve produced, and the full-length
            recordings for the ones that were filmed.
          </p>
        </SectionHead>

        <div className="player glass" id="concert-player">
          <div className="player__stage">
            {playing && video ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                title={`${show.title} — full concert`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <>
                <ImageSlot
                  src={show.banner ?? show.poster}
                  alt={`${show.title} — ${show.venue}`}
                  placeholder="Still from the full concert video"
                  sizes="(max-width: 860px) 100vw, 66vw"
                />
                <div className="player__info">
                  <div>
                    <span className="eyebrow" style={{ color: "var(--green)", fontSize: 12 }}>
                      {video ? `Full concert${video.duration ? ` · ${video.duration}` : ""}` : "Concert"}
                    </span>
                    <h3>{show.title}</h3>
                    <p>
                      {shortDate(show.date)} · {show.venue}
                    </p>
                  </div>
                  {video ? (
                    <button className="btn btn--gradient" onClick={() => setPlaying(true)}>
                      <Play /> Play full concert
                    </button>
                  ) : (
                    <span className="btn btn--ghost" aria-disabled="true">
                      Video coming soon
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="player__list">
            <div className="player__list-head">LATEST SHOWS</div>
            {FEATURED_CONCERTS.map((e, i) => (
              <button key={e.slug} className="track" aria-current={i === featured} onClick={() => select(i)}>
                <span className="track__num">{pad2(i + 1)}</span>
                <span className="track__title">
                  <strong>{e.title}</strong>
                  <span>{shortDate(e.date)}</span>
                </span>
                <span className="track__time">{CONCERT_VIDEOS[e.slug]?.duration ?? e.city}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="past">
          <div className="past__head">
            <h3>Past shows</h3>
            <div className="chips" role="group" aria-label="Filter past shows by year">
              <button className="chip chip--sm" aria-pressed={!year} onClick={() => setYear(null)}>
                All years
              </button>
              {YEARS.map((y) => (
                <button key={y} className="chip chip--sm" aria-pressed={year === y} onClick={() => setYear(y)}>
                  {y}
                </button>
              ))}
            </div>
          </div>
          <PastShowsSlider shows={pastShows} onWatch={watchHandler} />
        </div>
      </div>
    </section>
  );
}
