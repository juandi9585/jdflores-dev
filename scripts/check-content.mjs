// Validates the content files the CMS writes, before anything is built.
//
// The site's copy lives in src/content/*.json and is edited through /admin by hand, so a wrong
// shape has to fail here with a readable message rather than surface as a blank section or a
// cryptic TypeScript error. It also checks that both languages stay parallel: a role added in
// Spanish only would make the timeline disagree with itself.
//
//   node scripts/check-content.mjs
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const errors = []
const warnings = []
const fail = (file, path, msg) => errors.push(`${file}: ${path} ${msg}`)

// 's' non-empty string · 's?' optional string · 'b?' optional boolean
// an array holds one schema for every item · 'metrics' is the one tagged union
const CONTENT = {
  nav: { about: 's', impact: 's', work: 's', stack: 's', method: 's', contact: 's', resume: 's', close: 's' },
  hero: {
    role: 's', name: 's',
    thesis: [{ t: 's', accent: 'b?' }],
    location: 's', availability: 's', ctaPrimary: 's', ctaSecondary: 's', scrollCue: 's',
  },
  about: { title: 's', body: ['s'], signature: 's' },
  impact: { title: 's', lead: 's', metrics: 'metrics' },
  trajectory: {
    title: 's', lead: 's', nowLabel: 's',
    roles: [{ period: 's', company: 's', location: 's', title: 's', points: ['s'] }],
  },
  stack: { title: 's', lead: 's', groups: [{ label: 's', items: ['s'] }] },
  aiFirst: { title: 's', body: ['s'], points: [{ k: 's', v: 's' }] },
  credentials: {
    title: 's', eduLabel: 's', certLabel: 's', langLabel: 's', beyondLabel: 's',
    education: [{ school: 's', place: 's', degree: 's', period: 's', note: 's?' }],
    certs: [{ name: 's', issuer: 's', year: 's?' }],
    languages: [{ lang: 's', level: 's' }],
    beyond: ['s'],
  },
  contact: {
    title: 's', lead: 's', availability: 's', emailLabel: 's', phoneLabel: 's', linkedinLabel: 's',
    githubLabel: 's', whatsappLabel: 's', locationLabel: 's', location: 's', cta: 's',
  },
  theme: { label: 's', toLight: 's', toDark: 's' },
  meta: { title: 's', description: 's' },
  footer: { rights: 's' },
}

const LINKS = {
  email: 's', phone: 's', phoneHref: 's', linkedin: 's', linkedinHandle: 's',
  github: 's', githubHandle: 's', whatsapp: 's', resumeEnFile: 's', resumeEsFile: 's',
}

function checkMetrics(file, path, value) {
  if (!Array.isArray(value) || !value.length) return fail(file, path, 'must be a non-empty list')
  value.forEach((m, i) => {
    const p = `${path}[${i}]`
    if (typeof m !== 'object' || m === null) return fail(file, p, 'must be an object')
    if (m.kind !== 'count' && m.kind !== 'text') return fail(file, `${p}.kind`, 'must be "count" or "text"')
    for (const k of ['label', 'note']) {
      if (typeof m[k] !== 'string' || !m[k].trim()) fail(file, `${p}.${k}`, 'must be a non-empty string')
    }
    if (m.kind === 'count') {
      if (typeof m.value !== 'number' || !Number.isFinite(m.value)) fail(file, `${p}.value`, 'must be a number when kind is "count"')
      if (m.suffix !== undefined && typeof m.suffix !== 'string') fail(file, `${p}.suffix`, 'must be a string')
      if (m.text !== undefined) fail(file, `${p}.text`, 'belongs to kind "text" only')
    } else {
      if (typeof m.text !== 'string' || !m.text.trim()) fail(file, `${p}.text`, 'must be a non-empty string when kind is "text"')
      if (m.value !== undefined) fail(file, `${p}.value`, 'belongs to kind "count" only')
      if (m.suffix !== undefined) fail(file, `${p}.suffix`, 'belongs to kind "count" only')
    }
  })
}

function check(file, schema, value, path = '') {
  if (schema === 'metrics') return checkMetrics(file, path, value)
  if (typeof schema === 'string') {
    const optional = schema.endsWith('?')
    if (value === undefined || value === null) {
      if (!optional) fail(file, path, 'is missing')
      return
    }
    if (schema.startsWith('b')) {
      if (typeof value !== 'boolean') fail(file, path, 'must be true or false')
      return
    }
    // an optional field left blank in the editor may be saved as "": same as absent
    if (optional && value === '') return
    if (typeof value !== 'string' || !value.trim()) fail(file, path, 'must be a non-empty string')
    return
  }
  if (Array.isArray(schema)) {
    if (!Array.isArray(value) || !value.length) return fail(file, path, 'must be a non-empty list')
    value.forEach((item, i) => check(file, schema[0], item, `${path}[${i}]`))
    return
  }
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return fail(file, path, 'must be an object')
  for (const [key, sub] of Object.entries(schema)) check(file, sub, value[key], path ? `${path}.${key}` : key)
  for (const key of Object.keys(value)) {
    if (!(key in schema)) fail(file, path ? `${path}.${key}` : key, 'is not a field the site knows')
  }
}

// the lists whose two languages describe the same facts, so they must stay the same length
const PAIRED = [
  ['impact', 'metrics'], ['trajectory', 'roles'], ['stack', 'groups'], ['aiFirst', 'points'],
  ['credentials', 'education'], ['credentials', 'certs'], ['credentials', 'languages'],
]
const PROSE = [['about', 'body'], ['aiFirst', 'body'], ['credentials', 'beyond'], ['hero', 'thesis']]
const at = (o, p) => p.reduce((acc, k) => acc?.[k], o)

const read = async (name) => {
  const file = `src/content/${name}`
  try {
    return JSON.parse(await readFile(join(root, file), 'utf8'))
  } catch (e) {
    errors.push(`${file}: ${e instanceof SyntaxError ? `is not valid JSON (${e.message})` : `cannot be read (${e.message})`}`)
    return null
  }
}

const en = await read('content.en.json')
const es = await read('content.es.json')
const links = await read('links.json')

if (en) check('content.en.json', CONTENT, en)
if (es) check('content.es.json', CONTENT, es)
if (links) {
  check('links.json', LINKS, links)
  if (typeof links.email === 'string' && !links.email.includes('@')) fail('links.json', 'email', 'must be an email address')
  for (const k of ['linkedin', 'github', 'whatsapp']) {
    if (typeof links[k] === 'string' && !links[k].startsWith('https://')) fail('links.json', k, 'must start with https://')
  }
  for (const k of ['resumeEnFile', 'resumeEsFile']) {
    if (typeof links[k] === 'string' && !links[k].toLowerCase().endsWith('.pdf')) fail('links.json', k, 'must be the name of a PDF file in public/')
  }
}

if (en && es) {
  for (const p of PAIRED) {
    const a = at(en, p), b = at(es, p)
    if (Array.isArray(a) && Array.isArray(b) && a.length !== b.length) {
      errors.push(`${p.join('.')}: English has ${a.length} and Spanish has ${b.length}. Both languages list the same things, so they must match.`)
    }
  }
  const roles = [at(en, ['trajectory', 'roles']), at(es, ['trajectory', 'roles'])]
  if (Array.isArray(roles[0]) && Array.isArray(roles[1]) && roles[0].length === roles[1].length) {
    roles[0].forEach((r, i) => {
      const other = roles[1][i]
      if (r.points?.length !== other?.points?.length) {
        errors.push(`trajectory.roles[${i}].points: English has ${r.points?.length} and Spanish has ${other?.points?.length}.`)
      }
    })
  }
  for (const p of PROSE) {
    const a = at(en, p), b = at(es, p)
    if (Array.isArray(a) && Array.isArray(b) && a.length !== b.length) {
      warnings.push(`${p.join('.')}: English has ${a.length} and Spanish has ${b.length}. That is allowed, but check it is deliberate.`)
    }
  }
}

for (const w of warnings) console.warn(`warning  ${w}`)
if (errors.length) {
  console.error(`\nThe content is not ready to build (${errors.length} problem${errors.length > 1 ? 's' : ''}):\n`)
  for (const e of errors) console.error(`  - ${e}`)
  console.error('\nFix it in /admin, or in the JSON file the message names, and save again.\n')
  process.exit(1)
}
console.log(`content ok: two languages, ${en.trajectory.roles.length} roles, ${en.impact.metrics.length} metrics, ${en.credentials.certs.length} certifications`)
