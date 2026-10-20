"use client";

import { useEffect, useState } from "react";
import { useCart } from "./cart/CartProvider";
import { Bag, ImageIcon, Info, PlayCircle, Shirt, TicketIcon } from "./icons";

const TABS = [
  { id: "about", label: "About", Icon: Info },
  { id: "coming-up", label: "Tickets", Icon: TicketIcon, accent: true },
  { id: "the-nights", label: "Nights", Icon: PlayCircle },
  { id: "moments", label: "Moments", Icon: ImageIcon },
  { id: "wear-it", label: "Merch", Icon: Shirt },
];

/** Floating bottom tab bar for phones and tablets: sections (highlighting the one in view) + cart. */
export function BottomNav() {
  const { count, open } = useCart();
  const [active, setActive] = useState<string | null>(null);
  // Hidden on the opening screen; slides in once the visitor scrolls down.
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const update = () => setShown(window.scrollY > window.innerHeight * 0.35);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

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
    <nav className="tabbar" aria-label="Sections" data-shown={shown}>
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
      <button className="tabbar__item" onClick={open} aria-label={`Open cart, ${count} items`}>
        <span className="tabbar__icon">
          <Bag size={20} />
          {count > 0 && (
            <span className="tabbar__badge" aria-hidden="true">
              {count}
            </span>
          )}
        </span>
        <span>Cart</span>
      </button>
    </nav>
  );
}
