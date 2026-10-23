import type { Airline } from "@/lib/types";
import { formatDims } from "@/lib/calc";
import { hasSingleCarrierLimit } from "@/lib/content";
import { UNKNOWN_TEXT } from "@/lib/site";
import { RulerIcon } from "./Icons";

export default function CarrierBox({ airline: a }: { airline: Airline }) {
  const rows = hasSingleCarrierLimit(a)
    ? [{ label: "Any carrier", dims: a.max_carrier_soft_in }]
    : [
        { label: "Soft-sided", dims: a.max_carrier_soft_in },
        { label: "Hard-sided", dims: a.max_carrier_hard_in },
      ];
  return (
    <section aria-labelledby="carrier-size" className="rounded-3xl border-2 border-brand-600 bg-white p-6">
      <h2 id="carrier-size" className="flex items-center gap-2 text-lg font-bold text-slate-900">
        <RulerIcon className="h-5 w-5 text-brand-700" /> Maximum carrier size
      </h2>
      <dl className="mt-4 divide-y divide-slate-100">
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-3 py-2.5">
            <dt className="text-slate-800">{r.label}</dt>
            <dd className="text-xl font-extrabold tabular-nums text-slate-900">{r.dims ? formatDims(r.dims) : UNKNOWN_TEXT}</dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-3 py-2.5">
          <dt className="text-slate-800">Weight limit</dt>
          <dd className="font-bold text-slate-900">{a.max_weight_lbs != null ? `${a.max_weight_lbs} lbs` : "Not stated by airline"}</dd>
        </div>
      </dl>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">Length × width × height, measured on the outside. The carrier must fit under the seat in front of you.</p>
    </section>
  );
}
