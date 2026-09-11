/* Code rain: the console's one ornament, and its answer to the aquarium's
   bubbles. A bubble reads as water and the console has none, so what falls
   here is code, the way The Matrix drew it: columns of mirrored half-width
   katakana and numerals, held to the console's palette. Every character is
   generative cyan and the lead one burns lifted toward white. No glow and no
   shadow; depth comes from two planes that differ in brightness, length and
   speed, the way the bubbles vary in size.

   Framework-free, so it can be driven outside React too (the review board runs
   this same file). */

export type Rain = {
  start(): void
  stop(): void
  /** a single frame and no loop: the reduced-motion state */
  still(): void
  destroy(): void
}

type Column = {
  col: number
  x: number
  near: boolean
  alpha: number
  /** row of the lead character; negative while it waits above the screen */
  row: number
  /** characters trailing behind the lead */
  trail: number
  /** milliseconds per row */
  stepMs: number
  acc: number
  chars: Map<number, string>
}

const CYAN = '87, 224, 216'
// the lead character burns almost white in the film; here it is cyan lifted, not a new hue
const LEAD = '196, 247, 243'
const KATAKANA = Array.from('ｦｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾜﾝ0123456789')
const NUMERALS = Array.from('0123456789')
const FONT = '"Hiragino Sans", "Yu Gothic", Meiryo, "Noto Sans CJK JP", "Noto Sans JP", sans-serif'

const NOOP: Rain = { start() {}, stop() {}, still() {}, destroy() {} }

function rand(a: number, b: number) {
  return a + Math.random() * (b - a)
}

function pick<T>(arr: T[]): T {
  return arr[(Math.random() * arr.length) | 0]
}

/* A system with no Japanese face would rain empty boxes. Probe once: if a
   katakana draws exactly like an unassigned code point, rain numerals only. */
function glyphSet(): string[] {
  const probe = document.createElement('canvas')
  probe.width = 32
  probe.height = 32
  const g = probe.getContext('2d', { willReadFrequently: true })
  if (!g) return NUMERALS
  g.font = `24px ${FONT}`
  g.textBaseline = 'top'
  const ink = (ch: string) => {
    g.clearRect(0, 0, 32, 32)
    g.fillText(ch, 4, 2)
    return g.getImageData(0, 0, 32, 32).data.join()
  }
  // an unassigned code point: every face draws it as its missing-glyph box, or not at all
  const missing = ink('\u0378')
  return ink('ｱ') === missing || ink('ﾂ') === missing ? NUMERALS : KATAKANA
}

export function createRain(canvas: HTMLCanvasElement, opts: { dpr?: number } = {}): Rain {
  const context = canvas.getContext('2d')
  if (!context) return NOOP
  const ctx: CanvasRenderingContext2D = context
  const glyphs = glyphSet()

  let mode: 'off' | 'run' | 'still' = 'off'
  let w = 0
  let h = 0
  let dpr = 1
  let cell = 20
  let columns: Column[] = []
  const taken = new Set<number>()
  let raf = 0
  let last = 0

  // sparse on purpose, and fewer than the bubbles: 7 on a phone, 16 on a wide screen
  const target = () => Math.round(Math.min(16, Math.max(7, w / 80)))

  function freeColumn() {
    const n = Math.max(1, Math.floor(w / cell))
    for (let i = 0; i < 12; i++) {
      const c = (Math.random() * n) | 0
      if (!taken.has(c) && !taken.has(c - 1) && !taken.has(c + 1)) return c
    }
    return (Math.random() * n) | 0
  }

  function place(c: Column, scatter: boolean) {
    taken.delete(c.col)
    c.col = freeColumn()
    taken.add(c.col)
    c.x = c.col * cell + cell / 2
    c.near = Math.random() < 0.4
    c.trail = Math.round(c.near ? rand(12, 24) : rand(8, 16))
    c.stepMs = c.near ? rand(70, 100) : rand(120, 170)
    c.alpha = c.near ? rand(0.8, 0.95) : rand(0.35, 0.5)
    const rows = Math.ceil(h / cell)
    // a fresh start scatters columns down the screen; a respawn waits above it, staggered
    c.row = scatter ? Math.round(rand(0, rows + c.trail)) : -Math.round(rand(0, rows * 0.7))
    c.acc = 0
    c.chars.clear()
  }

  function seed() {
    taken.clear()
    columns = Array.from({ length: target() }, () => {
      const c: Column = { col: -1, x: 0, near: false, alpha: 0, row: 0, trail: 0, stepMs: 100, acc: 0, chars: new Map() }
      place(c, true)
      return c
    })
  }

  function resize() {
    const cw = canvas.clientWidth
    const ch = canvas.clientHeight
    if (!cw || !ch) return false
    const nextDpr = opts.dpr ?? Math.min(window.devicePixelRatio || 1, 1.5)
    const reseed = cw !== w || nextDpr !== dpr || !columns.length
    w = cw
    h = ch
    dpr = nextDpr
    cell = w < 640 ? 18 : 20
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    // assigning canvas.width resets every context property, so they follow each resize
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.font = `${cell - 4}px ${FONT}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    if (reseed) seed()
    return true
  }

  function draw(c: Column) {
    const rows = Math.ceil(h / cell)
    ctx.save()
    ctx.translate(c.x, 0)
    ctx.scale(-1, 1) // mirrored, as in the film
    for (let k = 0; k < c.trail; k++) {
      const r = c.row - k
      if (r < 0) break
      if (r >= rows) continue
      let ch = c.chars.get(r)
      if (!ch) {
        ch = pick(glyphs)
        c.chars.set(r, ch)
      }
      const a = k === 0 ? c.alpha : c.alpha * 0.7 * (1 - k / c.trail)
      ctx.fillStyle = `rgba(${k === 0 ? LEAD : CYAN}, ${a})`
      ctx.fillText(ch, 0, r * cell)
    }
    ctx.restore()
  }

  function paint() {
    ctx.clearRect(0, 0, w, h)
    for (const c of columns) draw(c)
  }

  function frame(now: number) {
    // clamped, so a tab coming back from the background does not jump
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    for (const c of columns) {
      c.acc += dt * 1000
      while (c.acc >= c.stepMs) {
        c.acc -= c.stepMs
        c.row++
        c.chars.delete(c.row - c.trail - 1)
      }
      // a few characters change while they fall
      if (Math.random() < 0.25) {
        const r = c.row - 1 - ((Math.random() * Math.max(1, c.trail - 1)) | 0)
        if (c.chars.has(r)) c.chars.set(r, pick(glyphs))
      }
      if ((c.row - c.trail) * cell > h) place(c, false)
    }
    paint()
    raf = requestAnimationFrame(frame)
  }

  const ro = new ResizeObserver(() => {
    if (resize() && mode === 'still') paint()
  })
  ro.observe(canvas)

  return {
    start() {
      if (mode === 'run') return
      if (!w) resize()
      mode = 'run'
      last = performance.now()
      raf = requestAnimationFrame(frame)
    },
    stop() {
      cancelAnimationFrame(raf)
      if (mode === 'run') mode = 'off'
    },
    still() {
      cancelAnimationFrame(raf)
      mode = 'still'
      if (!w) resize()
      paint()
    },
    destroy() {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mode = 'off'
      columns = []
      taken.clear()
    },
  }
}
