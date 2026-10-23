import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { calculate, cheaperAlternatives, type CalcInput } from "./calc.ts";
import type { Airline } from "./types.ts";

const airlines: Airline[] = JSON.parse(readFileSync(new URL("../data/airlines.json", import.meta.url), "utf8"));
const get = (slug: string) => airlines.find((a) => a.slug === slug)!;

const base: CalcInput = { tripType: "one_way", segments: 1, petType: "dog", pets: 1, petWeightLbs: null, carrier: null, carrierType: "soft" };

test("one-way direct", () => {
  const r = calculate(get("frontier"), base);
  assert.equal(r.fee.status === "confirmed" && r.fee.total, 149);
});

test("round-trip with one connection is charged per direction, not per segment", () => {
  const input = { ...base, tripType: "round_trip" as const, segments: 2 };
  const sw = calculate(get("southwest"), input);
  const fr = calculate(get("frontier"), input);
  assert.equal(sw.fee.status === "confirmed" && sw.fee.total, 250);
  assert.equal(fr.fee.status === "confirmed" && fr.fee.total, 298);
});

test("Southwest charges per carrier, so two pets in one carrier pay once", () => {
  const r = calculate(get("southwest"), { ...base, pets: 2 });
  assert.equal(r.fee.status === "confirmed" && r.fee.total, 125);
  assert.equal(r.capacity.ok, true);
});

test("Frontier allows one pet per traveler", () => {
  const r = calculate(get("frontier"), { ...base, pets: 2 });
  assert.equal(r.capacity.travelersNeeded, 2);
});

test("null fee is never shown as $0", () => {
  const r = calculate(get("spirit"), base);
  assert.equal(r.fee.status, "unconfirmed");
});

test("oversized carrier fails the fit check, even when the fee is unconfirmed", () => {
  const big = { l: 20, w: 15, h: 12 };
  for (const slug of ["southwest", "spirit", "frontier"]) {
    assert.equal(calculate(get(slug), { ...base, carrier: big }).carrierFit.status, "fail", slug);
  }
  assert.equal(calculate(get("spirit"), { ...base, carrier: { l: 17, w: 13, h: 9 } }).carrierFit.status, "pass");
});

test("Frontier hard and soft limits differ", () => {
  const c = { l: 18, w: 14, h: 10 };
  assert.equal(calculate(get("frontier"), { ...base, carrier: c, carrierType: "soft" }).carrierFit.status, "pass");
  assert.equal(calculate(get("frontier"), { ...base, carrier: c, carrierType: "hard" }).carrierFit.status, "fail");
});

test("cheaper alternatives leave out airlines with a null fee", () => {
  const cur = calculate(get("frontier"), base);
  const alts = cheaperAlternatives(cur, airlines, base);
  assert.deepEqual(alts.map((a) => a.airline.slug), ["southwest"]);
  const fromSpirit = cheaperAlternatives(calculate(get("spirit"), base), airlines, base);
  assert.ok(fromSpirit.every((a) => a.fee.status === "confirmed"));
});

test("oversize reports which dimension is too big and by how much", () => {
  const r = calculate(get("southwest"), { ...base, carrier: { l: 18, w: 12, h: 10.5 } });
  assert.deepEqual(r.carrierFit.oversize, [
    { dimension: "width", by: 1.5, actual: 12, max: 10.5 },
    { dimension: "height", by: 0.5, actual: 10.5, max: 10 },
  ]);
});

test("American charges per kennel each way; Delta has no fixed carrier limit", () => {
  const aa = calculate(get("american"), { ...base, tripType: "round_trip", segments: 2 });
  assert.equal(aa.fee.status === "confirmed" && aa.fee.total, 300);
  const dl = calculate(get("delta"), { ...base, carrier: { l: 18, w: 11, h: 11 } });
  assert.equal(dl.fee.status === "confirmed" && dl.fee.total, 150);
  assert.equal(dl.carrierFit.status, "unknown");
  assert.equal(calculate(get("jetblue"), base).fee.status, "unconfirmed");
});
