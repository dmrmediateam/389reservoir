import Image from "next/image";
import { site } from "@/site.config";
import { keyFacts, priceReduction } from "@/lib/format";
import { CtaLink } from "@/components/ui";
import HeroVideo from "@/components/HeroVideo";

/* Full-bleed photo with the copy set low on the left, the same layout as the
   20 Tuscarora page: address, subline, price, key facts, lead, then the CTAs. */
export default function Hero() {
  const { hero, property } = site;
  const reduction = priceReduction(property.previousPrice, property.price);
  const [primary, secondary] = hero.ctas;
  const facts = keyFacts(property).map((f) => (f.label === "Built" ? `Built ${f.value}` : `${f.value} ${f.label}`));

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
            {hero.eyebrow}
          </p>
          <h1 className="hero__title hero-in" style={{ ["--i" as string]: 1 }}>
            {hero.titleLines.map((line, i) => (
              <span key={i} className={`hero__title-line${line.italic ? " hero__title-line--italic" : ""}`}>
                {line.text}
              </span>
            ))}
          </h1>
          <p className="hero__subline hero-in" style={{ ["--i" as string]: 2 }}>
            {hero.subline}
          </p>
          <div className="hero__price hero-in" style={{ ["--i" as string]: 3 }}>
            <p className="hero__price-label">Offered at</p>
            <p className="hero__price-value">{property.price}</p>
            {reduction || property.status ? (
              <p className="hero__price-tags">
                {reduction ? <s>{property.previousPrice}</s> : null}
                <span className="hero__badge">{reduction ? `Reduced ${reduction}` : property.status}</span>
              </p>
            ) : null}
            <p className="hero__price-meta">{facts.join(" · ")}</p>
          </div>
          <p className="hero__lead hero-in" style={{ ["--i" as string]: 4 }}>
            {hero.lead}
          </p>
          <div className="hero__ctas hero-in" style={{ ["--i" as string]: 5 }}>
            <CtaLink cta={primary} className="btn btn--white" />
            {secondary ? <CtaLink cta={secondary} className="btn btn--ghost" /> : null}
          </div>
        </div>

        <a className="hero__scroll" href="#overview" aria-label="Scroll to the residence">
          <span className="hero__scroll-line" />
          <span className="hero__scroll-text">Scroll</span>
        </a>
      </div>
    </section>
  );
}
