import { ogImage, ogSize } from "@/lib/og";
import { SITE_NAME } from "@/lib/site";
import { airlines, shortName } from "@/lib/airlines";

export const alt = "Pet Flight Fee Calculator: cost to fly with a dog or cat";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: SITE_NAME, title: "What does it cost to fly with your pet?", facts: ["Total pet fee + carrier size check", airlines.map(shortName).join(" · ")] });
}
