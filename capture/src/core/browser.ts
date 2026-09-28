#!/usr/bin/env bun
/**
 * browser.ts — agent-browser wrapper for web/component capture modes.
 *
 * Internal module — invoked by ../presentation/cli.ts.
 */

import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { mkdirSync } from 'node:fs'

export function ab(session: string, ...cmd: string[]): { ok: boolean; out: string } {
  const r = spawnSync('agent-browser', ['--session', session, ...cmd], {
    encoding: 'utf8',
    timeout: 60_000,
    shell: true,
  })
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`.trim()
  return { ok: r.status === 0 && !out.startsWith('✗'), out }
}

export function ensureInstalled(): boolean {
  const probe = process.platform === 'win32' ? 'where' : 'which'
  const r = spawnSync(probe, ['agent-browser'], { encoding: 'utf8', timeout: 10_000, shell: true })
  return r.status === 0
}

function ensureDir(file: string) {
  mkdirSync(dirname(resolve(file)), { recursive: true })
}

export interface WebOptions {
  url: string
  out?: string
  pdf?: string
  full?: boolean
  annotate?: boolean
  waitMs: number
  headed?: boolean
  session: string
}

export function captureWeb(o: WebOptions): number {
  const openArgs = ['open', o.url]
  if (o.headed) openArgs.push('--headed')
  const open = ab(o.session, ...openArgs)
  if (!open.ok) {
    console.error(`FAIL open ${o.url}: ${open.out.slice(0, 200)}`)
    return 1
  }
  ab(o.session, 'wait', '--load', 'networkidle')
  Bun.sleepSync(o.waitMs)

  let failures = 0
  if (o.out) {
    ensureDir(o.out)
    const shotArgs = ['screenshot', o.out]
    if (o.full) shotArgs.push('--full')
    if (o.annotate) shotArgs.push('--annotate')
    const shot = ab(o.session, ...shotArgs)
    if (shot.ok) console.log(`OK screenshot -> ${o.out}`)
    else {
      console.error(`FAIL screenshot: ${shot.out.slice(0, 200)}`)
      failures++
    }
  } else {
    const shotArgs = ['screenshot']
    if (o.full) shotArgs.push('--full')
    if (o.annotate) shotArgs.push('--annotate')
    const shot = ab(o.session, ...shotArgs)
    if (shot.ok) console.log(`OK screenshot -> ${shot.out || 'default screenshot dir'}`)
    else {
      console.error(`FAIL screenshot: ${shot.out.slice(0, 200)}`)
      failures++
    }
  }

  if (o.pdf) {
    ensureDir(o.pdf)
    const pdf = ab(o.session, 'pdf', o.pdf)
    if (pdf.ok) console.log(`OK pdf -> ${o.pdf}`)
    else {
      console.error(`FAIL pdf: ${pdf.out.slice(0, 200)}`)
      failures++
    }
  }

  ab(o.session, 'close')
  return failures ? 2 : 0
}

export interface ComponentOptions {
  url: string
  selector: string
  out: string
  waitMs: number
  session: string
}

export function captureComponent(o: ComponentOptions): number {
  const open = ab(o.session, 'open', o.url)
  if (!open.ok) {
    console.error(`FAIL open ${o.url}: ${open.out.slice(0, 200)}`)
    return 1
  }
  ab(o.session, 'wait', '--load', 'networkidle')
  Bun.sleepSync(o.waitMs)

  const visible = ab(o.session, 'is', 'visible', o.selector)
  if (!visible.ok) {
    console.error(`FAIL selector not visible: ${o.selector}`)
    ab(o.session, 'close')
    return 1
  }
  ab(o.session, 'scrollintoview', o.selector)
  Bun.sleepSync(300)

  ensureDir(o.out)
  const shot = ab(o.session, 'screenshot', o.out)
  ab(o.session, 'close')
  if (shot.ok && existsSync(o.out)) {
    console.log(`OK component -> ${o.out}`)
    return 0
  }
  console.error(`FAIL screenshot: ${shot.out.slice(0, 200)}`)
  return 2
}
