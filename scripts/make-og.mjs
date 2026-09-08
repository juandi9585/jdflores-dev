/**
 * Generates public/og.png — the 1200x630 card the link renders as when it is
 * pasted into WhatsApp or LinkedIn, which is this site's real distribution
 * channel. Run with `npm run og`.
 *
 * It composes the card directly rather than screenshotting the site: the hero
 * sphere is WebGL and renders black in headless Chromium, and the card wants a
 * tighter crop than the live hero anyway. The dotted sphere here is the same
 * CSS construction phones get in place of the WebGL one.
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'public', 'og.png')

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden;
    background: #0A0C10; color: #ECEEF3;
    font-family: Archivo, system-ui, sans-serif;
    position: relative;
    display: flex; flex-direction: column; justify-content: center;
    padding: 0 76px;
  }
  .sphere {
    position: absolute; right: -170px; top: 44%; transform: translateY(-50%);
    width: 560px; height: 560px; border-radius: 50%;
    background-image:
      radial-gradient(circle at 38% 32%, rgba(87,224,216,0.16), transparent 58%),
      radial-gradient(circle, rgba(87,224,216,0.62) 1.1px, transparent 2.1px);
    background-size: 100% 100%, 11px 11px;
    -webkit-mask-image: radial-gradient(circle at 50% 50%, #000 54%, rgba(0,0,0,0.35) 70%, transparent 77%);
  }
  .inner { position: relative; z-index: 2; max-width: 720px; }
  h1 {
    font-size: 96px; line-height: 0.92; font-weight: 800;
    font-stretch: 125%; letter-spacing: -0.02em;
  }
  p.thesis {
    margin-top: 26px; font-size: 32px; line-height: 1.3;
    font-weight: 600; color: #C3C8D4; max-width: 20ch;
  }
  .amber { color: #FFB84D; }
  .strip {
    position: absolute; left: 76px; right: 232px; bottom: 46px;
    display: flex; gap: 28px; align-items: center;
    font-family: 'IBM Plex Mono', monospace; font-size: 19px;
    letter-spacing: 0.04em; color: #8B93A4;
    border-top: 1px solid #222836; padding-top: 22px;
  }
  .strip > span { white-space: nowrap; }
  .dot { width: 9px; height: 9px; border-radius: 50%; background: #7FD88F; }
  .live { display: inline-flex; align-items: center; gap: 9px; color: #C3C8D4; }
</style></head>
<body>
  <div class="sphere"></div>
  <div class="inner">
    <h1>Juan Diego<br>Flores</h1>
    <p class="thesis">Autonomous agents and full-stack systems that cut banking operating costs by <span class="amber">94%</span>.</p>
  </div>
  <div class="strip">
    <span>Systems Engineer · AI Specialist</span>
    <span>Caracas, Venezuela</span>
    <span class="live"><span class="dot"></span>Available for freelance</span>
  </div>
</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await mkdir(join(root, 'public'), { recursive: true })
await page.screenshot({ path: out })
await browser.close()
console.log('wrote', out)
