import { site } from "@/site.config";
import { fullAddress } from "@/lib/format";
import Motion from "@/components/Motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import LeadModal from "@/components/LeadModal";
import StickyCta from "@/components/StickyCta";
import {
  Amenities,
  Enquire,
  FinalCta,
  Footer,
  Investment,
  Location,
  Marquee,
  Overview,
  Quote,
  Specs,
  Splits,
} from "@/components/Sections";

/** Listing structured data, so search and AI results show price and specs. */
function listingJsonLd() {
  const { property, agent } = site;
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.name,
    description: site.seo.description,
    url: site.siteUrl,
    image: site.gallery.images.slice(0, 6).map((i) => `${site.siteUrl}${i.src}`),
    offers: {
      "@type": "Offer",
      price: property.price.replace(/[^\d.]/g, ""),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    about: {
      "@type": "Residence",
      address: {
        "@type": "PostalAddress",
        streetAddress: property.street,
        addressLocality: property.city,
        addressRegion: property.region,
        postalCode: property.postalCode,
        addressCountry: "US",
      },
      numberOfRooms: property.beds,
      numberOfBathroomsTotal: property.baths,
      floorSize: { "@type": "QuantitativeValue", value: property.sqft, unitCode: "FTK" },
      yearBuilt: property.yearBuilt,
    },
    provider: {
      "@type": "RealEstateAgent",
      name: agent.name,
      telephone: agent.phone,
      email: agent.email,
      worksFor: agent.brokerage,
    },
    contentLocation: fullAddress(property),
  };
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingJsonLd()).replace(/</g, "\\u003c") }}
      />
      <Motion />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Overview />
        <Gallery />
        <Amenities />
        <Splits />
        <Quote />
        <Specs />
        <Investment />
        <Location />
        <Enquire />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
      <LeadModal />
    </>
  );
}
