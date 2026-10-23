import type { Metadata } from "next";
import ProsePage from "@/components/ProsePage";

export const metadata: Metadata = {
  title: "Affiliate Disclosure – Pet Flight Fee Calculator",
  description: "Some links on Pet Flight Fee Calculator may be affiliate links. We may earn a commission at no extra cost to you.",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function Page() {
  return (
    <ProsePage title="Affiliate disclosure">
      <p>Some links on this site, such as recommended pet carriers or pet travel insurance, may be affiliate links. If you buy through one of them, we may earn a small commission at no extra cost to you.</p>
      <p>Affiliate links never change the airline fees or rules we show. Airline data comes only from official airline pages.</p>
    </ProsePage>
  );
}
