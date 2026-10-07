# 389 Reservoir Rd: launch checklist

Property page for 389 Reservoir Rd, Quakertown, PA 18951, listed by Jeffrey Shauger, RE/MAX 440.
Built from property template `343b154`.

## Sources

- **Jeff's intake form (Typeform, Sep 30 2026):** price $1,599,000, 3 beds, 4 baths, 2,592 sq ft,
  built 1860, Coming Soon, the description copy, and the target buyers (local second-home buyers
  plus Manhattan, NYC and North Jersey).
- **Zillow (zpid 9087527), public record:** 15.75 acres, pond, in-ground pool, detached garage,
  2 stories, well and septic, zoning 36RA, plus all photos.

## Confirm with Jeff before launch

1. **Bathrooms.** The form says 4; Zillow's public record says 3 (2 full + 1 half). The page
   shows **4**. Confirm the full/half split. If there are half baths, set `property.halfBaths`
   and update the specs row.
2. **Lot size of 15.75 acres** (public record) is used in the hero, the overview and the SEO description.
3. **Utilities** (well and septic) and **zoning 36RA** come from public record. Zillow also lists
   oil/hot-water heat and window-unit A/C, which I left off because the renovation may have changed them.
4. **MLS #**: none yet (Coming Soon). Add `property.mlsNumber` once it's live, and change
   `status` to "Just Listed".
5. **Taxes** show "Ask agent". Add the annual figure if Jeff wants it shown.
6. **Drive times** are approximate (Allentown ~30 min, Philadelphia ~1 hr, Manhattan ~1 hr 45).
   Adjust if Jeff prefers different ones.
7. **Agent license line** is not shown. Add `agent.license` if RE/MAX requires it.

## Photos: the main gap

- Zillow's photos are from an **older listing** and max out at **1024px** wide, so they look soft
  on large screens. Several carry a small **Bright MLS** watermark in the corner.
- Zillow's **interior photos predate the renovation** (wood paneling, a dated kitchen with white
  appliances, carpet). They contradict the "showpiece kitchen / luxury primary suite" copy, so
  they are **not on the page**. The gallery is 33 exterior, pond, grounds and wildlife shots.
  The excluded files are in `_intake/unused-property-images/`.
- **Needed from Jeff:** the current professional shoot, full resolution, especially the kitchen,
  great room, primary suite and baths. Then run `npm run images -- "<folder>"`, add Interior
  photos to the gallery, and repoint `overview.imageSrc` (best living space) and `splits[1]`
  (kitchen) to interiors.
- A drone or twilight hero shot and a short hero video (`hero.videoSrc`) would also help.

## Vercel environment variables

| Var | Value |
| --- | --- |
| `SENDGRID_API_KEY` | DMR SendGrid key |
| `SENDGRID_FROM_EMAIL` | verified sender |
| `LEAD_NOTIFY_EMAIL` | `jshauger@remax.net,` + the DMR inbox |
| `LEAD_AUTORESPONDER` | `1` (optional) |
| `LEAD_WEBHOOK_URL` | optional (CRM / Zapier) |
| `TWILIO_*` | optional SMS speed-to-lead to (215) 872-8988 |

## Domain

`siteUrl` is the placeholder `https://389-reservoir-rd.vercel.app`. Set the real domain in
`site.config.ts` once it's chosen (it's used in the lead emails, the OG tags and the sitemap).

## Tracking (all still needed)

GTM, GA4, Google Ads ID + lead conversion label, Meta pixel, Clarity. Fill in `tracking` in
`site.config.ts`.

## Ad deep links

- `/#tour`: opens the private preview form
- `/#details`: opens the early-access details form
- `/#gallery`, `/#location`: section anchors

Targeting from the intake: second-home buyers in Manhattan, NYC and North Jersey, plus local
Bucks and Lehigh Valley buyers. Suggested additions: the Philadelphia Main Line and Princeton/Mercer
County (similar commute, the same "country weekend" buyer).
