import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from '../../i18n/I18nProvider'
import { useReveal } from '../../hooks/useReveal'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useWideViewport } from '../../hooks/useMediaQuery'
import type { Project } from '../../i18n/content'
import { ArrowLeft, ArrowRight, ArrowUpRight } from '../ui/Icon'

/* Composition: the reel. The section opens the way a film does, with a leader
   (title, one sentence, a counter and the transport) ahead of the frames. On a
   desktop the leader sits still while one horizontal track of frames runs off
   the right edge, the next one cut so it reads as more. On a phone the leader
   becomes a single title-and-counter row and the track becomes a carousel that
   still swipes, one slide per swipe, with the transport under the thumb.

   Video: only the frames that are mostly in view play. A video's source is
   attached when its frame is within one item of the viewport, never before.
   The poster is a plain <img> under the video, so a missing mp4 leaves the
   poster and a missing poster leaves a neutral frame, never a broken icon. */

const BASE = import.meta.env.BASE_URL
const media = (slug: string, ext: 'mp4' | 'jpg') => `${BASE}projects/${slug}.${ext}`

type Link = { href: string; label: string; kind: 'live' | 'code' }

function Frame({
  p,
  load,
  play,
  reduced,
}: {
  p: Project
  load: boolean
  play: boolean
  reduced: boolean
}) {
  const vid = useRef<HTMLVideoElement>(null)
  const [shown, setShown] = useState(false)
  const [posterOk, setPosterOk] = useState(true)
  // under reduced motion nothing plays until the visitor taps the frame
  const [manual, setManual] = useState(false)
  const running = reduced ? manual : play
  const wantSrc = load || manual

  useEffect(() => {
    const v = vid.current
    if (!v || !wantSrc) return
    if (running) v.play().catch(() => {}) // refused or missing: the poster stays
    else v.pause()
  }, [running, wantSrc])

  return (
    <div
      className="reel__frame"
      data-frame={p.frame}
      {...(reduced ? {} : { role: 'img', 'aria-label': p.name })}
    >
      {posterOk && (
        <img
          className="reel__poster"
          src={media(p.slug, 'jpg')}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setPosterOk(false)}
        />
      )}
      <video
        ref={vid}
        className="reel__video"
        data-shown={shown || undefined}
        src={wantSrc ? media(p.slug, 'mp4') : undefined}
        muted
        playsInline
        loop
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setShown(true)}
      />
      {reduced && (
        <button
          type="button"
          className="reel__toggle"
          aria-label={p.name}
          aria-pressed={manual}
          onClick={() => setManual((m) => !m)}
        />
      )}
    </div>
  )
}

function ExtLink({ l }: { l: Link }) {
  return (
    <a className="reel__link" href={l.href} target="_blank" rel="noopener">
      {l.label}
      <ArrowUpRight className="reel__link-icon" />
    </a>
  )
}

export function Projects() {
  const { t } = useI18n()
  const pr = t.projects
  const items = pr.items
  const n = items.length
  const wide = useWideViewport()
  const reduced = useReducedMotion()
  const root = useReveal<HTMLDivElement>({ stagger: true })
  const track = useRef<HTMLDivElement>(null)

  const [active, setActive] = useState(0)
  const [inView, setInView] = useState<boolean[]>(() => items.map(() => false))

  const linksOf = (p: Project): Link[] => {
    const out: Link[] = []
    if (p.live) out.push({ href: p.live, label: p.demo ? pr.demo : pr.open, kind: 'live' })
    if (p.code) out.push({ href: p.code, label: pr.code, kind: 'code' })
    return out
  }

  // The most-visible item: the first one at least 60% in view, or the widest
  // overlap when none is. The ends are pinned so the last frame can be reached
  // even when the frame before it is already fully on screen.
  const measure = useCallback(() => {
    const tr = track.current
    if (!tr) return
    const cells = tr.querySelectorAll<HTMLElement>('.reel__item')
    const box = tr.getBoundingClientRect()
    let first = -1
    let best = 0
    let widest = 0
    cells.forEach((c, i) => {
      const r = c.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(r.right, box.right) - Math.max(r.left, box.left)) / r.width
      if (first < 0 && ratio >= 0.6) first = i
      if (ratio > best) {
        best = ratio
        widest = i
      }
    })
    let next = first < 0 ? widest : first
    if (tr.scrollLeft <= 2) next = 0
    else if (tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 2) next = cells.length - 1
    setActive(next)
  }, [])

  useEffect(() => {
    const tr = track.current
    if (!tr) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        measure()
      })
    }
    measure()
    tr.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      tr.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [measure, wide])

  // which frames are mostly in view (these play)
  useEffect(() => {
    const tr = track.current
    if (!tr) return
    const frames = tr.querySelectorAll<HTMLElement>('.reel__frame')
    const io = new IntersectionObserver(
      (entries) => {
        setInView((prev) => {
          const next = prev.slice()
          entries.forEach((e) => {
            const i = Array.prototype.indexOf.call(frames, e.target)
            if (i >= 0) next[i] = e.intersectionRatio >= 0.6
          })
          return next
        })
      },
      { root: tr, threshold: [0, 0.6, 1] },
    )
    frames.forEach((f) => io.observe(f))
    return () => io.disconnect()
  }, [wide, n])

  const go = (i: number) => {
    const tr = track.current
    if (!tr) return
    const cell = tr.querySelectorAll<HTMLElement>('.reel__item')[Math.max(0, Math.min(n - 1, i))]
    if (!cell) return
    const pad = parseFloat(getComputedStyle(tr).scrollPaddingLeft) || 0
    tr.scrollTo({ left: cell.offsetLeft - pad, behavior: reduced ? 'auto' : 'smooth' })
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(active + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(active - 1)
    }
  }

  const prevBtn = (
    <button type="button" className="reel__ctrl" onClick={() => go(active - 1)} disabled={active <= 0} aria-label={pr.prev}>
      <ArrowLeft />
    </button>
  )
  const nextBtn = (
    <button type="button" className="reel__ctrl" onClick={() => go(active + 1)} disabled={active >= n - 1} aria-label={pr.next}>
      <ArrowRight />
    </button>
  )

  const cur = items[active] ?? items[0]
  const curLinks = linksOf(cur)
  const cta = curLinks[0]

  return (
    <section className="section projects" id="projects">
      <div className="container" ref={root}>
        <div className={`reel ${wide ? 'reel--wide' : 'reel--narrow'}`}>
          {wide ? (
            <div className="reel__leader">
              <div className="reel__lead-top" data-reveal-item>
                <h2 className="reel__title">{pr.title}</h2>
                <p className="reel__body">{pr.body}</p>
              </div>
              <div className="reel__transport" data-reveal-item>
                <div className="reel__progress" aria-hidden="true">
                  <span style={{ transform: `scaleX(${(active + 1) / n})` }} />
                </div>
                <div className="reel__row">
                  <p className="reel__count label tnum">
                    {active + 1} / {n}
                  </p>
                  <div className="reel__ctrls">
                    {prevBtn}
                    {nextBtn}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="reel__head" data-reveal-item>
                <h2 className="reel__title">{pr.title}</h2>
                <p className="reel__count label tnum">
                  {active + 1} {pr.of} {n}
                </p>
              </div>
              <p className="reel__body" data-reveal-item>
                {pr.body}
              </p>
            </>
          )}

          <div
            className="reel__track"
            ref={track}
            role="region"
            aria-label={pr.title}
            tabIndex={0}
            onKeyDown={onKey}
          >
            {items.map((p, i) => {
              const links = linksOf(p)
              const shownLinks = wide ? links : links.filter((l) => l !== links[0])
              return (
                <article
                  className="reel__item"
                  key={p.slug}
                  data-frame={p.frame}
                  data-active={i === active || undefined}
                  data-reveal-item
                >
                  <Frame
                    p={p}
                    load={Math.abs(i - active) <= 1 || inView[i]}
                    play={inView[i]}
                    reduced={reduced}
                  />
                  <div className="reel__cap">
                    <h3 className="reel__name">{p.name}</h3>
                    <p className="reel__line">{p.line}</p>
                    <p className="reel__stack label">{p.stack}</p>
                    {shownLinks.length > 0 && (
                      <p className="reel__links">
                        {shownLinks.map((l) => (
                          <ExtLink key={l.kind} l={l} />
                        ))}
                      </p>
                    )}
                  </div>
                </article>
              )
            })}
          </div>

          {!wide && (
            <>
              <div className="reel__bar" data-reveal-item>
                {prevBtn}
                {cta ? (
                  <a className="btn btn--primary reel__cta" href={cta.href} target="_blank" rel="noopener">
                    <span>{cta.label}</span>
                    <ArrowUpRight className="btn__arrow" />
                  </a>
                ) : (
                  <p className="reel__cta reel__cta--none label">{cur.stack}</p>
                )}
                {nextBtn}
              </div>
              <div className="reel__dots" aria-hidden="true">
                {items.map((p, i) => (
                  <span key={p.slug} data-on={i === active || undefined} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
