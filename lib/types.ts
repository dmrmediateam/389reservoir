/* ==========================================================================
   The shape of one property page.

   Everything a client page says lives in `site.config.ts` and is typed here.
   Components never hard-code listing copy, so a new property is a new config
   file plus photos, never a component edit.
   ========================================================================== */

export type FormKey = "request" | "showing";

/** A call to action. `form` opens that lead form; otherwise `href` is followed. */
export type Cta = {
  label: string;
  href?: string;
  form?: FormKey;
  /** Where on the page this sits, sent with the analytics event. */
  location?: string;
};

export type TitleLine = { text: string; italic?: boolean };

export type AmenityIcon =
  | "pool"
  | "waterfront"
  | "dock"
  | "views"
  | "kitchen"
  | "wine"
  | "spa"
  | "fitness"
  | "fireplace"
  | "terrace"
  | "garden"
  | "garage"
  | "parking"
  | "smart-home"
  | "security"
  | "floorplan"
  | "elevator"
  | "laundry"
  | "office"
  | "community"
  | "sun"
  | "pet";

export type GalleryImage = {
  src: string;
  label: string;
  /** Lightbox filter chip this photo belongs to, e.g. "Interior". */
  category?: string;
  alt?: string;
};

export type Stat = {
  value: string;
  label: string;
  body?: string;
  /** Count the number up from zero when it scrolls into view. */
  count?: boolean;
};

export type ChoiceOption = {
  label: string;
  /** Picking this marks the lead not qualified (email still sent, no SMS). */
  disqualifies?: boolean;
};

export type FormQuestion =
  | {
      kind: "choice";
      /** Payload field the answer is sent as, e.g. "timeline". */
      name: string;
      /** Label used in the agent email, e.g. "Timeline". */
      label: string;
      question: string;
      options: ChoiceOption[];
    }
  | {
      /** Next N days plus a time-of-day row, for booking a showing. */
      kind: "schedule";
      name: string;
      label: string;
      question: string;
      days: number;
      times: string[];
    };

export type LeadFormConfig = {
  /** Shown in the agent email header and subject, e.g. "Tour request". */
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  questions: FormQuestion[];
  contactQuestion: string;
  /** Speed-to-lead runs on the phone. Leave on unless a client insists. */
  requirePhone: boolean;
  messagePlaceholder?: string;
  submitLabel: string;
  successTitle: string;
  successBody: string;
  /** Relative weight sent to ad platforms so bidding favours the better form. */
  conversionValue: number;
};

export type SiteConfig = {
  /** Production origin, no trailing slash. Used for email links and SEO. */
  siteUrl: string;
  brand: {
    /** Short wordmark shown in the nav when there is no logo file. */
    wordmark: string;
    logoSrc?: string;
    /** "A DMR Media Production" style credit in the footer. */
    credit?: { label: string; href: string };
  };
  /**
   * Colour tokens. Swap `accent` per client and the page re-themes; `accentInk`
   * is a darker shade of it that stays readable on the cream sections.
   */
  theme: {
    accent: string;
    accentInk: string;
    /** Text on accent-filled buttons: dark for light accents, white for deep ones. */
    onAccent?: string;
    ink: string;
    canvas: string;
    cream: string;
    creamAlt: string;
  };
  seo: {
    title: string;
    description: string;
    ogImage: string;
    /** Ad landing pages are sometimes kept out of organic search. */
    index: boolean;
  };
  tracking: {
    gtmId?: string;
    ga4Id?: string;
    googleAdsId?: string;
    /** Google Ads conversion label for a submitted lead, e.g. "AbC-dEfGhI". */
    googleAdsLeadLabel?: string;
    metaPixelId?: string;
    clarityId?: string;
  };
  property: {
    name: string;
    street: string;
    city: string;
    region: string;
    postalCode: string;
    neighborhood: string;
    /** Short badge over the hero, e.g. "Just Listed" or "Price Improved". */
    status?: string;
    price: string;
    /** Set after a reduction to show the old price struck through. */
    previousPrice?: string;
    beds: number;
    baths: number;
    halfBaths?: number;
    sqft: number;
    lotSize?: string;
    yearBuilt: number;
    type: string;
    mlsNumber?: string;
  };
  agent: {
    name: string;
    title: string;
    brokerage: string;
    license?: string;
    phoneDisplay: string;
    /** E.164, e.g. +17165550100 */
    phone: string;
    email: string;
    photoSrc?: string;
    bio: string;
    highlights: string[];
  };
  nav: { href: string; label: string }[];
  navCta: Cta;
  hero: {
    eyebrow: string;
    titleLines: TitleLine[];
    subline: string;
    lead: string;
    imageSrc: string;
    /** Optional looping background video; the image is its poster. */
    videoSrc?: string;
    ctas: [Cta, Cta?];
  };
  /** Gallery indexes shown in the auto-scrolling strip under the hero. */
  marquee: number[];
  overview: {
    eyebrow: string;
    titleLines: TitleLine[];
    lede: string;
    body: string;
    imageSrc: string;
    imageAlt: string;
    stats: Stat[];
    highlights: { kicker: string; title: string; body: string }[];
    cta: Cta;
  };
  gallery: {
    eyebrow: string;
    titleLines: TitleLine[];
    images: GalleryImage[];
    /** Five gallery indexes for the mosaic; the first is the large tile. */
    featured: [number, number, number, number, number];
  };
  amenities: {
    eyebrow: string;
    titleLines: TitleLine[];
    body: string;
    items: { label: string; icon: AmenityIcon }[];
  };
  splits: {
    eyebrow: string;
    titleLines: TitleLine[];
    body: string;
    imageSrc: string;
    imageAlt: string;
    cta: Cta;
    tone: "light" | "dark";
    reverse?: boolean;
  }[];
  quote?: { text: string; imageSrc: string; imageAlt: string };
  specs: {
    eyebrow: string;
    titleLines: TitleLine[];
    groups: { title: string; rows: [string, string][] }[];
    note?: string;
    cta: Cta;
  };
  investment?: {
    eyebrow: string;
    titleLines: TitleLine[];
    stats: Stat[];
  };
  location: {
    eyebrow: string;
    titleLines: TitleLine[];
    body: string;
    /** Overrides the address for the map pin, e.g. when the street is private. */
    mapQuery?: string;
    distances: { value: string; label: string }[];
    nearby: string[];
  };
  enquire: {
    eyebrow: string;
    titleLines: TitleLine[];
    body: string;
  };
  /** Closing band with two form cards. Leave out for a page that ends on the enquiry section. */
  finalCta?: {
    titleLines: TitleLine[];
    body: string;
  };
  forms: Record<FormKey, LeadFormConfig>;
  footer: {
    disclosures: string[];
  };
};
