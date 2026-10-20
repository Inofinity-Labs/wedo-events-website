import { colomboParts, lkr } from "@/lib/format";
import type { WeDoEvent } from "@/lib/types";
import { Countdown } from "../Countdown";
import { ImageSlot } from "../ImageSlot";
import { ArrowUpRight } from "../icons";

/** Ticket-shaped card for the next show: main body + tear-off stub. */
export function NextTicket({ event }: { event: WeDoEvent }) {
  const d = colomboParts(event.startsAt);
  return (
    <a href="#coming-up" className="ticket" aria-label={`Next night: ${event.title}. See tickets`}>
      <div className="ticket__main">
        <span className="hud__key">
          <span className="live-dot" />
          Next night
        </span>
        <div className="ticket__head">
          <div className="ticket__thumb">
            <ImageSlot src={event.posterUrl} alt={`${event.title} thumbnail`} placeholder="Event" sizes="120px" />
          </div>
          <div className="ticket__info">
            <div className="ticket__date">
              <strong>{d.day}</strong>
              <span>
                {d.month}
                <br />
                {d.weekday}
              </span>
            </div>
            <h3>{event.title}</h3>
          </div>
        </div>
        <p className="ticket__where">
          {event.venue} · {event.city} · {event.time}
        </p>
        <Countdown target={event.startsAt} />
      </div>
      <div className="ticket__stub" aria-hidden="true">
        <span className="ticket__admit">Admit one</span>
        {event.priceFrom && (
          <span className="ticket__price">
            From
            <br />
            <strong>{lkr(event.priceFrom)}</strong>
          </span>
        )}
        <span className="ticket__cta">
          Get
          <br />
          tickets <ArrowUpRight />
        </span>
      </div>
    </a>
  );
}
