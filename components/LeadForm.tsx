"use client";

import { useId, useMemo, useState } from "react";
import { site } from "@/site.config";
import { getAttribution } from "@/lib/attribution";
import { setUserData, trackEvent } from "@/lib/analytics";
import { qualify } from "@/lib/leads/qualify";
import { telHref } from "@/lib/format";
import type { FormKey, FormQuestion } from "@/lib/types";

type Status = "idle" | "submitting" | "success" | "error";

/* ==========================================================================
   The multi-step lead form, used inline and in the modal.

   Questions first, contact details last: a visitor who has already tapped two
   easy answers is far more likely to finish than one faced with a name/email/
   phone wall up front. Each question auto-advances on tap.
   ========================================================================== */

function upcomingDays(count: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const label =
      i === 0 ? "Today" : i === 1 ? "Tomorrow" : day.toLocaleDateString("en-US", { weekday: "short" });
    out.push(`${label} · ${day.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`);
  }
  out.push("I'm flexible");
  return out;
}

function ScheduleStep({
  question,
  value,
  onChange,
}: {
  question: Extract<FormQuestion, { kind: "schedule" }>;
  value: string;
  onChange: (value: string, complete: boolean) => void;
}) {
  // Only ever mounted after a click, so computing dates here cannot mismatch
  // the server render.
  const days = useMemo(() => upcomingDays(question.days), [question.days]);
  const [day, setDay] = useState(value.split(" — ")[0] ?? "");
  const [time, setTime] = useState(value.split(" — ")[1] ?? "");

  const pick = (nextDay: string, nextTime: string) => {
    setDay(nextDay);
    setTime(nextTime);
    onChange([nextDay, nextTime].filter(Boolean).join(" — "), Boolean(nextDay && nextTime));
  };

  return (
    <>
      <div className="lead-form__days" role="group" aria-label="Day">
        {days.map((d) => {
          const [top, bottom] = d.split(" · ");
          return (
            <button
              key={d}
              type="button"
              className={`lead-form__day${day === d ? " is-selected" : ""}`}
              aria-pressed={day === d}
              onClick={() => pick(d, time)}
            >
              <span>{top}</span>
              {bottom ? <strong>{bottom}</strong> : null}
            </button>
          );
        })}
      </div>
      <div className="lead-form__choices lead-form__choices--row" role="group" aria-label="Time of day">
        {question.times.map((t) => (
          <button
            key={t}
            type="button"
            className={`lead-form__choice${time === t ? " is-selected" : ""}`}
            aria-pressed={time === t}
            onClick={() => pick(day, t)}
          >
            {t}
          </button>
        ))}
      </div>
    </>
  );
}

export default function LeadForm({
  formKey,
  variant,
  location,
  onClose,
}: {
  formKey: FormKey;
  variant: "inline" | "modal";
  location?: string;
  onClose?: () => void;
}) {
  const config = site.forms[formKey];
  const ids = useId();
  const totalSteps = config.questions.length + 1;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [stepReady, setStepReady] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const question = config.questions[step];
  const onContactStep = step === config.questions.length;

  const advance = () => {
    trackEvent("lead_step", { form_type: formKey, step: step + 1, location });
    setStepReady(false);
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  };

  const answer = (name: string, value: string, autoAdvance: boolean) => {
    setAnswers((a) => ({ ...a, [name]: value }));
    setStepReady(Boolean(value) && autoAdvance);
    // Brief pause so the selected state registers before the step changes.
    if (autoAdvance) window.setTimeout(advance, 260);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string, string>;
    const fields = { formType: formKey, ...answers, ...data };
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          page: window.location.pathname + window.location.search,
          ctaLocation: location ?? "",
          attribution: getAttribution(),
        }),
      });
      if (!res.ok) throw new Error("request failed");
      setUserData({ email: data.email, phone: data.phone });
      const { qualified } = qualify(fields);
      trackEvent("generate_lead", {
        form_type: formKey,
        qualified,
        location,
        // Disqualified leads still count, at a fraction of the value, so bidding
        // learns which clicks become real buyers.
        value: qualified ? config.conversionValue : Math.round(config.conversionValue / 6),
        currency: "USD",
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={`lead-form lead-form--${variant} lead-form--success`} aria-live="polite">
        <div className="lead-form__success-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="eyebrow">{config.eyebrow}</p>
        <h3 className="lead-form__title">{config.successTitle}</h3>
        <p className="lead-form__body">{config.successBody}</p>
        <div className="lead-form__success-actions">
          <a className="btn btn--accent" href={telHref(site.agent.phone)} data-location="lead-success">
            Call {site.agent.phoneDisplay}
          </a>
          {onClose ? (
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Back to the property
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={`lead-form lead-form--${variant}`}>
      <p className="eyebrow">{config.eyebrow}</p>
      <h3 className="lead-form__title" id={`${ids}-title`}>
        {config.title}
      </h3>
      <p className="lead-form__body">{config.body}</p>

      <div className="lead-form__progress" aria-hidden="true">
        {Array.from({ length: totalSteps }, (_, i) => (
          <span key={i} className={i <= step ? "is-done" : ""} />
        ))}
      </div>
      <p className="lead-form__step-count" aria-live="polite">
        Step {step + 1} of {totalSteps}
      </p>

      <form className="lead-form__form" onSubmit={handleSubmit} noValidate={false}>
        {/* Honeypot: hidden from people and screen readers, visible to
            DOM-walking bots. Never type="hidden": most form-fillers skip
            those, which defeats the point. Caught server-side by isSpam(). */}
        <div style={{ display: "none" }} aria-hidden="true">
          <label htmlFor={`${ids}-company`}>Company</label>
          <input id={`${ids}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
          <label htmlFor={`${ids}-website`}>Website</label>
          <input id={`${ids}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="lead-form__step" key={step}>
          {question ? (
            <>
              <p className="lead-form__question">{question.question}</p>
              {question.kind === "choice" ? (
                <div className="lead-form__choices" role="group" aria-label={question.question}>
                  {question.options.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      className={`lead-form__choice${answers[question.name] === option.label ? " is-selected" : ""}`}
                      aria-pressed={answers[question.name] === option.label}
                      onClick={() => answer(question.name, option.label, true)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : (
                <ScheduleStep
                  question={question}
                  value={answers[question.name] ?? ""}
                  onChange={(value, complete) => {
                    setAnswers((a) => ({ ...a, [question.name]: value }));
                    setStepReady(complete);
                  }}
                />
              )}
              <div className="lead-form__actions">
                {step > 0 ? (
                  <button type="button" className="lead-form__back" onClick={() => setStep((s) => s - 1)}>
                    Back
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  className="btn btn--accent"
                  disabled={!answers[question.name] || (question.kind === "schedule" && !stepReady)}
                  onClick={advance}
                >
                  Continue
                </button>
              </div>
            </>
          ) : null}

          {onContactStep ? (
            <>
              <p className="lead-form__question">{config.contactQuestion}</p>
              <div className="lead-form__fields">
                <label className="field">
                  <span>Full name</span>
                  <input name="name" type="text" autoComplete="name" required />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input name="email" type="email" autoComplete="email" inputMode="email" required />
                </label>
                <label className="field">
                  <span>Phone{config.requirePhone ? "" : " (optional)"}</span>
                  <input name="phone" type="tel" autoComplete="tel" inputMode="tel" required={config.requirePhone} />
                </label>
                {config.messagePlaceholder ? (
                  <label className="field field--wide">
                    <span>Message</span>
                    <input name="message" type="text" placeholder={config.messagePlaceholder} />
                  </label>
                ) : null}
              </div>
              {status === "error" ? (
                <p className="lead-form__error" role="alert">
                  We couldn&apos;t send that just now. Please try again, or call {site.agent.phoneDisplay}.
                </p>
              ) : null}
              <div className="lead-form__actions">
                <button type="button" className="lead-form__back" onClick={() => setStep((s) => s - 1)}>
                  Back
                </button>
                <button type="submit" className="btn btn--accent" disabled={status === "submitting"}>
                  {status === "submitting" ? "Sending…" : config.submitLabel}
                </button>
              </div>
              <p className="lead-form__fineprint">
                By submitting you agree to be contacted about this property by phone, text or email. No spam, ever.
              </p>
            </>
          ) : null}
        </div>
      </form>
    </div>
  );
}
