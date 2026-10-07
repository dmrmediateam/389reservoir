# Property Marketing Template

DMR Media's single-property ad landing page. It combines the luxury look of Ocean Breeze (dark canvas, champagne-gold accent, cinematic motion) with the practical parts of 20 Tuscarora (fast facts, a spec sheet, two-step lead forms, and a sticky mobile CTA). Leads use the same SendGrid notification email as the Carole Tierney and Alexa Devaney sites.

The sample content describes a fictional property ("48 Shoreline Drive"), and the photos are sample media. Replace both for every client.

## Launch a new property

**The usual way:** open Claude Code in an empty folder and run `/property-page`. The skill copies this template into the folder, reviews the photos, fills in `site.config.ts` from whatever you give it (listing details, agent info, logo, brand color), then builds and checks the page. The manual steps below are what it automates.

Every project is its own independent copy. Edit it freely. Changes that should benefit all future projects belong here in the template (see "Updating the base" below).

1. **Copy the repo** to a new client folder and run `npm install`.
2. **Photos:** `npm run images -- "/path/to/Photographer Export"`. This writes optimized 2000px JPEGs to `public/images/property/`. Then `npm run contact-sheet` writes numbered overview sheets to `.contact-sheet/`, so you can review the whole shoot at once when labelling and choosing the hero.
3. **Edit `site.config.ts`.** It's the only file you need to change:
   - `theme.accent` / `accentInk` / `onAccent`: one hex value re-themes the whole page. `accentInk` is a darker shade of the accent, used for text on cream. `onAccent` is the button text color: dark for light accents, `#ffffff` for deep ones.
   - `property`, `agent`, `hero`, `overview`, `gallery.images` (with `category` for the lightbox filters), `amenities`, `splits`, `specs`, `location`
   - `investment` and `quote` are optional; delete either one to hide its section.
   - `forms`: the step-1 qualifying questions. Mark an option `disqualifies: true` and those leads are tagged `[DQ]` and never text the agent.
   - `tracking`: GTM / GA4 / Google Ads / Meta pixel / Clarity IDs. Tags load only when an ID is set.
   - `siteUrl`: the production domain. Email images and SEO links depend on it.
4. **Optional hero video:** drop an MP4 in `public/videos/` and set `hero.videoSrc`. The photo stays as the poster. Video is skipped on data-saver connections and for visitors who prefer reduced motion.
5. **Env vars** (Vercel → Settings → Environment Variables). Copy `.env.example`:
   - `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL` (must be a verified sender), `LEAD_NOTIFY_EMAIL` (put the agent and the DMR inbox here, comma-separated)
   - `LEAD_AUTORESPONDER=1` sends the lead an instant confirmation, signed by the agent, with a property card
   - `LEAD_WEBHOOK_URL` for Zapier/CRM; `TWILIO_*` + `LEAD_NOTIFY_SMS` to text the agent on qualified leads
6. `npm run build` and deploy.

## What's on the page

Hero (Ken Burns or video, glass facts bar) → photo marquee → overview with count-up stats → gallery mosaic + full-screen viewer (filterable grid, swipe, keyboard) → amenities → parallax split sections → full-bleed quote → spec sheet → "why it matters" stats → location map → agent card + inline form → final CTA cards → footer. On phones, a sticky bar shows the price plus Call / Book a Tour buttons.

**Ad deep links:** `/#tour` opens the tour form, and `/#details` opens the details form.

## Leads

Both forms post to `/api/lead`. That route runs the honeypot and spam heuristics, then a per-IP rate limit, then qualification, then delivers in parallel to the webhook, the SendGrid agent email, Twilio SMS (qualified leads only), and the auto-responder. Every lead is also logged to the server console, so it can be recovered from Vercel logs if every channel fails.

Click IDs (gclid, gbraid, wbraid, fbclid, msclkid) and UTMs are captured on landing (`lib/attribution.ts`, kept for 90 days). They ride along to the email, the webhook and the CRM. The browser pushes `generate_lead` to the dataLayer with a qualified-weighted `value`, plus enhanced-conversion user data. When a Google Ads ID and label are set, it also fires the Ads conversion and Meta `Lead` directly.

To test delivery without sending real mail, point `SENDGRID_API_BASE` / `TWILIO_API_BASE` at a mock server.

## Motion

Sections opt in with data attributes handled by `components/Motion.tsx`: `data-reveal="up|fade|clip|scale"`, `data-stagger`, `data-parallax="0.1"`, and `data-count`. Content is fully visible without JavaScript, and all motion is off for visitors who prefer reduced motion.

## Updating the base

This folder (`~/property-marketing-template`) is the base for every property project. Each new project records the template commit it started from in `.template-version`.

- **A fix or feature every future page should have:** make it here, build, and commit.
- **Pulling that fix into an existing project:** run `git -C ~/property-marketing-template diff <that project's .template-version>..HEAD -- components lib app`, apply what's relevant, and never overwrite the project's `site.config.ts`.
