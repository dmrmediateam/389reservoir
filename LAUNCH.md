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

Rule: where sources disagree, the page follows Jeff's Typeform. Zillow only fills gaps the
Typeform doesn't cover.

1. **Bathrooms: settled at 4, per Jeff's Typeform.** (Zillow's older public record says 3; the
   Typeform wins on any conflict.) Optionally ask for the full/half split to show in the specs.
2. **Lot size of 15.75 acres** (public record) is used in the hero, the overview and the SEO description.
3. **Utilities** (well and septic) and **zoning 36RA** come from public record. Zillow also lists
   oil/hot-water heat and window-unit A/C, which I left off because the renovation may have changed them.
4. **MLS #**: none yet (Coming Soon). Add `property.mlsNumber` once it's live, and change
   `status` to "Just Listed".
5. **Taxes** show "Ask agent". Add the annual figure if Jeff wants it shown.
6. **Drive times** are approximate (Allentown ~30 min, Philadelphia ~1 hr, Manhattan ~1 hr 45).
   Adjust if Jeff prefers different ones.
7. **Agent license line** is not shown. Add `agent.license` if RE/MAX requires it.

## Photos

- **Jeff's renovation shoot** (`Jeff Creatives/`, 20 photos) leads the page: hero, overview, the gallery
  mosaic and the first 20 gallery slots. Optimized copies with descriptive names are in
  `public/images/jeff/`.
- Three of the shots are named "GPT" in Jeff's folder (house front, driveway, garage). Cleared for
  use (Oct 9 2026). The house front is the hero and OG image.
- **Slideshow under the hero** (`marquee` in `site.config.ts`) follows Jeff's order, by his MLS photo
  numbers: House Front, 73, 63, 41, 45, 49, 52, 59, 30, 37, New Batch #5, 71, 2, 69, 11, 17, 20, 4,
  Pool GPT, Pond View from house, 105, 103. **Still needed from Jeff:** 73, 63, 45, 49, 52, 59, 71, 69,
  105, 103, "New Batch #5", "Pool GPT", "Pond View from house", plus the attached "2" and "4" (confirm
  whether those are MLS-2 and MLS-4). Optimize them with `npm run images`, add them to the gallery,
  then slot their gallery indexes into `marquee` in that order.
- The older **Zillow set** (exteriors, pool, pond through the seasons, wildlife) follows Jeff's
  shoot in the gallery. Those photos max out at 1024px and some carry a small Bright MLS watermark.
  Zillow's pre-renovation interiors stay off the page (`_intake/unused-property-images/`).
- Extra shots MLS-90 (workshop), 110 (pond from above) and 111 (boat at the pond) were added Oct 9.
  110 is now the pond split photo and the last mosaic tile; 110 and 111 close the slideshow (they
  aren't on Jeff's list, so move them if his order should be exact). The pool split still uses a
  Zillow photo until "Pool GPT" arrives. A drone shot and a short hero video (`hero.videoSrc`) would also help.

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

`siteUrl` is the live Vercel address, `https://389reservoir.vercel.app`. If a custom domain is
added, update it in `site.config.ts` (it's used in the lead emails, the OG tags and the sitemap).

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
