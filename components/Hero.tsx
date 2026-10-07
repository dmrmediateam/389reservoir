import Image from "next/image";
import { site } from "@/site.config";
import { keyFacts, priceReduction } from "@/lib/format";
import { CtaLink } from "@/components/ui";
import HeroVideo from "@/components/HeroVideo";

export default function Hero() {
  const { hero, property } = site;
  const reduction = priceReduction(property.previousPrice, property.price);
  const [primary, secondary] = hero.ctas;

  return (
    <section className="hero" id="top">
      <div className="hero__media" aria-hidden="true">
        <Image
          src={hero.imageSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero__image"
        />
        {hero.videoSrc ? <HeroVideo src={hero.videoSrc} poster={hero.imageSrc} /> : null}
      </div>
      <div className="hero__shade" />

      <div className="hero__content">
        <div className="hero__copy">
          <p className="hero__eyebrow hero-in" style={{ ["--i" as string]: 0 }}>
            <span className="hero__eyebrow-line" />
            {hero.eyebrow}
            {property.status ? <span className="hero__status">{property.status}</span> : null}
          </p>
          <h1 className="hero__title">
            {hero.titleLines.map((line, i) => (
              <span key={i} className="hero__title-mask">
                <span
                  className={`hero__title-line hero-rise${line.italic ? " title-line--italic" : ""}`}
                  style={{ ["--i" as string]: i + 1 }}
                >
                  {line.text}
                </span>
              </span>
            ))}
          </h1>
          <p className="hero__subline hero-in" style={{ ["--i" as string]: 3 }}>
            {hero.subline}
          </p>
          <p className="hero__lead hero-in" style={{ ["--i" as string]: 4 }}>
            {hero.lead}
          </p>
          <div className="hero__ctas hero-in" style={{ ["--i" as string]: 5 }}>
            <CtaLink cta={primary} className="btn btn--accent btn--large" arrow />
            {secondary ? <CtaLink cta={secondary} className="btn btn--glass btn--large" /> : null}
          </div>
        </div>
      </div>

      <div className="hero__facts hero-in" style={{ ["--i" as string]: 6 }}>
        <div className="hero__price">
          <span className="hero__price-label">Offered at</span>
          <span className="hero__price-value">{property.price}</span>
          {reduction ? (
            <span className="hero__price-was">
              <s>{property.previousPrice}</s> <em>Reduced {reduction}</em>
            </span>
          ) : null}
        </div>
        <ul className="hero__fact-list">
          {keyFacts(property).map((fact) => (
            <li key={fact.label}>
              <strong>{fact.value}</strong>
              <span>{fact.label}</span>
            </li>
          ))}
        </ul>
        <a className="hero__scroll" href="#overview" aria-label="Scroll to the residence">
          <span />
        </a>
      </div>
    </section>
  );
}
