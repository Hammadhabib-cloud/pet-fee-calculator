export type Dimensions = { l: number; w: number; h: number };

export type Airline = {
  slug: string;
  name: string;
  in_cabin_allowed: boolean;
  in_cabin_fee_usd: number | null;
  fee_basis: "per_direction" | "per_segment" | null;
  // Whether the fee is charged once per pet or once per carrier (a carrier can hold more than one pet).
  fee_per: "pet" | "carrier" | null;
  max_carrier_hard_in: Dimensions | null;
  max_carrier_soft_in: Dimensions | null;
  max_weight_lbs: number | null;
  pets_per_carrier: number | null;
  pets_per_passenger: number | null;
  cargo_available: boolean;
  cargo_notes: string | null;
  species_allowed: string[];
  breed_restrictions: string | null;
  international_notes: string | null;
  source_url: string | null;
  last_checked: string;
  verification?: {
    confirmed_on_official_page: string[];
    needs_official_check: string[];
    notes: string;
  };
};
