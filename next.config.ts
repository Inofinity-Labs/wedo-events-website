import type { NextConfig } from "next";

// `npm run demo` sets DEMO_EXPORT=1 to produce a static, host-anywhere build for client review.
const demoExport = process.env.DEMO_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(demoExport && { output: "export", trailingSlash: true }),
  images: {
    unoptimized: demoExport,
    remotePatterns: [
      // Event posters will come from TicketsMinistry once the API is wired up.
      { protocol: "https", hostname: "**.ticketsministry.com" },
      // TicketsMinistry event images (banner_img / thumbnail_img).
      { protocol: "https", hostname: "ticketsministry.s3.ap-south-1.amazonaws.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
