import type { Airline, Dimensions } from "./types.ts";

export type TripType = "one_way" | "round_trip";
export type PetType = "dog" | "cat" | "other";
export type CarrierType = "hard" | "soft";

export type CalcInput = {
  tripType: TripType;
  segments: number; // flight segments each way: direct = 1, one connection = 2
  petType: PetType;
  pets: number;
  petWeightLbs: number | null; // pet + carrier
  carrier: Dimensions | null;
  carrierType: CarrierType;
};

export type FeeResult =
  | { status: "confirmed"; total: number; unitFee: number; units: number; unitLabel: "pet" | "carrier"; multiplier: number; multiplierLabel: string }
  | { status: "unconfirmed" }
  | { status: "not_allowed" };

export type Check = "pass" | "fail" | "unknown";

export type CalcResult = {
  airline: Airline;
  fee: FeeResult;
  carrierFit: { status: Check | "not_entered"; limit: Dimensions | null; limitType: CarrierType | null; oversize: Oversize[] };
  weight: { status: Check | "not_entered"; limit: number | null };
  species: { status: Check; allowed: string[] };
  capacity: { carriersNeeded: number; travelersNeeded: number; ok: boolean };
  cargoAvailable: boolean;
};

export function carriersNeeded(airline: Airline, pets: number): number {
  return Math.ceil(pets / (airline.pets_per_carrier ?? 1));
}

export function calcFee(airline: Airline, input: CalcInput): FeeResult {
  if (!airline.in_cabin_allowed) return { status: "not_allowed" };
  const fee = airline.in_cabin_fee_usd;
  // A missing fee, basis or per-unit rule means we cannot compute a total. Never fall back to $0.
  if (fee == null || airline.fee_basis == null || airline.fee_per == null) return { status: "unconfirmed" };

  const directions = input.tripType === "round_trip" ? 2 : 1;
  const segments = Math.max(1, Math.floor(input.segments));
  const multiplier = airline.fee_basis === "per_segment" ? segments * directions : directions;
  const multiplierLabel =
    airline.fee_basis === "per_segment"
      ? `${segments * directions} flight segment${segments * directions > 1 ? "s" : ""}`
      : `${directions} direction${directions > 1 ? "s" : ""}`;

  const units = airline.fee_per === "carrier" ? carriersNeeded(airline, input.pets) : input.pets;
  return { status: "confirmed", total: fee * multiplier * units, unitFee: fee, units, unitLabel: airline.fee_per, multiplier, multiplierLabel };
}

export function carrierLimit(airline: Airline, type: CarrierType): { limit: Dimensions | null; limitType: CarrierType | null } {
  const preferred = type === "hard" ? airline.max_carrier_hard_in : airline.max_carrier_soft_in;
  if (preferred) return { limit: preferred, limitType: type };
  return { limit: null, limitType: null };
}

export function fits(carrier: Dimensions, limit: Dimensions): boolean {
  return carrier.l <= limit.l && carrier.w <= limit.w && carrier.h <= limit.h;
}

export type Oversize = { dimension: "length" | "width" | "height"; by: number; actual: number; max: number };

// Which dimensions exceed the limit, and by how many inches.
export function oversizeBy(carrier: Dimensions, limit: Dimensions): Oversize[] {
  const names = { l: "length", w: "width", h: "height" } as const;
  return (["l", "w", "h"] as const)
    .filter((k) => carrier[k] > limit[k])
    .map((k) => ({ dimension: names[k], by: Math.round((carrier[k] - limit[k]) * 100) / 100, actual: carrier[k], max: limit[k] }));
}

export function calculate(airline: Airline, input: CalcInput): CalcResult {
  const { limit, limitType } = carrierLimit(airline, input.carrierType);
  const carrierStatus = !input.carrier ? "not_entered" : !limit ? "unknown" : fits(input.carrier, limit) ? "pass" : "fail";

  const weightLimit = airline.max_weight_lbs;
  const weightStatus =
    input.petWeightLbs == null ? "not_entered" : weightLimit == null ? "unknown" : input.petWeightLbs <= weightLimit ? "pass" : "fail";

  const allowed = airline.species_allowed;
  const speciesStatus: Check =
    input.petType === "other" ? (allowed.some((s) => s !== "dog" && s !== "cat") ? "unknown" : "fail") : allowed.includes(input.petType) ? "pass" : "fail";

  const needed = carriersNeeded(airline, input.pets);
  const perTraveler = airline.pets_per_passenger ?? 1;
  const travelersNeeded = Math.ceil(needed / perTraveler);

  return {
    airline,
    fee: calcFee(airline, input),
    carrierFit: { status: carrierStatus, limit, limitType, oversize: input.carrier && limit ? oversizeBy(input.carrier, limit) : [] },
    weight: { status: weightStatus, limit: weightLimit },
    species: { status: speciesStatus, allowed },
    capacity: { carriersNeeded: needed, travelersNeeded, ok: travelersNeeded <= 1 },
    cargoAvailable: airline.cargo_available,
  };
}

// Other airlines with a confirmed, lower total for the same trip. Airlines with an unconfirmed fee are left out.
export function cheaperAlternatives(current: CalcResult, all: Airline[], input: CalcInput): CalcResult[] {
  return all
    .filter((a) => a.slug !== current.airline.slug)
    .map((a) => calculate(a, input))
    .filter((r) => r.fee.status === "confirmed" && r.species.status !== "fail")
    .filter((r) => current.fee.status !== "confirmed" || (r.fee.status === "confirmed" && r.fee.total < current.fee.total))
    .sort((a, b) => (a.fee.status === "confirmed" ? a.fee.total : 0) - (b.fee.status === "confirmed" ? b.fee.total : 0));
}

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

export function formatDims(d: Dimensions): string {
  return `${d.l} × ${d.w} × ${d.h} in`;
}
