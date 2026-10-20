# WeDo Events website

Next.js (App Router, TypeScript) build of the "WeDo Website" design from Claude Design.
Single page with five sections: Nights Ahead (upcoming events), The Nights We Made (past concerts),
Remembered in Frames (photo albums), The Merch Drop (merchandise) and Join the Crowd (social).

## Run

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Where things live

| What | File |
|---|---|
| Upcoming events (live from TicketsMinistry) | `lib/events.ts` |
| Recordings, past shows, albums, products, socials, contact | `lib/content.ts` |
| Brand colours, fonts, all styles | `app/globals.css` (tokens at the top) |
| WhatsApp order / alert links | `lib/whatsapp.ts`, `components/cart/CartDrawer.tsx` |
| Original design file and logo | `design/` |

## Content to supply

- **Photos**: drop files in `public/images/...` and reference them in `lib/content.ts`
  (`thumbnail`, `poster`, `image`, album `photos`). Anything left empty shows a branded placeholder.
- **Concert videos**: set `youtubeId` on each recording; the player embeds it on Play.
- **Hero photo**: pass `src` to the `ImageSlot` in `components/Hero.tsx`.
- **WhatsApp number**: `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local` (digits only, e.g. `94771234567`).
- **Social URLs / handles**: `SOCIALS` in `lib/content.ts`.
- **Brand fonts**: Acrom (headings) and Gilroy (body) are licensed fonts. Add the `.woff2` files to
  `public/fonts/` with `@font-face` rules in `globals.css` and they take over automatically;
  Outfit / Urbanist are the fallbacks until then.

## TicketsMinistry

Upcoming events are live: `getUpcomingEvents()` in `lib/events.ts` reads the public
`/api/events` feed, keeps events whose organiser is "WeDo Events", and maps them to `WeDoEvent`
(title, start time, venue, lowest price, on-sale / sold-out, thumbnail, ticket page link).
The hero ticket shows the earliest one. If the feed is unreachable the list is empty (no
placeholder events). Static exports (GitHub Pages) take a snapshot at build time.

## Merch orders

There is no online payment. The cart builds an itemised WhatsApp message (items, sizes, subtotal,
name/address prompts) and opens `wa.me` with it; the team confirms stock, payment and delivery in chat.

## Client demo build

Four design versions live side by side (same sections, different hero / styling):

| Version | Route | Hero | Styling |
|---|---|---|---|
| A | `/` | Futuristic: brand ring with cycling posters, stage beams, parallax | Glass |
| B | `/classic` | Classic: headline + next-up card, latest poster with spinning ring | Glass |
| C | `/flat` | Futuristic | Flat (no glass) |
| D | `/rounded` | Futuristic | Flat with rounded corners and pill controls (`.theme-round`) |

The glass layer in `globals.css` only applies inside `.theme-glass`, which `HomePage` adds when `theme="glass"`.

`npm run demo` makes a static, host-anywhere copy of all four (with a small "Demo" switcher in the
bottom-left corner) in `demo-builds/wedo-demo-<date>/` plus a `.zip` of it. Drag the folder onto
[Netlify Drop](https://app.netlify.com/drop) or import it into Vercel to get a link for the client.
The demo is a snapshot: rebuild it after changes. `demo-builds/` is git-ignored.

## Hosting (GitHub Pages)

Every push to `main` runs `.github/workflows/pages.yml`, which builds the static demo (all three
versions + switcher) and deploys it to https://inofinity-labs.github.io/wedo-events-website/.
`NEXT_PUBLIC_BASE_PATH` (set to `/<repo name>` in the workflow) prefixes every link and image so the
site works from that sub-path; `lib/image-loader.ts` and `lib/paths.ts` apply it.
