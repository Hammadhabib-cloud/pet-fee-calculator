import data from "@/data/airlines.json";
import type { Airline } from "./types";

export const airlines: Airline[] = (data as Airline[]).slice().sort((a, b) => a.slug.localeCompare(b.slug));

export const pageSlug = (a: Airline) => `${a.slug}-pet-fee`;

export function airlineByPageSlug(slug: string): Airline | undefined {
  return airlines.find((a) => pageSlug(a) === slug);
}

// "Southwest Airlines" -> "Southwest"
export const shortName = (a: Airline) => a.name.replace(/ (Airlines?|Air Lines)$/, "");
