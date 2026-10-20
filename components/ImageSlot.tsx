import Image from "next/image";

interface ImageSlotProps {
  src?: string | null;
  alt: string;
  /** Shown on the branded placeholder until a real image is supplied. */
  placeholder?: string;
  sizes?: string;
  priority?: boolean;
  /** "contain" shows the whole image (e.g. in the lightbox). */
  fit?: "cover" | "contain";
}

/** Fills its positioned parent with an image, or a branded placeholder. */
export function ImageSlot({ src, alt, placeholder, sizes = "100vw", priority, fit = "cover" }: ImageSlotProps) {
  return (
    <div className="slot">
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: fit }} />
      ) : (
        <div className="slot__ph" role="img" aria-label={alt}>
          {placeholder ?? alt}
        </div>
      )}
    </div>
  );
}
