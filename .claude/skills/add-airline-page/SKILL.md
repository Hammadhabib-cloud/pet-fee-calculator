---
name: add-airline-page
description: Use when adding a new airline, or updating an existing airline's pet fee data, in the pet flight fee calculator project.
---

# Add or update an airline pet fee page

Follow these steps every time a new airline is added or an existing one is updated.

## 1. Collect verified data
- Use only the airline's OFFICIAL pet policy page as the source.
- Fill every field in the schema described in CLAUDE.md.
- If a value is not stated on the official page, use `null`. Never guess.
- Set `source_url` to the exact official page and `last_checked` to today's date.

## 2. Update the data file
- Add or edit the entry in `data/airlines.json`.
- Keep entries sorted alphabetically by `slug`.
- Validate the JSON (no trailing commas, correct types).

## 3. Generate the page
- The page `/<slug>-pet-fee` must be generated automatically from the data. Do not hand-write a separate page component.
- Confirm the page includes: H1, preset calculator, policy summary, carrier size box, "Last checked" date, official source link, FAQ section, FAQPage JSON-LD, internal links to `/compare` and 2–3 related airline pages.

## 4. Write the content
- Plain English, short paragraphs, mobile-friendly.
- FAQ questions should match real search queries, e.g. "How much does <Airline> charge for a dog in cabin?", "What size carrier fits on <Airline>?", "Can large dogs fly on <Airline>?".
- Do not copy text from the airline's website. Summarize in your own words.

## 5. Check before finishing
- Run the build and confirm it passes with no errors.
- Open the page and test the calculator with: one-way direct, round-trip with one connection, and an oversized carrier (should fail the fit check).
- Confirm the new page appears in `sitemap.xml` and on `/compare`.
- Report back: what changed, the values used, and the source URL.
