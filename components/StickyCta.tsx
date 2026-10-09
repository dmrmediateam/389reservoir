"use client";

import { useEffect, useState } from "react";
import { site } from "@/site.config";
import { telHref } from "@/lib/format";
import { PhoneIcon } from "@/components/ui";

/**
 * Bottom bar on phones: price, call button and the tour CTA. Ad traffic is
 * mostly mobile, so the action must always be one thumb away. It slides in
 * once the hero is gone and steps aside while the inline form is on screen,
 * so it never covers the thing it is pointing at.
 */
export default function StickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const enquire = document.getElementById("enquire");
    const observers: IntersectionObserver[] = [];
    if (hero) {
      const o = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), { threshold: 0.1 });
      o.observe(hero);
      observers.push(o);
    }
    if (enquire) {
      const o = new IntersectionObserver(([e]) => setFormVisible(e.isIntersecting), { threshold: 0.15 });
      o.observe(enquire);
      observers.push(o);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const { property } = site;
  return (
    <div className={`sticky-cta light${pastHero && !formVisible ? " is-visible" : ""}`}>
      <div className="sticky-cta__price">
        <strong>{property.price}</strong>
        <span>
          {property.beds} bd · {property.baths} ba · {property.sqft.toLocaleString("en-US")} sf
        </span>
      </div>
      <a className="sticky-cta__call" href={telHref(site.agent.phone)} aria-label={`Call ${site.agent.name}`} data-location="sticky-bar">
        <PhoneIcon />
      </a>
      <a className="btn btn--accent sticky-cta__tour" href="#enquire" data-open-lead-form="showing" data-location="sticky-bar">
        Book a Tour
      </a>
    </div>
  );
}
