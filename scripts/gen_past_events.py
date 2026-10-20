"""Turn the TicketsMinistry export (see export-past-events.sh) into lib/past-events.ts + local images.

usage: python -I gen_past_events.py <export.jsonl> <project-root>
"""
import json
import os
import re
import sys
import time
import urllib.request

src, root = sys.argv[1], sys.argv[2]
img_dir = os.path.join(root, "public", "images", "events")
os.makedirs(img_dir, exist_ok=True)

# Line-ups where the artist table is empty or less complete than the description.
LINEUP_OVERRIDES = {
    2: "BNS | Wasthi | Jaya Sri | Kanchana · Music by Infinity",
    8: "Sunil Edirisinghe | Amarasiri Peiris | Kasun Kalhara · Music by Naada",
    23: "Wasthi | Sanuka | Dhanith Sri | Dinesh Gamage | Kanchana Anuradhi · Music by 2FORTY2",
    40: "Malith Perera | Amila Perera | Mohan Darshana | Kanchana Anuradhi",
    88: "Kasun Kalhara | Indrachapa Liyanage | Nadeeka Guruge | Nadeeka Jayawardena · Music by Naada",
    115: "Shihan | Wasthi | Dinesh | Kaizer | Chithral | Kanchana · Music by Infinity",
    166: "Malith Perera · Music by Naada",
    189: "Kasun Kalhara | Indrachapa Liyanage | Nadeeka Guruge | Nadeeka Jayawardena · Music by Naada",
    550: "Sangeeth Wijesuriya with WAYO",
    671: "Ridma | Yasas | Suneera | Mihiran | Damsara | Dilu Beats | Dhyan | Gangadara",
    780: "Where music blooms again",
    922: "One stage. Four artists.",
    967: "One stage. Four artists.",
    1048: "Sunil Edirisinghe | Rookantha Gunathilake | Kasun Kalhara",
}

# Artist counts the line-up text can't give (taglines instead of names).
ARTIST_COUNT_OVERRIDES = {922: 4, 967: 4}  # "Four Notes": four artists per the event description

SMALL = {"of", "at", "the", "and", "in", "on"}


def title_case(name: str) -> str:
    name = re.sub(r"\s*[-:]\s*", ": ", name.strip()) if re.search(r"\s[-:]\s|:\s", name) else name.strip()
    words = name.split()
    out = []
    for i, w in enumerate(words):
        lw = w.lower()
        out.append(lw if i and lw in SMALL else lw[:1].upper() + lw[1:])
    return " ".join(out).replace("Legends Unfolding", "Legends: Unfolding")


def clean_venue(v: str) -> str:
    v = re.sub(r"\s*-\s*Colombo$", "", v or "").strip()
    return v.replace("Viharamadevi", "Viharamahadevi")


def city_for(venue: str, city: str | None) -> str:
    if venue and "kandy" in venue.lower():
        return "Kandy"
    if city and city.lower() != "null":
        return re.sub(r"\s*\d+$", "", city).strip()
    return "Colombo"


def artist_count(event_id: int, lineup: str, db_artists) -> int | None:
    if event_id in ARTIST_COUNT_OVERRIDES:
        return ARTIST_COUNT_OVERRIDES[event_id]
    names = lineup.split(" · ")[0]
    from_lineup = len([n for n in names.split("|") if n.strip()]) if "|" in names else 0
    n = max(from_lineup, len(db_artists or []))
    return n or None


def slugify(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def download(url: str, dest_base: str) -> str:
    ext = os.path.splitext(url.split("?")[0])[1].lower() or ".jpg"
    dest = dest_base + ext
    if not os.path.exists(dest):
        req = urllib.request.Request(url, headers={"User-Agent": "wedo-site-build"})
        for attempt in range(5):
            try:
                with urllib.request.urlopen(req, timeout=60) as r:
                    data = r.read()
                break
            except OSError:
                if attempt == 4:
                    raise
                time.sleep(2 * (attempt + 1))
        with open(dest + ".part", "wb") as f:
            f.write(data)
        os.replace(dest + ".part", dest)
    return "/images/events/" + os.path.basename(dest)


events = []
for line in open(src, encoding="utf-8"):
    r = json.loads(line)
    title = title_case(r["name"])
    year = r["start"][:4]
    slug = f"{slugify(title)}-{year}" if year not in title else slugify(title)
    if any(e["slug"] == slug for e in events):
        slug = f"{slug}-{r['start'][5:7]}"
    venue = clean_venue(r["venue"])
    lineup = LINEUP_OVERRIDES.get(r["id"]) or " | ".join(r.get("artists") or [])
    events.append(
        {
            "tmId": r["id"],
            "slug": slug,
            "title": title,
            "date": r["start"][:10],
            "venue": venue,
            "city": city_for(venue, r.get("city")),
            "lineup": lineup,
            "artistCount": artist_count(r["id"], lineup, r.get("artists")),
            # Tickets sold through TicketsMinistry (paid / verified orders).
            "fans": int(r.get("fans") or 0),
            "poster": download(r["thumb"], os.path.join(img_dir, f"{slug}-poster")) if r.get("thumb") else None,
            "banner": download(r["banner"], os.path.join(img_dir, f"{slug}-banner")) if r.get("banner") else None,
        }
    )
    print("ok", slug)

body = json.dumps(events, indent=2, ensure_ascii=False)
ts = f"""// Generated from the TicketsMinistry UAT database (organizer: We Do Events).
// Past, non-deleted events only, newest first. Images are copied into /public/images/events.
// Re-run scripts/export-past-events.sh instead of editing by hand.
import type {{ PastEvent }} from "./types";

export const PAST_EVENTS: PastEvent[] = {body};
"""
with open(os.path.join(root, "lib", "past-events.ts"), "w", encoding="utf-8", newline="\n") as f:
    f.write(ts)
print(len(events), "events written")
