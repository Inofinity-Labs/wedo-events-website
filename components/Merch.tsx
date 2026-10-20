"use client";

import { useState } from "react";
import { PRODUCTS } from "@/lib/content";
import { lkr } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCart } from "./cart/CartProvider";
import { ImageSlot } from "./ImageSlot";
import { Plus, WhatsApp } from "./icons";
import { SectionHead } from "./SectionHead";

export function Merch() {
  return (
    <section id="wear-it" className="section section--alt" aria-labelledby="wear-it-title">
      <div className="wrap">
        <SectionHead id="wear-it-title" index="05" eyebrow="Wear the night" title="The Merch Drop" accent="green">
          <p className="lead">Official WeDo gear. Island-wide delivery, or collect at the merch desk on show night.</p>
        </SectionHead>
        <div className="products">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <p className="merch-note">
          <WhatsApp />
          Add what you like to the cart, then send the order to us on WhatsApp — we&apos;ll confirm payment and delivery.
        </p>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { add, flash } = useCart();
  const single = product.sizes.length === 1;
  const [size, setSize] = useState<string | null>(single ? product.sizes[0] : null);

  return (
    <article className="product glass">
      <div className="product__img">
        <ImageSlot src={product.image} alt={product.name} placeholder="Product photo" sizes="(max-width: 600px) 100vw, 25vw" />
        {product.badge && <span className="product__badge">{product.badge}</span>}
      </div>
      <div className="product__body">
        <div className="product__head">
          <strong>{product.name}</strong>
          <span>{lkr(product.price)}</span>
        </div>
        <div className="sizes" role="group" aria-label={`${product.name} size`}>
          {product.sizes.map((s) => (
            <button key={s} className="size" aria-pressed={size === s} onClick={() => setSize(s)}>
              {s}
            </button>
          ))}
        </div>
        <button
          className={size ? "btn btn--solid" : "btn btn--muted"}
          onClick={() => (size ? add(product, size) : flash("Pick a size first"))}
        >
          {size ? "Add to cart" : "Select a size"}
          <Plus />
        </button>
      </div>
    </article>
  );
}
