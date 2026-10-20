"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight, Bag, Close, Menu } from "./icons";
import { useCart } from "./cart/CartProvider";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#coming-up", label: "Coming Up" },
  { href: "#the-nights", label: "The Nights" },
  { href: "#moments", label: "Moments" },
  { href: "#wear-it", label: "Wear It" },
  { href: "#connect", label: "Connect" },
];

export function Header() {
  const { count, open } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="header">
      <div className="wrap header__bar">
        <a href="#top" className="header__logo" aria-label="WeDo home">
          <Image src="/images/wedo-logo.png" alt="WeDo — Remembered Always" width={65} height={44} priority />
        </a>

        <nav className="nav" aria-label="Main">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <button className="cart-btn" onClick={open} aria-label={`Open cart, ${count} items`}>
          <Bag size={22} />
          <span className="cart-count" aria-hidden="true">
            {count}
          </span>
        </button>
        <a href="#coming-up" className="btn btn--gradient tickets-btn">
          Get tickets <ArrowUpRight />
        </a>
        <button
          className="menu-btn"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <Close size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav id="mobile-nav" className="wrap mobile-nav" data-open={menuOpen} aria-label="Mobile">
        {LINKS.map((l, i) => (
          <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
            <span>0{i + 1}</span>
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
