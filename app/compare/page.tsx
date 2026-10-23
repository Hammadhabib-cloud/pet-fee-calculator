import type { Metadata } from "next";
import Link from "next/link";
import { airlines, pageSlug } from "@/lib/airlines";
import { feeText, hasSingleCarrierLimit } from "@/lib/content";
import { formatDims } from "@/lib/calc";
import { formatDate, UNKNOWN_TEXT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Compare Airline Pet Fees (2026) – Side by Side",
  description: "Compare in-cabin pet fees, carrier size limits, weight limits and cargo options across US airlines in one table.",
  alternates: { canonical: "/compare" },
};

const dims = (d: { l: number; w: number; h: number } | null) => (d ? formatDims(d) : UNKNOWN_TEXT);

export default function ComparePage() {
  const rows: { label: string; value: (a: (typeof airlines)[number]) => React.ReactNode }[] = [
    { label: "In-cabin fee", value: (a) => feeText(a) },
    { label: "Soft-sided carrier max", value: (a) => dims(a.max_carrier_soft_in) + (hasSingleCarrierLimit(a) ? " (any carrier)" : "") },
    { label: "Hard-sided carrier max", value: (a) => dims(a.max_carrier_hard_in) + (hasSingleCarrierLimit(a) ? " (any carrier)" : "") },
    { label: "Weight limit", value: (a) => (a.max_weight_lbs != null ? `${a.max_weight_lbs} lbs` : "None stated") },
    { label: "Pets per carrier", value: (a) => a.pets_per_carrier ?? UNKNOWN_TEXT },
    { label: "Carriers per traveler", value: (a) => a.pets_per_passenger ?? UNKNOWN_TEXT },
    { label: "Cargo for large dogs", value: (a) => (a.cargo_available ? "Yes" : "No") },
    { label: "Pets allowed", value: (a) => a.species_allowed.join(", ") },
    { label: "Where pets can fly", value: (a) => a.international_notes ?? UNKNOWN_TEXT },
    { label: "Last checked", value: (a) => formatDate(a.last_checked) },
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Compare airline pet fees</h1>
      <p className="mt-3 text-lg text-slate-800">In-cabin pet rules for each airline, side by side. Tap an airline to calculate your exact total.</p>
      <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-200 bg-white">
        <table className="w-full min-w-[680px] text-left text-base">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="sticky left-0 bg-slate-50 p-4 font-semibold text-slate-800"><span className="sr-only">Rule</span></th>
              {airlines.map((a) => (
                <th key={a.slug} scope="col" className="p-4 font-semibold">
                  <Link href={`/${pageSlug(a)}`} className="text-brand-800 underline">{a.name}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.label} className="align-top">
                <th scope="row" className="sticky left-0 bg-white p-4 font-semibold text-slate-900">{r.label}</th>
                {airlines.map((a) => (
                  <td key={a.slug} className="p-4 text-slate-800">{r.value(a)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-slate-700 sm:hidden">Swipe the table sideways to see every airline.</p>
    </div>
  );
}
