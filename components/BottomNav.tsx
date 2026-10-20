"use client";

import { useEffect, useState } from "react";
import { Heart, ImageIcon, Info, PlayCircle, Shirt, TicketIcon } from "./icons";

const TABS = [
  { id: "about", label: "About", Icon: Info },
  { id: "coming-up", label: "Tickets", Icon: TicketIcon, accent: true },
  { id: "the-nights", label: "Nights", Icon: PlayCircle },
  { id: "moments", label: "Moments", Icon: ImageIcon },
  { id: "wear-it", label: "Merch", Icon: Shirt },
  { id: "connect", label: "Connect", Icon: Heart },
];

/** Floating bottom tab bar for phones and tablets; highlights the section in view. */
export function BottomNav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = TABS.map((t) => document.getElementById(t.id)).filter((el): el is HTMLElement => !!el);
    // A section is "current" when it crosses the middle band of the screen.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    const top = document.getElementById("top");
    const heroIo = top
      ? new IntersectionObserver(([e]) => e.isIntersecting && setActive(null), { rootMargin: "-45% 0px -50% 0px" })
      : null;
    if (top) heroIo?.observe(top);
    return () => {
      io.disconnect();
      heroIo?.disconnect();
    };
  }, []);

  return (
    <nav className="tabbar" aria-label="Sections">
      {TABS.map(({ id, label, Icon, accent }) => (
        <a
          key={id}
          href={`#${id}`}
          className={accent ? "tabbar__item tabbar__item--accent" : "tabbar__item"}
          aria-current={active === id ? "location" : undefined}
        >
          <Icon size={20} />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}
