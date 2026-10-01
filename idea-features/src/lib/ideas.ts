import raw from '../data/ideas.json'
import { ideasFileSchema, type Idea } from '../types/idea'

export type GroupBy = 'none' | 'category' | 'kind' | 'phase' | 'impact'

export interface IdeaFilters {
  query: string
  kind: 'all' | 'extends' | 'new'
  category: string
  phase: 'all' | 'mvp' | 'v2' | 'v3'
  tags: string[]
}

const parsed = ideasFileSchema.safeParse(raw)

export const meta = parsed.success
  ? { project: parsed.data.project, topic: parsed.data.topic, generatedAt: parsed.data.generatedAt }
  : { project: '', topic: '', generatedAt: '' }

export const allIdeas: Idea[] = parsed.success ? parsed.data.ideas : []

export function allCategories(ideas: Idea[]): string[] {
  return [...new Set(ideas.map((i) => i.category))].sort()
}

export function allTags(ideas: Idea[]): string[] {
  return [...new Set(ideas.flatMap((i) => i.tags))].sort()
}

export function filterIdeas(ideas: Idea[], f: IdeaFilters): Idea[] {
  const q = f.query.trim().toLowerCase()
  return ideas.filter((i) => {
    if (f.kind !== 'all' && i.kind !== f.kind) return false
    if (f.phase !== 'all' && i.phase !== f.phase) return false
    if (f.category !== 'all' && i.category !== f.category) return false
    if (f.tags.length > 0 && !f.tags.every((t) => i.tags.includes(t))) return false
    if (!q) return true
    const hay = [i.title, i.description, i.category, i.why, ...i.tags, ...i.features].join(' ').toLowerCase()
    return hay.includes(q)
  })
}

export function groupIdeas(ideas: Idea[], by: GroupBy): [string, Idea[]][] {
  if (by === 'none') return [['all', ideas]]
  const map = new Map<string, Idea[]>()
  for (const idea of ideas) {
    const key = String(idea[by])
    const list = map.get(key) ?? []
    list.push(idea)
    map.set(key, list)
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
}

const impactRank = { high: 0, medium: 1, low: 2 } as const

export function sortByImpact(ideas: Idea[]): Idea[] {
  return [...ideas].sort((a, b) => impactRank[a.impact] - impactRank[b.impact] || b.mvpScore - a.mvpScore)
}

function routePath(path: string): string {
  const name = path.replace(/^src\/routes\//, '').replace(/\.(tsx|ts)$/, '')
  if (name === 'index') return '/'
  return '/' + name.replace(/\$\./g, '...').replace(/\$([\w]+)/g, ':$1').replace(/\./g, '/')
}

export function ideaSurfaces(idea: Idea): string[] {
  const out = new Set<string>()
  for (const fc of idea.fileChanges) {
    const p = fc.path
    const base = p.split('/').pop()?.replace(/\.(tsx|ts|json|jsonc|sql|css)$/, '') ?? p
    if (p.startsWith('src/routes/api/')) out.add(`api ${routePath(p)}`)
    else if (p.startsWith('src/routes/')) out.add(`route ${routePath(p)}`)
    else if (/Dialog/.test(base)) out.add(`dialog ${base}`)
    else if (/Table/.test(base)) out.add('table')
    else if (/Card|Toast|Toggle/.test(base)) out.add(`ui ${base}`)
    else if (p.startsWith('migrations/') || /schema/.test(base)) out.add('db schema')
    else if (/wrangler|capacitor|manifest|sw/.test(p)) out.add('deploy/native')
    else if (p === 'package.json') out.add('cmd scripts')
    else if (p.startsWith('scripts/')) out.add(`cli ${base}`)
    else if (p.startsWith('src/lib/') || p.includes('/lib/')) out.add(`lib ${base}`)
    else if (p.endsWith('.css')) out.add('styles')
    else out.add(base)
  }
  return [...out]
}
