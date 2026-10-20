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
import { marqueeItems as buildMarquee } from "@/lib/marquee";

export type HeroVariant = "futuristic" | "classic";
export type Theme = "glass" | "flat";
/** Demo version id shown in the review switcher. */
export type VersionId = "a" | "b" | "c" | "d" | "e";

interface HomePageProps {
  hero: HeroVariant;
  theme: Theme;
  version: VersionId;
  /** Rounded corners and pill controls (demo version D). */
  rounded?: boolean;
  /** Event banners revealed inside the hero's WEDO letters (demo version E). */
  reveal?: boolean;
}

/** The full single-page site; demo versions differ only in hero and theme. */
export async function HomePage({ hero, theme, version, rounded, reveal }: HomePageProps) {
  const now = Date.now();
  const events = (await getUpcomingEvents()).filter((e) => Date.parse(e.startsAt) > now);
  const next = events.find((e) => e.status !== "sold-out") ?? events[0];
  const marqueeItems = buildMarquee(events);
  const albums = await getAlbums();

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
            {hero === "classic" ? (
              <HeroClassic next={next} marqueeItems={marqueeItems} />
            ) : (
              <Hero next={next} marqueeItems={marqueeItems} reveal={reveal} />
            )}
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
