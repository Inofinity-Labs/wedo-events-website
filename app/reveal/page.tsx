import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";

export const revalidate = 300;

export const metadata: Metadata = {
  // Alternate design for client review; keep it out of search results.
  robots: { index: false, follow: false },
};

/** Version E: version A with event banners revealed inside the WEDO letters as the light sweeps. */
export default function RevealHome() {
  return <HomePage hero="futuristic" theme="glass" version="e" reveal />;
}
