import Link from "next/link";

// Affiliate slots. Add real links here; the section stays hidden until at least one has an href.
// Keep rel="sponsored nofollow" on every affiliate link.
const carriers: { name: string; note: string; href: string | null }[] = [
  { name: "Soft-sided under-seat carrier (small)", note: "For small cats and toy dogs", href: null },
  { name: "Expandable soft-sided carrier", note: "Extra room once you're seated", href: null },
  { name: "Low-profile carrier for tight seats", note: "Good for lower height limits", href: null },
];

// Pet travel insurance referral slot. Hidden until a link is added.
const insurance: { text: string; href: string | null } = { text: "Compare pet travel insurance", href: null };

export default function RecommendedCarriers() {
  const live = carriers.filter((c) => c.href);
  if (!live.length && !insurance.href) return null;
  return (
    <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6" aria-labelledby="rec-carriers">
      <h2 id="rec-carriers" className="text-2xl font-bold text-slate-900">Recommended carriers</h2>
      <p className="mt-2 text-slate-700">
        Always measure your carrier against the airline&apos;s limits. These are affiliate links (
        <Link href="/affiliate-disclosure" className="underline">disclosure</Link>).
      </p>
      <ul className="mt-4 grid gap-4 sm:grid-cols-3">
        {live.map((c) => (
          <li key={c.name} className="rounded-2xl border border-slate-200 bg-white p-5">
            <a href={c.href!} rel="sponsored nofollow" className="font-semibold text-brand-800 underline">{c.name}</a>
            <p className="mt-1 text-slate-700">{c.note}</p>
          </li>
        ))}
      </ul>
      {insurance.href && (
        <a href={insurance.href} rel="sponsored nofollow" className="mt-4 block rounded-2xl border border-slate-200 bg-white p-5 font-semibold text-brand-800 underline">
          {insurance.text}
        </a>
      )}
    </section>
  );
}
