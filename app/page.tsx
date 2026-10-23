import Link from "next/link";
import Calculator from "@/components/Calculator";
import FaqList, { faqJsonLd, JsonLd } from "@/components/FaqList";
import RecommendedCarriers from "@/components/RecommendedCarriers";
import { ArrowRightIcon, CalendarIcon, PlaneIcon, ShieldIcon } from "@/components/Icons";
import { airlines, pageSlug } from "@/lib/airlines";
import { feeText, homeFaqs } from "@/lib/content";
import { formatDate } from "@/lib/site";

export default function Home() {
  const faqs = homeFaqs(airlines);
  const latest = airlines.map((a) => a.last_checked).sort().at(-1)!;
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <section className="border-b border-brand-100 bg-gradient-to-b from-brand-50 to-canvas">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
            What does it cost to fly with your pet?
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-800">
            Get the total in-cabin pet fee for your trip and check that your carrier fits, in under a minute.
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-slate-800">
            <li className="flex items-center gap-1.5"><ShieldIcon className="h-4 w-4 text-brand-700" /> Official airline sources</li>
            <li className="flex items-center gap-1.5"><CalendarIcon className="h-4 w-4 text-brand-700" /> Checked {formatDate(latest)}</li>
            <li className="flex items-center gap-1.5"><PlaneIcon className="h-4 w-4 text-brand-700" /> Free, no sign-up</li>
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <Calculator airlines={airlines} initialSlug="southwest" />
      </div>

      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6" aria-labelledby="airlines">
        <h2 id="airlines" className="text-2xl font-bold text-slate-900 sm:text-3xl">Pet fees by airline</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-3">
          {airlines.map((a) => (
            <li key={a.slug}>
              <Link href={`/${pageSlug(a)}`} className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 transition hover:border-brand-600 hover:shadow-md">
                <span className="text-lg font-bold text-slate-900">{a.name}</span>
                <span className="mt-1 flex-1 text-slate-800">{feeText(a)}</span>
                <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand-800">
                  See rules &amp; calculator <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/compare" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white hover:bg-brand-800">
          Compare all airlines side by side <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </section>

      <section className="mx-auto mt-16 max-w-3xl px-4 sm:px-6" aria-labelledby="faq">
        <h2 id="faq" className="text-2xl font-bold text-slate-900 sm:text-3xl">Common questions about flying with pets</h2>
        <FaqList items={faqs} />
      </section>

      <RecommendedCarriers />
    </>
  );
}
