"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/analytics";

/* ==========================================================================
   Page-wide motion and listeners, mounted once.

   Sections stay server components and opt in with data attributes:
     data-reveal="up|fade|clip|scale"  animate in when scrolled into view
     data-stagger                      reveal children one after another
     data-parallax="0.12"              drift against the scroll by that factor
     data-count                        count a number up from zero on reveal

   Content is visible without JS: the hidden starting state only applies once
   <html> has the `motion` class, which this component adds. Reduced-motion
   visitors never get it.
   ========================================================================== */

const NUMBER = /^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/;

function countUp(el: HTMLElement) {
  const original = el.textContent ?? "";
  const match = original.match(NUMBER);
  if (!match) return;
  const [, prefix, digits, suffix] = match;
  const target = Number(digits.replace(/,/g, ""));
  const decimals = digits.split(".")[1]?.length ?? 0;
  const useCommas = digits.includes(",");
  const duration = 1400;
  const start = performance.now();

  const frame = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const value = (target * eased).toFixed(decimals);
    const shown = useCommas ? Number(value).toLocaleString("en-US", { minimumFractionDigits: decimals }) : value;
    el.textContent = `${prefix}${shown}${suffix}`;
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = original;
  };
  requestAnimationFrame(frame);
}

export default function Motion() {
  useEffect(() => {
    captureAttribution();

    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Phone and email taps are conversions in their own right on an ad page.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      const href = link?.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) trackEvent("phone_click", { location: link?.getAttribute("data-location") });
      if (href.startsWith("mailto:")) trackEvent("email_click", { location: link?.getAttribute("data-location") });
    };
    document.addEventListener("click", onClick);

    // Scroll progress hairline + nav state, one rAF-throttled listener.
    let ticking = false;
    const parallax = reduced ? [] : Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty("--scroll-progress", String(max > 0 ? window.scrollY / max : 0));
      const vh = window.innerHeight;
      for (const el of parallax) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) continue;
        const factor = Number(el.dataset.parallax) || 0.1;
        const offset = (rect.top + rect.height / 2 - vh / 2) * -factor;
        el.style.setProperty("--parallax", `${offset.toFixed(1)}px`);
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    if (reduced || !("IntersectionObserver" in window)) {
      return () => {
        document.removeEventListener("click", onClick);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }

    root.classList.add("motion");

    document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
      Array.from(group.children).forEach((child, i) => {
        (child as HTMLElement).style.setProperty("--reveal-delay", `${i * 90}ms`);
        if (!child.hasAttribute("data-reveal")) child.setAttribute("data-reveal", "up");
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("is-in");
          el.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
          if (el.hasAttribute("data-count")) countUp(el);
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div className="scroll-progress" aria-hidden="true" />;
}
