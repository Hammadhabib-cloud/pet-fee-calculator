"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import type { Airline } from "@/lib/types";
import {
  calculate,
  cheaperAlternatives,
  formatDims,
  formatUsd,
  type CalcInput,
  type CalcResult,
  type CarrierType,
  type Oversize,
  type PetType,
  type TripType,
} from "@/lib/calc";
import { formatDate, NO_FEE_TEXT, UNKNOWN_TEXT } from "@/lib/site";
import { AlertIcon, ArrowRightIcon, BoxIcon, CalendarIcon, CheckIcon, ChevronIcon, ExternalIcon, InfoIcon, PawIcon, RulerIcon, WeightIcon, XIcon } from "./Icons";

const num = (v: string): number | null => {
  const n = parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};

const field =
  "mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-slate-900 shadow-sm placeholder:text-slate-500 focus:border-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-100";
const label = "block text-sm font-semibold text-slate-800";

function Segmented<T extends string>({ name, value, options, onChange }: { name: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
      {options.map((o) => (
        <label
          key={o.value}
          className={`cursor-pointer rounded-lg px-3 py-2.5 text-center text-base font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-600 ${
            value === o.value ? "bg-white text-brand-800 shadow-sm" : "text-slate-700 hover:text-slate-900"
          }`}
        >
          <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="sr-only" />
          {o.label}
        </label>
      ))}
    </div>
  );
}

export default function Calculator({ airlines, initialSlug }: { airlines: Airline[]; initialSlug?: string }) {
  const id = useId();
  const [slug, setSlug] = useState(initialSlug ?? airlines[0].slug);
  const [tripType, setTripType] = useState<TripType>("one_way");
  const [segments, setSegments] = useState(1);
  const [petType, setPetType] = useState<PetType>("dog");
  const [pets, setPets] = useState(1);
  const [weight, setWeight] = useState("");
  const [carrierType, setCarrierType] = useState<CarrierType>("soft");
  const [dims, setDims] = useState({ l: "", w: "", h: "" });

  const airline = airlines.find((a) => a.slug === slug) ?? airlines[0];
  const l = num(dims.l), w = num(dims.w), h = num(dims.h);
  const input: CalcInput = {
    tripType,
    segments,
    petType,
    pets,
    petWeightLbs: num(weight),
    carrier: l && w && h ? { l, w, h } : null,
    carrierType,
  };
  const result = calculate(airline, input);
  const alternatives = cheaperAlternatives(result, airlines, input);

  // On phones the result card sits below the form, so show a slim total bar until the card scrolls into view.
  const cardRef = useRef<HTMLElement>(null);
  const [cardVisible, setCardVisible] = useState(false);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setCardVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-8">
      <form className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" onSubmit={(e) => e.preventDefault()} aria-label="Pet fee calculator">
        <div className="space-y-5">
          <div>
            <label htmlFor={`${id}-airline`} className={label}>Airline</label>
            <select id={`${id}-airline`} className={field} value={slug} onChange={(e) => setSlug(e.target.value)}>
              {airlines.map((a) => (
                <option key={a.slug} value={a.slug}>{a.name}</option>
              ))}
            </select>
          </div>

          <fieldset>
            <legend className={label}>Trip</legend>
            <Segmented name={`${id}-trip`} value={tripType} onChange={setTripType} options={[{ value: "one_way", label: "One-way" }, { value: "round_trip", label: "Round-trip" }]} />
          </fieldset>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${id}-segments`} className={label}>Flights each way</label>
              <select id={`${id}-segments`} className={field} value={segments} onChange={(e) => setSegments(Number(e.target.value))}>
                <option value={1}>1 · direct</option>
                <option value={2}>2 · 1 stop</option>
                <option value={3}>3 · 2 stops</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-pets`} className={label}>Pets</label>
              <select id={`${id}-pets`} className={field} value={pets} onChange={(e) => setPets(Number(e.target.value))}>
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${id}-type`} className={label}>Pet type</label>
              <select id={`${id}-type`} className={field} value={petType} onChange={(e) => setPetType(e.target.value as PetType)}>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-weight`} className={label}>Pet + carrier (lbs)</label>
              <input id={`${id}-weight`} className={field} type="number" inputMode="decimal" min="0" step="0.1" placeholder="Optional" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
          </div>

          <fieldset>
            <legend className={label}>Carrier</legend>
            <Segmented name={`${id}-carrier`} value={carrierType} onChange={setCarrierType} options={[{ value: "soft", label: "Soft-sided" }, { value: "hard", label: "Hard-sided" }]} />
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(["l", "w", "h"] as const).map((k) => (
                <div key={k}>
                  <label htmlFor={`${id}-${k}`} className="block text-sm font-medium text-slate-800">
                    {k === "l" ? "Length" : k === "w" ? "Width" : "Height"}
                  </label>
                  <div className="relative">
                    <input id={`${id}-${k}`} className={`${field} pr-9`} type="number" inputMode="decimal" min="0" step="0.1" placeholder="0" value={dims[k]} onChange={(e) => setDims({ ...dims, [k]: e.target.value })} />
                    <span className="pointer-events-none absolute right-3 top-1/2 mt-[3px] -translate-y-1/2 text-sm text-slate-600">in</span>
                  </div>
                </div>
              ))}
            </div>
            <MeasureHelp />
          </fieldset>
        </div>
      </form>

      <div className="lg:sticky lg:top-6">
        <ResultCard ref={cardRef} result={result} alternatives={alternatives} pets={pets} />
      </div>

      <a
        href="#result"
        className={`fixed inset-x-3 bottom-3 z-20 flex items-center justify-between gap-3 rounded-2xl bg-brand-800 px-5 py-3.5 text-white shadow-xl transition lg:hidden ${cardVisible ? "pointer-events-none translate-y-24 opacity-0" : ""}`}
        aria-hidden={cardVisible}
        tabIndex={cardVisible ? -1 : 0}
      >
        <span className="text-sm font-medium text-brand-100">Total on {airline.name.replace(/ Airlines?$/, "")}</span>
        <span className="flex items-center gap-2 text-xl font-extrabold">
          {result.fee.status === "confirmed" ? formatUsd(result.fee.total) : "Check with airline"}
          <ArrowRightIcon className="h-5 w-5 rotate-90" />
        </span>
      </a>
    </div>
  );
}

function MeasureHelp() {
  return (
    <details className="group mt-4 rounded-xl border border-slate-200 bg-slate-50">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-brand-800">
        <span className="flex items-center gap-2"><RulerIcon className="h-4 w-4" /> How to measure your carrier</span>
        <ChevronIcon className="h-4 w-4 transition group-open:rotate-180" />
      </summary>
      <div className="flex flex-col gap-3 px-4 pb-4 text-sm leading-relaxed text-slate-800 sm:flex-row sm:gap-4">
        <svg viewBox="0 0 120 90" className="h-20 w-24 shrink-0 text-brand-700" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          <path d="M14 34 L74 34 L74 78 L14 78 Z" />
          <path d="M14 34 L40 16 L100 16 L74 34" />
          <path d="M100 16 L100 60 L74 78" />
          <text x="40" y="88" fontSize="10" fill="currentColor" stroke="none" fontWeight="700">L</text>
          <text x="90" y="74" fontSize="10" fill="currentColor" stroke="none" fontWeight="700">W</text>
          <text x="2" y="60" fontSize="10" fill="currentColor" stroke="none" fontWeight="700">H</text>
        </svg>
        <ul className="list-disc space-y-1 pl-4">
          <li>Measure the outside of the carrier, not the inside.</li>
          <li>Include pockets, handles, wheels or frames that stick out.</li>
          <li>Length is the longest side. Height runs from the floor to the top.</li>
          <li>Measure it zipped up, the way your pet will travel in it.</li>
        </ul>
      </div>
    </details>
  );
}

function Status({ kind, children }: { kind: "pass" | "fail" | "info"; children: React.ReactNode }) {
  const styles = { pass: "bg-green-100 text-green-900", fail: "bg-red-100 text-red-900", info: "bg-slate-100 text-slate-800" }[kind];
  const Icon = { pass: CheckIcon, fail: XIcon, info: InfoIcon }[kind];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-sm font-bold ${styles}`}>
      <Icon className="h-4 w-4" />
      {children}
    </span>
  );
}

function Row({ icon, title, detail, status }: { icon: React.ReactNode; title: string; detail: React.ReactNode; status: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 py-3.5">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="font-semibold text-slate-900">{title}</p>
          {status}
        </div>
        <div className="mt-0.5 text-sm leading-relaxed text-slate-700">{detail}</div>
      </div>
    </li>
  );
}

const oversizeText = (o: Oversize) => `${o.dimension[0].toUpperCase()}${o.dimension.slice(1)} is ${o.by} in too big (${o.actual} in vs ${o.max} in max)`;

function breakdown(r: CalcResult): string | null {
  if (r.fee.status !== "confirmed") return null;
  const parts = [formatUsd(r.fee.unitFee)];
  if (r.fee.units > 1) parts.push(`${r.fee.units} ${r.fee.unitLabel}s`);
  parts.push(r.fee.multiplierLabel);
  return `${parts.join(" × ")} = ${formatUsd(r.fee.total)}`;
}

function ResultCard({ result: r, alternatives, pets, ref }: { result: CalcResult; alternatives: CalcResult[]; pets: number; ref: React.Ref<HTMLElement> }) {
  const a = r.airline;
  const fit = r.carrierFit;
  const short = a.name.replace(/ Airlines?$/, "");
  return (
    <section ref={ref} id="result" aria-live="polite" aria-label="Your result" className="scroll-mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
      <div className="bg-brand-800 px-5 pb-6 pt-5 text-white sm:px-7 sm:pt-6">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-100">
          <PawIcon className="h-4 w-4" /> Total pet fee · {a.name}
        </p>
        {r.fee.status === "confirmed" ? (
          <>
            <p className="mt-2 text-7xl font-extrabold leading-none tracking-tight sm:text-8xl">{formatUsd(r.fee.total)}</p>
            <p className="mt-3 inline-block rounded-lg bg-white/10 px-3 py-1.5 text-lg font-semibold tabular-nums">{breakdown(r)}</p>
            <p className="mt-2 text-sm text-brand-100">
              {short} charges per {r.fee.unitLabel}, {a.fee_basis === "per_direction" ? "each way" : "per flight segment"}.
            </p>
          </>
        ) : r.fee.status === "not_allowed" ? (
          <p className="mt-3 text-3xl font-extrabold">Pets aren&apos;t allowed in the cabin</p>
        ) : (
          <>
            <p className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">{NO_FEE_TEXT}</p>
            <p className="mt-2 text-brand-100">We couldn&apos;t confirm {short}&apos;s current pet fee on its official site. Your carrier and pet checks below still apply.</p>
          </>
        )}
      </div>

      <ul className="divide-y divide-slate-100 px-5 sm:px-7">
        <Row
          icon={<RulerIcon />}
          title="Carrier size"
          detail={
            <>
              {fit.limit ? `Max ${fit.limitType}-sided: ${formatDims(fit.limit)}` : `No limit published. ${UNKNOWN_TEXT}.`}
              {fit.status === "fail" && (
                <ul className="mt-1 space-y-0.5 font-semibold text-red-800">
                  {fit.oversize.map((o) => (
                    <li key={o.dimension}>{oversizeText(o)}</li>
                  ))}
                </ul>
              )}
              {fit.status === "not_entered" && <span className="block">Enter your carrier&apos;s size to check it.</span>}
            </>
          }
          status={fit.status === "pass" ? <Status kind="pass">Fits</Status> : fit.status === "fail" ? <Status kind="fail">Too big</Status> : <Status kind="info">{fit.status === "unknown" ? "Check" : "Add size"}</Status>}
        />
        <Row
          icon={<WeightIcon />}
          title="Weight"
          detail={r.weight.limit != null ? `Max ${r.weight.limit} lbs (pet + carrier)` : "The airline doesn't publish a weight limit."}
          status={r.weight.status === "pass" ? <Status kind="pass">OK</Status> : r.weight.status === "fail" ? <Status kind="fail">Too heavy</Status> : <Status kind="info">{r.weight.limit == null ? "Not stated by airline" : "Add weight"}</Status>}
        />
        <Row
          icon={<PawIcon />}
          title="Pet type"
          detail={`Allowed: ${r.species.allowed.join(", ")}`}
          status={r.species.status === "pass" ? <Status kind="pass">Allowed</Status> : r.species.status === "fail" ? <Status kind="fail">Not allowed</Status> : <Status kind="info">Check list</Status>}
        />
        <Row
          icon={<PawIcon />}
          title="Number of pets"
          detail={
            r.capacity.ok
              ? `${pets} pet${pets > 1 ? "s" : ""} in ${r.capacity.carriersNeeded} carrier${r.capacity.carriersNeeded > 1 ? "s" : ""}`
              : `You'd need ${r.capacity.carriersNeeded} carriers, which means ${r.capacity.travelersNeeded} travelers (1 carrier each).`
          }
          status={r.capacity.ok ? <Status kind="pass">OK</Status> : <Status kind="fail">Too many</Status>}
        />
        <Row
          icon={<BoxIcon />}
          title="Cargo for large dogs"
          detail={r.cargoAvailable ? "Available" : "Not offered. Pets fly in the cabin only."}
          status={<Status kind={r.cargoAvailable ? "pass" : "info"}>{r.cargoAvailable ? "Yes" : "No"}</Status>}
        />
      </ul>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 bg-slate-50 px-5 py-4 text-sm text-slate-800 sm:px-7">
        <span className="flex items-center gap-1.5"><CalendarIcon className="h-4 w-4 text-brand-700" /> Last checked: {formatDate(a.last_checked)}</span>
        {a.source_url && (
          <a href={a.source_url} className="flex items-center gap-1.5 font-semibold text-brand-800 underline underline-offset-2" rel="noopener" target="_blank">
            Official {short} pet policy <ExternalIcon className="h-4 w-4" />
          </a>
        )}
      </div>

      {alternatives.length > 0 && (
        <div className="border-t border-slate-100 px-5 py-5 sm:px-7">
          <h3 className="font-bold text-slate-900">{r.fee.status === "confirmed" ? "Cheaper alternatives" : "Airlines with a confirmed fee for this trip"}</h3>
          <ul className="mt-3 space-y-2">
            {alternatives.map((alt) => (
              <li key={alt.airline.slug}>
                <Link href={`/${alt.airline.slug}-pet-fee`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 hover:border-brand-600 hover:bg-brand-50">
                  <span className="font-semibold text-slate-900">
                    {alt.airline.name}
                    {alt.carrierFit.status === "fail" && (
                      <span className="mt-0.5 flex items-center gap-1 text-sm font-medium text-red-800"><AlertIcon className="h-4 w-4" /> Your carrier is too big here</span>
                    )}
                  </span>
                  <span className="flex items-center gap-2 text-lg font-extrabold text-brand-800">
                    {alt.fee.status === "confirmed" && formatUsd(alt.fee.total)}
                    <ArrowRightIcon className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
