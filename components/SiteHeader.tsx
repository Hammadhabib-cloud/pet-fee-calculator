import Link from "next/link";
import { PawIcon } from "./Icons";
import { SITE_NAME } from "@/lib/site";

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6" aria-label="Main">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-700 text-white">
            <PawIcon className="h-5 w-5" />
          </span>
          <span className="leading-tight">{SITE_NAME}</span>
        </Link>
        <Link href="/compare" className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-brand-800 hover:bg-brand-50">
          Compare airlines
        </Link>
      </nav>
    </header>
  );
}
