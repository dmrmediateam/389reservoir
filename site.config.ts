import type { GalleryImage, SiteConfig } from "@/lib/types";

/* ==========================================================================
   389 Reservoir Rd, Quakertown, PA 18951 · Listed by Jeffrey Shauger, RE/MAX 440.

   Facts come from the agent's intake form (price, beds, baths, sq ft, year,
   description) and the Zillow public record (lot, pond, pool, garage, well,
   septic, heating, zoning). Photos are from Zillow; the interior shots there
   predate the renovation, so the gallery is exterior-only until new interior
   photography arrives. See LAUNCH.md.
   ========================================================================== */

const img = (file: string) => `/images/property/${file}.jpg`;

// Order is the order the lightbox walks through: the hero shots first, then the
// house, the grounds and pool, the pond through the seasons, then its wildlife.
const images: GalleryImage[] = [
  { src: img("01-z01"), label: "Fieldstone Farmhouse, Circa 1860", category: "The Home" },
  { src: img("52-z52"), label: "Across The Pond To The House", category: "The Pond" },
  { src: img("35-z35"), label: "In-Ground Pool", category: "Grounds" },
  { src: img("05-z05"), label: "Pond And Open Lawn", category: "The Pond" },
  { src: img("32-z32"), label: "Stone Outdoor Fireplace", category: "Grounds" },
  { src: img("41-z41"), label: "Front Elevation", category: "The Home" },
  { src: img("06-z06"), label: "Sunroom And Garden Side", category: "The Home" },
  { src: img("28-z28"), label: "Covered Front Porch", category: "The Home" },
  { src: img("02-z02"), label: "Porch View Over The Grounds", category: "The Home" },
  { src: img("07-z07"), label: "Garden Entry", category: "The Home" },
  { src: img("29-z29"), label: "Wing With Upper Balcony", category: "The Home" },
  { src: img("21-z21"), label: "Balcony Deck Along The Stone", category: "The Home" },
  { src: img("25-z25"), label: "Detached Garage", category: "The Home" },
  { src: img("31-z31"), label: "Screened Porch Over The Pool", category: "Grounds" },
  { src: img("34-z34"), label: "Pool And Diving Board", category: "Grounds" },
  { src: img("33-z33"), label: "Pool Through The Garden", category: "Grounds" },
  { src: img("36-z36"), label: "Landscaped Lawn", category: "Grounds" },
  { src: img("08-z08"), label: "Tree-Lined Lawn", category: "Grounds" },
  { src: img("40-z40"), label: "The House Across The Lawn", category: "Grounds" },
  { src: img("04-z04"), label: "Autumn Reflections", category: "The Pond" },
  { src: img("37-z37"), label: "Meadow At The Pond's Edge", category: "The Pond" },
  { src: img("38-z38"), label: "The Pond Through Fall Leaves", category: "The Pond" },
  { src: img("54-z54"), label: "Fall Color On The Water", category: "The Pond" },
  { src: img("55-z55"), label: "Still Water In October", category: "The Pond" },
  { src: img("56-z56"), label: "Pond Island In Spring", category: "The Pond" },
  { src: img("39-z39"), label: "Rainbow Over The Pond", category: "The Pond" },
  { src: img("03-z03"), label: "Deer And Geese At The Water", category: "Wildlife" },
  { src: img("46-z46"), label: "Goslings On The Pond", category: "Wildlife" },
  { src: img("50-z50"), label: "Great Blue Heron", category: "Wildlife" },
  { src: img("53-z53"), label: "Geese On The Autumn Lawn", category: "Wildlife" },
  { src: img("47-z47"), label: "Deer In Winter", category: "Wildlife" },
  { src: img("51-z51"), label: "Cardinals In Winter", category: "Wildlife" },
  { src: img("48-z48"), label: "Wild Turkeys Under The Magnolia", category: "Wildlife" },
];

export const site: SiteConfig = {
  // TODO: replace with the live domain before launch (see LAUNCH.md).
  siteUrl: "https://389-reservoir-rd.vercel.app",
  brand: {
    wordmark: "389 Reservoir",
    credit: { label: "A DMR Media Production", href: "https://dmrmedia.org" },
  },
  theme: {
    accent: "#c8a96e",
    accentInk: "#8f6b35",
    onAccent: "#17130b",
    ink: "#141412",
    canvas: "#0e0e0d",
    cream: "#f7f4ee",
    creamAlt: "#efebe2",
  },
  seo: {
    title: "389 Reservoir Rd · Circa 1860 Stone Estate · Quakertown, PA",
    description:
      "A renovated 1860 fieldstone estate in Bucks County with a private pond, in-ground pool and 15.75 acres: 3 bedrooms, 4 baths, 2,592 sq ft. Offered at $1,599,000.",
    ogImage: img("01-z01"),
    index: true,
  },
  tracking: {
    // gtmId: "GTM-XXXXXXX",
    // ga4Id: "G-XXXXXXXXXX",
    // googleAdsId: "AW-XXXXXXXXX",
    // googleAdsLeadLabel: "XXXXXXXXXXXX",
    // metaPixelId: "000000000000000",
    // clarityId: "xxxxxxxxxx",
  },
  property: {
    name: "389 Reservoir Road",
    street: "389 Reservoir Rd",
    city: "Quakertown",
    region: "PA",
    postalCode: "18951",
    neighborhood: "Bucks County",
    status: "Coming Soon",
    price: "$1,599,000",
    beds: 3,
    baths: 4,
    sqft: 2592,
    lotSize: "15.75 acres",
    yearBuilt: 1860,
    type: "Single-Family Residence",
  },
  agent: {
    name: "Jeffrey Shauger",
    title: "Listing Agent",
    brokerage: "RE/MAX 440",
    phoneDisplay: "(215) 872-8988",
    phone: "+12158728988",
    email: "jshauger@remax.net",
    photoSrc: "/images/agent/jeffrey-shauger.jpg",
    bio:
      "Jeff represents 389 Reservoir Road personally. Ask about the renovation, the grounds or the area and you will hear back from him directly.",
    highlights: [
      "Private previews by appointment before the home reaches the open market.",
      "Full feature list, renovation details and disclosures on request.",
    ],
  },
  nav: [
    { href: "#gallery", label: "Gallery" },
    { href: "#features", label: "Features" },
    { href: "#details", label: "Details" },
    { href: "#location", label: "Location" },
  ],
  navCta: { label: "Book a Preview", form: "showing", location: "navbar" },
  hero: {
    eyebrow: "Quakertown, Pennsylvania",
    titleLines: [{ text: "389 Reservoir" }, { text: "Road", italic: true }],
    subline: "Circa 1860 Stone Estate · Bucks County · Private Pond & Pool",
    lead:
      "An 1860 fieldstone farmhouse, renovated with custom finishes, on 15.75 acres with its own pond, pool and gardens.",
    imageSrc: img("01-z01"),
    // videoSrc: "/videos/hero.mp4",
    ctas: [
      { label: "Book a Private Preview", form: "showing", location: "hero" },
      { label: "Get Early Access", form: "request", location: "hero" },
    ],
  },
  marquee: [7, 13, 19, 26, 14, 23, 27, 10],
  overview: {
    eyebrow: "The Estate",
    titleLines: [{ text: "Historic stone," }, { text: "thoroughly renewed", italic: true }],
    lede:
      "389 Reservoir Road pairs the fieldstone walls of an 1860 Bucks County farmhouse with a renovation carried out to a custom-home standard.",
    body:
      "Dramatic exposed beams run through the house. The showpiece kitchen and great room anchor the main level, and the primary suite is finished to a luxury standard. Outside, the setting does the rest: a private pond, an in-ground pool beside a stone outdoor fireplace, a screened porch, a covered front porch, mature landscaping, sweeping lawns and a detached garage, all on 15.75 acres.",
    imageSrc: img("41-z41"),
    imageAlt: "Fieldstone front elevation with covered porch",
    stats: [
      { value: "2,592", label: "Interior Sq Ft", count: true },
      { value: "3", label: "Bedrooms", count: true },
      { value: "4", label: "Bathrooms", count: true },
      { value: "1860", label: "Built" },
    ],
    highlights: [
      {
        kicker: "01",
        title: "Original 1860 stone, new finishes",
        body: "Thick fieldstone walls and exposed beams, with a showpiece kitchen, great room and primary suite inside.",
      },
      {
        kicker: "02",
        title: "A pond of your own",
        body: "Herons, geese and deer at the water's edge, and fall color reflected across it every October.",
      },
      {
        kicker: "03",
        title: "Resort-style grounds",
        body: "Pool, stone fireplace, screened porch and 15.75 acres of lawn and gardens, with privacy on every side.",
      },
    ],
    cta: { label: "Get early access to the details", form: "request", location: "overview" },
  },
  gallery: {
    eyebrow: "The Gallery",
    titleLines: [{ text: "Four seasons" }, { text: "on fifteen acres", italic: true }],
    images,
    featured: [1, 5, 2, 4, 3],
  },
  amenities: {
    eyebrow: "Features",
    titleLines: [{ text: "Character and comfort," }, { text: "inside and out", italic: true }],
    body:
      "A historic stone house with the kitchen, suite and finish level of new custom construction, set within grounds that work as a private retreat.",
    items: [
      { label: "Private Pond", icon: "waterfront" },
      { label: "In-Ground Pool", icon: "pool" },
      { label: "Stone Outdoor Fireplace", icon: "fireplace" },
      { label: "Showpiece Kitchen", icon: "kitchen" },
      { label: "Luxury Primary Suite", icon: "spa" },
      { label: "Screened & Covered Porches", icon: "terrace" },
      { label: "Extensive Landscaping", icon: "garden" },
      { label: "15.75 Acres", icon: "views" },
      { label: "Detached Garage", icon: "garage" },
    ],
  },
  splits: [
    {
      eyebrow: "Outdoor Living",
      titleLines: [{ text: "A summer house" }, { text: "in your own backyard", italic: true }],
      body:
        "The pool sits below a stone outdoor fireplace and a screened porch, framed by low stone walls and gardens. Swim in the afternoon, then move to the fire as the evening cools.",
      imageSrc: img("35-z35"),
      imageAlt: "In-ground pool surrounded by gardens",
      cta: { label: "See all photos", href: "#gallery" },
      tone: "light",
    },
    {
      eyebrow: "The Pond",
      titleLines: [{ text: "Water at the" }, { text: "heart of the land", italic: true }],
      body:
        "A private pond with its own island, ringed by maples that turn red and gold each fall. It draws herons, geese and deer year-round, and the house looks out across it.",
      imageSrc: img("52-z52"),
      imageAlt: "The pond in autumn with the house beyond",
      cta: { label: "Book a private preview", form: "showing", location: "pond" },
      tone: "dark",
      reverse: true,
    },
  ],
  quote: {
    text: "A heron at dawn, a swim at noon, the fire lit by evening.",
    imageSrc: img("04-z04"),
    imageAlt: "Autumn trees reflected in the pond",
  },
  specs: {
    eyebrow: "At A Glance",
    titleLines: [{ text: "The details," }, { text: "all in one place", italic: true }],
    groups: [
      {
        title: "Interior",
        rows: [
          ["Bedrooms", "3"],
          ["Bathrooms", "4"],
          ["Living area", "2,592 sq ft"],
          ["Stories", "2"],
          ["Kitchen", "Custom showpiece kitchen"],
          ["Character", "Exposed beams, original stone"],
        ],
      },
      {
        title: "Exterior & Lot",
        rows: [
          ["Property type", "Single-family, detached"],
          ["Year built", "1860"],
          ["Lot", "15.75 acres"],
          ["Water", "Private pond"],
          ["Pool", "In-ground"],
          ["Garage", "Detached, off-street parking"],
        ],
      },
      {
        title: "Financials",
        rows: [
          ["List price", "$1,599,000"],
          ["Taxes", "Ask agent"],
          ["Utilities", "Well water, septic"],
          ["Zoning", "36RA"],
          ["Status", "Coming soon"],
          ["Showings", "By appointment"],
        ],
      },
    ],
    note: "All information deemed reliable but not guaranteed. Lot size and utilities per public record. Buyers should verify all details independently.",
    cta: { label: "Request the full feature list", form: "request", location: "specs" },
  },
  location: {
    eyebrow: "Location",
    titleLines: [{ text: "Country quiet," }, { text: "city within reach", italic: true }],
    body:
      "Set in the countryside outside Quakertown, the estate feels far removed while staying within driving distance of the Lehigh Valley, Philadelphia and New York. It suits a full-time home or a weekend retreat from Manhattan or North Jersey.",
    mapQuery: "389 Reservoir Rd, Quakertown, PA 18951",
    distances: [
      { value: "~30 min", label: "Allentown" },
      { value: "~1 hr", label: "Philadelphia" },
      { value: "~1 hr 45", label: "Manhattan" },
    ],
    nearby: [
      "Lake Nockamixon State Park",
      "Downtown Quakertown",
      "Doylestown dining & museums",
      "New Hope & the Delaware River",
    ],
  },
  enquire: {
    eyebrow: "Next Steps",
    titleLines: [{ text: "See it before" }, { text: "it goes public", italic: true }],
    body:
      "389 Reservoir Road is coming soon. Book a private preview, or request the full details and be among the first to know when it is officially listed.",
  },
  finalCta: {
    titleLines: [{ text: "Take the" }, { text: "next step", italic: true }],
    body: "Private previews are booking now. Jeff confirms most requests the same day.",
  },
  forms: {
    request: {
      label: "Details request",
      eyebrow: "Early Access",
      title: "Get the details before it's listed",
      body: "The full feature list, renovation details and offering information, sent straight to your inbox.",
      questions: [
        {
          kind: "choice",
          name: "timeline",
          label: "Timeline",
          question: "When are you looking to buy?",
          options: [
            { label: "Ready now" },
            { label: "Within 3 months" },
            { label: "3–6 months" },
            { label: "Just browsing", disqualifies: true },
          ],
        },
        {
          kind: "choice",
          name: "financing",
          label: "Financing",
          question: "How are you planning to purchase?",
          options: [
            { label: "Paying cash" },
            { label: "Pre-approved" },
            { label: "Working on pre-approval" },
            { label: "Not started yet", disqualifies: true },
          ],
        },
      ],
      contactQuestion: "Where should we send the details?",
      requirePhone: true,
      messagePlaceholder: "Primary home or weekend retreat? Anything you'd like to know? (optional)",
      submitLabel: "Send Me The Details",
      successTitle: "Your details are on the way",
      successBody:
        "Thank you. The details will be in your inbox shortly, and Jeff will follow up personally with preview times.",
      conversionValue: 60,
    },
    showing: {
      label: "Preview request",
      eyebrow: "Private Preview",
      title: "See the estate in person",
      body: "Pick a day that works and Jeff will confirm an exact time, usually the same day.",
      questions: [
        {
          kind: "schedule",
          name: "preferredTime",
          label: "Preferred time",
          question: "When would you like to visit?",
          days: 7,
          times: ["Morning", "Afternoon", "Evening"],
        },
        {
          kind: "choice",
          name: "agentStatus",
          label: "Working with an agent",
          question: "Are you working with a buyer's agent?",
          options: [{ label: "No, not yet" }, { label: "Yes, I have an agent" }, { label: "I am an agent" }],
        },
      ],
      contactQuestion: "Where can we reach you to confirm?",
      requirePhone: true,
      messagePlaceholder: "Questions before the visit? (optional)",
      submitLabel: "Request My Preview",
      successTitle: "Your preview request is in",
      successBody:
        "Thank you. Jeff will reach out shortly to confirm your time. If it's urgent, call or text him directly.",
      conversionValue: 100,
    },
  },
  footer: {
    disclosures: [
      "Equal Housing Opportunity. All information deemed reliable but not guaranteed. Buyers are advised to verify all details independently.",
      "Listing courtesy of Jeffrey Shauger, RE/MAX 440. Each office independently owned and operated.",
      "Lot size, utilities and zoning per public record. Some photographs may predate recent renovations.",
    ],
  },
};
