/* ==========================================================================
   Lead qualification.

   One rule set, used by the email subject, the notification design, the SMS
   gate and the conversion value, so a lead can never be "qualified" in one
   place and not another.

   The rules come from the form config: any answer marked `disqualifies`
   flags the lead. Deliberately blunt. The point is not to score a lead
   precisely, it is to tell the agent in the subject line whether this is
   worth interrupting a showing for.
   ========================================================================== */

import { site } from "@/site.config";
import type { FormKey } from "@/lib/types";

export type Qualification = {
  qualified: boolean;
  /** Short reason shown on the badge, e.g. "Ready now · Paying cash" */
  label: string;
  tag: "QUALIFIED" | "DQ" | "NEW";
};

const str = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === "string" ? value.trim() : "";
};

export function isFormKey(value: unknown): value is FormKey {
  return value === "request" || value === "showing";
}

export function qualify(payload: Record<string, unknown>): Qualification {
  const formType = payload.formType;
  if (!isFormKey(formType)) {
    return { qualified: false, label: "No qualifying answers given", tag: "NEW" };
  }

  const answers: string[] = [];
  for (const question of site.forms[formType].questions) {
    const answer = str(payload, question.name);
    if (!answer) continue;
    if (question.kind === "choice") {
      const option = question.options.find((o) => o.label === answer);
      if (option?.disqualifies) {
        return { qualified: false, label: `${question.label}: ${answer}`, tag: "DQ" };
      }
    }
    answers.push(answer);
  }

  /* A tour request with no disqualifying answer is high intent by definition,
     and a details request that cleared every question is the lead the ad
     account should bid toward. */
  return {
    qualified: true,
    label: answers.join(" · ") || site.forms[formType].label,
    tag: answers.length ? "QUALIFIED" : "NEW",
  };
}
