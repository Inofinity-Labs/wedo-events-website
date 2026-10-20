import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";

export const revalidate = 300;

export const metadata: Metadata = {
  // Alternate design for client review; keep it out of search results.
  robots: { index: false, follow: false },
};

/** Version C: futuristic hero without the glass layer (the flat design). */
export default function FlatHome() {
  return <HomePage hero="futuristic" theme="flat" version="c" />;
}
