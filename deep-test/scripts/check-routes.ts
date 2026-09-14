#!/usr/bin/env bun
/**
 * check-routes.ts — HTTP-check every route on a domain, report as a table.
 * Generic: works with any site/API — no framework assumptions.
 *
 * Usage:
 *   bun check-routes.ts --base http://localhost:3000 [options]
 *
 * Route sources (pick one):
 *   --routes <list>       Comma-separated paths: "/api/health,/api/users"
 *   --routes-file <f>     File: one route per line, JSON array, or crw_map
 *                       output saved to file (URLs are normalized to paths)
 *   --discover            Fetch base URL, extract same-origin hrefs (HTML sites)
 *
 * Options:
 *   --method <m>          HTTP method (default GET). Only GET/HEAD/OPTIONS
 *                       allowed without --allow-write
 *   --allow-write         Enable POST/PUT/PATCH/DELETE (user must confirm)
 *   --timeout <ms>        Per-request timeout (default 10000)
 *   --slow <ms>           Mark responses slower than this (default 3000)
 *   --header <h>          Extra header, e.g. "Authorization: Bearer x"
 *   --out <file>          Manifest JSON path (default:
 *                       .devin/reports/<cwd>/api-check-<ts>.json)
 */

import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { resolve, basename } from 'node:path'

const args = process.argv.slice(2)
const arg = (n: string, d = '') => {
  const i = args.indexOf(`--${n}`)
  return i >= 0 ? args[i + 1] ?? d : d
}
const has = (n: string) => args.includes(`--${n}`)

const base = arg('base').replace(/\/$/, '')
if (!base) {
  console.error('ERROR: --base <url> is required')
  process.exit(1)
}
const method = arg('method', 'GET').toUpperCase()
const SAFE = ['GET', 'HEAD', 'OPTIONS']
if (!SAFE.includes(method) && !has('allow-write')) {
  console.error(`ERROR: ${method} requires --allow-write (user confirmation)`)
  process.exit(1)
}
const timeout = Number(arg('timeout', '10000'))
const slowMs = Number(arg('slow', '3000'))
const header = arg('header')
const cwdName = basename(process.cwd())
const ts = new Date().toISOString().replace(/[:T]/g, '').slice(0, 14)
const outFile = arg('out', `.devin/reports/${cwdName}/api-check-${ts}.json`)

// ---------- routes ----------
function normalize(p: string): string | null {
  if (!p) return null
  if (p.startsWith('http')) {
    try {
      const u = new URL(p)
      if (!base.includes(u.host)) return null
      p = u.pathname
    } catch {
      return null
    }
  }
  p = p.split('?')[0].split('#')[0] || '/'
  return p.startsWith('/') ? p : null
}

let routes: string[] = []
const routesFile = arg('routes-file')
if (arg('routes')) {
  routes = arg('routes').split(',').map((r) => r.trim())
} else if (routesFile && existsSync(routesFile)) {
  const raw = readFileSync(routesFile, 'utf8').trim()
  routes = raw.startsWith('[')
    ? (JSON.parse(raw) as string[])
    : raw.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
} else if (has('discover')) {
  try {
    const html = await (await fetch(base)).text()
    routes = [...html.matchAll(/href=["']([^"']+)["']/g)].map((m) => m[1])
  } catch (e: any) {
    console.error(`discover failed: ${e.message}`)
  }
}
routes = [...new Set(routes.map(normalize).filter(Boolean) as string[])]
if (!routes.length) {
  console.error('ERROR: no routes — pass --routes, --routes-file, or --discover')
  process.exit(1)
}

// ---------- check ----------
interface Row {
  method: string
  route: string
  status: number | string
  time: number
  severity: string
}
const rows: Row[] = []
const headers: Record<string, string> = {}
if (header) {
  const i = header.indexOf(':')
  headers[header.slice(0, i).trim()] = header.slice(i + 1).trim()
}

console.log(`checking ${routes.length} routes on ${base} (${method})\n`)

for (const route of routes) {
  const path = route.replace(/\{[^}]+\}/g, '1')
  const t0 = performance.now()
  let status: number | string = 0
  let severity = ''
  try {
    const res = await fetch(base + path, {
      method,
      headers,
      redirect: 'manual',
      signal: AbortSignal.timeout(timeout),
    })
    status = res.status
    const ms = Math.round(performance.now() - t0)
    if (status >= 200 && status < 300) severity = ms > slowMs ? 'slow' : 'ok'
    else if (status >= 300 && status < 400) severity = 'redirect'
    else if (status === 401 || status === 403) severity = 'protected'
    else if (status === 404) severity = 'missing'
    else severity = 'critical'
    rows.push({ method, route, status, time: ms, severity })
  } catch (e: any) {
    status = 'ERR'
    severity = 'critical'
    rows.push({ method, route, status, time: Math.round(performance.now() - t0), severity })
  }
}

// ---------- table ----------
const sevRank: Record<string, number> = { critical: 0, missing: 1, slow: 2, redirect: 3, protected: 4, ok: 5 }
const cols = ['No.', 'Method', 'Route', 'Status', 'Time (ms)', 'Severity'] as const
const widths = [
  String(rows.length).length,
  method.length,
  Math.max(...rows.map((r) => r.route.length), 5),
  6,
  8,
  8,
]
const fmt = (cells: string[]) =>
  cells.map((c, i) => c.padEnd(widths[i])).join('  ')
const line = widths.map((w) => '-'.repeat(w)).join('  ')

console.log(fmt([...cols]))
console.log(line)
rows.forEach((r, i) => {
  console.log(fmt([String(i + 1), r.method, r.route, String(r.status), String(r.time), r.severity]))
})
console.log(line)

const count = (s: string) => rows.filter((r) => r.severity === s).length
console.log(
  `total ${rows.length} | ok ${count('ok')} | protected ${count('protected')} | slow ${count('slow')} | redirect ${count('redirect')} | missing ${count('missing')} | critical ${count('critical')}`,
)

// ---------- manifest ----------
mkdirSync(resolve(outFile, '..'), { recursive: true })
writeFileSync(
  outFile,
  JSON.stringify({ base, method, checkedAt: new Date().toISOString(), routes: rows }, null, 2),
)
console.log(`manifest -> ${resolve(outFile)}`)
process.exit(count('critical') || count('missing') ? 2 : 0)
