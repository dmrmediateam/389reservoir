import type { SiteConfig } from "@/lib/types";

const toNumber = (price?: string) => Number((price ?? "").replace(/[^\d.]/g, "")) || 0;

/** "$39,500" when previousPrice is set and higher than price, else null. */
export function priceReduction(previous: string | undefined, current: string): string | null {
  const before = toNumber(previous);
  const now = toNumber(current);
  if (!before || !now || before <= now) return null;
  return `$${(before - now).toLocaleString("en-US")}`;
}

export function fullAddress(p: SiteConfig["property"]): string {
  return `${p.street}, ${p.city}, ${p.region} ${p.postalCode}`;
}

export function bathsLabel(p: SiteConfig["property"]): string {
  return p.halfBaths ? `${p.baths}.${p.halfBaths > 1 ? p.halfBaths : 5}` : String(p.baths);
}

/** The four numbers every buyer scans for first, in the order they scan them. */
export function keyFacts(p: SiteConfig["property"]) {
  return [
    { value: String(p.beds), label: p.beds === 1 ? "Bed" : "Beds" },
    { value: bathsLabel(p), label: "Baths" },
    { value: p.sqft.toLocaleString("en-US"), label: "Sq Ft" },
    { value: String(p.yearBuilt), label: "Built" },
  ];
}

export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, "")}`;
