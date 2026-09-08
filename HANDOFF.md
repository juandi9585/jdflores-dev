# HANDOFF — Portfolio Juan Diego Flores (`jdflores-dev`)

> Estado del proyecto al **2026-09-08**. Documento de continuidad: qué se
> construyó, cómo, y qué queda pendiente con el procedimiento exacto para retomar.
>
> **Decisión cerrada (2026-09-08):** `spinimage` y `sticker-peel` quedan descartados por falta
> de assets (trabajo bajo confidencialidad del cliente) → ver **§5.3**.
> **Cambio mayor (2026-09-08):** pasada de diseño `/impeccable` que eliminó el patrón
> eyebrow → título → lead de las 7 secciones → ver **§11**.

---

## 1. Snapshot

| Área | Estado |
|------|--------|
| Scaffold Vite + React + TS | ✅ Completo |
| Sistema de diseño (tokens, tipografía, base) | ✅ Completo |
| Bilingüe EN/ES (toggle, persistencia) | ✅ Completo |
| 8 secciones con contenido real del CV | ✅ Completo |
| Originkit `particlesphere` (hero) | ✅ Integrado |
| Originkit `reactive-lines` (About), `kineticgrid` (Trajectory) | ✅ Integrados (interino ahora = fallback reduced-motion) |
| Originkit `sticker-peel` (Stack), `spinimage` (AI-First) | ❌ Descartados — sin assets disponibles (§5.3) |
| Motion (GSAP hero + reveals + CSS) | ✅ Completo |
| Responsive + accesibilidad + reduced-motion | ✅ Completo |
| Build de producción | ✅ Verde |
| Config Vercel | ✅ Lista |
| Deploy | ✅ **En vivo** — GitHub Pages, rama `gh-pages` |
| URL de LinkedIn real | ✅ Completo |

**Preview local:** `npm run dev` → http://localhost:5173

---

## 2. Stack y dependencias

- **Runtime:** Node 24, npm 11.
- **Framework:** Vite 6 + React 18.3 + TypeScript 5.7 (modo `strict`).
- **Dependencias de producción:**
  - `react` / `react-dom` `^18.3.1`
  - `gsap` `^3.12.5` — animación de entrada del hero (y disponible para más).
  - `three` `0.174.0` — usado por el `particlesphere` de Originkit.
  - `framer-motion` `^11.15` — **instalado pero aún sin usar**; lo requiere `sticker-peel` cuando se integre.
  - `simple-icons` — marcas monocromas de las herramientas (logos del Stack y la órbita).
- **Dev:** `@vitejs/plugin-react`, `typescript`, `@types/*`, `playwright` (solo para screenshots de QA).
- **Fuentes:** Google Fonts vía `<link>` en `index.html` — `Archivo` (variable, ejes `wdth` + `wght`) + `IBM Plex Mono`.

---

## 3. Sistema de diseño — "Deployed Systems Console"

Definido en `src/styles/tokens.css`.

**Paleta**
```
--ink    #0A0C10   base            --bone   #ECEEF3   texto principal
--ink-2  #111520   paneles         --muted  #8B93A4   texto secundario
--line   #222836   hairlines       --amber  #FFB84D   ÚNICO acento (CTAs, métrica, activo)
                                    --cyan   #57E0D8   señal — solo en canvas generativo
```

**Tipografía**
- Display: `Archivo` con `font-stretch: 125%` + peso 800 (titulares, nombre).
- Body: `Archivo` normal 400/500.
- Data/labels: `IBM Plex Mono` (eyebrows, métricas, periodos) — guiño al IBM AS/400 del CV.
- Escala fluida `--step--2 … --step-7` con `clamp()`.

**Firma:** el sitio se lee como el panel de lectura de los sistemas desplegados; los
componentes generativos de Originkit son los momentos protagonistas, todo lo demás es
editorial y disciplinado.

---

## 4. Qué está implementado (detalle)

### 4.1 Configuración
- `package.json`, `vite.config.ts`, `tsconfig.json` (+ `tsconfig.app.json`, `tsconfig.node.json`), `index.html` (con meta OG, theme-color, preconnect a fuentes), `.gitignore`.

### 4.2 Internacionalización (`src/i18n/`)
- `content.ts`: todo el texto en **EN y ES**, transcrito de ambos CVs. Tipado con `Content`.
  Incluye `LINKS` (email, teléfono, LinkedIn, rutas de CV).
- `I18nProvider.tsx`: contexto React, hook `useI18n()`, persiste en `localStorage`,
  default EN (respeta navegador en español), fija `document.documentElement.lang`.
- El hero se compone de "segmentos" (`Segment[]`) para resaltar en ámbar las frases clave.

### 4.3 Secciones (`src/components/sections/`)
| Sección | id | Contenido | Visual |
|---------|-----|-----------|--------|
| **Hero** | `#top` | Nombre, rol, tesis (−90%), CTAs, disponibilidad | `particlesphere` (integrado) + entrada GSAP |
| **About** | `#about` | Bio + ángulo freelance/IA | Originkit `reactive-lines` (líneas cyan, lazy) |
| **Impact** | `#impact` | 4 tiles: −90% costos, −90% horas, End-to-end, Core | Contadores animados (`Counter`) |
| **Trajectory** | `#trajectory` | Timeline de **6 roles** con badge "NOW" | Originkit `kineticgrid` (dot-grid reactivo, lazy) |
| **Stack** | `#stack` | Marquee de 12 logos + 6 grupos de chips | Marquee CSS — interino, **decisión pendiente §5.3** |
| **AI-First** | `#ai-first` | Diferenciador freelance + specs | Órbita CSS con Claude Code al centro — interino, **decisión pendiente §5.3** |
| **Credentials** | `#credentials` | Formación, certs, idiomas, "beyond" (karate, violín) | Grid editorial |
| **Contact** | `#contact` | CTA + email/teléfono/LinkedIn/ubicación | — |
| **Nav / Footer** | — | Nav fija con burger móvil, toggle EN/ES, CTA CV | — |

### 4.4 Motion
- **Hero:** timeline GSAP `useLayoutEffect` (stagger de entrada), se salta con reduced-motion.
- **Reveals de scroll:** `useReveal` (IntersectionObserver) con stagger de hijos — `src/hooks/useReveal.ts` + `src/styles/motion.css`.
- **CSS:** marquee de logos, órbita rotatoria, pulso de disponibilidad, línea de scroll.
- **Contadores:** `src/components/ui/Counter.tsx` cuenta al entrar en viewport.

### 4.5 Accesibilidad y performance
- Skip-link, `:focus-visible` visible, `prefers-reduced-motion` respetado en todo.
- `scroll-margin-top` en secciones para que las anclas no queden bajo el nav.
- La esfera WebGL va **code-split** (chunk lazy) y **solo se monta cuando es visible** y si no hay reduced-motion (`LazyViz`).
- Iconos SVG inline (sin requests), fuentes con `display=swap` + preconnect.

### 4.6 Assets
- `public/favicon.svg` (esfera ámbar).
- `public/Juan-Diego-Flores-CV-EN.pdf` y `-ES.pdf` (tus CVs; los botones descargan según idioma).

### 4.7 Deploy
- `vercel.json` (`framework: vite`, `outputDirectory: dist`, cache headers de assets).
- `npm run build` verde. Tamaños: CSS 23 KB (5.4 gzip), JS principal 266 KB (93 gzip),
  chunk `ParticleSphere` (three.js) 480 KB (122 gzip, lazy).

---

## 5. Integración Originkit — detalle

### 5.1 Hecho: `particlesphere`
- Traído con `get_component({ name, stack:'vite', styling:'css', typescript:true })`.
- Guardado en `src/components/originkit/ParticleSphere.tsx`.
- Montado en el hero vía `LazyViz` + `React.lazy`, con props:
  `particlesCount=8000, particleScale=3.4, speed=13, sphereColor="#57E0D8", cursorOn`, etc.

### 5.2 Hecho (2026-07-16): `reactive-lines` + `kineticgrid`
- Los 4 componentes crudos se **re-fetchearon del MCP y quedaron en `_originkit-raw/`** (gitignoreado) — los swaps ya **no dependen del límite diario**.
- `reactive-lines` → `src/components/originkit/ReactiveLines.tsx`, montado en **About** vía `LazyViz` + `React.lazy`. Canvas 2D (sin deps). Escucha el mouse en `document`, así que funciona con el fondo en `pointer-events:none`. Props: `backgroundColor="#0A0C10"`, `lineColor="rgba(87,224,216,0.6)"`, `minLines=6`, `maxLines=30`, `fade`.
- `kineticgrid` → `src/components/originkit/KineticGrid.tsx`, montado en **Trajectory**. Canvas 2D (sin deps). **Requirió**: shim de `useIsStaticRenderer` (hook solo-Framer → `() => false`) y `style={{ pointerEvents:'auto' }}` (escucha en su host, no en `document`). Props: `background="transparent"`, `dotColor="#ECEEF3"`, `lineColor/trailColor="#57E0D8"`, `spacing=48`, `radius=220`.
- **El interino CSS ahora es el `reducedFallback`**: `.lineflow` / `.dotgrid` se muestran bajo `prefers-reduced-motion`; el canvas vivo, en el resto.
- Verificado con `_verify-viz.mjs` (helper local: motion ON + barrido de mouse simulado; `_shot.mjs` no sirve para canvas vivo porque usa `reducedMotion`). Build verde; chunks lazy: KineticGrid 3.5 KB, ReactiveLines 4.7 KB.

### 5.3 ✅ DECISIÓN CERRADA (2026-09-08) — `spinimage` + `sticker-peel` descartados

Juan confirmó que **solo tiene GitHub** como material publicable: la mayor parte de lo que el
sitio describe pertenece a **procesos confidenciales** de los bancos y empresas donde trabajó,
así que no hay capturas de proyectos ni se puede exponer trabajo real.

- **`spinimage`** (AI-First) necesitaba 4–8 imágenes reales. **Descartado.** La sección ahora usa
  la órbita CSS como *fondo a sangre* detrás del texto (ver §11), no como columna lateral.
- **`sticker-peel`** (Stack) necesitaba una foto. **Descartado**, tal como recomendaba esta misma
  guía si no había foto que justificara el peso de WebGL. El Stack ya no tiene marquee ni chips:
  es una ficha técnica (§11).
- **Consecuencia:** `framer-motion` queda como **dependencia sin usar** y se puede desinstalar.
- El crudo de los 4 sigue en `_originkit-raw/` por si algún día aparecen los assets.

### 5.4 Procedimiento de swap (integrar desde `_originkit-raw/`)
El crudo de los 4 ya está staged, así que **no hace falta el MCP**. Para cada pendiente:
1. Copiar el `.tsx` crudo a `src/components/originkit/<Nombre>.tsx` y anteponer el header de vendorizado: `// @ts-nocheck` + `/* eslint-disable */` + comentario "Generated". (`sticker-peel` sale del `.raw.json`: extraer el bloque ```` ```tsx ```` primero.)
2. Normalizar (a mano o con `_extract.mjs`): reescribir imports CDN → npm (`three`, `three/examples/jsm/*`, `framer-motion`); quitar imports de `framer`/`unframer`; añadir shims de runtime que use (p. ej. `RenderTarget`, `useIsStaticRenderer`).
3. Instalar deps que declare (p. ej. `sticker-peel` → `framer-motion`, ya instalado).
4. Sustituir el interino: `React.lazy` + `LazyViz`, con el CSS interino como `reducedFallback`. Si el componente escucha el mouse en su host (no en `document`), pasar `style={{ pointerEvents:'auto' }}`.
5. `npx tsc -b` (o `npm run build`) y verificar el **canvas vivo** con `node _verify-viz.mjs` (motion ON + mouse simulado). `_shot.mjs` solo sirve para layout/fallback (usa `reducedMotion`).

> Ver la memoria `originkit-mcp-quirks` para los gotchas completos.

---

## 6. Pendiente / TODO (priorizado)

1. **Prueba verificable (lo más importante).** El sitio sigue sin mostrar nada que un cliente
   pueda abrir. GitHub ya está enlazado (nav footer + ledger de contacto). Falta **un caso de
   estudio compatible con confidencialidad**: problema / qué construí / qué eliminó / stack,
   sin visuales del cliente ni nombres protegidos.
2. ~~Conflicto de fechas~~ **✅ RESUELTO (2026-09-08).** `trajectory.lead` decía *"Cinco años
   construyendo"* / *"Five years of building"*, pero los roles fechados arrancan en **04/2023**
   (3 años y 5 meses a hoy). Cambiado a **"Más de tres años" / "Over three years"**, que ya no
   se contradice con el `2023` que el timeline deriva de los datos. Si algún día se cuentan los
   años de estudios (2020–2024), habría que ajustar también el extremo del raíl.
3. **El claim "90%+" sigue sin denominador.** Aparece en Hero, About, Impact ×2 y Trajectory ×2,
   sin línea base ni marco temporal. Una sola frase con dos números reales haría más trabajo.
4. ~~Deploy~~ **✅ HECHO (2026-09-08)** — ver §12.
5. **Desinstalar `framer-motion`** (ya no se usa; ver §5.3).
6. **Opcional:** GSAP ScrollTrigger para parallax / pin del timeline.

## 7. Notas técnicas y gotchas (aprendidos)

- **Reset global `canvas { max-width: 100% }` rompe WebGL**: el canvas se auto-agranda y debe desbordar; limitar el ancho (pero no el alto) lo deforma en elipse. Por eso `canvas` está **excluido** del reset en `base.css`.
- **Los canvases WebGL salen en negro en screenshots headless de Playwright** ("GPU stall due to ReadPixels"). Los navegadores reales los ven bien. Para QA: capturar con `reducedMotion: 'reduce'` (la esfera no se monta) o forzar `--use-angle=swiftshader`.
- **Componentes Originkit vienen "para Framer"**: aun en variante `vite` traen `three` por CDN, `RenderTarget` de `framer` (undefined en runtime) y código con `any` que rompe `strict`. El `_extract.mjs` lo normaliza.
- **`framer-motion` instalado pero sin importar** todavía → tree-shaking lo deja fuera del bundle hasta que se integre `sticker-peel`.

---

## 8. Mapa de archivos

```
jdflores-dev/
├─ index.html                 # entry + fuentes + meta
├─ vite.config.ts, tsconfig*  # config
├─ vercel.json                # deploy
├─ README.md, HANDOFF.md
├─ public/
│  ├─ favicon.svg
│  └─ Juan-Diego-Flores-CV-EN.pdf / -ES.pdf
├─ src/
│  ├─ main.tsx, App.tsx
│  ├─ i18n/           content.ts (EN/ES), I18nProvider.tsx
│  ├─ data/           tools.ts (simple-icons)
│  ├─ hooks/          useReveal.ts, useReducedMotion.ts
│  ├─ styles/         index.css → tokens / base / motion / sections
│  └─ components/
│     ├─ Nav.tsx, LangToggle.tsx, Footer.tsx
│     ├─ ui/          Counter.tsx, BrandIcon.tsx
│     ├─ originkit/   ParticleSphere, ReactiveLines, KineticGrid (vendored), LazyViz.tsx
│     └─ sections/    Hero, About, Impact, Trajectory, Stack, AIFirst, Credentials, Contact
├─ _originkit-raw/            # crudo Originkit staged (gitignoreado) — los 4 componentes
└─ _extract.mjs, _shot.mjs, _verify-viz.mjs   # helpers locales (gitignoreados)
```

---

## 9. Comandos

```bash
npm install
npm run dev       # dev server (HMR)
npm run build     # tsc -b && vite build → /dist
npm run preview   # sirve /dist
npm run lint      # type-check
node _shot.mjs    # screenshots de QA — layout/fallback (reducedMotion)
URL=http://localhost:5183 node _verify-viz.mjs   # verifica canvas VIVO (motion ON + mouse simulado)
```
> Nota: vite preview/dev bindea a `localhost` (IPv6), no a `127.0.0.1` — apunta los scripts a `localhost`.

---

## 10. Origen del contenido

- Todo el texto proviene de tus dos CVs (EN y ES), incluidos los datos de contacto:
  `juandi9585@gmail.com`, `+58 414 925 7525`, Caracas.
- Se añadió, según pediste, el ángulo de **freelance con herramientas de IA modernas (principalmente Claude Code)** en Hero, About y la sección AI-First.
- El toggle EN/ES cambia también el PDF de CV que se descarga.

---

## 11. Pasada de diseño `/impeccable` (2026-09-08)

Encargo de Juan: que el portafolio **no tenga vibra "vibecodeada"**, con prohibición dura del
patrón *tag pequeño → título enorme → texto pequeño → otro tag*.

### 11.1 Diagnóstico
Crítica `/impeccable critique` con dos evaluaciones aisladas (revisión de diseño + detector).
Resultado **21/36** en heurísticas de Nielsen. Snapshot en
`.impeccable/critique/2026-09-08T18-55-16Z__src-app-tsx.md`.

El patrón estaba **7 veces**, sostenido por una primitiva reutilizable `.section__head`
(`base.css`). Cuatro cabeceras eran **pixel-idénticas** (`left:161, width:485`). Seis de las
siete composiciones sobrevivían un trasplante total de contenido sin tocar CSS.

### 11.2 Regla estructural nueva
**No existe primitiva de cabecera de sección.** `.eyebrow`, `.section__head`, `.section__title`
y `.section__lead` fueron **borradas** de `base.css`, y el campo `eyebrow` fue **eliminado del
tipo `Content`** y de los 14 literales de `content.ts`. El patrón no tiene de dónde regenerarse.

Cada sección abre con su propia mecánica, en su propio namespace, y **ninguna se repite**:

| Sección | Mecánica | Clases |
|---|---|---|
| **Hero** | **Masthead + barra de instrumentos**: nombre y tesis como una sola masa tipográfica; todo el metadato baja a una franja anclada al fondo | `.hero__grid` / `.hero__status` |
| About | Run-in: el h2 va inline y el párrafo sigue en el mismo flujo | `.about__runin` / `.about__lead-in` |
| Impact | Ledger con reglas; las cifras llevan el display, el h2 baja a `<caption>` | `.ledger*` |
| Trajectory | Espina + regla; los extremos del raíl (Now → 2023) llevan el display | `.tj__spine` / `.tj__bracket` |
| Stack | Ficha técnica; el h2 ocupa la primera fila de la propia rejilla | `.specsheet*` |
| AI-First | Marginalia en esquina; órbita a sangre detrás | `.aifirst__runhead` |
| Credentials | Sangría francesa; "beyond" promovido a filas pares | `.cred__hang` / `.cred__group` |
| Contact | Par alineado por línea base, 50/50 | `.contact__pair` |

Los 7 h2 de sección siguen existiendo y en orden de DOM (accesibilidad), con tamaños de 16 a
34 px: ninguno es un título apilado. El `h1` del hero es el nombre.

### 11.3 Bugs corregidos
- **P0 — titular ES cortado en móvil.** A 390 px, `.contact__title` medía **424,8 px** con borde
  derecho en **446,1** dentro de una caja de 390 (`docScrollWidth` 446). La palabra
  *"Construyamos"* sola era más ancha que el viewport; `body{overflow-x:hidden}` lo ocultaba, así
  que **en inglés se veía bien y en español se amputaba**. Ahora: borde derecho **368,7**,
  `docScrollWidth` = 390, sin scroll horizontal.
- **P0 — dos métricas 90%+ idénticas** una al lado de otra. El ledger pone la etiqueta junto a la
  cifra, así que se leen como dos medidas distintas; solo la primera va en ámbar.
- **CV en inglés para visitantes ES:** `Hero.tsx` fijaba `LINKS.resumeEn`. Ahora respeta el idioma.
- **Contraste:** `--muted-2` (3,40:1, falla AA) se usaba en `.lang__btn` y `.metric__index`.
  Movido a `--muted` (6,34:1).
- **Drawer móvil invisible capturaba el foco** en desktop (5 enlaces en las posiciones 11–15 de
  tabulación). Ahora `inert` al cerrar, + Escape, scroll-lock y scrim.
- **Quiebre de alineación de 150 px** en `#contact` (tenía `.container` *y* `max-width:900px`).
- `#ai-first` y `#credentials` no tenían entrada en el nav; se añadió AI-first + scroll-spy con
  `aria-current`.

### 11.4 Señales de "generado por IA" eliminadas
Detector en navegador: **12 hallazgos primarios → 1**, y ese único restante es intencional.

- 4 × `dark-glow` (halos ámbar/cyan de offset cero) y 1 × `radial-spotlight-glow` → eliminados.
- 2 × `marquee` (el muro de logos que repetía la lista, y la línea del scroll cue) → eliminados;
  los logos son ahora una banda estática.
- 2 × `all-caps-body` → el rol del hero deja el mono en mayúsculas; el footer perdió su línea.
- `tight-leading`, `line-length` (115 car.), `gpt-thin-border-wide-shadow` → corregidos.
- **24 chips** en Stack → prosa. Numeración decorativa `01/02/03` en Impact → fuera.
- Flechas Unicode `→` `↗` → SVG dibujado (`ui/Icon.tsx`).
- Superficies de navegador tematizadas: scrollbar, `caret-color`, `text-underline-offset`,
  cifras tabulares (`.tnum`).
- **Ámbar disciplinado:** de 11 papeles a 4 (botón primario, la cifra titular del ledger, el nodo
  "ahora" del timeline, y el estado activo de nav/idioma).

**Falsos positivos documentados** (no tocar):
- `clipped-overflow-container` en `#top`: el canvas WebGL **debe** desbordar y el hero lo recorta.
  Es el gotcha de §7, no un defecto.
- `dark-glow (#ffba00)` a nivel de `body`: verificado que **las 6 sombras de la página pertenecen
  al propio overlay del detector**; el sitio tiene cero.
- `em-dash-overuse` (25, advisory): están en el texto del CV, que Juan marcó como intocable.

### 11.5 Verificación
`npm run build` verde · `npx tsc -b` limpio · consola sin errores · sin scroll horizontal a 390 px
en **ES** e **EN** · página 18 % más corta en móvil (13.058 → ~11.200 px).

---

## 12. Deploy — GitHub Pages (2026-09-08)

**En vivo:** https://juandi9585.github.io/jdflores-dev/

### 12.1 Por qué el repo es público
GitHub Pages **no funciona en repos privados con el plan gratuito** (la API devuelve
`422 Your current plan does not support GitHub Pages for this repository`). Juan optó por
**hacer el repo público** en vez de pagar Pro o mudarse a Vercel. Consecuencia: el código
fuente, el historial de git y los datos de contacto en `content.ts` son públicos.

### 12.2 Base path — el detalle que rompe todo si se olvida
Es un *project site*, así que se sirve desde `/jdflores-dev/`, no desde la raíz.

- `vite.config.ts` define `base: '/jdflores-dev/'` **solo en modo producción**; en dev sigue
  siendo `/`, así que las URLs locales no cambian. `vite preview` corre en modo producción, por
  lo que refleja el deploy real.
- Vite reescribe las URLs absolutas dentro de `index.html` (favicon, JS, CSS), **pero no los
  literales de string en JS**. Por eso los PDFs del CV en `LINKS` se construyen con
  `import.meta.env.BASE_URL`. Requiere `src/vite-env.d.ts` para que TS conozca `import.meta.env`.
- **Si alguna vez se renombra el repo, hay que cambiar `base`** o todos los assets dan 404.

### 12.3 Procedimiento de publicación
El token local de `gh` **no tiene el scope `workflow`**, así que no se puede hacer push de un
archivo en `.github/workflows/`. Por eso el deploy es un push manual de `dist/` a `gh-pages`:

```bash
npm run build
cd dist && touch .nojekyll
git init -b gh-pages && git add -A && git commit -m "Deploy"
git push -f https://github.com/juandi9585/jdflores-dev.git gh-pages:gh-pages
```

`dist/` está gitignoreado en el repo principal, así que el `.git` anidado no molesta.
Para automatizarlo: `gh auth refresh -s workflow`, añadir un workflow de Pages y cambiar la
fuente de Pages a "GitHub Actions".

### 12.4 Nota de cuentas
La máquina tiene **dos cuentas de `gh`**: `ENA-demo` (era la activa) y `juandi9585` (dueño del
repo). Hubo que hacer `gh auth switch --user juandi9585` para el push y la API; **la activa se
restauró a `ENA-demo`** al terminar. Ninguna de las dos tiene scope `workflow`.

### 12.5 Verificado en producción
`/`, JS, CSS, favicon y ambos PDFs devuelven **200** con el content-type correcto. En el sitio
real: 94% en la tesis del hero y en el ledger, enlace de CV correcto por idioma
(`/jdflores-dev/Juan-Diego-Flores-CV-ES.pdf`), GitHub enlazado, **0 elementos del patrón
prohibido**, 7 `h2`, y a 390 px en español el titular cierra en **368,7 px** sin scroll
horizontal.

---

## 13. Segunda pasada: el hero (2026-09-08)

**El hero se había quedado fuera de §11** porque la crítica lo había marcado como "la parte
autorada" de la página. Juan lo detectó al entrar al sitio ya desplegado: era **exactamente el
patrón prohibido** — etiqueta pequeña con punto cian → nombre enorme → tesis → texto gris
pequeño → fila de metadatos. El patrón completo, incluido el "otro tag pequeño" del final.

### 13.1 Composición nueva: masthead + barra de instrumentos
- **Nada etiqueta al nombre por arriba y nada lo describe por abajo.** `hero__role`,
  `hero__dot`, `hero__tagline`, `hero__meta` y `hero__scroll` fueron eliminados.
- El **nombre y la tesis** se leen como un solo bloque tipográfico (`margin-top: 0.35em` entre
  ambos), no como "título grande + descripción".
- Todo el metadato (rol, ubicación, disponibilidad, señal de scroll) baja a una **franja de
  estado anclada al fondo del viewport**, con hairline superior y separadores verticales. Es el
  concepto "Deployed Systems Console" tomado literalmente, y es la **octava mecánica**: ninguna
  otra sección la usa.
- El campo `hero.tagline` quedó sin uso y **se eliminó del tipo y de ambos idiomas** (el mismo
  punto de freelance/Claude Code ya lo hacen About y AI-First).

### 13.2 ⚠️ Modificación local a `ParticleSphere.tsx` (componente vendorizado)
La esfera **impedía scrollear en móvil**. La causa estaba en el componente de Originkit:
`handleTouchMove` llamaba `event.preventDefault()` con el comentario literal
`// Prevent scrolling`, y ambos listeners estaban registrados con `passive: false`. Es decir,
la esfera se tragaba cada gesto vertical sobre el canvas.

**Bloquear la esfera no era la solución** (Juan quiere conservar la interacción). El arreglo:

1. Quitados los `preventDefault()` de `handleTouchMove` y `handleTouchStart`.
2. Ambos listeners pasan a `passive: true`.
3. El canvas declara **`touch-action: pan-y`** (`.hero__viz, .hero__viz canvas`).

Resultado: el navegador se queda con el gesto vertical (la página scrollea) mientras el
componente **sigue recibiendo las coordenadas táctiles**, así que un swipe scrollea *y* agita
las partículas a la vez, y un tap sigue disparando el scatter.

> **Las tres modificaciones están marcadas con `LOCAL MODIFICATION` en el archivo.** Si alguna
> vez se re-extrae el componente desde `_originkit-raw/`, **hay que volver a aplicarlas** o el
> scroll móvil se rompe otra vez sin aviso.

Verificado despachando un `touchmove` cancelable sobre el canvas: `defaultPrevented === false`
en producción, con `touch-action: pan-y` computado.

### 13.3 La esfera ya no tapa el texto
En móvil la esfera se renderizaba **justo detrás de la tesis**, destrozando la legibilidad
(visible en la captura que envió Juan). Como el nombre está alineado a la izquierda y con medida
corta, el **cuadrante superior derecho es la única región sin copy**: ahí se ancló
(`top: 6%; right: -34%; width: min(82vw, 400px); opacity: .5`).

### 13.4 Detector
El hero nuevo introdujo 2 hallazgos que se corrigieron en el momento — `all-caps-body` (41
caracteres en mayúsculas en la franja) y "children flush against border-top" — más un tercero
derivado (`letter-spacing: 0.08em` sobre texto en minúsculas, que es tracking de versalitas).
La franja quedó en minúsculas con el tracking por defecto de `.mono` y padding real bajo la
regla. **Saldo neto: 0 hallazgos nuevos**; siguen solo los 3 ya clasificados como no-defectos
en §11.4.
