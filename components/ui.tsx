import type { AmenityIcon, Cta, TitleLine } from "@/lib/types";

/** A CTA as a plain link: forms open via the modal's delegated listener. */
export function CtaLink({
  cta,
  className = "btn btn--accent",
  arrow = false,
}: {
  cta: Cta;
  className?: string;
  arrow?: boolean;
}) {
  return (
    <a
      href={cta.form ? "#enquire" : (cta.href ?? "#enquire")}
      className={className}
      {...(cta.form ? { "data-open-lead-form": cta.form } : {})}
      {...(cta.location ? { "data-location": cta.location } : {})}
    >
      <span>{cta.label}</span>
      {arrow ? <Arrow /> : null}
    </a>
  );
}

export function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h15m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Headline lines, italic ones in the accent serif style. */
export function Title({ lines }: { lines: TitleLine[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className={`title-line${line.italic ? " title-line--italic" : ""}`}>
          {line.text}
        </span>
      ))}
    </>
  );
}

const ICON_PATHS: Record<AmenityIcon, string> = {
  pool: "M3 9c1.5 1.5 3 1.5 4.5 0s3-1.5 4.5 0 3 1.5 4.5 0 3-1.5 4.5 0M3 15c1.5 1.5 3 1.5 4.5 0s3-1.5 4.5 0 3 1.5 4.5 0 3-1.5 4.5 0",
  waterfront: "M12 3v9m0 0 4-4m-4 4-4-4M3 17c2 1.3 4 1.3 6 0s4-1.3 6 0 4 1.3 6 0M3 21c2 1.3 4 1.3 6 0s4-1.3 6 0 4 1.3 6 0",
  dock: "M4 10h16M6 10v10m6-10v10m6-10v10M3 20c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0M12 10V4l5 3-5 3",
  views: "M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Zm10 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  kitchen: "M6 3v7m3-7v7M6 6.5h3M7.5 10v11M16 3c-1.7 1.3-2.5 3.3-2.5 6 0 1.5.8 2.5 2.5 2.5V21",
  wine: "M8 3h8l-.5 6a3.5 3.5 0 0 1-7 0L8 3Zm4 9.5V20m-3.5 1h7",
  spa: "M12 4c2.5 2 3.8 4.1 3.8 6.4A3.8 3.8 0 0 1 12 14.2a3.8 3.8 0 0 1-3.8-3.8c0-1.5.6-2.9 1.9-4.3.1 1.4.5 2.4 1.1 3.1C12 7.9 12.4 6.1 12 4ZM6 19h12",
  fitness: "M3 12h18M6 8v8M3.5 10v4M18 8v8m2.5-6v4",
  fireplace: "M4 21V7l8-4 8 4v14M8 21v-5a4 4 0 0 1 8 0v5m-4-8c1.2-1 1.5-2 1-3.5-.8 1-1.5.8-1.5-.5-1 .8-2 2-1 4",
  terrace: "M3 10h18M5 10v10m14-10v10M3 14h18M12 3 3 8h18l-9-5Z",
  garden: "M12 21v-9m0 0c0-4 3-6 7-6 0 4-3 6-7 6Zm0 0C12 8 9 6 5 6c0 4 3 6 7 6ZM7 21h10",
  garage: "M3 21V9l9-6 9 6v12M7 21v-8h10v8M7 16h10",
  parking: "M6 4h7a4 4 0 0 1 0 8H6m0-8v16m0-8h7",
  "smart-home": "M3 11 12 4l9 7M5 10v10h14V10m-9.5 5.5a3.5 3.5 0 0 1 5 0M8 13a7 7 0 0 1 8 0",
  security: "M12 3 4 6v6c0 4.5 3.4 8.2 8 9 4.6-.8 8-4.5 8-9V6l-8-3Zm-3 9 2.2 2.2L15.5 10",
  floorplan: "M3 3h18v18H3V3Zm0 9h7m4 0h7M10 3v5m0 8v5m4-18v9",
  elevator: "M5 3h14v18H5V3Zm4 7 3-3 3 3m-6 4 3 3 3-3",
  laundry: "M5 3h14v18H5V3Zm0 4h14m-7 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  office: "M3 20h18M5 20V10h14v10M9 10V6h6v4",
  community: "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20c0-3.3 2.7-6 6-6s6 2.7 6 6m0-5.6c.6-.3 1.3-.4 2-.4 3.3 0 6 2.7 6 6",
  sun: "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-14v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  pet: "M5 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm14 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM9 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-3 4c-3 0-6 4-6 7 0 2 1.5 3 3 3 1.2 0 2-.6 3-.6s1.8.6 3 .6c1.5 0 3-1 3-3 0-3-3-7-6-7Z",
};

export function Icon({ name }: { name: AmenityIcon }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={ICON_PATHS[name]} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6.6 3.5h2.6l1.4 4-2 1.3a11 11 0 0 0 6.6 6.6l1.3-2 4 1.4v2.6a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6h18v12H3V6Zm0 0 9 7 9-7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
