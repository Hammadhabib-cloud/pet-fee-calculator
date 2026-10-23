import type { Metadata } from "next";
import ProsePage from "@/components/ProsePage";

export const metadata: Metadata = {
  title: "Disclaimer – Pet Flight Fee Calculator",
  description: "Airline pet fees and rules change often. Our calculator is a guide only; always confirm with the airline before you book.",
  alternates: { canonical: "/disclaimer" },
};

export default function Page() {
  return (
    <ProsePage title="Disclaimer">
      <p>Fees and rules change often. Always confirm with the airline before booking. This site is not affiliated with any airline.</p>
      <p>We check each airline&apos;s official pet policy and show the date of our last check, but airlines can change fees, carrier sizes and rules at any time. Results from the calculator are an estimate and are not a guarantee that your pet will be accepted.</p>
      <p>Airline names are used only to identify the airlines. All trademarks belong to their owners.</p>
    </ProsePage>
  );
}
