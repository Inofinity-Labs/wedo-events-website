import { PAST_EVENTS } from "./past-events";
import { colomboParts, lkr } from "./format";
import type { WeDoEvent } from "./types";

const STATUS_LINE: Record<WeDoEvent["status"], string> = {
  "on-sale": "On sale now",
  "few-left": "Few tickets left",
  "sold-out": "Sold out",
  "coming-soon": "Tickets soon",
};

/** Phrases for the scrolling banner under the hero: every upcoming show's details, then brand stats. */
export function marqueeItems(events: WeDoEvent[]): string[] {
  const shows = events.flatMap((e) => {
    const d = colomboParts(e.startsAt);
    return [
      e.title,
      `${d.weekday} ${d.day} ${d.month} · ${e.time}`,
      `${e.venue}, ${e.city}`,
      ...(e.priceFrom ? [`Tickets from ${lkr(e.priceFrom)}`] : []),
      STATUS_LINE[e.status],
    ];
  });
  const since = PAST_EVENTS.at(-1)?.date.slice(0, 4) ?? "2022";
  const brand = ["Remembered always", `${PAST_EVENTS.length} shows produced`, `On stage since ${since}`, "30K+ fans in the crowd"];
  const cycle = [...shows, ...brand];
  // Repeat whole cycles (never partial) so one loop always fills a wide screen.
  const items = [...cycle];
  while (items.length < 8) items.push(...cycle);
  return items;
}
