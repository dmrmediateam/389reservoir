# Property Marketing Template

Single-property ad landing page for DMR Media clients. Read README.md first.

- All listing content lives in `site.config.ts` (typed by `lib/types.ts`). Never hard-code copy in components.
- Sections are server components in `components/Sections.tsx`; motion is opt-in via data attributes (see `components/Motion.tsx`). Forms open via `data-open-lead-form="request|showing"`.
- Light sections get the `light` class, which swaps the surface tokens (`--fg`, `--muted`, `--line`); don't add per-element colour modifiers.
- Lead delivery (`lib/leads/notify.ts`) is ported from the Carole Tierney site; keep it in sync with that one rather than diverging.
- Verify with `npm run build`; check mobile at 390px (sticky CTA, bottom-sheet modal).
