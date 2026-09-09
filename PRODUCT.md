# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences of **equal weight** — neither wins by default when a decision is contested:

- **Direct freelance clients.** Deciding whether to hire Juan for a project, often on a phone, often arriving from a link pasted into WhatsApp. They want to know what he can build and how to reach him now.
- **Technical recruiters.** Evaluating him for a role, frequently from LinkedIn's in-app browser on a mid-range Android. They want the résumé, a verifiable trajectory, education and certifications.

Both routes — the CV download and direct contact — carry the same priority. Venezuela is the home market and Spanish is not a translation layer; English is the second audience.

## Product Purpose

A personal portfolio that converts a short, distracted skim into either a résumé download or a first message. Success is a reply in the inbox or on WhatsApp, not time on page. Most visits are one pass on a phone.

## Positioning

A systems engineer who ships **autonomous agents and full-stack systems into production banking environments**, working freelance with an AI-first delivery method (primarily Claude Code) while keeping banking-grade release discipline. The combination a neighbouring portfolio cannot truthfully copy: core-banking integration experience (IBM AS/400, Oracle Service Bus, payments migration) plus agentic AI delivery, evidenced by a **94%** operating-cost reduction on an autonomous support solution.

## Operating Context

Single-page, long-scroll, bilingual site. Read on a phone far more often than on a desktop. It is distributed as a URL pasted into WhatsApp or LinkedIn, so the share card is part of the product, not decoration. Contact happens by WhatsApp, email or phone; the résumé ships as two PDFs (EN/ES) served from the site itself.

## Capabilities and Constraints

- **Client confidentiality is a hard constraint.** Most of the work described is under NDA with banks and employers. There are no project screenshots, no client visuals, no named systems beyond employers already on the CV, and future work must not invent them.
- Bilingual EN/ES throughout, including the résumé PDF and the share card. Spanish strings run longer and are the ones to test against.
- CV-derived text — roles, dates, achievements — is factual and off-limits to rewriting unless Juan corrects a fact himself.
- Deployed as a GitHub Pages project site, so production is served from a sub-path.
- Undecided: whether a confidentiality-safe case study will be written. It remains the largest known gap.

## Brand Commitments

- **The templated pattern is permanently banned:** small tag/pill → huge title → small description → optional second tag. There is deliberately no shared section-head primitive; every section opens with its own mechanic.
- **The three Originkit generative canvases are signature elements** and ship on every device, phones included. The hero sphere must stay interactive under touch. Removing them to save weight is not an acceptable trade.
- Bilingual parity: anything shipped in one language ships in both.
- Voice is direct and first-person; claims carry real figures or none.

## Evidence on Hand

- Two résumé PDFs in `public/` (EN and ES), sourced from Juan's real CVs.
- Public GitHub profile: `github.com/juandi9585` — **it does not contain most of the work the site describes**, because that work is confidential.
- Real LinkedIn profile, email, phone and WhatsApp.
- The 94% operating-cost figure and the 90%+ man-hours figure come from Juan directly.
- **Absent, and not to be fabricated:** project screenshots, case studies, testimonials, client logos, live product links, metrics beyond the two above.

## Product Principles

1. **Adaptation is never deletion.** When something costs too much on a device, fix the cost where it is created; do not withhold the feature.
2. **Evidence before assertion.** A claim repeated is weaker than a claim measured; prefer one figure with a denominator over many without.
3. **Spanish is a first-class surface**, not a localisation pass — it is the home market's language and the one where layouts break first.
4. **Confidentiality is a design constraint, not an excuse.** Describe systems at the level of architecture and outcome rather than inventing artifacts.
5. **The phone is the real device.** Decisions are validated at phone width and on touch before they are considered done.

## Accessibility & Inclusion

Keyboard reachability, visible focus, and `prefers-reduced-motion` are honoured across the site, including the generative canvases, which fall back to hand-built CSS analogues. Tap targets meet 44×44. Contrast meets WCAG AA for body text in every theme.

## Theming

The site ships two themes of equal standing. First visit **follows the operating system** (`prefers-color-scheme`); an explicit choice is remembered thereafter.
