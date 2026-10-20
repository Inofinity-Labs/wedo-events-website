import { PAST_EVENTS } from "./past-events";
import type { Album, Product, SocialLink } from "./types";

export const SITE = {
  name: "WeDo Events",
  tagline: "Remembered Always",
  description:
    "WeDo is a management team for music concerts situated in Sri Lanka. Our main goal is to introduce the best music events to the country.",
  about: [
    "WeDo is a Colombo-based concert management team with one goal: bringing Sri Lanka the music nights it deserves.",
    "From intimate auditorium evenings to open-air nights under the Colombo sky, we take care of everything from the line-up to the lights, so all you have to do is sing along. Every show is built to be remembered long after the encore.",
  ],
  email: "hello@wedo.lk",
  location: "Colombo, Sri Lanka",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "94770000000",
};

/**
 * Full-concert videos, keyed by past-event slug (see lib/past-events.ts).
 * Add a YouTube video id here and the event gets a playable recording.
 */
export const CONCERT_VIDEOS: Record<string, { youtubeId: string; duration?: string }> = {
  // "swaraabhisheka-2026": { youtubeId: "xxxxxxxxxxx", duration: "2:14:08" },
};

/** Events shown in the concerts player, newest first. */
export const FEATURED_CONCERTS = PAST_EVENTS.slice(0, 5);

/**
 * Photo albums for the most recent shows. The event banner and poster open each
 * album; drop real event photos into /public/images/albums/<slug>/ and list them here.
 */
const PLACEHOLDER_SLOTS = 5;
export const ALBUMS: Album[] = PAST_EVENTS.slice(0, 4).map((e) => ({
  id: e.slug,
  title: e.title,
  date: e.date,
  venue: e.venue,
  thumbnail: e.poster, // `poster` holds the TicketsMinistry thumbnail_img
  photos: [e.banner, e.poster, ...Array.from({ length: PLACEHOLDER_SLOTS }, () => null)],
}));

/** Every past show with an image, for the About section's story carousel. */
export const STORY_SHOWS = PAST_EVENTS.filter((e) => e.poster);

export const ABOUT_STATS = [
  { value: String(PAST_EVENTS.length), label: "Shows produced" },
  { value: PAST_EVENTS.at(-1)?.date.slice(0, 4) ?? "2022", label: "On stage since" },
  // Audience figure supplied by WeDo (not derived from ticket data).
  { value: "30K+", label: "Fans in the crowd" },
];

export const PRODUCTS: Product[] = [
  { id: "tee", name: "Remembered Always Tee", price: 4500, sizes: ["S", "M", "L", "XL"], badge: "NEW" },
  { id: "hoodie", name: "WeDo Tour Hoodie", price: 9800, sizes: ["S", "M", "L", "XL"] },
  { id: "cap", name: "Ring Logo Cap", price: 3200, sizes: ["One size"] },
  { id: "tote", name: "Crowd Tote Bag", price: 2600, sizes: ["One size"] },
];

export const SOCIALS: SocialLink[] = [
  { name: "Instagram", handle: "@wedo.lk", url: "https://instagram.com" },
  { name: "Facebook", handle: "/wedoevents", url: "https://facebook.com" },
  { name: "TikTok", handle: "@wedo.lk", url: "https://tiktok.com" },
  { name: "YouTube", handle: "WeDo Live", url: "https://youtube.com" },
  { name: "X", handle: "@wedo_lk", url: "https://x.com" },
];
