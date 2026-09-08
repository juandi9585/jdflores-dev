# Juan Diego Flores — Portfolio

Personal portfolio / résumé site. Long-scroll, motion-driven, bilingual (EN/ES).

**Stack:** Vite + React + TypeScript · GSAP · Three.js (Originkit particle sphere) · deploy on Vercel.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to /dist
npm run preview  # preview the production build
```

## Design

"Deployed Systems Console" — deep-ink editorial base with a single amber accent
(`#FFB84D`); cyan (`#57E0D8`) is reserved for the generative canvas ("signal").
Type: Archivo (variable, expanded for display) + IBM Plex Mono for data/labels.

## Structure

```
src/
  i18n/          content.ts (EN/ES copy) + I18nProvider
  components/
    sections/    Hero, About, Impact, Trajectory, Stack, AIFirst, Credentials, Contact
    originkit/   ParticleSphere, ReactiveLines, KineticGrid (from Originkit MCP) + LazyViz wrapper
    ui/          Counter, BrandIcon, Icon (drawn arrows)
  data/          tools.ts (simple-icons brand marks)
  hooks/         useReveal, useReducedMotion
  styles/        tokens.css, base.css, motion.css, sections.css
public/          résumé PDFs (EN/ES), favicon
```

## Pending

- **Originkit components:** `particlesphere` (hero), `reactive-lines` (About) and
  `kineticgrid` (Trajectory) are integrated (lazy, canvas-2D, CSS interim kept as the
  reduced-motion fallback). `spinimage` and `sticker-peel` are **not integrated and are no
  longer planned**: both need real image assets (project screenshots / a headshot) that do
  not exist, because most of the work described on this site is under client
  confidentiality. Raw source for all four stays staged in gitignored `_originkit-raw/` if
  that ever changes. `framer-motion` is now an unused dependency and can be dropped.
- **Proof of work:** the site still shows no artifact a visitor can open. GitHub is now
  linked from the nav footer and the contact ledger; a confidentiality-safe case study
  (problem / what was built / what it removed / stack, with no client visuals) is the
  highest-value remaining addition.
- **The "90%+" claim:** still stated across Hero, About, Impact (x2) and Trajectory (x2) with
  no denominator, baseline or timeframe. Highest-credibility fix is to carry the exact figure
  and a before/after in the Impact ledger's `note` field, and let the other mentions stay
  qualitative. Needs real numbers from Juan.

## Deploy

Live at **https://juandi9585.github.io/jdflores-dev/** (GitHub Pages, `gh-pages` branch).

The repo is **public** because Pages is not available for private repos on the free plan.

`vite.config.ts` sets `base: '/jdflores-dev/'` in production only, so dev stays at `/`.
Absolute asset URLs in `index.html` are rewritten by Vite, but plain string literals are not
which is why the resume links in `content.ts` are built from `import.meta.env.BASE_URL`.
**If the repo is ever renamed, `base` must change to match** or every asset 404s.

To publish an update:

```bash
npm run build
cd dist && touch .nojekyll
git init -b gh-pages && git add -A && git commit -m "Deploy"
git push -f https://github.com/juandi9585/jdflores-dev.git gh-pages:gh-pages
```

This manual push is used because the local `gh` token lacks the `workflow` scope, so a
`.github/workflows/` file cannot be pushed. To automate it instead, run
`gh auth refresh -s workflow`, then add a Pages workflow and switch the Pages source to
"GitHub Actions". `vercel.json` is still present if you'd rather deploy there.

## Mobile

Mobile is treated as the primary case, not an adaptation. No canvas mounts on a coarse
pointer, so a phone never downloads three.js — the hand-built CSS analogues stand in and
mobile ships ~66KB of JS instead of ~214KB. `useMediaQuery` resolves synchronously in a
`useState` initialiser on purpose: reading it in an effect let the dynamic import fire before
the answer arrived. Trajectory and Credentials collapse behind taps on the phone only
(`ui/Disclosure.tsx`); a wide viewport renders them expanded with no control at all. A
persistent action bar carries résumé, WhatsApp and email in the thumb zone.

Regenerate the share card with `npm run og` after changing the hero copy.

## Accessibility & performance

Responsive to mobile · keyboard focus states · `prefers-reduced-motion` respected ·
the WebGL sphere is code-split and lazy-mounted (skipped under reduced motion).
