---
name: Juan Diego Flores — Deployed Systems Console
description: One token spine, two worlds of equal standing: an ink-editorial console and a Frutiger Aero aquarium window.
colors:
  ink: "#0a0c10"
  ink-2: "#111520"
  ink-3: "#0d1017"
  line: "#222836"
  line-soft: "#191e29"
  bone: "#eceef3"
  bone-dim: "#c3c8d4"
  muted: "#8b93a4"
  muted-2: "#5f6675"
  amber: "#ffb84d"
  amber-bright: "#ffcf82"
  amber-ink: "#3a2a0e"
  cyan-signal: "#57e0d8"
  ok: "#7fd88f"
  danger: "#ff6b6b"
  aero-sky: "#00b2ff"
  aero-water: "#0079bf"
  aero-grass: "#6bcb3c"
  aero-glass: "#d9e3f0"
  aero-ground: "#e9f3fc"
  aero-plate: "#ffffff"
  aero-bone: "#06344f"
  aero-muted: "#163d54"
  aero-muted-2: "#21506b"
  aero-leaf: "#35800f"
  aero-accent-ink: "#ffffff"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(3.58rem, 2.11rem + 7.36vw, 9.5rem)"
    fontWeight: 800
    lineHeight: 0.94
    letterSpacing: "-0.02em"
    fontVariation: "font-stretch: 125%"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.07rem, 1.7rem + 1.84vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
    fontVariation: "font-stretch: 120%"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.44rem, 1.29rem + 0.74vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.95rem + 0.24vw, 1.15rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body-lead:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.2rem, 1.11rem + 0.44vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "clamp(0.75rem, 0.72rem + 0.14vw, 0.82rem)"
    fontWeight: 500
    letterSpacing: "0.14em"
    fontFeature: "tnum 1"
rounded:
  sm: "4px"
  lg: "10px"
  aero-sm: "10px"
  aero-lg: "20px"
  pill: "999px"
spacing:
  2xs: "0.5rem"
  xs: "0.75rem"
  s: "1rem"
  m: "1.5rem"
  l: "2.5rem"
  xl: "4rem"
  2xl: "6rem"
  3xl: "clamp(5rem, 3rem + 9vw, 10rem)"
  gutter: "clamp(1.25rem, 0.7rem + 2.6vw, 3rem)"
components:
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.bone}"
    rounded: "{rounded.sm}"
    padding: "0.85em 1.4em"
    typography: "{typography.label}"
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.amber-ink}"
    rounded: "{rounded.sm}"
    padding: "0.85em 1.4em"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.amber-bright}"
    textColor: "{colors.amber-ink}"
  button-primary-aero:
    backgroundColor: "{colors.aero-water}"
    textColor: "{colors.aero-accent-ink}"
    rounded: "{rounded.pill}"
    padding: "0.85em 1.4em"
  button-lg:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.amber-ink}"
    rounded: "{rounded.sm}"
    padding: "1.05em 1.8em"
    typography: "{typography.body}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    padding: "0.4em 0"
    typography: "{typography.label}"
  nav-link-active:
    textColor: "{colors.bone}"
  plate-aero:
    backgroundColor: "{colors.aero-plate}"
    textColor: "{colors.aero-bone}"
    rounded: "{rounded.aero-lg}"
    padding: "clamp(1.25rem, 2.4vw, 2.25rem)"
---

# Design System: Juan Diego Flores — Deployed Systems Console

## Overview

**Creative North Star: "The Console and the Aquarium Window"**

One instrument, seen in two weathers. The dark world is a deployed-systems console: near-black ink, hairline rules, bone type, a single amber accent that appears once per section and never twice, and cyan held back for generative signal only. Nothing is decorated; everything is ruled, tabulated or bracketed, the way a system that is actually running reports itself.

The light world is a committed Frutiger Aero aquarium window. A fixed sky layer with a low horizon sits behind the whole page, bubbles drift up through it, and the content rides on raised glass plates that each end in a wet reflection. It is not the dark layout inverted: it is the same content read through glass, with its own material logic, its own rounded geometry and its own accent role.

The two are held together by one rule of construction: every semantic token keeps its name across themes and only its value changes, so a single scoped stylesheet re-skins the entire surface without touching a component. Both themes are first-class; neither is the default, and the first visit follows the operating system.

**Key Characteristics:**
- One accent per theme, spent sparingly: amber in the dark world, water blue in the light one.
- Eight sections, eight distinct opening mechanics; no shared section head exists to regenerate a template from.
- Fluid modular type ramp (ten steps) driven by Archivo's variable width axis, with IBM Plex Mono carrying all data and labels.
- Dark world: flat, hairline-ruled, no shadows. Light world: layered glass plates, specular edges, wet sheens.
- Browser surfaces (scrollbar, caret, selection, tap highlight) are themed as part of the design, not left to the platform.
- AA contrast holds in both themes; tap targets meet 44×44; reduced motion is honoured everywhere including the canvases.

## Colors

Two palettes on one skeleton: a near-monochrome ink field with a single warm accent, and a four-colour water world with four fixed jobs.

### Primary
- **Signal Amber** (`{colors.amber}`): the dark world's only accent. It carries primary CTAs, the one headline figure in the ledger, the current timeline node, active nav underlines, focus rings, selection and caret. Where it appears twice in one section, one of them is wrong.
- **Deep Water** (`{colors.aero-water}`): the light world's accent role, occupying the same token slot amber does. Aqua buttons, link hovers, hairlines and every ink value derive from it.

### Secondary
- **Bright Sky** (`{colors.aero-sky}`): the light world's ground — the fixed gradient behind the page, the selection colour, the bright stop of every aqua gradient.
- **Amber Bright** (`{colors.amber-bright}`): the hover state of the dark world's accent, and nothing else.

### Tertiary
- **Signal Cyan** (`{colors.cyan-signal}`): reserved strictly for generative canvases and their hand-built CSS fallbacks. It never appears on type, borders or controls.
- **Leaf Grass** (`{colors.aero-grass}`): "life" in the light world — the availability pulse and the current timeline node. Where it must sit on type it runs down to a darker leaf value (`{colors.aero-leaf}`) that clears contrast against the sky.

### Neutral
- **Console Ink** (`{colors.ink}`): the dark page ground, with raised panels (`{colors.ink-2}`) and recessed alternating bands (`{colors.ink-3}`) one step either side of it.
- **Hairline** (`{colors.line}` / `{colors.line-soft}`): every rule, border, table divider and rail on the site. Structure is drawn with these, not with shadow.
- **Bone** (`{colors.bone}` / `{colors.bone-dim}`): primary and near-primary type.
- **Ash** (`{colors.muted}` / `{colors.muted-2}`): secondary and tertiary type, mono labels, spec keys.
- **Sea Glass** (`{colors.aero-glass}`) over **Pale Ground** (`{colors.aero-ground}`): the light world's recessed shelf and page ground, with white plates lifted above them.
- **Deep Water Ink** (`{colors.aero-bone}` / `{colors.aero-muted}` / `{colors.aero-muted-2}`): the light world's type. These are deliberately dark, not mid-tone, because the fixed sky layer puts its deepest band at the bottom of every viewport.

### Named Rules
**The One Accent Rule.** Each theme has exactly one accent token, and it is spent once per section. Two accent objects in one screen region means one of them is decoration.

**The Signal Reservation Rule.** Cyan belongs to the generative canvases and to nothing else. If a border, label or button reaches for it, the answer is the accent or a neutral.

**The Four Jobs Rule.** The light world is sky (ground), water (ink, depth, accent), grass (life) and glass (surfaces). There is no fifth colour and no warm colour anywhere in it.

**The Same Name, New Value Rule.** A theme changes values, never token names. A new component styles against the semantic token (`--bone`, `--line`, `--amber`) and is themed for free; a component that hardcodes a hex breaks the second world.

## Typography

**Display Font:** Archivo (variable, width axis 62–125), fallback `system-ui, sans-serif`
**Body Font:** Archivo, same family, static width
**Label/Mono Font:** IBM Plex Mono, fallback `ui-monospace, SFMono-Regular, monospace`

**Character:** One grotesque doing two jobs. Display setting is width-driven rather than size-driven — the masthead is stretched to 125% and heavier heads sit at 105–120% — so hierarchy reads as pressure rather than as scale alone. Mono is not ornament: it marks anything the reader is meant to treat as instrument data.

### Hierarchy
- **Display** (800, `--step-7`, 0.94 leading, 125% width): the masthead name only. One per page.
- **Headline** (800, `--step-4`, 0.95 leading, −0.03em): ledger figures and rail endpoints — numbers, not titles.
- **Title** (600–800, `--step-2`/`--step-3`, 1.04–1.15): section-owned heads (spec sheet title, credentials hang, timeline spine, run-in lead), each set inside its own mechanic.
- **Body** (400, `--step-0`, 1.6): all prose. Measures are capped: 66ch for the about column, 62ch for spec values, 46–48ch for leads and colophons.
- **Body Lead** (400, `--step-1`, 1.5): the run-in paragraph and section summaries.
- **Label** (mono 500, `--step--2`, 0.10–0.18em, uppercase): nav links, spec keys, credential keys, contact keys, strip keys, action-bar items.

### Named Rules
**The No Shared Head Rule.** The stack "small tag → huge title → small description" is banned outright, and there is deliberately no shared section-head class in the stylesheet to regenerate it from. A new section invents its own opening mechanic or it does not ship.

**The 12px Floor Rule.** `--step--2` bottoms out at 12px. It carries every data label on the site, and smaller does not survive a phone screen outdoors. Nothing is shrunk below it to protect a desktop silhouette.

**The Instrument Numerals Rule.** Anything read as data or compared down a column carries tabular figures (`.tnum`); anything that is a key rather than a sentence is set in mono, uppercase and tracked.

## Layout

A single long-scroll column. Content is centred in a 1200px container (1400px for the wide variant) with a fluid gutter (1.25rem → 3rem), and sections are separated by a fluid vertical rhythm of `--space-3xl` (5rem → 10rem). The spacing scale is a fixed eight-step ramp from 0.5rem to 6rem plus that fluid top step; internal rhythm uses `s`/`m`/`l` almost exclusively.

Sections do not share a layout. Impact is a full-width ruled table; Trajectory is a two-column rail (160px period column plus body) hung off an absolute spine; Stack is a two-column spec grid whose head occupies the first row; Credentials is a hanging-indent grid (29% hang plus table) with a nested key/rows grid inside; Contact is a 1.05fr/1fr baseline-aligned pair. The hero fills `100svh` with the masthead block vertically centred and a status strip pinned to the bottom edge.

Three breakpoints do the work. At **1024px** the credentials hang and the contact pair go single-column. At **900px** the desktop nav is replaced by a bottom-sheet menu and a fixed thumb-region action bar, the hero canvas moves to the empty upper-right under a horizontal mask, and the spec sheet and credential groups collapse to one column. At **640px** display steps drop one rung each, the ledger stops being a table and becomes stacked records, and the hero strip's vertical rules become horizontal ones, because vertical rules only read as rules while a row is unwrapped.

**The Adapt-Never-Delete Rule.** When something costs too much on a phone, the cost is fixed where it is created — capped pixel ratios, bounded canvas heights, one type step down. Features are not withheld from small screens; the three generative canvases ship on every device, gated only on reduced motion.

**The Reachable Region Rule.** On phones, primary actions live at the bottom: the menu is a bottom sheet under the thumb, and the action bar rises into view once the hero is behind you.

## Elevation & Depth

The two worlds resolve depth in opposite ways, and both are deliberate. **The dark world has no shadows at all.** Depth is tonal and linear: three ink values (recessed band, base, raised panel), hairlines at two weights, and a fixed grain/vignette layer over the whole page. A dark surface is separated from its neighbour by a 1px rule or a one-step tonal shift, never by a cast shadow.

The light world is the opposite: it is built entirely out of lift. Content sits on raised glass plates (`--plate`, `--plate-edge`, `--plate-lift`) combining an inner top highlight, an inner bottom highlight and a soft, low-opacity drop shadow in deep water blue, over an 8px backdrop blur at 1.15 saturation. Each plate ends in a wet reflection below its lower edge — a screen-blended, blurred, elliptically-clipped sheen that is lighter than what it falls on. Elevation is per-mechanic, not uniform.

### Shadow Vocabulary (light theme only)
- **Plate lift** (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.98), inset 0 -1px 0 rgba(255,255,255,0.6), 0 6px 16px rgba(0,74,117,0.1)`): the default raised glass panel.
- **Deep lift** (`box-shadow: … , 0 14px 34px rgba(0,74,117,0.16)` / `… , 0 18px 40px rgba(0,74,117,0.18)`): the timeline, which sits lowest in the water, and the closing contact panel, the most lifted thing on the page.
- **Recessed cut** (`box-shadow: inset 0 2px 6px rgba(0,74,117,0.16), inset 0 -1px 0 rgba(255,255,255,0.9)`): credentials, cut into the surface rather than laid on it. It casts no reflection, because nothing recessed does.
- **Control gloss** (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(0,56,90,0.35), 0 3px 12px rgba(0,106,168,0.4)`): the aqua lozenge.

### Named Rules
**The Gloss Pools Rule.** Gloss collects where a surface ends — the top edge of a plate, the upper half of a control, the reflection under a panel — and stops there. It never coats a whole element or the page.

**The Differentiated Plate Rule.** Plates answer to the mechanic they hold, not to each other: the run-in gets a waterline along its top edge, the spec sheet is squared at the head and lifted only at the foot, the claims are a shallow slip of glass, credentials are recessed, the closing panel is the widest and most lifted. Uniform plates would turn eight mechanics back into one container.

**The Hairline Structure Rule.** In the dark world, structure is drawn with 1px rules and tonal bands. If a dark surface needs a shadow to be legible, its tonal placement is wrong.

## Shapes

Two geometries, one per world. The dark world is nearly square: a 4px radius on buttons, chips and the burger, with 10px reserved for large sheets like the mobile menu. Corners are incidental there; the form language is the rule, the rail, the bracket and the table row.

The light world is rounded, as its material demands: 10px on small parts, 20px on plates (varied to 4px/8px/26px/28px per mechanic), and full pills (999px) on every control and on the theme toggle. Circles carry meaning in both worlds — the availability pulse, the timeline node, the brand pearl, the orbit chips, the bubbles. The recurring silhouettes are the hairline rule (spine, leader, divider, underline) and the lozenge.

## Components

### Buttons
- **Shape:** squared-off in the dark world (4px), full pill in the light world (999px).
- **Primary:** amber fill with dark amber-ink type, mono uppercase at `--step--1` with 0.06em tracking, 0.85em/1.4em padding. In the light world the same button becomes an aqua lozenge: a top-to-bottom water gradient with a specular highlight inset 1px from the edges that occupies the top 46% and stops at the midline.
- **Hover / Focus:** lifts 2px and takes an accent-tinted border; the trailing arrow icon slides 3px right. Focus is a 2px accent outline offset 3px. On touch devices the lift and border change are neutralised so nothing sticks in a hover state after a tap; `:active` drops opacity to 0.65 instead.
- **Ghost:** transparent fill, hairline border, bone type — the default `.btn`. The large variant bumps padding to 1.05em/1.8em and type to `--step-0`.

### Cards / Containers
- **Dark:** there are no cards. Content sits directly on the page ground, separated by hairlines and tonal bands.
- **Light:** the glass plate is the container — white gradient fill, near-white 1px edge, 20px radius by default, plate lift shadow, backdrop blur, `clamp(1.25rem, 2.4vw, 2.25rem)` padding, and a wet reflection below the lower edge.

### Navigation
- Fixed top bar, 68px tall, transparent until scrolled; then a blurred, hairline-bottomed panel fades in. Links are mono uppercase `--step--2` at 0.14em, muted at rest, bone on hover and when current, with an accent underline that scales in from the left.
- Under 900px the links are replaced by a burger opening a bottom sheet: rounded top corners, safe-area padding, links at `--step-3` with a small accent dot marking the current section, over a dimming scrim.
- The language toggle is a mono `EN / ES` pair with a hairline separator; the active side takes the accent. The theme toggle is a 46×25 capsule whose 19px knob slides between the two worlds and carries a drawn sun or moon.

### Signature: the eight section mechanics
Each section opens with a mechanic no other section uses, and this is the system's load-bearing rule. **Hero** — masthead plus a status strip pinned to the viewport bottom, with no label above the name and no descriptor beneath it. **About** — a run-in head: the section name is set inline in display type and the prose continues in the same line flow. **Impact** — a ruled ledger where the figures carry the display type and the section name demotes to the table caption. **Trajectory** — a spine line against a hairline, with rail endpoints carrying the display type. **Stack** — a spec sheet whose head occupies the first row of the same two-column grid as the data. **AI-First** — corner marginalia: the section name runs flush right like a running head over a full-bleed orbit. **Credentials** — a hanging indent beside the first row, with one row grammar shared by every group. **Contact** — a baseline-aligned pair on the same left edge as every other section.

### Signature: generative canvases
Three canvases (particle sphere in the hero, reactive lines behind About, kinetic grid behind Trajectory) are recoloured per theme from CSS tokens and ship on every device including phones. They mount lazily on scroll proximity and are skipped only under `prefers-reduced-motion`, where hand-built CSS analogues (masked dot fields, ruled line fields) take their place. They are decorative: `aria-hidden`, non-interactive except the hero sphere, which keeps vertical panning so a swipe both scrolls and stirs.

### Disclosure
A phone-only progressive-disclosure control used on the timeline and credentials. The panel animates between `grid-template-rows: 0fr` and `1fr` on a symmetric ease so a collapse is not front-loaded, stays in the DOM under `inert`, and its plus icon retracts its upright stroke into a minus. Above 900px both sections render fully expanded with no control present at all.

## Do's and Don'ts

### Do:
- **Do** style every new component against semantic tokens (`--bone`, `--line`, `--amber`, `--ink-2`) so the light stylesheet themes it without a new rule.
- **Do** give a new section its own opening mechanic, in its own class namespace.
- **Do** spend the accent once per section: one accent figure, one accent node, one primary button.
- **Do** set keys, years, counts and any column of compared numbers in mono with tabular figures.
- **Do** keep prose measures capped (66ch body, 46–48ch leads) and drive display type through Archivo's `font-stretch` axis.
- **Do** draw icons as SVG paths on the shared 16-unit grid at 1.25 stroke; Unicode arrows are not an icon system.
- **Do** theme the browser's own surfaces — scrollbar, caret, selection, tap highlight, `theme-color` — as part of any new world.
- **Do** validate at phone width and on touch before calling a change done, and neutralise any `:hover` that would stick after a tap.

### Don't:
- **Don't** build an eyebrow → huge title → small lead stack, and don't add a shared section-head class that would make one easy.
- **Don't** put cyan on type, borders or controls; it belongs to the generative canvases.
- **Don't** introduce a fifth colour or any warm colour into the light world.
- **Don't** cast a shadow in the dark theme; separate surfaces with a hairline or a tonal step.
- **Don't** coat a light-theme surface in gloss — pool it at the edge where the surface stops.
- **Don't** give every light-theme plate the same radius and lift; the plate answers to its mechanic.
- **Don't** set any label below 12px, or shrink type to protect a desktop composition.
- **Don't** drop a feature to make it cheap on a phone; fix the cost where it is created.
- **Don't** hardcode a hex in a component when a semantic token exists.
