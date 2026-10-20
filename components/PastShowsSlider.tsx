"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { shortDate } from "@/lib/format";
import type { PastEvent } from "@/lib/types";
import { ImageSlot } from "./ImageSlot";

const SPEED = 40; // px per second
const RESUME_AFTER_TOUCH = 2500; // ms

interface PastShowsSliderProps {
  shows: PastEvent[];
  /** Returns a handler when the show has a recording to jump to. */
  onWatch: (show: PastEvent) => (() => void) | undefined;
}

/**
 * Endless, auto-advancing row of posters. It is a real scroll container, so
 * visitors can still swipe / trackpad-scroll it; auto-advance pauses while
 * they hover, focus or touch it, and is off for prefers-reduced-motion.
 */
export function PastShowsSlider({ shows, onWatch }: PastShowsSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const [loop, setLoop] = useState(false);
  const paused = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Only loop when one set of posters is wider than the viewport.
  useLayoutEffect(() => {
    const track = trackRef.current;
    const set = setRef.current;
    if (!track || !set) return;
    const measure = () => setLoop(set.scrollWidth > track.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, [shows]);

  useEffect(() => {
    const track = trackRef.current;
    if (track) track.scrollLeft = 0;
  }, [shows]);

  useEffect(() => {
    const track = trackRef.current;
    const set = setRef.current;
    if (!loop || !track || !set) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pos = track.scrollLeft;
    let last = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      // Width of one set including the gap that separates it from its copy.
      const period = set.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");

      if (Math.abs(track.scrollLeft - pos) > 2) pos = track.scrollLeft; // visitor scrolled
      if (!paused.current) pos += SPEED * dt;
      if (pos >= period) pos -= period;
      if (pos < 0) pos += period;
      track.scrollLeft = pos;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [loop, shows]);

  useEffect(() => () => clearTimeout(resumeTimer.current), []);

  const pause = () => {
    clearTimeout(resumeTimer.current);
    paused.current = true;
  };
  const resume = (delay = 0) => {
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => (paused.current = false), delay);
  };

  return (
    <div
      ref={trackRef}
      className="slider"
      data-loop={loop}
      onPointerEnter={(e) => e.pointerType === "mouse" && pause()}
      onPointerLeave={(e) => e.pointerType === "mouse" && resume()}
      onTouchStart={pause}
      onTouchEnd={() => resume(RESUME_AFTER_TOUCH)}
      onFocus={pause}
      onBlur={() => resume()}
      role="region"
      aria-roledescription="carousel"
      aria-label="Past shows"
    >
      <PosterSet ref={setRef} shows={shows} onWatch={onWatch} />
      {loop && <PosterSet shows={shows} onWatch={onWatch} copy />}
    </div>
  );
}

function PosterSet({
  shows,
  onWatch,
  copy,
  ref,
}: PastShowsSliderProps & { copy?: boolean; ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div className="slider__set" ref={ref} aria-hidden={copy || undefined} inert={copy || undefined}>
      {shows.map((e) => {
        const watch = onWatch(e);
        return (
          <article className="poster" key={e.slug}>
            <div className="poster__img">
              <ImageSlot src={e.poster} alt={`${e.title} poster`} placeholder="Event poster" sizes="260px" />
              <span className="poster__year">{e.date.slice(0, 4)}</span>
            </div>
            <div className="poster__meta">
              <div>
                <strong>{e.title}</strong>
                <span>
                  {shortDate(e.date, false)} · {e.venue}
                </span>
              </div>
              {watch && (
                <button className="link-btn" onClick={watch}>
                  WATCH
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
