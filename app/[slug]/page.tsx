import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Calculator from "@/components/Calculator";
import CarrierBox from "@/components/CarrierBox";
import FaqList, { faqJsonLd, JsonLd } from "@/components/FaqList";
import RecommendedCarriers from "@/components/RecommendedCarriers";
import { AlertIcon, ArrowRightIcon, BoxIcon, CalendarIcon, ExternalIcon, PawIcon, RulerIcon, WeightIcon } from "@/components/Icons";
import { airlineByPageSlug, airlines, pageSlug, shortName } from "@/lib/airlines";
import { faqs, feeText, summary } from "@/lib/content";
import { formatDims } from "@/lib/calc";
import { formatDate, UNKNOWN_TEXT } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return airlines.map((a) => ({ slug: pageSlug(a) }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = airlineByPageSlug((await params).slug);
  if (!a) return {};
  const n = shortName(a);
  const size = a.max_carrier_soft_in ?? a.max_carrier_hard_in;
  const fee = a.in_cabin_fee_usd != null ? `${n} pet fee: ${feeText(a)}.` : `${n} pet fee not confirmed, so check with the airline.`;
  const title = `${n} Pet Fee Calculator (2026) – Cost, Size & Rules`;
  const description = `${fee}${size ? ` Max carrier ${formatDims(size)}.` : ""} Work out your total and check your carrier fits.`;
  return {
    title,
    description,
    alternates: { canonical: `/${pageSlug(a)}` },
    openGraph: { title, description, url: `/${pageSlug(a)}` },
  };
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <dt className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">{icon}{label}</dt>
      <dd className="mt-1 text-base font-bold leading-snug text-slate-900 sm:text-lg">{value}</dd>
    </div>
  );
}

export default async function AirlinePage({ params }: Props) {
  const a = airlineByPageSlug((await params).slug);
  if (!a) notFound();
  const n = shortName(a);
  const faqList = faqs(a);
  // Up to three related airlines, cheapest confirmed fees first.
  const others = airlines
    .filter((x) => x.slug !== a.slug)
    .sort((x, y) => (x.in_cabin_fee_usd ?? Infinity) - (y.in_cabin_fee_usd ?? Infinity))
    .slice(0, 3);
  const size = a.max_carrier_soft_in ?? a.max_carrier_hard_in;

  return (
    <>
      <JsonLd data={faqJsonLd(faqList)} />
      <section className="border-b border-brand-100 bg-gradient-to-b from-brand-50 to-canvas">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-6 sm:px-6 sm:pt-10">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-700">
            <Link href="/" className="underline-offset-2 hover:underline">Home</Link> <span aria-hidden="true">›</span> {a.name}
          </nav>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">{n} Pet Fee Calculator</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-800">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-semibold shadow-sm ring-1 ring-slate-200">
              <CalendarIcon className="h-4 w-4 text-brand-700" /> Last updated {formatDate(a.last_checked)}
            </span>
            {a.source_url && (
              <a href={a.source_url} className="inline-flex items-center gap-1.5 font-semibold text-brand-800 underline underline-offset-2" rel="noopener" target="_blank">
                Checked against {n}&apos;s official pet policy <ExternalIcon className="h-4 w-4" />
              </a>
            )}
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Fact icon={<PawIcon className="h-4 w-4 text-brand-700" />} label="In-cabin fee" value={feeText(a)} />
            <Fact icon={<RulerIcon className="h-4 w-4 text-brand-700" />} label="Max carrier" value={size ? formatDims(size) : UNKNOWN_TEXT} />
            <Fact icon={<WeightIcon className="h-4 w-4 text-brand-700" />} label="Weight limit" value={a.max_weight_lbs != null ? `${a.max_weight_lbs} lbs` : "Not stated by airline"} />
            <Fact icon={<BoxIcon className="h-4 w-4 text-brand-700" />} label="Cargo" value={a.cargo_available ? "Available" : "Cabin only"} />
          </dl>
          {a.international_notes && (
            <aside role="note" aria-labelledby="where" className="mt-5 flex gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4">
              <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
              <div>
                <h2 id="where" className="font-bold text-amber-950">Where your pet can fly</h2>
                <p className="mt-1 leading-relaxed text-amber-950">{a.international_notes}</p>
              </div>
            </aside>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <Calculator airlines={airlines} initialSlug={a.slug} />
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.6fr_1fr]">
        <section aria-labelledby="summary">
          <h2 id="summary" className="text-2xl font-bold text-slate-900 sm:text-3xl">{n} pet policy in plain English</h2>
          <div className="mt-4 space-y-4 text-lg leading-relaxed text-slate-800">
            {summary(a).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>
        <div>
          <CarrierBox airline={a} />
        </div>
      </div>

      <section className="mx-auto mt-16 max-w-3xl px-4 sm:px-6" aria-labelledby="faq">
        <h2 id="faq" className="text-2xl font-bold text-slate-900 sm:text-3xl">{n} pet policy FAQ</h2>
        <FaqList items={faqList} />
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6" aria-labelledby="related">
        <h2 id="related" className="text-2xl font-bold text-slate-900">Compare with other airlines</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-3">
          {others.map((r) => (
            <li key={r.slug}>
              <Link href={`/${pageSlug(r)}`} className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 transition hover:border-brand-600 hover:shadow-md">
                <span className="text-lg font-bold text-slate-900">{r.name} pet fee</span>
                <span className="mt-1 flex-1 text-slate-800">{feeText(r)}</span>
                <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand-800">View <ArrowRightIcon className="h-4 w-4" /></span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/compare" className="flex h-full flex-col justify-between rounded-3xl bg-brand-700 p-5 text-white transition hover:bg-brand-800">
              <span className="text-lg font-bold">All airlines side by side</span>
              <span className="mt-4 flex items-center gap-1 text-sm font-semibold">Open comparison <ArrowRightIcon className="h-4 w-4" /></span>
            </Link>
          </li>
        </ul>
      </section>

      <RecommendedCarriers />
    </>
  );
}
