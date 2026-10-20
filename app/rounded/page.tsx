import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";

export const revalidate = 300;

export const metadata: Metadata = {
  // Alternate design for client review; keep it out of search results.
  robots: { index: false, follow: false },
};

/** Version D: the flat version with rounded corners and pill-shaped controls. */
export default function RoundedHome() {
  return <HomePage hero="futuristic" theme="flat" version="d" rounded />;
}
