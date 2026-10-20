"use client";

import Image from "next/image";
import { ArrowUpRight, Bag } from "./icons";
import { useCart } from "./cart/CartProvider";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#coming-up", label: "Coming Up" },
  { href: "#the-nights", label: "The Nights" },
  { href: "#moments", label: "Moments" },
  { href: "#wear-it", label: "Wear It" },
  { href: "#connect", label: "Connect" },
];

/** Top bar. Below 1080px the section links move to the floating BottomNav. */
export function Header() {
  const { count, open } = useCart();

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
      </div>
    </header>
  );
}
