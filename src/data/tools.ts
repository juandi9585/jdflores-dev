import {
  siClaude,
  siN8n,
  siGooglecloud,
  siReact,
  siNodedotjs,
  siExpress,
  siPython,
  siPytorch,
  siTensorflow,
  siPostgresql,
  siGithub,
  siFlutter,
} from 'simple-icons'

export type Tool = { name: string; path: string }

/** Monochrome brand marks (simple-icons) rendered in currentColor. */
export const tools: Tool[] = [
  { name: 'Claude Code', path: siClaude.path },
  { name: 'n8n', path: siN8n.path },
  { name: 'Google Cloud', path: siGooglecloud.path },
  { name: 'React', path: siReact.path },
  { name: 'Node.js', path: siNodedotjs.path },
  { name: 'Express', path: siExpress.path },
  { name: 'Python', path: siPython.path },
  { name: 'PyTorch', path: siPytorch.path },
  { name: 'TensorFlow', path: siTensorflow.path },
  { name: 'PostgreSQL', path: siPostgresql.path },
  { name: 'Flutter', path: siFlutter.path },
  { name: 'GitHub', path: siGithub.path },
]

/** Subset used for the AI-first orbit (Claude sits at the centre). */
export const orbitTools: Tool[] = [
  { name: 'n8n', path: siN8n.path },
  { name: 'Google Cloud', path: siGooglecloud.path },
  { name: 'Python', path: siPython.path },
  { name: 'React', path: siReact.path },
  { name: 'Node.js', path: siNodedotjs.path },
  { name: 'PostgreSQL', path: siPostgresql.path },
]

export const claudeMark = { name: 'Claude Code', path: siClaude.path }
