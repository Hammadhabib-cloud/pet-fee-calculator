import type { Metadata } from "next";
import ProsePage from "@/components/ProsePage";

export const metadata: Metadata = {
  title: "About Pet Flight Fee Calculator",
  description: "Why we built a free calculator for flying with a dog or cat, and how we check airline pet fees and carrier rules.",
  alternates: { canonical: "/about" },
};

export default function Page() {
  return (
    <ProsePage title="About this site">
      <p>Pet Flight Fee Calculator helps you work out what it costs to fly with a dog or cat and whether your carrier meets the airline&apos;s rules.</p>
      <p>Every fee, size and rule comes from the airline&apos;s own website. Each airline page shows the date we last checked it and links to the official source. When an airline doesn&apos;t publish a value, or we can&apos;t confirm it, we say &quot;Check with airline&quot; instead of guessing.</p>
      <p>This site is independent and is not affiliated with any airline.</p>
    </ProsePage>
  );
}
