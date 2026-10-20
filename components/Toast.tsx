"use client";

import { useCart } from "./cart/CartProvider";

export function Toast() {
  const { toast } = useCart();
  return (
    <div aria-live="polite">
      {toast && (
        <div className="toast" key={toast}>
          {toast}
        </div>
      )}
    </div>
  );
}
