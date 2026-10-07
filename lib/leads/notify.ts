import "server-only";
import { site } from "@/site.config";
import { fullAddress, telHref } from "@/lib/format";
import { isFormKey, qualify } from "@/lib/leads/qualify";

/* ==========================================================================
   Lead notification: SendGrid (email) + Twilio (SMS).

   Ported from the Carole Tierney / Alexa Devaney sites so every DMR client
   gets the same notification email.

   Speed-to-lead is the whole game: contact rates fall off a cliff after the
   first few minutes, and an agent showing property is not reading email. So
   a lead fires an SMS and an email in parallel, and the visitor can get an
   instant acknowledgement so they know a human is coming.

   Every channel is independently optional and driven by env vars, so a client
   with only one of them configured still gets that one. No SDKs: both are
   plain REST calls, which keeps the dependency list at zero.
   ========================================================================== */

const TIMEOUT_MS = 8000;

/* Overridable so the delivery path can be pointed at a sandbox or a mock and
   exercised for real without sending mail or SMS. Defaults are production. */
const SENDGRID_BASE = process.env.SENDGRID_API_BASE || "https://api.sendgrid.com";
const TWILIO_BASE = process.env.TWILIO_API_BASE || "https://api.twilio.com";

export type LeadPayload = Record<string, unknown>;

export function formLabel(formType: unknown): string {
  return isFormKey(formType) ? site.forms[formType].label : "Website enquiry";
}

function str(payload: LeadPayload, ...keys: string[]): string {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function leadName(payload: LeadPayload): string {
  return str(payload, "name") || str(payload, "email") || str(payload, "phone") || "New lead";
}

const siteBase = () => site.siteUrl.replace(/\/$/, "");
const absolute = (path: string) => (/^https?:\/\//i.test(path) ? path : `${siteBase()}${path}`);

/** A row's optional third member is a link the value should point at. */
type Row = [label: string, value: string, href?: string];

/** Fields worth putting in front of an agent, in the order they matter. */
function summaryRows(payload: LeadPayload): Row[] {
  const rows: Row[] = [];
  const push = (label: string, value: string, href?: string) =>
    value && rows.push([label, value, href]);

  const phone = str(payload, "phone");
  const email = str(payload, "email");
  push("Phone", phone, phone ? telHref(phone) : undefined);
  push("Email", email, email ? `mailto:${email}` : undefined);

  // Qualifying answers sit directly under the contact details: they decide
  // how fast this lead gets called back.
  if (isFormKey(payload.formType)) {
    for (const question of site.forms[payload.formType].questions) {
      push(question.label, str(payload, question.name));
    }
  }
  push("Message", str(payload, "message"));
  push("Campaign", str(payload, "utmCampaign"));
  push("Source", [str(payload, "utmSource"), str(payload, "utmMedium")].filter(Boolean).join(" / "));
  push("Keyword", str(payload, "utmTerm"));
  push("Landing page", str(payload, "landingPage", "page"));
  push("Google click id", str(payload, "gclid"));
  push("Meta click id", str(payload, "fbclid"));
  return rows;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** The listing photo, price and address as an email-safe table block. */
function propertyCard(): string {
  const p = site.property;
  const photo = absolute(site.hero.imageSrc);
  const facts = `${p.beds} bd · ${p.baths} ba · ${p.sqft.toLocaleString("en-US")} sq ft`;
  return `<table role="presentation" style="border-collapse:collapse;width:100%;background:#ffffff;border:1px solid #E7E2D8">
    <tr><td style="padding:0"><a href="${escapeHtml(siteBase())}"><img src="${escapeHtml(photo)}" alt="${escapeHtml(p.name)}" width="620" style="display:block;width:100%;height:auto;max-height:260px;object-fit:cover;border:0"></a></td></tr>
    <tr><td style="padding:18px 22px">
      <p style="margin:0;font-family:Georgia,serif;font-size:20px;color:#1A1A1A">${escapeHtml(p.price)}</p>
      <p style="margin:4px 0 0;font-size:13px;color:#4A4640">${escapeHtml(fullAddress(p))}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#8C8377;letter-spacing:.04em">${escapeHtml(facts)}</p>
    </td></tr>
  </table>`;
}

/* --------------------------------------------------------------------------
   SendGrid
   -------------------------------------------------------------------------- */

export async function sendGrid(body: Record<string, unknown>): Promise<boolean> {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch(`${SENDGRID_BASE}/v3/mail/send`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    // SendGrid returns 202 with an empty body on success
    if (res.status !== 202) {
      console.error("[Lead] sendgrid rejected", { status: res.status, detail: (await res.text()).slice(0, 300) });
      return false;
    }
    return true;
  } catch (error) {
    console.error("[Lead] sendgrid failed", { error: String(error) });
    return false;
  }
}

/**
 * Recipients of the lead notification.
 *
 * LEAD_NOTIFY_EMAIL takes a comma-separated list, so the agent and whoever
 * runs their ads can both be on it. Everyone lands in one `to`, deliberately:
 * a single thread means a reply is visible to both rather than two people
 * chasing the same lead separately.
 */
function notifyRecipients(): string[] {
  const raw = process.env.LEAD_NOTIFY_EMAIL || site.agent.email || "";
  return raw
    .split(",")
    .map((address) => address.trim())
    .filter((address) => address.includes("@"))
    .filter((address, i, all) => all.indexOf(address) === i);
}

/** The lead notification the agent actually reads. Reply-To is the lead. */
export async function emailAgent(payload: LeadPayload): Promise<boolean> {
  const from = process.env.SENDGRID_FROM_EMAIL;
  const recipients = notifyRecipients();
  if (!from || recipients.length === 0) return false;

  const label = formLabel(payload.formType);
  const name = leadName(payload);
  const rows = summaryRows(payload);
  const phone = str(payload, "phone");
  const email = str(payload, "email");
  const { qualified, label: verdict, tag } = qualify(payload);

  const rowsHtml = rows
    .map(([k, v, href]) => {
      const value = href
        ? `<a href="${escapeHtml(href)}" style="color:#1A1A1A">${escapeHtml(v)}</a>`
        : escapeHtml(v);
      return (
        `<tr><td style="padding:7px 18px 7px 0;color:#8C8377;font-size:12px;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</td>` +
        `<td style="padding:7px 0;color:#1A1A1A;font-size:15px">${value}</td></tr>`
      );
    })
    .join("");

  /* Dark masthead carrying the verdict, so the answer is visible in the
     preview pane before anything is opened or scrolled. */
  const pill =
    tag === "NEW"
      ? { bg: "#ECEBE8", fg: "#4A4640", text: verdict }
      : qualified
        ? { bg: "#E7F3EA", fg: "#1D6B36", text: `Qualified — ${verdict}` }
        : { bg: "#F3EFEA", fg: "#8A6B34", text: `Not qualified — ${verdict}` };

  const html = `<div style="font-family:Helvetica,Arial,sans-serif;max-width:620px;margin:0 auto;background:#FAF9F7">
  <div style="background:#141414;padding:34px 34px 30px">
    <p style="margin:0 0 10px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:${escapeHtml(site.theme.accent)}">${escapeHtml(site.property.name)}</p>
    <h1 style="margin:0;font-family:Georgia,serif;font-weight:400;font-size:30px;line-height:1.2;color:#ffffff">${escapeHtml(label)}</h1>
    <p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,.66)">${escapeHtml(name)} · ${escapeHtml(
      new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    )}</p>
    <p style="margin:22px 0 0"><span style="display:inline-block;background:${pill.bg};color:${pill.fg};font-size:15px;font-weight:600;padding:11px 22px;border-radius:999px">${escapeHtml(pill.text)}</span></p>
  </div>
  <div style="padding:28px 34px 32px">
    <table style="border-collapse:collapse;width:100%">${rowsHtml}</table>
    <p style="margin:26px 0 0">
      ${phone ? `<a href="${escapeHtml(telHref(phone))}" style="display:inline-block;padding:13px 24px;background:#1A1A1A;color:#fff;text-decoration:none;font-size:12px;letter-spacing:.14em;text-transform:uppercase;margin-right:8px">Call ${escapeHtml(name.split(" ")[0])}</a>` : ""}
      ${email ? `<a href="mailto:${escapeHtml(email)}" style="display:inline-block;padding:13px 24px;border:1px solid #1A1A1A;color:#1A1A1A;text-decoration:none;font-size:12px;letter-spacing:.14em;text-transform:uppercase">Email</a>` : ""}
    </p>
    <div style="margin:30px 0 0">${propertyCard()}</div>
    <p style="margin:24px 0 0;font-size:11px;color:#8C8377;line-height:1.6">Submitted from ${escapeHtml(str(payload, "landingPage", "page") || "the website")} · ${escapeHtml(siteBase())}</p>
  </div>
</div>`;

  return sendGrid({
    personalizations: [{ to: recipients.map((address) => ({ email: address })) }],
    /* Named for the SITE, not the agent. This email goes TO the agent, so a
       From of their own name makes it look like they wrote to themselves. The
       auto-responder below is the one that should carry their name. */
    from: { email: from, name: `${site.property.name} Website` },
    // Hitting reply goes straight to the lead, not into a no-reply void
    ...(email ? { reply_to: { email, name } } : {}),
    subject: `[${tag}] ${label} - ${name}${phone ? ` · ${phone}` : ""}`,
    content: [{ type: "text/html", value: html }],
  });
}

/**
 * Instant acknowledgement to the lead. Off unless LEAD_AUTORESPONDER is set,
 * since it sends mail on the agent's behalf and they should opt into that
 * wording.
 */
export async function emailLead(payload: LeadPayload): Promise<boolean> {
  if (!["1", "on", "true"].includes(process.env.LEAD_AUTORESPONDER ?? "")) return false;
  const from = process.env.SENDGRID_FROM_EMAIL;
  const email = str(payload, "email");
  if (!from || !email) return false;

  const first = leadName(payload).split(" ")[0] || "there";
  const { agent, property } = site;
  const isTour = payload.formType === "showing";
  const when = str(payload, "preferredTime");

  const html = `<div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#FAF9F7;color:#1A1A1A">
  <p style="margin:0 0 14px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:${escapeHtml(site.theme.accentInk)}">${escapeHtml(property.name)}</p>
  <p style="margin:0 0 16px;font-size:15px;line-height:1.7">Hi ${escapeHtml(first)},</p>
  <p style="margin:0 0 16px;font-size:15px;line-height:1.7">${
    isTour
      ? `Thank you for requesting a private tour${when ? ` (${escapeHtml(when)})` : ""}. I'll be in touch shortly to confirm an exact time.`
      : "Thank you for your interest. I have your request and will send the full details personally, usually the same day."
  }</p>
  <p style="margin:0 0 24px;font-size:15px;line-height:1.7">If it's time sensitive, call or text me directly at <a href="${escapeHtml(telHref(agent.phone))}" style="color:#1A1A1A">${escapeHtml(agent.phoneDisplay)}</a>.</p>
  ${propertyCard()}
  <p style="margin:28px 0 0;font-family:Georgia,serif;font-size:18px">${escapeHtml(agent.name)}</p>
  <p style="margin:2px 0 0;font-size:12px;color:#8C8377">${escapeHtml(agent.title)} · ${escapeHtml(agent.brokerage)}</p>
</div>`;

  return sendGrid({
    personalizations: [{ to: [{ email }] }],
    from: { email: from, name: process.env.SENDGRID_FROM_NAME || agent.name },
    reply_to: { email: agent.email, name: agent.name },
    subject: isTour ? `Your tour of ${property.name}` : `The details for ${property.name}`,
    content: [{ type: "text/html", value: html }],
  });
}

/* --------------------------------------------------------------------------
   Twilio
   -------------------------------------------------------------------------- */

/**
 * SMS to the agent. The one channel that reliably interrupts a showing.
 *
 * Sender: prefer TWILIO_MESSAGING_SERVICE_SID. A2P 10DLC campaigns attach their
 * numbers to a Messaging Service, and sending through the service is what keeps
 * traffic on the registered campaign (plus it handles STOP/HELP). A bare
 * TWILIO_FROM_NUMBER still works for unregistered testing.
 *
 * Auth: prefer an API Key (SK...) over the account Auth Token. The token is the
 * master credential for the whole account and cannot be rotated without
 * breaking everything else; an API key can be revoked on its own.
 */
export async function smsAgent(payload: LeadPayload): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const authUser = process.env.TWILIO_API_KEY_SID || sid;
  const authPass = process.env.TWILIO_API_KEY_SECRET || process.env.TWILIO_AUTH_TOKEN;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const from = process.env.TWILIO_FROM_NUMBER;
  const to = process.env.LEAD_NOTIFY_SMS;
  if (!sid || !authUser || !authPass || !to) return false;
  if (!messagingServiceSid && !from) return false;

  /* Only qualified leads buzz the phone. An alert that fires for every
     submission is one the agent learns to ignore, and then it stops working
     for the leads that matter. Disqualified ones still arrive by email. */
  const { qualified, label: verdict } = qualify(payload);
  if (!qualified) return false;

  const body = [
    `${formLabel(payload.formType)}: ${leadName(payload)}`,
    str(payload, "phone"),
    site.property.name,
    verdict,
  ]
    .filter(Boolean)
    .join(" · ")
    // One segment is 160 chars; longer costs more and gets split oddly
    .slice(0, 300);

  try {
    const res = await fetch(`${TWILIO_BASE}/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${authUser}:${authPass}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: to,
        Body: body,
        ...(messagingServiceSid
          ? { MessagingServiceSid: messagingServiceSid }
          : { From: from as string }),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error("[Lead] twilio rejected", { status: res.status, detail: (await res.text()).slice(0, 300) });
      return false;
    }
    return true;
  } catch (error) {
    console.error("[Lead] twilio failed", { error: String(error) });
    return false;
  }
}
