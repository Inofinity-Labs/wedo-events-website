import type { NextConfig } from "next";

// Static exports (`npm run demo`, GitHub Pages) set DEMO_EXPORT=1.
const demoExport = process.env.DEMO_EXPORT === "1";
// Sub-path the site is served from, e.g. "/wedo-events-website" on GitHub Pages.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(demoExport && { output: "export", trailingSlash: true }),
  ...(basePath && { basePath }),
  images: {
    // Static hosts can't run the image optimizer; the loader just adds the base path.
    ...(demoExport && { loader: "custom", loaderFile: "./lib/image-loader.ts" }),
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
