import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";

export const revalidate = 300;

export const metadata: Metadata = {
  // Alternate design for client review; keep it out of search results.
  robots: { index: false, follow: false },
};

export default function ClassicHome() {
  return <HomePage hero="classic" theme="glass" version="b" />;
}
