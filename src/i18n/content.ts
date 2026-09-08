/* =========================================================
   Bilingual content — sourced verbatim from Juan's CVs.
   EN is the default; ES mirrors it 1:1.
   ========================================================= */

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
  nav: { about: string; impact: string; work: string; stack: string; method: string; contact: string; resume: string }
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
    locationLabel: string
    location: string
    cta: string
  }
  footer: { rights: string }
}

/** language-neutral links & constants */
export const LINKS = {
  email: 'juandi9585@gmail.com',
  phone: '+58 414 925 7525',
  phoneHref: '+584149257525',
  linkedin: 'https://www.linkedin.com/in/juan-diego-flores-686334268/',
  linkedinHandle: '/juan-diego-flores',
  github: 'https://github.com/juandi9585',
  githubHandle: '@juandi9585',
  // BASE_URL keeps these correct under the GitHub Pages sub-path. They are plain
  // string literals, so unlike asset URLs in index.html Vite does not rewrite them.
  resumeEn: `${import.meta.env.BASE_URL}Juan-Diego-Flores-CV-EN.pdf`,
  resumeEs: `${import.meta.env.BASE_URL}Juan-Diego-Flores-CV-ES.pdf`,
}

export const en: Content = {
  nav: { about: 'About', impact: 'Impact', work: 'Trajectory', stack: 'Stack', method: 'AI-first', contact: 'Contact', resume: 'Résumé' },
  hero: {
    role: 'Systems Engineer · AI Specialist',
    name: 'Juan Diego Flores',
    thesis: [
      { t: 'I engineer ' },
      { t: 'autonomous agents', accent: true },
      { t: ' and full-stack systems that cut banking operating costs by ' },
      { t: '94%', accent: true },
      { t: '.' },
    ],
    location: 'Caracas, Venezuela',
    availability: 'Available for freelance',
    ctaPrimary: 'Start a project',
    ctaSecondary: 'Download résumé',
    scrollCue: 'Scroll',
  },
  about: {
    title: 'An engineer who ships systems that think for themselves.',
    body: [
      'Systems Engineer from UNIMET with a final degree project awarded with honors, specializing in Artificial Intelligence. I have a proven track record building full-stack architectures and autonomous agents that have driven major operational cost reductions in the banking sector.',
      'I work as a freelance engineer using the latest AI development tooling — primarily Claude Code — to design, orchestrate and ship production software faster than traditional teams. My core is n8n workflow orchestration, the Google Cloud ecosystem, and scalable software.',
    ],
    signature: 'From front-end to autonomous AI agents — one architect, end to end.',
  },
  impact: {
    title: 'Outcomes, not output.',
    lead: 'Every engagement is measured by what it removed: cost, hours, and manual bottlenecks.',
    metrics: [
      { kind: 'count', value: 94, suffix: '%', label: 'Operating cost reduction', note: 'Autonomous agentic support solution · banking sector' },
      { kind: 'count', value: 90, suffix: '%+', label: 'Man-hours saved', note: 'AI-powered credit-analysis application' },
      { kind: 'text', text: 'End-to-end', label: 'Delivery ownership', note: 'Front-end, back-end, AI agents & automation — solo architect' },
      { kind: 'text', text: 'Core', label: 'Payments migration', note: 'Release & versioning lead · IBM AS/400 · banking' },
    ],
  },
  trajectory: {
    title: 'A track record across banking, AI and automation.',
    lead: 'Over three years of building, from data integration to autonomous agents in production.',
    nowLabel: 'Now',
    roles: [
      {
        period: '09/2025 — Present',
        company: 'PadTech Solution, C.A.',
        location: 'Contractor at Banesco, Banco Universal · Venezuela',
        title: 'AI Developer',
        points: [
          'Full-stack development of an AI-powered credit-analysis application, resulting in 90%+ man-hour savings.',
          'Led the design and implementation of an autonomous agentic support chatbot that reduced operating costs by 94%.',
          'Built AI-driven document-management tools that optimized productivity and drastically reduced man-hours.',
          'Designed end-to-end full-stack & AI architecture on GCP + n8n — from front/back-end to AI agent orchestration.',
        ],
      },
      {
        period: '03/2025 — 05/2025',
        company: 'Ministry of Natural Resources & Environment',
        location: 'Honduras · Remote',
        title: 'Intern — Automation Architect',
        points: [
          'Automated the processing of controlled-substance import permits with Power Automate and the Microsoft 365 suite, removing manual bottlenecks and ensuring strict regulatory compliance.',
        ],
      },
      {
        period: '01/2025 — 09/2025',
        company: 'Inversiones Galiang, C.A.',
        location: 'Contractor at Banesco, Banco Universal · Venezuela',
        title: 'Full-Stack Specialist Architect',
        points: [
          'Release-management and versioning lead (IBM AS/400) for a high-stakes Core Payments Migration.',
          'Built dashboards and KPI reporting for the Core Payments migration.',
          'Delivered productivity tools with Google Apps Script and AppSheet for operational departments.',
        ],
      },
      {
        period: '01/2024 — 12/2024',
        company: 'Banesco, Banco Universal',
        location: 'Venezuela',
        title: 'Intern — Developer',
        points: [
          'Developed Oracle Service Bus (OSB) integration services; web and API development.',
          'Assisted in a major banking-software technological migration project.',
        ],
      },
      {
        period: '09/2023 — 07/2024',
        company: 'Universidad Metropolitana de Caracas',
        location: 'Venezuela',
        title: 'Teaching Assistant — Introductory Mathematics',
        points: ['Ran supplemental practical lessons for undergraduate students.'],
      },
      {
        period: '04/2023 — 08/2023',
        company: 'Banesco, Banco Universal',
        location: 'Venezuela',
        title: 'Intern — Data Modeling & Integration',
        points: ['Designed and developed data tables; built Oracle Service Bus (OSB) integration services.'],
      },
    ],
  },
  stack: {
    title: 'The tools I orchestrate.',
    lead: 'From AI agents to core banking integrations — a full-stack toolkit.',
    groups: [
      { label: 'AI & Automation', items: ['Claude Code', 'n8n', 'AI agent orchestration', 'Prompt design'] },
      { label: 'Cloud', items: ['Google Cloud Platform', 'Vertex AI'] },
      { label: 'Full-stack & Mobile', items: ['Node.js', 'React.js', 'Express.js', 'Flutter'] },
      { label: 'ML & Data Science', items: ['Python', 'TensorFlow', 'PyTorch', 'Neural nets · DQN'] },
      { label: 'Data & BI', items: ['PostgreSQL', 'Power BI', 'Report Builder'] },
      { label: 'Low-code & Methods', items: ['Apps Script', 'AppSheet', 'Power Automate', 'Git · Scrum'] },
    ],
  },
  aiFirst: {
    title: 'AI-first, by default.',
    body: [
      'I build as a freelance engineer with an agentic workflow at the center. Modern AI dev tooling — primarily Claude Code — lets me move from spec to shipped software at a pace traditional teams can’t match, without giving up rigor.',
      'Agents draft, I direct and verify. The result is production software delivered faster, with the same banking-grade discipline I bring to every core system.',
    ],
    points: [
      { k: 'Primary tool', v: 'Claude Code' },
      { k: 'Orchestration', v: 'n8n · autonomous agents' },
      { k: 'Cloud', v: 'Google Cloud · Vertex AI' },
      { k: 'Discipline', v: 'Banking-grade · ISO 27001' },
    ],
  },
  credentials: {
    title: 'Education & recognition.',
    eduLabel: 'Education',
    certLabel: 'Certifications',
    langLabel: 'Languages',
    beyondLabel: 'Beyond the screen',
    education: [
      { school: 'CEUPE European Business School', place: 'Madrid, Spain', degree: 'Master in Artificial Intelligence', period: '2026 — 2027', note: 'In progress' },
      { school: 'Universidad Metropolitana de Caracas', place: 'Caracas, Venezuela', degree: 'Systems Engineering', period: '2020 — 2024', note: 'Academic index 17/20 · Full academic-excellence scholarship · Honorable mention, final degree project' },
      { school: 'Universidad Metropolitana de Caracas', place: 'Caracas, Venezuela', degree: 'Minor — Software Development', period: '2024' },
    ],
    certs: [
      { name: 'Deep Learning Specialization', issuer: 'DeepLearning.AI · Andrew Ng', year: '2024' },
      { name: 'Generative AI & Vertex AI: Prompt Design', issuer: 'Google Cloud Skills' },
      { name: 'Generative AI Professional (GAIPC)', issuer: 'Certiprof' },
      { name: 'ISO 27001 Information Security', issuer: 'Seguridad Cero', year: '2024' },
    ],
    languages: [
      { lang: 'Spanish', level: 'Native' },
      { lang: 'English', level: 'Full professional · IELTS 7.5/9' },
      { lang: 'Japanese', level: 'Basic · JLPT N4' },
    ],
    beyond: ['2nd Dan Black Belt — Karate (competitive)', 'Violin — advanced level', '“Lista del Rector” academic-excellence recognition'],
  },
  contact: {
    title: 'Tell me what you need built.',
    lead: 'Open to freelance projects in AI, automation and full-stack engineering.',
    availability: 'Available for freelance',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    linkedinLabel: 'LinkedIn',
    githubLabel: 'GitHub',
    locationLabel: 'Based in',
    location: 'Caracas, Venezuela',
    cta: 'Email me',
  },
  footer: { rights: 'All rights reserved.' },
}

export const es: Content = {
  nav: { about: 'Perfil', impact: 'Impacto', work: 'Trayectoria', stack: 'Stack', method: 'AI-first', contact: 'Contacto', resume: 'CV' },
  hero: {
    role: 'Ingeniero de Sistemas · Especialista en IA',
    name: 'Juan Diego Flores',
    thesis: [
      { t: 'Construyo ' },
      { t: 'agentes autónomos', accent: true },
      { t: ' y sistemas full-stack que reducen los costos operativos de la banca en un ' },
      { t: '94%', accent: true },
      { t: '.' },
    ],
    location: 'Caracas, Venezuela',
    availability: 'Disponible para freelance',
    ctaPrimary: 'Iniciar un proyecto',
    ctaSecondary: 'Descargar CV',
    scrollCue: 'Desliza',
  },
  about: {
    title: 'Un ingeniero que despliega sistemas que piensan solos.',
    body: [
      'Ingeniero de Sistemas de la UNIMET con Trabajo Final de Grado con mención honorífica, especialista en Inteligencia Artificial. Tengo experiencia comprobada desarrollando arquitecturas full-stack y agentes autónomos que han generado reducciones sustanciales de costos operativos en el sector bancario.',
      'Trabajo como ingeniero freelance usando las últimas herramientas de desarrollo con IA — principalmente Claude Code — para diseñar, orquestar y entregar software en producción más rápido que los equipos tradicionales. Mi base es la orquestación de flujos con n8n, el ecosistema de Google Cloud y el software escalable.',
    ],
    signature: 'Del front-end a los agentes de IA autónomos — un solo arquitecto, de punta a punta.',
  },
  impact: {
    title: 'Resultados, no entregables.',
    lead: 'Cada proyecto se mide por lo que eliminó: costos, horas y cuellos de botella manuales.',
    metrics: [
      { kind: 'count', value: 94, suffix: '%', label: 'Reducción de costos operativos', note: 'Solución de soporte agéntico autónomo · sector bancario' },
      { kind: 'count', value: 90, suffix: '%+', label: 'Horas-hombre ahorradas', note: 'Aplicativo de análisis de crédito con IA' },
      { kind: 'text', text: 'End-to-end', label: 'Entrega integral', note: 'Front-end, back-end, agentes de IA y automatización — solo arquitecto' },
      { kind: 'text', text: 'Core', label: 'Migración de pagos', note: 'Líder de versionado y liberaciones · IBM AS/400 · banca' },
    ],
  },
  trajectory: {
    title: 'Un recorrido entre banca, IA y automatización.',
    lead: 'Más de tres años construyendo, de la integración de datos a agentes autónomos en producción.',
    nowLabel: 'Ahora',
    roles: [
      {
        period: '09/2025 — Presente',
        company: 'PadTech Solution, C.A.',
        location: 'Contratista en Banesco, Banco Universal · Venezuela',
        title: 'Desarrollador de IA',
        points: [
          'Desarrollo full-stack de un aplicativo de análisis de crédito con IA, con un ahorro de horas-hombre superior al 90%.',
          'Lideré el diseño e implementación de un chatbot de soporte agéntico autónomo que redujo los costos operativos en un 94%.',
          'Desarrollé herramientas de gestión documental con IA que optimizaron la productividad y redujeron drásticamente las horas-hombre.',
          'Diseñé arquitectura full-stack e IA de punta a punta en GCP + n8n — del front/back-end a la orquestación de agentes.',
        ],
      },
      {
        period: '03/2025 — 05/2025',
        company: 'Secretaría de Recursos Naturales y Ambiente',
        location: 'Honduras · Remoto',
        title: 'Becario — Arquitecto de Automatización',
        points: [
          'Automaticé la gestión de permisos de importación de sustancias controladas con Power Automate y el ecosistema Microsoft 365, eliminando cuellos de botella manuales y asegurando el cumplimiento normativo.',
        ],
      },
      {
        period: '01/2025 — 09/2025',
        company: 'Inversiones Galiang, C.A.',
        location: 'Contratista en Banesco, Banco Universal · Venezuela',
        title: 'Arquitecto Especialista Full-Stack',
        points: [
          'Líder de gestión de liberaciones y versionado (IBM AS/400) para la migración del Core de Medios de Pago.',
          'Desarrollé dashboards y reportería de indicadores (KPI) para la migración del Core de Pagos.',
          'Entregué soluciones de productividad con Google Apps Script y AppSheet para áreas operativas.',
        ],
      },
      {
        period: '01/2024 — 12/2024',
        company: 'Banesco, Banco Universal',
        location: 'Venezuela',
        title: 'Pasante — Desarrollador',
        points: [
          'Desarrollo de servicios de integración Oracle Service Bus (OSB); desarrollo web y de APIs.',
          'Apoyo en un proyecto de migración tecnológica de software bancario.',
        ],
      },
      {
        period: '09/2023 — 07/2024',
        company: 'Universidad Metropolitana de Caracas',
        location: 'Venezuela',
        title: 'Preparador — Matemática Inicial',
        points: ['Impartí lecciones prácticas suplementarias para estudiantes de pregrado.'],
      },
      {
        period: '04/2023 — 08/2023',
        company: 'Banesco, Banco Universal',
        location: 'Venezuela',
        title: 'Pasante — Modelado e Integración de Datos',
        points: ['Diseñé y desarrollé tablas de datos; construí servicios de integración Oracle Service Bus (OSB).'],
      },
    ],
  },
  stack: {
    title: 'Las herramientas que orquesto.',
    lead: 'De agentes de IA a integraciones bancarias core — un toolkit full-stack.',
    groups: [
      { label: 'IA & Automatización', items: ['Claude Code', 'n8n', 'Orquestación de agentes', 'Diseño de prompts'] },
      { label: 'Cloud', items: ['Google Cloud Platform', 'Vertex AI'] },
      { label: 'Full-stack & Móvil', items: ['Node.js', 'React.js', 'Express.js', 'Flutter'] },
      { label: 'ML & Ciencia de Datos', items: ['Python', 'TensorFlow', 'PyTorch', 'Redes neuronales · DQN'] },
      { label: 'Datos & BI', items: ['PostgreSQL', 'Power BI', 'Report Builder'] },
      { label: 'Low-code & Métodos', items: ['Apps Script', 'AppSheet', 'Power Automate', 'Git · Scrum'] },
    ],
  },
  aiFirst: {
    title: 'AI-first, por defecto.',
    body: [
      'Construyo como ingeniero freelance con un flujo agéntico en el centro. Las herramientas modernas de desarrollo con IA — principalmente Claude Code — me permiten ir de la especificación al software entregado a un ritmo que los equipos tradicionales no alcanzan, sin renunciar al rigor.',
      'Los agentes redactan; yo dirijo y verifico. El resultado es software en producción entregado más rápido, con la misma disciplina de grado bancario que aplico a cada sistema core.',
    ],
    points: [
      { k: 'Herramienta principal', v: 'Claude Code' },
      { k: 'Orquestación', v: 'n8n · agentes autónomos' },
      { k: 'Cloud', v: 'Google Cloud · Vertex AI' },
      { k: 'Disciplina', v: 'Grado bancario · ISO 27001' },
    ],
  },
  credentials: {
    title: 'Formación y reconocimientos.',
    eduLabel: 'Formación',
    certLabel: 'Certificaciones',
    langLabel: 'Idiomas',
    beyondLabel: 'Más allá de la pantalla',
    education: [
      { school: 'CEUPE European Business School', place: 'Madrid, España', degree: 'Máster en Inteligencia Artificial', period: '2026 — 2027', note: 'En curso' },
      { school: 'Universidad Metropolitana de Caracas', place: 'Caracas, Venezuela', degree: 'Ingeniería de Sistemas', period: '2020 — 2024', note: 'Índice académico 17/20 · Beca de excelencia académica (100%) · Mención honorífica en el Trabajo Final de Grado' },
      { school: 'Universidad Metropolitana de Caracas', place: 'Caracas, Venezuela', degree: 'Minor — Desarrollo de Software', period: '2024' },
    ],
    certs: [
      { name: 'Especialización en Deep Learning', issuer: 'DeepLearning.AI · Andrew Ng', year: '2024' },
      { name: 'IA Generativa & Vertex AI: Diseño de Prompts', issuer: 'Google Cloud Skills' },
      { name: 'Profesional en IA Generativa (GAIPC)', issuer: 'Certiprof' },
      { name: 'Seguridad de la Información ISO 27001', issuer: 'Seguridad Cero', year: '2024' },
    ],
    languages: [
      { lang: 'Español', level: 'Nativo' },
      { lang: 'Inglés', level: 'Profesional pleno · IELTS 7.5/9' },
      { lang: 'Japonés', level: 'Básico · JLPT N4' },
    ],
    beyond: ['2º Dan Cinturón Negro — Karate (competitivo)', 'Violín — nivel avanzado', 'Reconocimiento «Lista del Rector» a la excelencia académica'],
  },
  contact: {
    title: 'Cuéntame qué necesitas construir.',
    lead: 'Abierto a proyectos freelance en IA, automatización e ingeniería full-stack.',
    availability: 'Disponible para freelance',
    emailLabel: 'Email',
    phoneLabel: 'Teléfono',
    linkedinLabel: 'LinkedIn',
    githubLabel: 'GitHub',
    locationLabel: 'Ubicado en',
    location: 'Caracas, Venezuela',
    cta: 'Escríbeme',
  },
  footer: { rights: 'Todos los derechos reservados.' },
}

export const dict: Record<Lang, Content> = { en, es }
