"use client";

import { useEffect } from "react";
import { lkr } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import { Close, WhatsApp } from "../icons";
import { useCart, type CartLine } from "./CartProvider";

function orderMessage(lines: CartLine[], subtotal: number) {
  const items = lines.map(
    (l) => `• ${l.qty} × ${l.product.name}${l.size === "One size" ? "" : ` (${l.size})`} — ${lkr(l.product.price * l.qty)}`,
  );
  return [
    "Hi WeDo! I'd like to order some merch:",
    "",
    ...items,
    "",
    `Subtotal: ${lkr(subtotal)}`,
    "",
    "Name:",
    "Delivery address / or collect at show:",
  ].join("\n");
}

export function CartDrawer() {
  const { lines, subtotal, isOpen, close, changeQty, remove } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <button className="drawer__scrim" aria-label="Close cart" onClick={close} />
      <aside className="drawer__panel">
        <div className="drawer__head">
          <h3 id="cart-title">Your cart</h3>
          <button className="icon-btn" onClick={close} aria-label="Close cart" autoFocus>
            <Close size={18} />
          </button>
        </div>

        <div className="drawer__items">
          {lines.length === 0 && <p className="drawer__empty">Your cart is empty.</p>}
          {lines.map((l) => (
            <div className="line-item" key={l.key}>
              <div>
                <strong>{l.product.name}</strong>
                <p>
                  {l.size === "One size" ? "One size" : `Size ${l.size}`} · {lkr(l.product.price)}
                </p>
                <div className="stepper">
                  <button onClick={() => changeQty(l.key, -1)} aria-label={`Decrease ${l.product.name}`}>
                    −
                  </button>
                  <span aria-live="polite">{l.qty}</span>
                  <button onClick={() => changeQty(l.key, 1)} aria-label={`Increase ${l.product.name}`}>
                    +
                  </button>
                </div>
              </div>
              <div className="line-item__end">
                <span>{lkr(l.product.price * l.qty)}</span>
                <button className="remove-btn" onClick={() => remove(l.key)}>
                  REMOVE
                </button>
              </div>
            </div>
          ))}
        </div>

        {lines.length > 0 && (
          <div className="drawer__foot">
            <div className="drawer__row">
              <span>Delivery</span>
              <span>Confirmed on WhatsApp</span>
            </div>
            <div className="drawer__row">
              <strong>Subtotal</strong>
              <span className="drawer__total">{lkr(subtotal)}</span>
            </div>
            <a
              className="btn btn--gradient"
              href={whatsappLink(orderMessage(lines, subtotal))}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order on WhatsApp
              <WhatsApp />
            </a>
            <small>
              We&apos;ll confirm stock, delivery and payment details with you on WhatsApp. Nothing is charged on
              this site.
            </small>
          </div>
        )}
      </aside>
    </div>
  );
}
