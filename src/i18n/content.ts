/* =========================================================
   Bilingual content — sourced verbatim from Juan's CVs.
   EN is the default; ES mirrors it 1:1.

   The copy itself lives in src/content/*.json so it can be edited in /admin
   without touching code. This file keeps the shape of that data and nothing
   else. `npm run build` runs scripts/check-content.mjs first, which validates
   both files field by field and checks that the two languages stay parallel,
   so a bad edit fails the build instead of reaching the page.
   ========================================================= */

import enJson from '../content/content.en.json'
import esJson from '../content/content.es.json'
import linksJson from '../content/links.json'

export type Lang = 'en' | 'es'

export type Segment = { t: string; accent?: boolean }

export type Metric = {
  kind: 'count' | 'text'
  /** for kind 'count' */
  value?: number
  suffix?: string
  /** for kind 'text' */
  text?: string
  label: string
  note: string
}

export type Role = {
  period: string
  company: string
  location: string
  title: string
  points: string[]
}

export type StackGroup = { label: string; items: string[] }

export type EduItem = {
  school: string
  place: string
  degree: string
  period: string
  note?: string
}

export type CertItem = { name: string; issuer: string; year?: string }

export type Content = {
  nav: { about: string; impact: string; work: string; stack: string; method: string; contact: string; resume: string; close: string }
  hero: {
    role: string
    name: string
    thesis: Segment[]
    location: string
    availability: string
    ctaPrimary: string
    ctaSecondary: string
    scrollCue: string
  }
  about: { title: string; body: string[]; signature: string }
  impact: { title: string; lead: string; metrics: Metric[] }
  trajectory: { title: string; lead: string; nowLabel: string; roles: Role[] }
  stack: { title: string; lead: string; groups: StackGroup[] }
  aiFirst: { title: string; body: string[]; points: { k: string; v: string }[] }
  credentials: {
    title: string
    eduLabel: string
    certLabel: string
    langLabel: string
    beyondLabel: string
    education: EduItem[]
    certs: CertItem[]
    languages: { lang: string; level: string }[]
    beyond: string[]
  }
  contact: {
    title: string
    lead: string
    availability: string
    emailLabel: string
    phoneLabel: string
    linkedinLabel: string
    githubLabel: string
    whatsappLabel: string
    locationLabel: string
    location: string
    cta: string
  }
  theme: { label: string; toLight: string; toDark: string }
  meta: { title: string; description: string }
  footer: { rights: string }
}

/* TypeScript reads a JSON import as its literal shape, where `kind` is a plain
   string rather than the 'count' | 'text' union, so the assertion is the only
   way to hand these files to the app. The check script is what actually
   guarantees the shape, and it runs before tsc on every build. */
export const en = enJson as unknown as Content
export const es = esJson as unknown as Content

/** language-neutral links & constants, from src/content/links.json */
export const LINKS = {
  email: linksJson.email,
  phone: linksJson.phone,
  phoneHref: linksJson.phoneHref,
  linkedin: linksJson.linkedin,
  linkedinHandle: linksJson.linkedinHandle,
  github: linksJson.github,
  githubHandle: linksJson.githubHandle,
  whatsapp: linksJson.whatsapp,
  // BASE_URL keeps these correct under the GitHub Pages sub-path. They are plain
  // string literals, so unlike asset URLs in index.html Vite does not rewrite them.
  resumeEn: `${import.meta.env.BASE_URL}${linksJson.resumeEnFile}`,
  resumeEs: `${import.meta.env.BASE_URL}${linksJson.resumeEsFile}`,
}

export const dict: Record<Lang, Content> = { en, es }
