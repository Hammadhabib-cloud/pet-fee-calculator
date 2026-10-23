import { ogImage, ogSize } from "@/lib/og";
import { airlineByPageSlug, airlines, pageSlug, shortName } from "@/lib/airlines";
import { feeText } from "@/lib/content";
import { formatDims } from "@/lib/calc";
import { SITE_NAME } from "@/lib/site";

export const alt = "Airline pet fee and carrier size";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return airlines.map((a) => ({ slug: pageSlug(a) }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const a = airlineByPageSlug((await params).slug)!;
  const size = a.max_carrier_soft_in ?? a.max_carrier_hard_in;
  return ogImage({
    eyebrow: SITE_NAME,
    title: `${shortName(a)} pet fee calculator`,
    facts: [`Fee: ${feeText(a)}`, size ? `Max carrier: ${formatDims(size)}` : ""].filter(Boolean),
  });
}
