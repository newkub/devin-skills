#!/usr/bin/env bun
/**
 * capture.ts — capture screenshots of ALL routes x ALL device sizes in one run.
 * Framework-agnostic: works with any site via agent-browser CLI.
 *
 * Usage:
 *   bun capture.ts --base http://localhost:3000 [options]
 *
 * Options:
 *   --base <url>        Base URL (required)
 *   --routes <list>     Comma-separated paths, e.g. "/,/about,/contact"
 *   --routes-file <f>   File with one route per line (or JSON array)
 *   --components <list> Comma-separated "name=selector@route", e.g.
 *                       "nav=header@/,form=form@/request,hero=section@/"
 *                       (name optional: "form@/request" -> slug from selector)
 *   --discover          Auto-discover same-origin routes by crawling from base
 *   --devices <list>    Presets: desktop,laptop,tablet,mobile (default: all)
 *                       or custom "name=WxH" e.g. "wide=1920x1080"
 *   --out <dir>         Output dir (default: .devin/reports/<cwd-name>/captures-<ts>)
 *   --wait <ms>         Settle time after load per page (default: 1200)
 *   --full              Full-page screenshots (agent-browser screenshot --full)
 *   --session <name>    agent-browser session name (default: capture)
 *
 * Output: <out>/routes/<route-slug>-<device>.png
 *         <out>/components/<name>-<device>.png
 *         + manifest.json
 */

import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { join, resolve, basename } from 'node:path'
import { spawnSync } from 'node:child_process'

const PRESETS: Record<string, [number, number]> = {
  desktop: [1440, 900],
  laptop: [1280, 800],
  tablet: [768, 1024],
  mobile: [390, 844],
}

// ---------- args ----------
const args = process.argv.slice(2)
const arg = (name: string, def = ''): string => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] ?? def : def
}
const has = (name: string) => args.includes(`--${name}`)

const base = arg('base').replace(/\/$/, '')
if (!base) {
  console.error('ERROR: --base <url> is required')
  process.exit(1)
}
const waitMs = Number(arg('wait', '1200'))
const session = arg('session', 'capture')
const full = has('full')
const discover = has('discover')

const cwdName = basename(process.cwd())
const ts = new Date().toISOString().replace(/[:T]/g, '').slice(0, 14)
const outDir = resolve(arg('out', `.devin/reports/${cwdName}/captures-${ts}`))

// devices
const deviceSpec = arg('devices', Object.keys(PRESETS).join(','))
const devices: Record<string, [number, number]> = {}
for (const d of deviceSpec.split(',')) {
  const t = d.trim()
  if (!t) continue
  const m = t.match(/^(\w+)=(\d+)x(\d+)$/)
  if (m) devices[m[1]] = [Number(m[2]), Number(m[3])]
  else if (PRESETS[t]) devices[t] = PRESETS[t]
  else console.warn(`WARN: unknown device "${t}", skipped`)
}

// ---------- agent-browser wrapper ----------
function ab(...cmd: string[]): { ok: boolean; out: string } {
  const r = spawnSync('agent-browser', ['--session', session, ...cmd], {
    encoding: 'utf8',
    timeout: 60_000,
    shell: true,
  })
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`.trim()
  return { ok: r.status === 0 && !out.startsWith('✗'), out }
}

// ---------- route discovery (generic crawl, no router lib needed) ----------
function discoverRoutes(): string[] {
  const seen = new Set<string>()
  const queue = [base]
  while (queue.length && seen.size < 50) {
    const url = queue.shift()!
    const path = new URL(url).pathname || '/'
    if (seen.has(path)) continue
    seen.add(path)
    ab('open', url)
    Bun.sleepSync(waitMs)
    const r = ab(
      'eval',
      `[...document.querySelectorAll('a[href]')].map(a=>new URL(a.href).pathname).filter(p=>p&&!p.startsWith('//'))`,
    )
    if (!r.ok) continue
    try {
      const links: string[] = JSON.parse(r.out.replace(/^"|"$/g, '').replace(/\\"/g, '"'))
      for (const p of links) {
        if (!seen.has(p) && !p.match(/\.(png|jpe?g|svg|ico|css|js|json|xml|txt|pdf|webmanifest)$/i)) {
          queue.push(base + p)
        }
      }
    } catch {
      /* parse fail — skip */
    }
  }
  return [...seen]
}

// ---------- routes ----------
let routes: string[] = []
const routesFile = arg('routes-file')
if (arg('routes')) {
  routes = arg('routes')
    .split(',')
    .map((r) => r.trim())
    .filter(Boolean)
} else if (routesFile && existsSync(routesFile)) {
  const raw = readFileSync(routesFile, 'utf8').trim()
  routes = raw.startsWith('[')
    ? (JSON.parse(raw) as string[])
    : raw.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
} else if (discover) {
  routes = discoverRoutes()
}
if (!routes.length && !has('components')) routes = ['/']

// ---------- components: "name=selector@route" ----------
interface ComponentSpec { name: string; selector: string; route: string }
const components: ComponentSpec[] = arg('components')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
  .map((s) => {
    const [lhs, route = '/'] = s.split('@')
    const eq = lhs.indexOf('=')
    const selector = eq >= 0 ? lhs.slice(eq + 1) : lhs
    const name = eq >= 0 ? lhs.slice(0, eq) : selector.replace(/[^\w]+/g, '-').replace(/^-|-$/g, '')
    return { name, selector, route: route || '/' }
  })

// ---------- capture ----------
mkdirSync(outDir, { recursive: true })
const slug = (p: string) => (p === '/' ? 'index' : p.replace(/[^\w]+/g, '-').replace(/^-|-$/g, ''))
const manifest: any = {
  base,
  capturedAt: new Date().toISOString(),
  routes: [],
  components: [],
  errors: [],
}

console.log(
  `capture: ${routes.length} routes + ${components.length} components x ${Object.keys(devices).length} devices -> ${outDir}`,
)

interface Target { kind: 'routes' | 'components'; name: string; route: string; selector?: string }
const targets: Target[] = [
  ...routes.map((route): Target => ({ kind: 'routes', name: slug(route), route })),
  ...components.map((c): Target => ({ kind: 'components', name: c.name, route: c.route, selector: c.selector })),
]

for (const t of targets) mkdirSync(join(outDir, t.kind), { recursive: true })

for (const [dev, [w, h]] of Object.entries(devices)) {
  ab('set', 'viewport', String(w), String(h))
  for (const t of targets) {
    const url = base + t.route
    const open = ab('open', url)
    if (!open.ok) {
      manifest.errors.push({ kind: t.kind, name: t.name, route: t.route, device: dev, error: open.out.slice(0, 200) })
      console.error(`FAIL ${t.kind} ${dev} ${t.name}: ${open.out.slice(0, 80)}`)
      continue
    }
    Bun.sleepSync(waitMs)

    if (t.selector) {
      const found = ab('is', 'visible', t.selector)
      if (!found.ok) {
        manifest.errors.push({ kind: t.kind, name: t.name, route: t.route, device: dev, error: `selector not visible: ${t.selector}` })
        console.error(`FAIL ${t.kind} ${dev} ${t.name}: selector not visible`)
        continue
      }
      ab('scrollintoview', t.selector)
      Bun.sleepSync(300)
    }

    const file = join(outDir, t.kind, `${t.name}-${dev}.png`)
    const shot = full ? ab('screenshot', file, '--full') : ab('screenshot', file)
    if (shot.ok) {
      manifest[t.kind].push({ name: t.name, route: t.route, device: dev, file })
      console.log(`OK   ${t.kind} ${dev} ${t.name}`)
    } else {
      manifest.errors.push({ kind: t.kind, name: t.name, route: t.route, device: dev, error: shot.out.slice(0, 200) })
      console.error(`FAIL ${t.kind} ${dev} ${t.name}: ${shot.out.slice(0, 80)}`)
    }
  }
}

ab('close')
writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2))
console.log(
  `done: ${manifest.routes.length + manifest.components.length} captures, ${manifest.errors.length} errors -> ${outDir}/manifest.json`,
)
process.exit(manifest.errors.length ? 2 : 0)
