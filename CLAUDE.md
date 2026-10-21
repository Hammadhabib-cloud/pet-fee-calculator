# Pet Flight Fee Calculator — Project Guide

## What we are building
A fast, mobile-first website that helps US travelers calculate the total cost of flying with a pet (dog/cat) and check whether their pet and carrier meet each airline's rules.

Main audience: US pet owners (also UK, Canada, Australia). Most users arrive from Google on a phone.

## Tech stack
- Next.js (App Router) with static generation for every page
- Tailwind CSS
- TypeScript
- No database. All airline data lives in `data/airlines.json`
- Deploy on Vercel

## Core pages
- `/` — Homepage with the main calculator
- `/[airline]-pet-fee` — One page per airline (e.g. `/southwest-pet-fee`), generated from `data/airlines.json`
- `/compare` — Side-by-side table of all airlines
- `/about`, `/privacy`, `/disclaimer`, `/affiliate-disclosure`

Launch order for airline pages: Southwest, Spirit, Frontier, then American, United, Alaska, JetBlue, Delta.

## Calculator logic
Inputs:
- Airline
- Trip type: one-way or round-trip
- Number of flight segments (direct = 1, one connection = 2, etc.)
- Pet type (dog/cat/other)
- Pet weight + carrier dimensions (length x width x height, inches)
- Number of pets

Outputs:
- Total pet fee = fee × segments rule × directions × pets (follow each airline's own rule: some charge per direction, some per segment — store this in the data as `fee_basis`)
- Carrier fit: pass / fail against the airline's max carrier size (show hard and soft-sided limits separately when the airline gives both)
- Weight check if the airline has a limit
- Whether cargo is available (for large dogs)
- Link to the airline's official pet policy page
- "Cheaper alternatives" list: other airlines on the data sheet with lower total fees for the same trip

## Data rules (very important)
- NEVER invent or guess any fee, size, weight or rule. If a value is unknown, store `null` and show "Check with airline".
- Every airline entry must include `source_url` (official airline page) and `last_checked` (YYYY-MM-DD).
- Show "Last checked: <date>" on every airline page and in calculator results.
- Data schema for each airline in `data/airlines.json`:
  - `slug`, `name`
  - `in_cabin_allowed` (bool), `in_cabin_fee_usd`, `fee_basis` ("per_direction" | "per_segment")
  - `max_carrier_hard_in` {l, w, h} or null, `max_carrier_soft_in` {l, w, h} or null
  - `max_weight_lbs` (pet + carrier) or null
  - `pets_per_carrier`, `pets_per_passenger`
  - `cargo_available` (bool), `cargo_notes`
  - `species_allowed` (array)
  - `breed_restrictions` (string or null)
  - `international_notes` (string or null)
  - `source_url`, `last_checked`

## SEO rules
- Each page: unique `<title>` (under 60 chars), meta description (under 155 chars), one H1
- Airline page title pattern: "<Airline> Pet Fee Calculator (2026) – Cost, Carrier Size & Rules"
- Each airline page includes: the calculator pre-set to that airline, a plain-English summary of the policy, carrier size box, FAQ section (4–6 real questions), FAQPage JSON-LD schema
- Generate `sitemap.xml` and `robots.txt`
- Fast pages: no heavy libraries, images optimized, aim for 90+ Lighthouse score on mobile
- Internal links between airline pages and to `/compare`

## Design
- Mobile-first, clean, friendly (pet-travel feel), high readability
- Calculator result card must be clear at a glance: big total fee, green/red fit check
- Accessible: labels on all inputs, good color contrast

## Legal / trust
- Footer disclaimer on every page: "Fees and rules change often. Always confirm with the airline before booking. This site is not affiliated with any airline."
- Do not use airline logos or trademarks as branding. Airline names in plain text only.
- Affiliate links must use `rel="sponsored nofollow"` and the site must show an affiliate disclosure.

## Monetization placeholders
- "Recommended carriers" section with placeholder affiliate links (to be filled later)
- Leave a clean slot for pet travel insurance referral
