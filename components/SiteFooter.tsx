import Link from "next/link";
import { airlines, pageSlug } from "@/lib/airlines";
import { DISCLAIMER, SITE_NAME } from "@/lib/site";
import { InfoIcon, PawIcon } from "./Icons";

export default function SiteFooter() {
  return (
    <footer className="mt-20 bg-slate-900 text-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="flex gap-3 rounded-xl bg-slate-800 p-4 text-base text-white">
          <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-200" />
          {DISCLAIMER}
        </p>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          <div>
            <p className="flex items-center gap-2 font-bold text-white">
              <PawIcon className="h-5 w-5 text-brand-200" /> {SITE_NAME}
            </p>
            <p className="mt-2 text-sm leading-relaxed">Free pet travel cost calculator. Data from official airline pages only.</p>
          </div>
          <nav aria-label="Airline pet fees">
            <h2 className="font-semibold text-white">Airline pet fees</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {airlines.map((a) => (
                <li key={a.slug}><Link href={`/${pageSlug(a)}`} className="hover:text-white hover:underline">{a.name} pet fee</Link></li>
              ))}
              <li><Link href="/compare" className="hover:text-white hover:underline">Compare all airlines</Link></li>
            </ul>
          </nav>
          <nav aria-label="About">
            <h2 className="font-semibold text-white">About</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white hover:underline">About</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white hover:underline">Disclaimer</Link></li>
              <li><Link href="/privacy" className="hover:text-white hover:underline">Privacy</Link></li>
              <li><Link href="/affiliate-disclosure" className="hover:text-white hover:underline">Affiliate disclosure</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
