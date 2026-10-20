export type EventStatus = "on-sale" | "few-left" | "sold-out" | "coming-soon";

export interface WeDoEvent {
  id: string;
  title: string;
  lineup: string;
  venue: string;
  city: string;
  /** ISO 8601 start time, Sri Lanka local time (+05:30). */
  startsAt: string;
  /** Human-readable doors time, e.g. "6:00 PM". */
  doors: string;
  /** Lowest ticket price in LKR, if known. */
  priceFrom?: number;
  status: EventStatus;
  /** Event page on TicketsMinistry, where the purchase happens. */
  ticketUrl?: string;
  /** Square event image (TicketsMinistry thumbnail_img). */
  posterUrl?: string;
}

/** A completed WeDo event, sourced from TicketsMinistry (see lib/past-events.ts). */
export interface PastEvent {
  tmId: number;
  slug: string;
  title: string;
  /** YYYY-MM-DD, Sri Lanka time. */
  date: string;
  venue: string;
  city: string;
  lineup: string;
  /** Number of performing artists, when known. */
  artistCount: number | null;
  /** Tickets sold through TicketsMinistry. */
  fans: number;
  poster: string | null;
  banner: string | null;
}

export interface Album {
  id: string;
  title: string;
  date: string;
  venue: string;
  /** Small square image for the album filter (TicketsMinistry thumbnail_img). */
  thumbnail: string | null;
  /** Photo paths under /public. Empty entries render as placeholders. */
  photos: (string | null)[];
}

export interface AlbumPhoto {
  src: string;
  width: number;
  height: number;
}

/** An album with every photo measured, ready for the justified gallery. */
export interface MeasuredAlbum extends Omit<Album, "photos"> {
  photos: (AlbumPhoto | null)[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  sizes: string[];
  badge?: string;
  image?: string;
}

export interface SocialLink {
  name: string;
  handle: string;
  url: string;
}
