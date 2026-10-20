"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { PRODUCTS } from "@/lib/content";
import type { Product } from "@/lib/types";

export interface CartLine {
  key: string;
  product: Product;
  size: string;
  qty: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (product: Product, size: string) => void;
  changeQty: (key: string, delta: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  toast: string;
  flash: (message: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "wedo-cart-v1";

type StoredLine = { id: string; size: string; qty: number };

export function CartProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<StoredLine[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setStored(JSON.parse(raw));
    } catch {}
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {}
  }, [stored]);

  const flash = useCallback((message: string) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(""), 1800);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const lines = stored.flatMap((s) => {
      const product = PRODUCTS.find((p) => p.id === s.id);
      return product ? [{ key: `${s.id}|${s.size}`, product, size: s.size, qty: s.qty }] : [];
    });
    const update = (key: string, fn: (l: StoredLine) => StoredLine) =>
      setStored((prev) => prev.map((l) => (`${l.id}|${l.size}` === key ? fn(l) : l)).filter((l) => l.qty > 0));

    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.product.price * l.qty, 0),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add: (product, size) => {
        setStored((prev) =>
          prev.some((l) => l.id === product.id && l.size === size)
            ? prev.map((l) => (l.id === product.id && l.size === size ? { ...l, qty: l.qty + 1 } : l))
            : [...prev, { id: product.id, size, qty: 1 }],
        );
        flash(`${product.name} added`);
      },
      changeQty: (key, delta) => update(key, (l) => ({ ...l, qty: l.qty + delta })),
      remove: (key) => update(key, (l) => ({ ...l, qty: 0 })),
      clear: () => setStored([]),
      toast,
      flash,
    };
  }, [stored, isOpen, toast, flash]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
