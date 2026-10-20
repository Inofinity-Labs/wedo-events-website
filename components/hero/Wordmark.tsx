import { STORY_SHOWS } from "@/lib/content";
import { withBase } from "@/lib/paths";

/** Recent shows with distinct banners, laid side by side behind the letters in reveal mode. */
const COLLAGE = STORY_SHOWS.filter((s, i, all) => s.banner && all.findIndex((o) => o.title === s.title) === i)
  .slice(0, 3)
  .map((s) => withBase(s.banner as string));

/**
 * Giant background "WEDO". Drawn as SVG so the outline traces each letter's
 * true silhouette: a CSS text-stroke would also outline the overlapping
 * contours inside the variable font's glyphs, making letters look like
 * joined blocks. The outline is built by dilating the glyphs' alpha by a
 * hair and cutting the original shape out of it.
 *
 * `reveal`: the letters also act as windows onto a collage of event banners,
 * which light up inside the travelling light band (demo version E).
 */
export function Wordmark({ reveal = false }: { reveal?: boolean }) {
  const text = (props: React.SVGProps<SVGTextElement>) => (
    <text x="500" y="262" textAnchor="middle" textLength="992" lengthAdjust="spacingAndGlyphs" {...props}>
      WEDO
    </text>
  );
  // The band is wider in reveal mode so a good stretch of each banner shows at once.
  const band = reveal ? 380 : 300;
  const tile = 1000 / COLLAGE.length;

  return (
    <span className={reveal ? "hero__wordmark hero__wordmark--reveal" : "hero__wordmark"} aria-hidden="true">
      <svg viewBox="0 0 1000 280" preserveAspectRatio="xMidYMax meet" focusable="false">
        <defs>
          <linearGradient id="wd-wm-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#01e8ff" stopOpacity="0.1" />
            <stop offset="0.75" stopColor="#01e8ff" stopOpacity="0" />
          </linearGradient>
          <filter id="wd-wm-edge" x="-2%" y="-5%" width="104%" height="110%">
            <feMorphology in="SourceAlpha" operator="dilate" radius="1.1" result="grown" />
            <feComposite in="grown" in2="SourceAlpha" operator="out" result="edge" />
            <feFlood floodColor="#ffffff" floodOpacity="0.14" />
            <feComposite in2="edge" operator="in" />
          </filter>
          <filter id="wd-wm-glow" x="-2%" y="-5%" width="104%" height="110%">
            <feMorphology in="SourceAlpha" operator="dilate" radius="1.1" result="grown" />
            <feComposite in="grown" in2="SourceAlpha" operator="out" result="edge" />
            <feFlood floodColor="#01e8ff" floodOpacity="0.6" />
            <feComposite in2="edge" operator="in" result="line" />
            <feGaussianBlur in="line" stdDeviation="2.5" result="halo" />
            <feMerge>
              <feMergeNode in="halo" />
              <feMergeNode in="line" />
            </feMerge>
          </filter>
          {/* A soft band that sweeps left to right and reveals the glowing edge (and, in reveal mode, the images). */}
          <linearGradient id="wd-wm-band" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="wd-wm-sheen" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="280">
            <rect className="hero__wordmark-band" x={-band} y="0" width={band} height="280" fill="url(#wd-wm-band)" />
          </mask>
          {reveal && (
            <clipPath id="wd-wm-letters">
              <text x="500" y="262" textAnchor="middle" textLength="992" lengthAdjust="spacingAndGlyphs" className="hero__wordmark-clip">
                WEDO
              </text>
            </clipPath>
          )}
        </defs>

        {text({ fill: "url(#wd-wm-fill)" })}
        {reveal && (
          // Banner collage, cut to the letter shapes, visible only inside the light band.
          <g clipPath="url(#wd-wm-letters)" mask="url(#wd-wm-sheen)" className="hero__wordmark-collage">
            {COLLAGE.map((src, i) => (
              <image key={src} href={src} x={i * tile} y="0" width={tile} height="280" preserveAspectRatio="xMidYMid slice" />
            ))}
          </g>
        )}
        {text({ fill: "#000", filter: "url(#wd-wm-edge)" })}
        <g mask="url(#wd-wm-sheen)">{text({ fill: "#000", filter: "url(#wd-wm-glow)" })}</g>
      </svg>
    </span>
  );
}
