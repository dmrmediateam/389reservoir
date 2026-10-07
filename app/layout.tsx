import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import localFont from "next/font/local";
import type { CSSProperties } from "react";
import { site } from "@/site.config";
import TrackingScripts from "@/components/TrackingScripts";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

// Fraunces numerals (as on 20 Tuscarora) in place of Cormorant's old-style
// figures. The files hold only 0-9 and $, so every other glyph falls through to
// Cormorant; no generated fallback, or it would catch the letters first.
const digits = localFont({
  src: [
    { path: "./fonts/fraunces-digits.woff2", weight: "300 600", style: "normal" },
    { path: "./fonts/fraunces-digits-italic.woff2", weight: "300 600", style: "italic" },
  ],
  display: "swap",
  adjustFontFallback: false,
  fallback: [],
});

const sans = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: site.seo.title,
  description: site.seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: site.seo.title,
    description: site.seo.description,
    images: [{ url: site.seo.ogImage, width: 2000, height: 1333 }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: site.seo.title, description: site.seo.description },
  robots: { index: site.seo.index, follow: site.seo.index },
};

export const viewport: Viewport = {
  themeColor: site.theme.canvas,
  width: "device-width",
  initialScale: 1,
};

/* The config's colour tokens become CSS variables, so re-theming a client is
   a config edit, not a stylesheet edit. */
const themeVars = {
  "--accent": site.theme.accent,
  "--accent-ink": site.theme.accentInk,
  "--on-accent": site.theme.onAccent ?? "#17130b",
  "--ink": site.theme.ink,
  "--canvas": site.theme.canvas,
  "--cream": site.theme.cream,
  "--cream-alt": site.theme.creamAlt,
  "--font-display": `${digits.style.fontFamily}, ${display.style.fontFamily}`,
} as CSSProperties;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} style={themeVars}>
      <body>
        {site.tracking.gtmId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${site.tracking.gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        {children}
        <TrackingScripts />
      </body>
    </html>
  );
}
