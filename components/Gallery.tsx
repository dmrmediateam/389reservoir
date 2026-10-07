"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { site } from "@/site.config";
import { trackEvent } from "@/lib/analytics";
import { Title } from "@/components/ui";

/* ==========================================================================
   Mosaic of five featured photos, plus a full-screen viewer with two modes:
   a filterable grid (how buyers actually browse: "show me the kitchen") and
   a single-photo stage with keyboard and swipe navigation.

   Anything on the page with data-open-gallery="<index>" opens the viewer at
   that photo, which is how the marquee strip hooks in.
   ========================================================================== */

const { images, featured } = site.gallery;
const ALL = "All";

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={dir === "left" ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Gallery() {
  const [view, setView] = useState<"closed" | "grid" | "single">("closed");
  const [index, setIndex] = useState(0);
  const [filter, setFilter] = useState(ALL);
  const touchX = useRef<number | null>(null);

  const categories = useMemo(() => {
    const found = Array.from(new Set(images.map((i) => i.category).filter(Boolean))) as string[];
    return found.length > 1 ? [ALL, ...found] : [];
  }, []);

  const visible = useMemo(
    () => images.map((img, i) => ({ ...img, i })).filter((img) => filter === ALL || img.category === filter),
    [filter],
  );

  const openAt = useCallback((i: number, source: string) => {
    setIndex(i);
    setView("single");
    trackEvent("gallery_open", { source });
  }, []);

  const step = useCallback(
    (delta: number) =>
      setIndex((current) => {
        // Walk within the active filter so arrows never jump categories.
        const pos = visible.findIndex((v) => v.i === current);
        const next = visible[(pos + delta + visible.length) % visible.length];
        return next ? next.i : current;
      }),
    [visible],
  );

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const trigger = (event.target as Element | null)?.closest?.<HTMLElement>("[data-open-gallery]");
      if (!trigger) return;
      event.preventDefault();
      setFilter(ALL);
      openAt(Number(trigger.dataset.openGallery) || 0, "marquee");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [openAt]);

  useEffect(() => {
    if (view === "closed") return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("has-modal");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setView((v) => (v === "single" ? "grid" : "closed"));
      if (view === "single" && event.key === "ArrowLeft") step(-1);
      if (view === "single" && event.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.documentElement.classList.remove("has-modal");
      window.removeEventListener("keydown", onKey);
    };
  }, [view, step]);

  // Preload the neighbours so arrowing through feels instant.
  const neighbours = view === "single" ? [index - 1, index + 1].map((n) => images[(n + images.length) % images.length]) : [];
  const current = images[index];
  const position = visible.findIndex((v) => v.i === index) + 1;

  return (
    <section className="gallery" id="gallery">
      <div className="container gallery__head" data-reveal="up">
        <div>
          <p className="eyebrow">{site.gallery.eyebrow}</p>
          <h2 className="display">
            <Title lines={site.gallery.titleLines} />
          </h2>
        </div>
        <button type="button" className="btn btn--outline" onClick={() => setView("grid")}>
          View all {images.length} photos
        </button>
      </div>

      <div className="gallery__mosaic" data-stagger>
        {featured.map((i, n) => (
          <button
            key={i}
            type="button"
            className={`gallery__tile${n === 0 ? " gallery__tile--hero" : ""}`}
            onClick={() => openAt(i, "mosaic")}
            aria-label={`Open photo: ${images[i]?.label}`}
          >
            <Image
              src={images[i].src}
              alt={images[i].alt ?? images[i].label}
              fill
              sizes={n === 0 ? "(max-width: 900px) 100vw, 50vw" : "(max-width: 900px) 50vw, 25vw"}
            />
            <span className="gallery__tile-label">{images[i].label}</span>
            {n === featured.length - 1 ? (
              <span className="gallery__tile-more">
                <strong>+{images.length - featured.length}</strong> more
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {view !== "closed" ? (
        <div className={`viewer viewer--${view}`} role="dialog" aria-modal="true" aria-label={`${site.property.name} photos`}>
          <div className="viewer__bar">
            {view === "single" ? (
              <button type="button" className="viewer__text-btn" onClick={() => setView("grid")}>
                <Chevron dir="left" /> All photos
              </button>
            ) : (
              <p className="viewer__title">{site.property.name}</p>
            )}
            {categories.length ? (
              <div className="viewer__filters" role="tablist" aria-label="Photo categories">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    role="tab"
                    aria-selected={filter === c}
                    className={filter === c ? "is-active" : ""}
                    onClick={() => {
                      setFilter(c);
                      setView("grid");
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            ) : null}
            <div className="viewer__bar-end">
              <a href="#enquire" className="btn btn--accent btn--small" data-open-lead-form="showing" data-location="gallery-viewer" onClick={() => setView("closed")}>
                Book a tour
              </a>
              <button type="button" className="viewer__close" aria-label="Close photos" onClick={() => setView("closed")}>
                <span />
                <span />
              </button>
            </div>
          </div>

          {view === "grid" ? (
            <div className="viewer__grid">
              {visible.map((img) => (
                <button key={img.src} type="button" className="viewer__thumb" onClick={() => openAt(img.i, "grid")}>
                  <Image src={img.src} alt={img.alt ?? img.label} fill sizes="(max-width: 700px) 50vw, 33vw" />
                  <span>{img.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div
              className="viewer__stage"
              onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
                touchX.current = null;
              }}
            >
              <button type="button" className="viewer__nav viewer__nav--prev" aria-label="Previous photo" onClick={() => step(-1)}>
                <Chevron dir="left" />
              </button>
              <div className="viewer__frame" key={current.src}>
                <Image src={current.src} alt={current.alt ?? current.label} fill sizes="100vw" priority />
              </div>
              <button type="button" className="viewer__nav viewer__nav--next" aria-label="Next photo" onClick={() => step(1)}>
                <Chevron dir="right" />
              </button>
              <p className="viewer__caption">
                <span>{current.label}</span>
                <span className="viewer__count">
                  {position} / {visible.length}
                </span>
              </p>
              {neighbours.map((n) => (
                <div key={`ghost-${n.src}`} className="viewer__frame viewer__frame--ghost" aria-hidden="true">
                  <Image src={n.src} alt="" fill sizes="100vw" loading="eager" />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
