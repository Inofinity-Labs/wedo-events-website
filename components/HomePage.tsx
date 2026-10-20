import { About } from "@/components/About";
import { BottomNav } from "@/components/BottomNav";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { Concerts } from "@/components/Concerts";
import { DemoSwitcher } from "@/components/DemoSwitcher";
import { EventCalendar } from "@/components/EventCalendar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HeroClassic } from "@/components/HeroClassic";
import { Merch } from "@/components/Merch";
import { PhotoAlbum } from "@/components/PhotoAlbum";
import { Social } from "@/components/Social";
import { Toast } from "@/components/Toast";
import { getAlbums } from "@/lib/albums.server";
import { getUpcomingEvents } from "@/lib/events";

export type HeroVariant = "futuristic" | "classic";
export type Theme = "glass" | "flat";
/** Demo version id shown in the review switcher. */
export type VersionId = "a" | "b" | "c" | "d";

interface HomePageProps {
  hero: HeroVariant;
  theme: Theme;
  version: VersionId;
  /** Rounded corners and pill controls (demo version D). */
  rounded?: boolean;
}

/** The full single-page site; demo versions differ only in hero and theme. */
export async function HomePage({ hero, theme, version, rounded }: HomePageProps) {
  const now = Date.now();
  const events = (await getUpcomingEvents()).filter((e) => Date.parse(e.startsAt) > now);
  const next = events.find((e) => e.status !== "sold-out") ?? events[0];
  const marqueeItems = ["Remembered always", ...events.map((e) => `${e.title} — ${e.city}`)];
  const albums = await getAlbums();
  const HeroComponent = hero === "classic" ? HeroClassic : Hero;

  return (
    <CartProvider>
      {/* The full glass layer applies inside .theme-glass; .theme-flat only gets glass controls. */}
      <div className={`${theme === "glass" ? "theme-glass" : "theme-flat"}${rounded ? " theme-round" : ""}${process.env.NEXT_PUBLIC_DEMO === "1" ? " is-demo" : ""}`}>
        <div className="page">
          {theme === "glass" && (
            <div className="ambient" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          )}

          <Header />
          <main>
            <HeroComponent next={next} marqueeItems={marqueeItems} />
            <About />
            <EventCalendar events={events} />
            <Concerts />
            <PhotoAlbum albums={albums} />
            <Merch />
            <Social />
          </main>
          <Footer />
        </div>
        <BottomNav />
        <CartDrawer />
        <Toast />
      </div>
      <DemoSwitcher current={version} />
    </CartProvider>
  );
}
