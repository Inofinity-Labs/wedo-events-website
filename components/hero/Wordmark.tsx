/**
 * Giant background "WEDO". Drawn as SVG so the outline traces each letter's
 * true silhouette: a CSS text-stroke would also outline the overlapping
 * contours inside the variable font's glyphs, making letters look like
 * joined blocks. The outline is built by dilating the glyphs' alpha by a
 * hair and cutting the original shape out of it.
 */
export function Wordmark() {
  const text = (props: React.SVGProps<SVGTextElement>) => (
    <text x="500" y="262" textAnchor="middle" textLength="992" lengthAdjust="spacingAndGlyphs" {...props}>
      WEDO
    </text>
  );

  return (
    <span className="hero__wordmark" aria-hidden="true">
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
          {/* A soft band that sweeps left to right and reveals the glowing edge. */}
          <linearGradient id="wd-wm-band" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="wd-wm-sheen" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="280">
            <rect className="hero__wordmark-band" x="-300" y="0" width="300" height="280" fill="url(#wd-wm-band)" />
          </mask>
        </defs>

        {text({ fill: "url(#wd-wm-fill)" })}
        {text({ fill: "#000", filter: "url(#wd-wm-edge)" })}
        <g mask="url(#wd-wm-sheen)">{text({ fill: "#000", filter: "url(#wd-wm-glow)" })}</g>
      </svg>
    </span>
  );
}
