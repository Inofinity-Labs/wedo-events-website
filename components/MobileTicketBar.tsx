"use client";

import { useEffect, useState } from "react";
import { colomboParts } from "@/lib/format";
import type { WeDoEvent } from "@/lib/types";
import { ArrowUpRight } from "./icons";

/** Phone-only bar pinned to the bottom once the hero is scrolled past, so tickets are always one tap away. */
export function MobileTicketBar({ event }: { event: WeDoEvent }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const events = document.getElementById("coming-up");
    if (!hero) return;
    let pastHero = false;
    let atEvents = false;
    const sync = () => setShow(pastHero && !atEvents);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) pastHero = !e.isIntersecting;
        if (e.target === events) atEvents = e.isIntersecting;
      }
      sync();
    });
    io.observe(hero);
    if (events) io.observe(events);
    return () => io.disconnect();
  }, []);

  const d = colomboParts(event.startsAt);
  return (
    <div className="ticket-bar" data-show={show} aria-hidden={!show}>
      <div className="ticket-bar__date">
        <strong>{d.day}</strong>
        <span>{d.month}</span>
      </div>
      <div className="ticket-bar__info">
        <span className="hud__key">Next night</span>
        <strong>{event.title}</strong>
      </div>
      <a href="#coming-up" className="btn btn--gradient" tabIndex={show ? 0 : -1}>
        Tickets <ArrowUpRight />
      </a>
    </div>
  );
}
