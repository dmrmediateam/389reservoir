"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Background video with the hero photo as its poster. Starts only once the
 * page is idle so it never competes with the LCP image on a phone, and stays
 * off entirely for reduced-motion or data-saver visitors.
 */
export default function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduced || saveData) return;
    const start = () => setEnabled(true);
    const idle = window.requestIdleCallback?.(start, { timeout: 1500 }) ?? window.setTimeout(start, 600);
    return () => {
      window.cancelIdleCallback?.(idle as number);
      window.clearTimeout(idle as number);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <video
        ref={ref}
        className="hero__video"
        src={src}
        poster={poster}
        autoPlay
        muted={muted}
        loop
        playsInline
        aria-hidden="true"
        onPlaying={(e) => e.currentTarget.classList.add("is-playing")}
      />
      <button
        type="button"
        className="hero__sound"
        aria-label={muted ? "Unmute video" : "Mute video"}
        onClick={() => setMuted((m) => !m)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 9h4l5-4v14l-5-4H4V9Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          {muted ? (
            <path d="m16 9 5 6m0-6-5 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          ) : (
            <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          )}
        </svg>
      </button>
    </>
  );
}
