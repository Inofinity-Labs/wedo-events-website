import type { Metadata, Viewport } from "next";
import { Outfit, Urbanist } from "next/font/google";
import { SITE } from "@/lib/content";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-outfit" });
const urbanist = Urbanist({ subsets: ["latin"], weight: ["300", "400", "600", "800"], variable: "--font-urbanist" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  icons: { icon: "/images/wedo-logo.png" },
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ["/images/wedo-logo.png"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#06122F",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${urbanist.variable}`}>
      <body>{children}</body>
    </html>
  );
}
