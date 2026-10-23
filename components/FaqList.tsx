import { ChevronIcon } from "./Icons";

export function faqJsonLd(list: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: list.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export default function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="mt-5 divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white">
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50 sm:px-6">
            <h3 className="text-base font-semibold text-slate-900 sm:text-lg">{f.q}</h3>
            <ChevronIcon className="h-5 w-5 shrink-0 text-brand-700 transition group-open:rotate-180" />
          </summary>
          <p className="px-5 pb-5 leading-relaxed text-slate-800 sm:px-6">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
