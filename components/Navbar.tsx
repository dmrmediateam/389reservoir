"use client";

import { useEffect, useState } from "react";
import { site } from "@/site.config";
import { CtaLink } from "@/components/ui";

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Transparent over the hero, frosted once the hero has scrolled past it.
    const onScroll = () => {
      const hero = document.getElementById("top");
      const limit = hero ? hero.offsetHeight - 90 : 40;
      setSolid(window.scrollY > Math.min(limit, 160));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("has-menu", menuOpen);
  }, [menuOpen]);

  return (
    <header className={`nav${solid ? " is-solid" : ""}${menuOpen ? " is-open" : ""}`}>
      <div className="nav__inner">
        <nav className="nav__links" aria-label="Sections">
          {site.nav.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <a className="nav__price" href="#details">
            {site.property.price}
          </a>
          <CtaLink cta={site.navCta} className="btn btn--outline btn--small nav__cta" />
          <button
            type="button"
            className="nav__toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="nav__sheet" onClick={() => setMenuOpen(false)}>
        <nav aria-label="Mobile sections">
          {site.nav.map((link, i) => (
            <a key={link.href} href={link.href} style={{ transitionDelay: `${80 + i * 50}ms` }}>
              {link.label}
            </a>
          ))}
        </nav>
        <CtaLink cta={{ ...site.navCta, location: "mobile-menu" }} className="btn btn--accent" />
      </div>
    </header>
  );
}
