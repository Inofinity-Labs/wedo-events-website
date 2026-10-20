"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { shortDate } from "@/lib/format";
import type { AlbumPhoto, MeasuredAlbum } from "@/lib/types";
import { ImageSlot } from "./ImageSlot";
import { ArrowLeft, ArrowRight, Close } from "./icons";
import { Rail } from "./Rail";
import { SectionHead } from "./SectionHead";

const ALL = "all";
/** Shape used for empty slots until real photos are added. */
const PLACEHOLDER: Pick<AlbumPhoto, "width" | "height"> = { width: 4, height: 3 };

interface Tile {
  photo: AlbumPhoto | null;
  albumTitle: string;
  key: string;
}

export function PhotoAlbum({ albums }: { albums: MeasuredAlbum[] }) {
  const [filter, setFilter] = useState<string>(ALL);
  const [viewing, setViewing] = useState<number | null>(null);

  const allTiles = useMemo<Tile[]>(
    () =>
      albums.flatMap((a) =>
        a.photos.flatMap((photo, i) => (photo ? [{ photo, albumTitle: a.title, key: `${a.id}-${i}` }] : [])),
      ),
    [albums],
  );

  const album = albums.find((a) => a.id === filter);
  const tiles: Tile[] = album
    ? album.photos.map((photo, i) => ({ photo, albumTitle: album.title, key: `${album.id}-${i}` }))
    : allTiles;
  const total = tiles.length;

  const choose = (id: string) => {
    setFilter(id);
    setViewing(null);
  };

  const step = useCallback(
    (d: number) => setViewing((v) => (v === null ? v : (v + d + total) % total)),
    [total],
  );

  useEffect(() => {
    if (viewing === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewing(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [viewing, step]);

  const current = viewing !== null ? tiles[viewing] : null;

  return (
    <section id="moments" className="section" aria-labelledby="moments-title">
      <div className="wrap" style={{ gap: 32 }}>
        <SectionHead id="moments-title" index="04" eyebrow="Moments" title="Remembered in Frames" accent="blue">
          <p className="lead">
            The crowd, the lights, the encores. Pick a night, or take in every frame at once.
          </p>
        </SectionHead>

        <div className="album-filter" role="tablist" aria-label="Choose an album">
          <button role="tab" aria-selected={filter === ALL} className="album-filter__item" onClick={() => choose(ALL)}>
            <span className="album-filter__thumb album-filter__thumb--all" aria-hidden="true">
              <GridIcon />
            </span>
            <span className="album-filter__text">
              <strong>All</strong>
              <span>Every night, every frame</span>
            </span>
          </button>
          {albums.map((a) => (
            <button
              key={a.id}
              role="tab"
              aria-selected={filter === a.id}
              className="album-filter__item"
              onClick={() => choose(a.id)}
            >
              <span className="album-filter__thumb" aria-hidden="true">
                {a.thumbnail && <Image src={a.thumbnail} alt="" fill sizes="56px" />}
              </span>
              <span className="album-filter__text">
                <strong>{a.title}</strong>
                <span>{shortDate(a.date)}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="rule album-meta">
          <span>
            {album ? (
              <>
                <strong>{album.title}</strong> · {shortDate(album.date)} · {album.venue}
              </>
            ) : (
              <>
                <strong>All moments</strong> · newest first
              </>
            )}
          </span>
        </div>

        {/* Justified rows: each tile keeps its real aspect ratio and rows fill the width. */}
        <Rail className="justified" role="tabpanel" aria-label={album?.title ?? "All moments"}>
          {tiles.map((t, i) => {
            const { width, height } = t.photo ?? PLACEHOLDER;
            return (
              <button
                key={`${filter}-${t.key}`}
                style={{ "--w": width, "--h": height, animationDelay: `${i * 40}ms` } as CSSProperties}
                onClick={() => setViewing(i)}
                aria-label={`Open photo ${i + 1} of ${total}, ${t.albumTitle}`}
              >
                <ImageSlot
                  src={t.photo?.src}
                  alt={`${t.albumTitle} photo ${i + 1}`}
                  placeholder="Event photo"
                  sizes="(max-width: 560px) 100vw, 50vw"
                />
                {!album && <span className="justified__tag">{t.albumTitle}</span>}
              </button>
            );
          })}
        </Rail>
      </div>

      {current && viewing !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${current.albumTitle} photos`}>
          <div className="lightbox__bar">
            <span>{current.albumTitle.toUpperCase()}</span>
            <button className="icon-btn" onClick={() => setViewing(null)} aria-label="Close" autoFocus>
              <Close size={20} />
            </button>
          </div>
          <div className="lightbox__stage">
            <button className="icon-btn" onClick={() => step(-1)} aria-label="Previous photo">
              <ArrowLeft size={20} />
            </button>
            <div className="lightbox__img">
              <ImageSlot
                src={current.photo?.src}
                alt={`${current.albumTitle} photo ${viewing + 1}`}
                placeholder="Event photo"
                sizes="90vw"
                fit="contain"
              />
            </div>
            <button className="icon-btn" onClick={() => step(1)} aria-label="Next photo">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function GridIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" />
      <rect x="13" y="3" width="8" height="5" />
      <rect x="13" y="10" width="8" height="11" />
      <rect x="3" y="13" width="8" height="8" />
    </svg>
  );
}
