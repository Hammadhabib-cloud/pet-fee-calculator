import type { Airline } from "./types";
import { formatDims, formatUsd } from "./calc";
import { shortName } from "./airlines";
import { NO_FEE_TEXT, UNKNOWN_TEXT } from "./site";

export function feeText(a: Airline): string {
  if (!a.in_cabin_allowed) return "Pets are not allowed in the cabin";
  if (a.in_cabin_fee_usd == null || a.fee_basis == null || a.fee_per == null) return NO_FEE_TEXT;
  const basis = a.fee_basis === "per_direction" ? "each way" : "per flight segment";
  return `${formatUsd(a.in_cabin_fee_usd)} per ${a.fee_per}, ${basis}`;
}

export function hasSingleCarrierLimit(a: Airline): boolean {
  const h = a.max_carrier_hard_in;
  const s = a.max_carrier_soft_in;
  return !!h && !!s && h.l === s.l && h.w === s.w && h.h === s.h;
}

export function speciesText(a: Airline): string {
  const list = a.species_allowed.map((s) => (s === "dog" ? "dogs" : s === "cat" ? "cats" : s.endsWith("s") ? s : `${s}s`));
  if (list.length <= 1) return list.join("");
  return `${list.slice(0, -1).join(", ")} and ${list[list.length - 1]}`;
}

function carrierText(a: Airline): string {
  if (hasSingleCarrierLimit(a)) {
    return `Your carrier can be up to ${formatDims(a.max_carrier_soft_in!)} (length × width × height), and it has to fit under the seat in front of you.`;
  }
  const parts: string[] = [];
  if (a.max_carrier_hard_in) parts.push(`${formatDims(a.max_carrier_hard_in)} for a hard-sided carrier`);
  if (a.max_carrier_soft_in) parts.push(`${formatDims(a.max_carrier_soft_in)} for a soft-sided carrier`);
  if (!parts.length) return `${shortName(a)} does not publish a maximum carrier size. ${UNKNOWN_TEXT}.`;
  return `The maximum is ${parts.join(" and ")}. The carrier has to fit under the seat in front of you.`;
}

function weightText(a: Airline): string {
  return a.max_weight_lbs == null
    ? `${shortName(a)} does not state a weight limit. Your pet just needs to fit comfortably in an approved carrier.`
    : `The pet and carrier together can weigh up to ${a.max_weight_lbs} lbs.`;
}

function petsText(a: Airline): string {
  const perCarrier = a.pets_per_carrier;
  const perTraveler = a.pets_per_passenger ?? 1;
  const carriers = `${perTraveler} carrier${perTraveler > 1 ? "s" : ""} per traveler`;
  if (perCarrier == null) return `You can bring ${carriers}. ${shortName(a)} doesn't say how many pets can share a carrier, so check with the airline.`;
  return perCarrier > 1
    ? `You can bring ${carriers}, and up to ${perCarrier} pets can share one carrier.`
    : `You can bring ${carriers}, with ${perCarrier} pet per carrier.`;
}

function feeAnswer(a: Airline): string {
  if (a.in_cabin_fee_usd == null || a.fee_basis == null || a.fee_per == null) {
    return `${shortName(a)} charges a fee for each pet carrier, but we have not been able to confirm the current amount on its official site. Check the fee with ${shortName(a)} before you book.`;
  }
  const basis = a.fee_basis === "per_direction" ? "each way" : "for every flight segment";
  const per =
    a.fee_per === "carrier"
      ? `The fee is per carrier, not per pet, so two pets sharing one carrier pay a single fee.`
      : `The fee is charged for each pet.`;
  const roundTrip = a.fee_basis === "per_direction" ? ` A round trip costs ${formatUsd(a.in_cabin_fee_usd * 2)}, even with a connection.` : "";
  return `${shortName(a)} charges ${formatUsd(a.in_cabin_fee_usd)} ${basis} for a dog or cat in the cabin. ${per}${roundTrip}`;
}

export function summary(a: Airline): string[] {
  const n = shortName(a);
  const p: string[] = [];
  p.push(
    a.in_cabin_allowed
      ? `${n} lets small ${speciesText(a)} fly in the cabin with you. The pet fee is ${feeText(a).replace(NO_FEE_TEXT, "not confirmed yet, so check it with the airline")}.`
      : `${n} does not allow pets in the cabin.`,
  );
  p.push(carrierText(a));
  p.push(`${petsText(a)} ${weightText(a)}`);
  p.push(a.cargo_available ? `Larger pets have a cargo option. ${a.cargo_notes ?? ""}`.trim() : `${n} does not fly pets in the cargo hold, so large dogs that can't fit under the seat can't travel with this airline.`);
  return p;
}

export function faqs(a: Airline): { q: string; a: string }[] {
  const n = shortName(a);
  const list = [
    { q: `How much does ${n} charge for a dog in cabin?`, a: feeAnswer(a) },
    { q: `What size carrier fits on ${n}?`, a: carrierText(a) },
    {
      q: `Can large dogs fly on ${n}?`,
      a: a.cargo_available
        ? `Yes. Dogs too big for the cabin can travel as cargo. ${a.cargo_notes ?? ""}`.trim()
        : `No. ${n} only takes pets in the cabin, so your dog has to fit in a carrier under the seat. It has no cargo or checked-pet option.`,
    },
    { q: `Is there a weight limit for pets on ${n}?`, a: weightText(a) },
    { q: `How many pets can I bring on ${n}?`, a: petsText(a) },
  ];
  if (a.international_notes) {
    list.push({ q: `Can I fly internationally with my pet on ${n}?`, a: a.international_notes });
  }
  return list;
}

const confirmedFee = (a: Airline) => a.in_cabin_allowed && a.in_cabin_fee_usd != null && a.fee_basis != null && a.fee_per != null;

function listNames(names: string[]): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

// Homepage FAQs, built from the data so they never drift from the verified values.
export function homeFaqs(all: Airline[]): { q: string; a: string }[] {
  const priced = all.filter(confirmedFee).sort((x, y) => x.in_cabin_fee_usd! - y.in_cabin_fee_usd!);
  const unpriced = all.filter((a) => !confirmedFee(a)).map(shortName);
  const feeLines = priced.map((a) => `${shortName(a)} charges ${feeText(a)}`).join("; ");
  const unpricedLine = unpriced.length ? ` We couldn't confirm ${listNames(unpriced)}'s fee on its official site, so check with the airline.` : "";
  const perDirection = all.filter((a) => a.fee_basis === "per_direction").map(shortName);
  const noCargo = all.filter((a) => !a.cargo_available).map(shortName);
  const noWeight = all.filter((a) => a.max_weight_lbs == null).map(shortName);
  const sizes = all
    .filter((a) => a.max_carrier_soft_in)
    .map((a) => (hasSingleCarrierLimit(a) ? `${shortName(a)} ${formatDims(a.max_carrier_soft_in!)}` : `${shortName(a)} ${formatDims(a.max_carrier_soft_in!)} soft-sided`));

  return [
    {
      q: "How much does it cost to fly a dog?",
      a: `Flying a small dog in the cabin usually costs a fixed fee for each flight direction. ${feeLines}.${unpricedLine} A round trip costs double. Use the calculator above for your exact total.`,
    },
    {
      q: "How much does it cost to fly a cat?",
      a: `Cats pay the same in-cabin fee as small dogs on the airlines we track. ${feeLines}.${unpricedLine}`,
    },
    {
      q: "Do you pay the pet fee each way?",
      a: perDirection.length
        ? `Yes. ${listNames(perDirection)} charge the pet fee once for each direction, so a round trip costs twice the one-way fee. A connection on the way doesn't add a second fee.`
        : "It depends on the airline. Check each airline's page for how its fee is charged.",
    },
    {
      q: "What size pet carrier fits under an airline seat?",
      a: `Every airline sets its own limit, and the carrier has to fit under the seat in front of you. Maximum sizes: ${sizes.join("; ")}. Measure the outside of your carrier and compare it with the calculator.`,
    },
    {
      q: "Can my dog fly in cargo instead of the cabin?",
      a: noCargo.length === all.length
        ? `Not on the airlines we track. ${listNames(noCargo)} only fly pets in the cabin, so your dog has to fit in a carrier under the seat.`
        : `Only some airlines do. ${listNames(all.filter((a) => a.cargo_available).map(shortName))} offer${all.filter((a) => a.cargo_available).length === 1 ? "s" : ""} a cargo option for larger pets. ${listNames(noCargo)} only fly pets in the cabin (or limit cargo to military and diplomatic moves).`,
    },
    {
      q: "Is there a weight limit for pets in the cabin?",
      a: noWeight.length === all.length
        ? `${listNames(noWeight)} don't publish a weight limit. Instead, your pet has to fit in an approved carrier and be able to stand up and turn around inside it.`
        : `It varies. ${listNames(noWeight)} don't state one; check each airline's page for the others.`,
    },
  ];
}
