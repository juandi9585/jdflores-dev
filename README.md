# Juan Diego Flores — Portfolio

Personal portfolio / résumé site. Long-scroll, motion-driven, bilingual (EN/ES).

**Stack:** Vite + React + TypeScript · GSAP · Three.js (Originkit particle sphere) · published to
GitHub Pages by a workflow on every push to `main`.

## Develop

```bash
npm install
npm run dev            # http://localhost:5173
npm run check:content  # validates src/content/*.json — the build runs it first
npm run build          # content check + type-check + production build to /dist
npm run preview        # preview the production build
```

## Design

Two worlds of equal standing, switched by the theme toggle. "Deployed Systems Console" is the
deep-ink editorial base with a single amber accent (`#FFB84D`), where cyan (`#57E0D8`) is
reserved for the generative canvases and the code rain. "Aquarium Window" is its Frutiger Aero
light counterpart: sky, water, grass and glass, with bubbles as its one ornament.

Type is per world, self-hosted from `public/fonts/`, and there is no monospace anywhere:
Michroma and Saira in the console; Neuropol for single words, Unbounded 300 for sentence heads
and Source Sans 3 for text on glass. The ramp reads the screen's height as well as its width, so
a short laptop does not get a monitor's sizes. `DESIGN.md` holds the whole system.

## Structure

```
src/
  content/       content.en.json, content.es.json, links.json — every word on the site
  i18n/          content.ts (the types, importing that JSON) + I18nProvider
  components/
    sections/    Hero, About, Impact, Trajectory, Stack, AIFirst, Credentials, Contact
    originkit/   ParticleSphere, ReactiveLines, KineticGrid (from Originkit MCP) + LazyViz wrapper
    ui/          Counter, BrandIcon, Icon (drawn arrows)
  data/          tools.ts (simple-icons brand marks)
  hooks/         useReveal, useReducedMotion
  styles/        tokens.css, base.css, motion.css, sections.css
scripts/         check-content.mjs (validates the content), make-og.mjs (share card)
public/
  admin/         index.html + config.yml — the content editor (Sveltia CMS)
  fonts/         the self-hosted faces and their licences
                 résumé PDFs (EN/ES), favicon, og.png
.github/workflows/deploy.yml   validates, builds and publishes on every push to main
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

## Edit the content

Every word lives in `src/content/content.en.json`, `content.es.json` and `links.json`. Nothing in
`src/` needs to be touched to change copy.

- **In the browser:** open `/admin/` on the live site, choose "Sign In with Token" and paste a
  GitHub fine-grained token limited to this repository with **Contents: read and write**. The
  editor shows English and Spanish side by side, saves a commit to `main`, and the workflow
  publishes the change a couple of minutes later.
- **Locally, with no account:** `npm run dev`, then open
  `http://localhost:5173/admin/index.html` in a Chromium browser and pick "Work with Local
  Repository". It writes straight to the files on disk and commits nothing.

`scripts/check-content.mjs` runs before every build and is the real schema: required fields,
unknown keys, the Impact metric union (`count` with a number, `text` with a string), and parity
between the two languages on the lists that describe the same facts. A malformed edit fails the
build, so the live site keeps serving the previous version and the error is readable in the
repository's Actions tab.

Two things stay in code: the drawn brand icons in `src/data/tools.ts` (their labels are editable)
and everything about the design itself.

## Deploy

Live at **https://juandi9585.github.io/jdflores-dev/** (GitHub Pages, `gh-pages` branch).

The repo is **public** because Pages is not available for private repos on the free plan.

`vite.config.ts` sets `base: '/jdflores-dev/'` in production only, so dev stays at `/`.
Absolute asset URLs in `index.html` are rewritten by Vite, but plain string literals are not
which is why the resume links in `content.ts` are built from `import.meta.env.BASE_URL`.
**If the repo is ever renamed, `base` must change to match** or every asset 404s.

Publishing is automatic: `.github/workflows/deploy.yml` runs on every push to `main`, validates
the content, builds, and force-pushes `dist` to `gh-pages`. Two branches, two jobs — `main` holds
the source and the content, `gh-pages` holds only the built site and is never edited by hand.

The same thing by hand, if the workflow is ever unavailable:

```bash
npm run build
cd dist && touch .nojekyll
git init -b gh-pages && git add -A && git commit -m "Deploy"
git push -f https://github.com/juandi9585/jdflores-dev.git gh-pages:gh-pages
```

`vercel.json` is still present if you'd rather deploy there.

## Mobile

Mobile is treated as the primary case, and **adaptation never means removing a feature**.
All three generative canvases ship on every device, the hero sphere included, and it stays
interactive under a thumb. Their cost is handled where it is created: capped pixel ratios, a
timeline backdrop bounded to `min(100%, 130svh)` instead of the whole section, and a sphere
tuned (not withheld) on touch. `ReactiveLines` carries a local modification adding touch
handlers — upstream only started on `mousemove`, so it froze on phones.

`useMediaQuery` resolves synchronously in a `useState` initialiser on purpose: reading it in
an effect let a dynamic import fire before the answer arrived. Trajectory and Credentials
collapse behind taps on the phone only (`ui/Disclosure.tsx`); a wide viewport renders them
expanded with no control at all. A persistent action bar carries résumé, WhatsApp and email
in the thumb zone.

Regenerate the share card with `npm run og` after changing the hero copy.

## Accessibility & performance

Responsive to mobile · keyboard focus states · `prefers-reduced-motion` respected ·
the WebGL sphere is code-split and lazy-mounted (skipped under reduced motion).
