/** Prefixes a site-relative path with the deploy base path (empty when served from the domain root). */
export const withBase = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
