import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { imageSize } from "image-size";
import { ALBUMS } from "./content";
import type { AlbumPhoto, MeasuredAlbum } from "./types";

/** Reads each local photo's real dimensions so the gallery can lay rows out by aspect ratio. */
async function measure(src: string): Promise<AlbumPhoto> {
  const buffer = await readFile(path.join(process.cwd(), "public", src));
  const { width, height } = imageSize(buffer);
  return { src, width, height };
}

export async function getAlbums(): Promise<MeasuredAlbum[]> {
  return Promise.all(
    ALBUMS.map(async (album) => ({
      ...album,
      photos: await Promise.all(album.photos.map((src) => (src ? measure(src) : null))),
    })),
  );
}
