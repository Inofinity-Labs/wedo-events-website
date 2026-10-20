"use client";

import { useMemo, useState } from "react";
import { colomboParts, lkr } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import type { EventStatus, WeDoEvent } from "@/lib/types";
import { ArrowUpRight, Pin } from "./icons";
import { Rail } from "./Rail";
import { SectionHead } from "./SectionHead";

const STATUS_LABEL: Record<EventStatus, string> = {
  "on-sale": "On sale",
  "few-left": "Few left",
  "sold-out": "Sold out",
  "coming-soon": "Coming soon",
};

export function EventCalendar({ events }: { events: WeDoEvent[] }) {
  const rows = useMemo(
    () =>
      events.map((e) => {
        const p = colomboParts(e.startsAt);
        return { ...e, ...p, monthKey: `${p.month} ${String(p.year).slice(2)}` };
      }),
    [events],
  );
  const months = useMemo(() => [...new Set(rows.map((r) => r.monthKey))], [rows]);
  const cities = useMemo(() => [...new Set(rows.map((r) => r.city))], [rows]);

  const [month, setMonth] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const visible = rows.filter((r) => (!month || r.monthKey === month) && (!city || r.city === city));

  return (
    <section id="coming-up" className="section" aria-labelledby="coming-up-title">
      <div className="wrap">
        <SectionHead id="coming-up-title" index="02" eyebrow="Coming up" title="Nights Ahead" accent="green">
          <div className="filters">
            <div className="chips chips--scroll" role="group" aria-label="Filter by month">
              <Chip active={!month} onClick={() => setMonth(null)} label="All dates" />
              {months.map((m) => (
                <Chip key={m} active={month === m} onClick={() => setMonth(m)} label={m} />
              ))}
            </div>
            <div className="chips chips--scroll" role="group" aria-label="Filter by city">
              <Chip small active={!city} onClick={() => setCity(null)} label="All cities" />
              {cities.map((c) => (
                <Chip small key={c} active={city === c} onClick={() => setCity(c)} label={c} />
              ))}
            </div>
          </div>
        </SectionHead>

        <Rail className="event-list glass" aria-label="Upcoming events">
          {visible.map((e) => (
            <article className="event-row" key={`${e.id}-${month}-${city}`}>
              <div className="event-row__date">
                <span className="event-row__day">{e.day}</span>
                <span className="event-row__mon">
                  <span>{e.month}</span>
                  <span>{e.weekday}</span>
                </span>
              </div>
              <div className="event-row__title">
                <strong>{e.title}</strong>
                <span>{e.lineup}</span>
              </div>
              <div className="event-row__venue">
                <span>
                  <Pin size={14} style={{ color: "var(--green)" }} />
                  {e.venue}
                </span>
                <span>
                  {e.city} · {e.time}
                </span>
              </div>
              <div className="event-row__status">
                <span className={`tag tag--${e.status}`}>{STATUS_LABEL[e.status]}</span>
                {e.priceFrom && <span className="event-row__price">From {lkr(e.priceFrom)}</span>}
              </div>
              <EventCta event={e} />
            </article>
          ))}
          {visible.length === 0 && <p className="empty">No events match this filter yet.</p>}
        </Rail>
        <p className="note">Tickets are sold through TicketsMinistry.</p>
      </div>
    </section>
  );
}

function EventCta({ event }: { event: WeDoEvent }) {
  if (event.status === "sold-out") {
    return (
      <span className="btn btn--outline" aria-disabled="true">
        Sold out
      </span>
    );
  }
  if (event.status === "coming-soon" || !event.ticketUrl) {
    return (
      <a
        className="btn btn--outline"
        href={whatsappLink(`Hi WeDo! Please let me know when tickets for "${event.title}" go on sale.`)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Notify me <ArrowUpRight />
      </a>
    );
  }
  return (
    <a className="btn btn--outline" href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
      Tickets <ArrowUpRight />
    </a>
  );
}

function Chip({ label, active, onClick, small }: { label: string; active: boolean; onClick: () => void; small?: boolean }) {
  return (
    <button className={small ? "chip chip--sm" : "chip"} aria-pressed={active} onClick={onClick}>
      {label}
    </button>
  );
}
