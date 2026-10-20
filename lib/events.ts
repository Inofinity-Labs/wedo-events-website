import type { WeDoEvent } from "./types";

/**
 * Upcoming events for the WeDo organizer.
 *
 * TODO(TicketsMinistry): replace the placeholder list with a fetch from the
 * TicketsMinistry API filtered by organizer, e.g.
 *
 *   const res = await fetch(`${process.env.TM_API_BASE_URL}/events?organizer=${process.env.TM_ORGANIZER_ID}`, {
 *     headers: { Authorization: `Bearer ${process.env.TM_API_KEY}` },
 *     next: { revalidate: 300 },
 *   });
 *   return (await res.json()).events.map(mapTmEvent);
 *
 * Everything that renders events only depends on the WeDoEvent shape, so the
 * mapping function is the only other thing that needs writing.
 */
export async function getUpcomingEvents(): Promise<WeDoEvent[]> {
  return PLACEHOLDER_EVENTS.slice().sort(
    (a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt),
  );
}

const TM = "https://www.ticketsministry.com";

const PLACEHOLDER_EVENTS: WeDoEvent[] = [
  {
    id: "neon-monsoon",
    title: "Neon Monsoon",
    lineup: "Headliner TBA + 4 local acts",
    venue: "Sugathadasa Indoor Stadium",
    city: "Colombo",
    startsAt: "2026-11-14T19:00:00+05:30",
    doors: "6:00 PM",
    priceFrom: 3500,
    status: "on-sale",
    ticketUrl: TM,
  },
  {
    id: "galle-face-sessions",
    title: "Galle Face Sessions",
    lineup: "Open-air sunset set",
    venue: "Galle Face Green",
    city: "Colombo",
    startsAt: "2026-11-28T17:30:00+05:30",
    doors: "4:30 PM",
    priceFrom: 2500,
    status: "few-left",
    ticketUrl: TM,
  },
  {
    id: "hill-country-live",
    title: "Hill Country Live",
    lineup: "Rock night · 3 bands",
    venue: "Bogambara Grounds",
    city: "Kandy",
    startsAt: "2026-12-12T19:00:00+05:30",
    doors: "6:00 PM",
    priceFrom: 3000,
    status: "on-sale",
    ticketUrl: TM,
  },
  {
    id: "nye-2026",
    title: "Remembered Always · NYE",
    lineup: "Countdown concert",
    venue: "Port City Colombo",
    city: "Colombo",
    startsAt: "2026-12-31T20:00:00+05:30",
    doors: "7:00 PM",
    priceFrom: 6500,
    status: "sold-out",
    ticketUrl: TM,
  },
  {
    id: "southern-frequencies",
    title: "Southern Frequencies",
    lineup: "Electronic & live fusion",
    venue: "Galle Fort Ramparts",
    city: "Galle",
    startsAt: "2027-01-17T18:30:00+05:30",
    doors: "5:30 PM",
    priceFrom: 4000,
    status: "coming-soon",
  },
  {
    id: "unplugged-lotus",
    title: "Unplugged at the Lotus",
    lineup: "Acoustic evening",
    venue: "Lotus Tower",
    city: "Colombo",
    startsAt: "2027-02-07T19:30:00+05:30",
    doors: "6:30 PM",
    priceFrom: 5000,
    status: "coming-soon",
  },
];
