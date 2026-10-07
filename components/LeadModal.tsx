"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import LeadForm from "@/components/LeadForm";
import { trackEvent } from "@/lib/analytics";
import type { FormKey } from "@/lib/types";

/* ==========================================================================
   One modal for both lead forms.

   Any element with data-open-lead-form="request|showing" opens it, so server
   components can render plain links and still trigger the form. Links keep a
   real href (#enquire) as a no-JS fallback. Ad links can deep-link straight
   into a form with #tour or #details.
   ========================================================================== */

const HASH_TO_FORM: Record<string, FormKey> = { "#tour": "showing", "#details": "request" };

export default function LeadModal() {
  const [open, setOpen] = useState<{ form: FormKey; location?: string } | null>(null);
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(null);
      setClosing(false);
      returnFocus.current?.focus?.();
    }, 260);
  }, []);

  useEffect(() => {
    const show = (form: FormKey, location?: string) => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setOpen({ form, location });
      trackEvent("lead_form_open", { form_type: form, location });
    };

    const onClick = (event: MouseEvent) => {
      const trigger = (event.target as Element | null)?.closest?.<HTMLElement>("[data-open-lead-form]");
      const form = trigger?.dataset.openLeadForm;
      if (form !== "request" && form !== "showing") return;
      event.preventDefault();
      show(form, trigger?.dataset.location);
    };
    const onHash = () => {
      const form = HASH_TO_FORM[window.location.hash];
      if (form) show(form, "deep-link");
    };

    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHash);
    onHash();
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("has-modal");

    // Move focus into the dialog, and keep Tab cycling inside it.
    const dialog = dialogRef.current;
    window.setTimeout(() => dialog?.querySelector<HTMLElement>("button, input")?.focus(), 60);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([tabindex='-1']), a[href]"),
      ).filter((el) => el.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.documentElement.classList.remove("has-modal");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div className={`modal${closing ? " is-closing" : ""}`}>
      <button type="button" className="modal__backdrop" aria-label="Close" onClick={close} />
      <div className="modal__dialog" role="dialog" aria-modal="true" aria-label="Enquiry form" ref={dialogRef}>
        <button type="button" className="modal__close" aria-label="Close" onClick={close}>
          <span />
          <span />
        </button>
        <LeadForm formKey={open.form} variant="modal" location={open.location} onClose={close} />
      </div>
    </div>
  );
}
