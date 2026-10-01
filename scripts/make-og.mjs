/**
 * Generates public/og.png — the 1200x630 card the link renders as when it is
 * pasted into WhatsApp or LinkedIn, which is this site's real distribution
 * channel. Run with `npm run og`.
 *
 * The card is set in the Aquarium Window world (Juan's choice, 2026-10-01): sky,
 * a glass shelf for the status strip, a few bubbles, Neuropol on the name.
 * It composes the card directly rather than screenshotting the site: the hero
 * sphere is WebGL and renders black in headless Chromium, and the card wants a
 * tighter crop than the live hero anyway. The dotted sphere here is the same
 * CSS construction phones get in place of the WebGL one, in white dots on sky.
 * Faces load from public/fonts, so the page is opened as a file, not set inline.
 */
import { chromium } from 'playwright'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'public', 'og.png')
const fonts = pathToFileURL(join(root, 'public', 'fonts')).href

const bubbles = [
  [600, 46, 18], [1040, 168, 20], [318, 548, 10], [944, 590, 7], [612, 586, 8], [1150, 40, 12],
]
  .map(([x, y, r]) => `<i class="bubble" style="left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px"></i>`)
  .join('')

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<style>
  @font-face { font-family: Neuropol; src: url(${fonts}/neuropol.woff2) format('woff2'); }
  @font-face { font-family: 'Source Sans 3'; src: url(${fonts}/source-sans-3-latin.woff2) format('woff2'); font-weight: 200 900; }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden; position: relative;
    color: #06344f; font-family: 'Source Sans 3', 'Segoe UI', sans-serif;
    background:
      radial-gradient(120% 70% at 50% 108%, rgba(107, 203, 60, 0.32), transparent 62%),
      radial-gradient(90% 55% at 82% 4%, rgba(255, 255, 255, 0.95), transparent 60%),
      linear-gradient(180deg, #8ad9ff 0%, #b7e6fd 18%, #9ad6f4 42%, #8fcdec 66%, #7cc2e8 86%, #6db8e2 100%);
    display: flex; flex-direction: column; justify-content: center; padding: 0 68px 96px;
  }
  .sphere {
    position: absolute; right: 24px; top: 46%; transform: translateY(-50%);
    width: 520px; height: 520px; border-radius: 50%;
    background-image:
      radial-gradient(circle at 38% 30%, rgba(255, 255, 255, 0.6), rgba(0, 178, 255, 0.12) 62%, transparent 74%),
      radial-gradient(circle, rgba(255, 255, 255, 0.95) 1.4px, transparent 2.4px);
    background-size: 100% 100%, 13px 13px;
    -webkit-mask-image: radial-gradient(circle at 50% 50%, #000 54%, rgba(0,0,0,0.4) 70%, transparent 77%);
  }
  .inner { position: relative; z-index: 2; }
  h1 { font-family: Neuropol, sans-serif; font-weight: 400; font-size: 100px; line-height: 1.04; }
  p.thesis { margin-top: 30px; font-size: 34px; line-height: 1.3; font-weight: 600; color: #073c5c; max-width: 660px; }
  .accent { color: #0079bf; }
  .shelf {
    position: absolute; left: 44px; right: 44px; bottom: 26px; height: 74px; z-index: 2;
    border-radius: 37px; border: 1px solid rgba(255, 255, 255, 0.92);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.86), rgba(255, 255, 255, 0.66));
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.98), inset 0 -1px 0 rgba(255, 255, 255, 0.6), 0 6px 16px rgba(0, 74, 117, 0.12);
    display: flex; align-items: center; padding: 0 28px; gap: 22px;
    font-size: 23px; font-weight: 600; color: #163d54; white-space: nowrap;
  }
  .rule { width: 1px; height: 28px; background: rgba(0, 121, 191, 0.3); }
  .live { display: inline-flex; align-items: center; gap: 12px; color: #073c5c; }
  .dot { width: 11px; height: 11px; border-radius: 50%; background: #6bcb3c; }
  .bubble {
    position: absolute; border-radius: 50%; z-index: 1;
    background:
      radial-gradient(circle at 30% 24%, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.42) 30%, transparent 46%),
      radial-gradient(circle at 50% 50%, rgba(0, 178, 255, 0.3), rgba(0, 121, 191, 0.3) 78%);
    border: 1.5px solid rgba(255, 255, 255, 0.92);
  }
</style></head>
<body>
  <div class="sphere"></div>
  ${bubbles}
  <div class="inner">
    <h1>Juan Diego<br>Flores</h1>
    <p class="thesis">Autonomous agents and full-stack systems that cut banking operating costs by <span class="accent">94%</span>.</p>
  </div>
  <div class="shelf">
    <span>Systems Engineer · AI Specialist</span><span class="rule"></span>
    <span>Caracas, Venezuela</span><span class="rule"></span>
    <span class="live"><span class="dot"></span>Available for freelance</span>
  </div>
</body></html>`

const tmp = join(root, 'scripts', '.og.html')
await writeFile(tmp, html)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.goto(pathToFileURL(tmp).href, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
await mkdir(join(root, 'public'), { recursive: true })
await page.screenshot({ path: out })
await browser.close()
await rm(tmp)
console.log('wrote', out)
