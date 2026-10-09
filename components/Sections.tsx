import Image from "next/image";
import { site } from "@/site.config";
import { fullAddress, priceReduction, telHref } from "@/lib/format";
import { CtaLink, Icon, MailIcon, PhoneIcon, Title } from "@/components/ui";
import LeadForm from "@/components/LeadForm";

/* ==========================================================================
   The page's static sections. All server-rendered; motion is opted into with
   data-reveal / data-stagger / data-parallax / data-count (see Motion.tsx),
   and lead forms open through data-open-lead-form (see LeadModal.tsx).
   ========================================================================== */

export function Marquee() {
  const items = site.marquee.map((index) => ({ ...site.gallery.images[index], index })).filter((i) => i.src);
  if (!items.length) return null;
  // Rendered twice so the -50% loop is seamless.
  const loop = [...items, ...items];
  return (
    <section className="marquee" aria-label="Photo highlights">
      <div className="marquee__track">
        {loop.map((item, i) => (
          <button
            key={`${item.src}-${i}`}
            type="button"
            className="marquee__item"
            data-open-gallery={item.index}
            aria-label={`Open photo: ${item.label}`}
            tabIndex={i >= items.length ? -1 : undefined}
            aria-hidden={i >= items.length ? true : undefined}
          >
            <Image src={item.src} alt="" fill sizes="(max-width: 768px) 60vw, 22vw" className="marquee__image" />
          </button>
        ))}
      </div>
    </section>
  );
}

export function Overview() {
  const { overview } = site;
  return (
    <section className="overview light" id="overview">
      <div className="container">
        <div className="overview__intro" data-reveal="up">
          <p className="eyebrow">{overview.eyebrow}</p>
          <h2 className="display">
            <Title lines={overview.titleLines} />
          </h2>
          <p className="overview__lede">{overview.lede}</p>
        </div>

        <div className="overview__grid">
          <div className="overview__media" data-reveal="clip">
            <div className="parallax" data-parallax="0.08">
              <Image src={overview.imageSrc} alt={overview.imageAlt} fill sizes="(max-width: 900px) 100vw, 55vw" />
            </div>
          </div>
          <div className="overview__copy" data-reveal="up">
            <p className="body-text">{overview.body}</p>
            <dl className="overview__stats">
              {overview.stats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd {...(stat.count ? { "data-count": "" } : {})}>{stat.value}</dd>
                </div>
              ))}
            </dl>
            <CtaLink cta={overview.cta} className="link-arrow" arrow />
          </div>
        </div>

        <div className="overview__highlights" data-stagger>
          {overview.highlights.map((h) => (
            <article key={h.title} className="highlight">
              <span className="highlight__kicker">{h.kicker}</span>
              <h3>{h.title}</h3>
              <p>{h.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Amenities() {
  const { amenities } = site;
  return (
    <section className="amenities light" id="features">
      <div className="container amenities__inner">
        <div className="amenities__intro" data-reveal="up">
          <p className="eyebrow">{amenities.eyebrow}</p>
          <h2 className="display">
            <Title lines={amenities.titleLines} />
          </h2>
          <p className="body-text">{amenities.body}</p>
        </div>
        <ul className="amenities__grid" data-stagger>
          {amenities.items.map((item) => (
            <li key={item.label} className="amenity">
              <span className="amenity__icon">
                <Icon name={item.icon} />
              </span>
              <span className="amenity__label">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Splits() {
  return (
    <>
      {site.splits.map((split) => (
        <section
          key={split.imageSrc}
          className={`split split--${split.tone}${split.tone === "light" ? " light" : ""}${
            split.reverse ? " split--reverse" : ""
          }`}
        >
          <div className="split__media" data-reveal="clip">
            <div className="parallax" data-parallax="0.1">
              <Image src={split.imageSrc} alt={split.imageAlt} fill sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
          </div>
          <div className="split__content">
            <div className="split__inner" data-reveal="up">
              <p className="eyebrow">{split.eyebrow}</p>
              <h2 className="display">
                <Title lines={split.titleLines} />
              </h2>
              <p className="body-text">{split.body}</p>
              <CtaLink cta={split.cta} className="link-arrow" arrow />
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

export function Quote() {
  if (!site.quote) return null;
  const { quote } = site;
  return (
    <section className="quote" aria-label="Quote">
      <div className="quote__media parallax" data-parallax="0.18" aria-hidden="true">
        <Image src={quote.imageSrc} alt="" fill sizes="100vw" />
      </div>
      <div className="quote__shade" />
      <blockquote className="quote__text" data-reveal="fade">
        <span className="quote__mark" aria-hidden="true">“</span>
        {quote.text}
      </blockquote>
    </section>
  );
}

export function Specs() {
  const { specs, property } = site;
  const reduction = priceReduction(property.previousPrice, property.price);
  return (
    <section className="specs light" id="details">
      <div className="container">
        <div className="specs__head" data-reveal="up">
          <div>
            <p className="eyebrow">{specs.eyebrow}</p>
            <h2 className="display">
              <Title lines={specs.titleLines} />
            </h2>
          </div>
          <div className="specs__price">
            <span>{property.status ?? "Offered at"}</span>
            <strong>{property.price}</strong>
            {reduction ? (
              <em>
                <s>{property.previousPrice}</s> · Reduced {reduction}
              </em>
            ) : null}
          </div>
        </div>

        <div className="specs__grid" data-stagger>
          {specs.groups.map((group) => (
            <div key={group.title} className="specs__group">
              <h3>{group.title}</h3>
              <dl>
                {group.rows.map(([label, value]) => (
                  <div key={label} className="specs__row">
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div className="specs__foot" data-reveal="fade">
          {specs.note ? <p className="specs__note">{specs.note}</p> : <span />}
          <CtaLink cta={specs.cta} className="btn btn--ink" arrow />
        </div>
      </div>
    </section>
  );
}

export function Investment() {
  if (!site.investment) return null;
  const { investment } = site;
  return (
    <section className="investment">
      <div className="container">
        <div className="investment__head" data-reveal="up">
          <p className="eyebrow">{investment.eyebrow}</p>
          <h2 className="display display--center">
            <Title lines={investment.titleLines} />
          </h2>
        </div>
        <div className="investment__grid" data-stagger>
          {investment.stats.map((stat) => (
            <article key={stat.label} className="stat-card">
              <p className="stat-card__value" {...(stat.count ? { "data-count": "" } : {})}>
                {stat.value}
              </p>
              <h3 className="stat-card__label">{stat.label}</h3>
              {stat.body ? <p className="stat-card__body">{stat.body}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Location() {
  const { location, property } = site;
  const address = fullAddress(property);
  const query = encodeURIComponent(location.mapQuery ?? address);
  return (
    <section className="location light" id="location">
      <div className="container location__inner">
        <div className="location__copy" data-reveal="up">
          <p className="eyebrow">{location.eyebrow}</p>
          <h2 className="display">
            <Title lines={location.titleLines} />
          </h2>
          <p className="body-text">{location.body}</p>
          <ul className="location__nearby">
            {location.nearby.map((place) => (
              <li key={place}>{place}</li>
            ))}
          </ul>
          <a
            className="link-arrow"
            href={`https://www.google.com/maps/search/?api=1&query=${query}`}
            target="_blank"
            rel="noreferrer"
          >
            <span>Open in Maps</span>
          </a>
        </div>
        <div className="location__map" data-reveal="scale">
          <iframe
            title={`Map of ${property.name}`}
            src={`https://www.google.com/maps?q=${query}&z=13&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <ul className="location__chips">
            {location.distances.map((d) => (
              <li key={d.label}>
                <strong>{d.value}</strong>
                <span>{d.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Enquire() {
  const { enquire, agent } = site;
  const initials = agent.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
  return (
    <section className="enquire light" id="enquire">
      <div className="container enquire__inner">
        <div className="enquire__side" data-reveal="up">
          <p className="eyebrow">{enquire.eyebrow}</p>
          <h2 className="display">
            <Title lines={enquire.titleLines} />
          </h2>
          <p className="body-text">{enquire.body}</p>

          <article className="agent">
            <div className="agent__photo">
              {agent.photoSrc ? (
                <Image src={agent.photoSrc} alt={agent.name} fill sizes="96px" />
              ) : (
                <span aria-hidden="true">{initials}</span>
              )}
            </div>
            <div className="agent__meta">
              <p className="agent__role">{agent.title}</p>
              <h3 className="agent__name">{agent.name}</h3>
              <p className="agent__brokerage">
                {agent.brokerage}
                {agent.license ? ` · ${agent.license}` : ""}
              </p>
            </div>
            <p className="agent__bio">{agent.bio}</p>
            <ul className="agent__points">
              {agent.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <div className="agent__contact">
              <a className="btn btn--outline" href={telHref(agent.phone)} data-location="agent-card">
                <PhoneIcon />
                <span>{agent.phoneDisplay}</span>
              </a>
              <a className="btn btn--outline" href={`mailto:${agent.email}`} data-location="agent-card">
                <MailIcon />
                <span>Email</span>
              </a>
            </div>
          </article>
        </div>

        <div className="enquire__form" data-reveal="up">
          <LeadForm formKey="request" variant="inline" location="enquire-section" />
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  if (!site.finalCta) return null;
  const { finalCta, forms } = site;
  return (
    <section className="final-cta">
      <div className="container">
        <h2 className="display display--center" data-reveal="up">
          <Title lines={finalCta.titleLines} />
        </h2>
        <p className="final-cta__body" data-reveal="fade">
          {finalCta.body}
        </p>
        <div className="final-cta__cards" data-stagger>
          {(["showing", "request"] as const).map((key) => (
            <a
              key={key}
              href="#enquire"
              className="glass-card"
              data-open-lead-form={key}
              data-location="final-cta"
            >
              <span className="glass-card__eyebrow">{forms[key].eyebrow}</span>
              <span className="glass-card__title">{key === "showing" ? "Schedule a Showing" : "Request Details"}</span>
              <span className="glass-card__body">{forms[key].body}</span>
              <span className="glass-card__arrow" aria-hidden="true">
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { property, agent, brand, footer } = site;
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <p className="footer__wordmark">{brand.wordmark}</p>
            <p className="footer__address">{fullAddress(property)}</p>
          </div>
          <nav className="footer__nav" aria-label="Footer">
            {site.nav.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="footer__contact">
            <p>{agent.name}</p>
            <a href={telHref(agent.phone)} data-location="footer">
              {agent.phoneDisplay}
            </a>
            <a href={`mailto:${agent.email}`} data-location="footer">
              {agent.email}
            </a>
          </div>
        </div>
        <div className="footer__legal">
          {property.mlsNumber ? <p>MLS #{property.mlsNumber}</p> : null}
          {footer.disclosures.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} {property.name}
          </p>
          {brand.credit ? (
            <a href={brand.credit.href} target="_blank" rel="noreferrer">
              {brand.credit.label}
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
