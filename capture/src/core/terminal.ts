#!/usr/bin/env bun
/**
 * terminal.ts — capture terminal command output as an image.
 * Tool priority: --tool flag, else auto (terminal-shot -> termframe -> termshot).
 *
 * Internal module — invoked by ../presentation/cli.ts.
 */

import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const TOOLS = {
  'terminal-shot': { exts: ['.png', '.svg', '.html'], hint: 'bun add -g terminal-shot' },
  termframe: { exts: ['.svg'], hint: 'scoop install termframe' },
  termshot: { exts: ['.png'], hint: 'GitHub releases: mr-pmillz/termshot' },
} as const

type ToolName = keyof typeof TOOLS

function installed(cmd: string): boolean {
  const probe = process.platform === 'win32' ? 'where' : 'which'
  const r = spawnSync(probe, [cmd], { encoding: 'utf8', timeout: 10_000, shell: true })
  return r.status === 0
}

export interface TerminalOptions {
  cmd: string
  out: string
  tool: string // 'auto' | ToolName
  theme: string
  title?: string
}

function pickTool(requested: string, outExt: string): ToolName | null {
  if (requested !== 'auto') {
    if (!(requested in TOOLS)) return null
    return installed(requested) ? (requested as ToolName) : null
  }
  for (const name of Object.keys(TOOLS) as ToolName[]) {
    if (TOOLS[name].exts.includes(outExt as never) && installed(name)) return name
  }
  // fallback: any installed tool regardless of ext
  for (const name of Object.keys(TOOLS) as ToolName[]) {
    if (installed(name)) return name
  }
  return null
}

export function captureTerminal(o: TerminalOptions): number {
  const ext = o.out.slice(o.out.lastIndexOf('.')).toLowerCase()
  const tool = pickTool(o.tool, ext)
  if (!tool) {
    console.error(
      `FAIL: no terminal capture tool installed or matching ".${ext}" — install one of: ` +
        Object.entries(TOOLS)
          .map(([n, t]) => `${n} (${t.hint})`)
          .join(', '),
    )
    return 1
  }

  // run the command, capture combined output as text
  const run = spawnSync(o.cmd, { encoding: 'utf8', timeout: 120_000, shell: true })
  const text = `$ ${o.cmd}\n${run.stdout ?? ''}${run.stderr ?? ''}`

  mkdirSync(dirname(resolve(o.out)), { recursive: true })

  let r: { status: number | null; stderr: string }
  if (tool === 'terminal-shot') {
    const args = ['--output', o.out, '--theme', o.theme]
    if (o.title) args.push('--title', o.title)
    const p = spawnSync('terminal-shot', args, { input: text, encoding: 'utf8', timeout: 60_000, shell: true })
    r = { status: p.status, stderr: p.stderr ?? '' }
  } else if (tool === 'termframe') {
    const p = spawnSync('termframe', ['-o', o.out], { input: text, encoding: 'utf8', timeout: 60_000, shell: true })
    r = { status: p.status, stderr: p.stderr ?? '' }
  } else {
    const p = spawnSync('termshot', ['--raw-read', '--output', o.out], {
      input: text,
      encoding: 'utf8',
      timeout: 60_000,
      shell: true,
    })
    r = { status: p.status, stderr: p.stderr ?? '' }
  }

  if (r.status === 0 && existsSync(o.out)) {
    console.log(`OK terminal (${tool}) -> ${o.out}`)
    return 0
  }
  console.error(`FAIL terminal capture (${tool}): ${(r.stderr || '').slice(0, 200)}`)
  return 2
}
