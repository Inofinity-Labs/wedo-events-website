import type { EventStatus, WeDoEvent } from "./types";

const API_BASE = process.env.TM_API_BASE_URL || "https://api.ticketsministry.com/api";
/** Organiser name on TicketsMinistry; compared ignoring case and spaces. */
const ORGANIZER = process.env.TM_ORGANIZER_NAME || "WeDo Events";
const SITE = "https://www.ticketsministry.com";

// Shape of the parts of the TicketsMinistry /events feed we use.
interface TmPackage {
  price: string;
  active: boolean;
  sold_out: boolean;
}
interface TmEvent {
  uid: string;
  name: string;
  type: string;
  status: string;
  start_date: string; // "2026-12-04 19:30", Sri Lanka time
  thumbnail_img: string | null;
  description: string | null;
  manager: { name: string } | null;
  venue: { name: string; city: string | null } | null;
  ticket_packages: TmPackage[];
}

const normalise = (s: string) => s.toLowerCase().replace(/\s+/g, "");
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const titleCase = (s: string) =>
  s.toLowerCase().replace(/(^|[\s:(-])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase());

/** "19:30" → "7:30 PM" */
function clock(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

/** First line of the rich-text description, minus a leading "NAME —". */
function tagline(e: TmEvent) {
  let text = "";
  try {
    const doc = JSON.parse(e.description ?? "");
    text = doc?.content?.[0]?.content?.map((n: { text?: string }) => n.text ?? "").join("") ?? "";
  } catch {
    text = e.description ?? "";
  }
  text = text.replace(new RegExp(`^\\s*${e.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*[—–-]\\s*`, "i"), "");
  return text.split(/[,.]/)[0].trim();
}

function statusOf(e: TmEvent): EventStatus {
  const live = e.ticket_packages.filter((p) => p.active);
  if (live.length && live.every((p) => p.sold_out)) return "sold-out";
  if (e.status === "ongoing" || e.status === "presale") return "on-sale";
  return "coming-soon";
}

function toWeDoEvent(e: TmEvent): WeDoEvent {
  const [date, time = "00:00"] = e.start_date.split(" ");
  const prices = e.ticket_packages.filter((p) => p.active && !p.sold_out).map((p) => Number(p.price));
  return {
    id: e.uid,
    title: titleCase(e.name),
    lineup: tagline(e),
    venue: e.venue?.name ?? "Venue TBA",
    city: (e.venue?.city ?? "Colombo").replace(/\s*\d+$/, ""),
    startsAt: `${date}T${time}:00+05:30`,
    time: clock(time),
    priceFrom: prices.length ? Math.min(...prices) : undefined,
    status: statusOf(e),
    ticketUrl: `${SITE}/${e.type}/${slugify(e.name)}/${e.uid}`,
    posterUrl: e.thumbnail_img ?? undefined,
  };
}

/** Upcoming WeDo events, live from TicketsMinistry (re-fetched at most every 5 minutes). */
export async function getUpcomingEvents(): Promise<WeDoEvent[]> {
  try {
    const res = await fetch(`${API_BASE}/events`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body: { data: TmEvent[] } = await res.json();
    return body.data
      .filter((e) => e.manager && normalise(e.manager.name) === normalise(ORGANIZER))
      .map(toWeDoEvent)
      .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  } catch (err) {
    // Never show made-up events: an empty list hides the ticket and shows "no events".
    console.warn("[events] TicketsMinistry feed unavailable:", err);
    return [];
  }
}
