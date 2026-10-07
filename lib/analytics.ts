/* ==========================================================================
   Conversion events.

   The page pushes SEMANTIC events to the dataLayer ("a lead was submitted, of
   this kind, worth roughly this much"). Whoever runs the ad account maps those
   to conversion actions inside GTM, so tag changes never need a deploy.

   When gtag or the Meta pixel are loaded directly (no GTM), the same call
   reports to them too, so trackEvent() works either way.
   ========================================================================== */

import { site } from "@/site.config";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export type ConversionEvent =
  | "generate_lead" // a lead form completed
  | "lead_form_open" // a form was opened (intent signal)
  | "lead_step" // a multi-step form advanced (micro-conversion)
  | "phone_click"
  | "email_click"
  | "gallery_open";

export function trackEvent(event: ConversionEvent, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });

    if (!site.tracking.gtmId && window.gtag) {
      window.gtag("event", event, params);
    }

    if (event === "generate_lead") {
      const { googleAdsId, googleAdsLeadLabel } = site.tracking;
      if (window.gtag && googleAdsId && googleAdsLeadLabel) {
        window.gtag("event", "conversion", {
          send_to: `${googleAdsId}/${googleAdsLeadLabel}`,
          value: params.value,
          currency: "USD",
        });
      }
      window.fbq?.("track", "Lead", { value: params.value, currency: "USD", content_name: params.form_type });
    }
    if (event === "lead_form_open") {
      window.fbq?.("track", "ViewContent", { content_name: params.form_type });
    }
  } catch {
    /* tracking must never break the page */
  }
}

/**
 * Hands the lead's email/phone to Google for enhanced conversions. GTM's
 * user-provided-data variable can read `enhanced_conversion_data` from the
 * dataLayer; gtag reads it via `set user_data`.
 */
export function setUserData(data: { email?: string; phone?: string }): void {
  if (typeof window === "undefined") return;
  const user = Object.fromEntries(Object.entries(data).filter(([, v]) => v));
  if (!Object.keys(user).length) return;
  try {
    const phone = user.phone?.replace(/[^\d+]/g, "");
    const payload = { ...user, ...(phone ? { phone_number: phone.startsWith("+") ? phone : `+1${phone}` } : {}) };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ enhanced_conversion_data: payload });
    window.gtag?.("set", "user_data", payload);
  } catch {
    /* ignore */
  }
}
