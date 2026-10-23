export const SITE_NAME = "Pet Flight Fee Calculator";
// Set NEXT_PUBLIC_SITE_URL to the real domain before deploying; it is used for canonical URLs and the sitemap.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(/\/$/, "");
export const DISCLAIMER =
  "Fees and rules change often. Always confirm with the airline before booking. This site is not affiliated with any airline.";
export const NO_FEE_TEXT = "Fee not confirmed — check with airline";
export const UNKNOWN_TEXT = "Check with airline";

// "2026-10-21" -> "October 21, 2026", without timezone drift.
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { timeZone: "UTC", month: "long", day: "numeric", year: "numeric" });
