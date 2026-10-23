import type { Metadata } from "next";
import ProsePage from "@/components/ProsePage";

export const metadata: Metadata = {
  title: "Privacy Policy – Pet Flight Fee Calculator",
  description: "How Pet Flight Fee Calculator handles your information. The calculator runs in your browser and does not store what you enter.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return (
    <ProsePage title="Privacy policy">
      <p>The calculator runs entirely in your browser. The details you enter, such as your pet&apos;s weight or carrier size, are not sent to us or stored.</p>
      <p>We use Vercel Analytics to count page views and see which pages are popular. It does not use cookies and does not collect information that identifies you personally.</p>
      <p>Links to airlines and other websites take you to sites with their own privacy policies. If we add advertising or affiliate tracking, we will update this page.</p>
    </ProsePage>
  );
}
