// Records short demo videos + posters of the personal projects into public/projects/.
// Usage: node scripts/capture-projects.mjs [slug ...]   (no args = all except aerostore, which needs it running locally)
// Needs playwright (devDependency) and ffmpeg on PATH. Raw webm goes to a scratch dir, not the repo.
import { chromium } from 'playwright'
import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, rmSync } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'projects')
const RAW = process.env.CAPTURE_RAW || join(process.env.TEMP || '/tmp', 'capture-raw')
const FFMPEG = process.env.FFMPEG || 'ffmpeg'
mkdirSync(OUT, { recursive: true })
mkdirSync(RAW, { recursive: true })

const PHONE = { width: 390, height: 844 }
const DESKTOP = { width: 1280, height: 800 }
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const beat = (p, ms = 900) => p.waitForTimeout(ms)

// Each project: viewport, url, optional prep(ctx) (unrecorded, may return storageState), run(page) (recorded; calm screen at the end).
const PROJECTS = {
  banderas: {
    viewport: PHONE,
    url: 'https://juego-banderas-khaki.vercel.app',
    async run(p, runStart) {
      await beat(p, 1200)
      await p.getByRole('button', { name: 'Empezar' }).tap()
      await beat(p, 1200)
      for (let i = 0; i < 3; i++) {
        const opts = p.locator('button[class*=_option_]')
        await opts.nth(i % 4).tap()
        await beat(p, 1500)
        const next = p.getByRole('button', { name: /siguiente|continuar/i })
        if (await next.count()) { await next.first().tap(); await beat(p, 1000) }
      }
      await beat(p, 800)
    },
  },
  copa: {
    viewport: PHONE,
    url: 'https://guia-la-copa.vercel.app',
    poster: 0.1,
    // Register-or-login with the test nickname before recording, so the video starts on the riel.
    async prep(browser, opts) {
      const ctx = await browser.newContext(opts)
      const p = await ctx.newPage()
      await p.goto('https://guia-la-copa.vercel.app', { waitUntil: 'networkidle' })
      await p.fill('#nick', 'Demo')
      for (let i = 0; i < 4; i++) await p.fill(`#pin${i}`, '2580'[i])
      await p.waitForSelector('.tk', { timeout: 8000 }).catch(() => p.tap('#enter'))
      await p.waitForSelector('.tk', { timeout: 20000 })
      const state = await ctx.storageState()
      await ctx.close()
      return state
    },
    async run(p, runStart) {
      await beat(p, 1500)
      await p.locator('.tk').first().tap()
      await beat(p, 2200)
      await p.locator('#back').tap()
      await beat(p, 900)
      await p.getByRole('link', { name: 'Mapa' }).tap()
      await beat(p, 2500)
      await p.getByRole('link', { name: 'Ranking' }).tap()
      await beat(p, 2200)
      await p.getByRole('link', { name: 'Riel' }).tap()
      await beat(p, 1200)
    },
  },
  questlog: {
    viewport: PHONE,
    url: 'https://questlog-jd.vercel.app/?demo',
    async run(p, runStart) {
      await beat(p, 1500)
      await p.locator('a.channel').first().tap()
      await beat(p, 1500)
      await p.locator('button.check[aria-pressed="false"]').first().tap()
      await beat(p, 2000)
      await p.goBack()
      await beat(p, 1500)
    },
  },
  palabras: {
    viewport: PHONE,
    url: 'https://guacharo-poc.vercel.app',
    dur: 10,
    poster: 0.7,
    async run(p, runStart) {
      await beat(p, 1200)
      await p.tap('.toca')
      await p.waitForSelector('.boton', { timeout: 15000 }) // camera descends to the mine
      await beat(p, 800)
      const off = (Date.now() - runStart) / 1000 - 0.3 // the video starts here, on the mine entrance
      await p.tap('.boton')
      await beat(p, 3000)
      const words = ['perro', 'gato', 'caballo', 'ballena', 'elefante', 'vaca', 'oso', 'delfin', 'tigre', 'leon', 'madrid', 'rojo']
      let answered = 0, w = 0
      while (answered < 1 && w < words.length) {
        await p.waitForSelector('#resp:not([readonly]):not([disabled])', { timeout: 15000 }).catch(async (e) => { await p.screenshot({ path: join(RAW, 'palabras-fail.png') }); throw e })
        await p.focus('#resp')
        await p.keyboard.type(words[w++], { delay: 70 })
        await beat(p, 400)
        await p.keyboard.press('Enter')
        const next = p.getByRole('button', { name: 'Siguiente nivel' })
        if (await next.waitFor({ timeout: 3500 }).then(() => true, () => false)) { answered++; await beat(p, 1500); await next.tap(); await beat(p, 3500) } // result card: answer accepted
      }
      // second question: a couple of guesses (accepted or rejected, both read well)
      for (const g of ['madrid', 'rojo']) {
        await p.waitForSelector('#resp:not([readonly]):not([disabled])', { timeout: 8000 }).catch(() => {})
        await p.focus('#resp').catch(() => {})
        await p.keyboard.type(g, { delay: 70 })
        await p.keyboard.press('Enter')
        await beat(p, 1800)
      }
      return off
    },
  },
  pedal: {
    viewport: DESKTOP,
    dur: 10,
    poster: 0.85,
    // Static UI of pedal-efectos (runs on its mockBackend outside Tauri); served by a throwaway server below.
    serve: process.env.PEDAL_UI || 'D:/Documentos D2/code/pedal-efectos/app/ui',
    path: '/?reset',
    async run(p, runStart) {
      await beat(p, 1000)
      const val = await p.evaluate(() => [...document.querySelectorAll('#sel-in option')].find((o) => /Input atras/.test(o.textContent))?.value)
      await p.selectOption('#sel-in', val)
      await beat(p, 1600) // strums move the meter
      await p.click('#wiz-next'); await beat(p, 600)
      await p.click('#wiz-next'); await beat(p, 900)
      await p.click('#wiz-next'); await beat(p, 1200)
      await p.locator('#offer-no').click({ timeout: 1500 }).catch(() => {})
      const presets = p.locator('#preset-list .preset')
      await presets.nth(1).click(); await beat(p, 1100)
      await presets.nth(2).click(); await beat(p, 1100)
      const k = await p.locator('.knob[data-p="drive_db"]').boundingBox()
      if (k) {
        await p.mouse.move(k.x + k.width / 2, k.y + k.height / 2)
        await p.mouse.down()
        await p.mouse.move(k.x + k.width / 2, k.y - 30, { steps: 12 })
        await p.mouse.up()
      }
      await beat(p, 1200)
      await presets.nth(3).click(); await beat(p, 1200)
    },
  },
  aerostore: {
    viewport: DESKTOP,
    dur: 10,
    poster: 0.12,
    // Needs backend (quarkus:dev, :8080) and frontend (next dev, :3000) running; the frontend proxies /api/v1 to the backend.
    url: process.env.AEROSTORE_URL || 'http://localhost:3000',
    local: true,
    async run(p) {
      await beat(p, 1200)
      await p.mouse.wheel(0, 250)
      await beat(p, 800)
      await p.getByRole('button', { name: 'Reservar Ahora' }).nth(1).click()
      await beat(p, 900)
      await p.getByPlaceholder('Ej. Gordon Freeman').pressSequentially('Ana Rivas', { delay: 70 })
      await beat(p, 500)
      await p.locator('input[type=number]').fill('2')
      await beat(p, 700)
      await p.getByRole('button', { name: 'Confirmar y Reservar' }).click()
      await beat(p, 1800)
      await p.getByRole('link', { name: 'Historial' }).click()
      await beat(p, 2500)
    },
  },
}

// Settings per project for the encode: seconds to keep, poster position (fraction), fps.
const ENC = { dur: 9, poster: 0.55, fps: 30, crf: 30 }

async function capture(slug) {
  const proj = PROJECTS[slug]
  const mobile = proj.viewport === PHONE
  const base = { viewport: proj.viewport, deviceScaleFactor: 1, ...(mobile ? { isMobile: true, hasTouch: true } : {}) }
  const browser = await chromium.launch()
  const dir = join(RAW, slug)
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })
  const storageState = proj.prep ? await proj.prep(browser, base) : undefined
  let server
  let url = proj.url
  if (proj.serve) {
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' }
    server = createServer((req, res) => {
      try {
        const f = join(proj.serve, new URL(req.url, 'http://x').pathname.replace(/\/$/, '/index.html'))
        res.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream' }).end(readFileSync(f))
      } catch { res.writeHead(404).end() }
    }).listen(0)
    url = `http://localhost:${server.address().port}${proj.path || '/'}`
  }
  const t0 = Date.now()
  const ctx = await browser.newContext({ ...base, storageState, recordVideo: { dir, size: proj.viewport } })
  const page = await ctx.newPage()
  await page.goto(url, { waitUntil: proj.local ? 'load' : 'networkidle', timeout: 90000 })
  await beat(page, 400)
  const startAt = (Date.now() - t0) / 1000
  const runStart = Date.now()
  const off = (await proj.run(page, runStart)) || 0
  const length = (Date.now() - runStart) / 1000 - off
  await ctx.close() // flushes the webm
  await browser.close()
  server?.close()
  const webm = join(dir, readdirSync(dir).find((f) => f.endsWith('.webm')))
  const keep = Math.min(proj.dur || ENC.dur, length)
  const mp4 = join(OUT, `${slug}.mp4`)
  const ff = (args) => execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...args])
  ff(['-ss', (startAt + off).toFixed(2), '-t', keep.toFixed(2), '-i', webm, '-an', '-r', String(ENC.fps),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', String(ENC.crf), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4])
  ff(['-ss', (keep * (proj.poster || ENC.poster)).toFixed(2), '-i', mp4, '-frames:v', '1', '-q:v', '5', join(OUT, `${slug}.jpg`)]) // q5 ~ jpeg quality 78
  console.log(`${slug}: ${keep.toFixed(1)}s (start ${startAt.toFixed(1)}s)`)
}

const args = process.argv.slice(2)
const slugs = args.length ? args : Object.keys(PROJECTS).filter((s) => !PROJECTS[s].local)
for (const s of slugs) {
  if (!PROJECTS[s]) throw new Error(`unknown slug ${s}`)
  await capture(s)
}
