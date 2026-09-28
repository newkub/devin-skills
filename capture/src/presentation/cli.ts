#!/usr/bin/env bun
/**
 * capture — unified evidence capture CLI (merged: web, component, terminal, app, all).
 *
 * Usage:
 *   bun src/presentation/cli.ts <mode> [options]
 *
 * Modes:
 *   web       Screenshot/PDF of a URL via agent-browser
 *   component Screenshot of one element (CSS selector) on a URL
 *   terminal  Render a command's output as PNG/SVG/HTML image
 *   app       OS-level window/screen screenshot (Windows PowerShell)
 *   all       All routes x all device sizes in one run (agent-browser)
 *
 * Examples:
 *   bun src/presentation/cli.ts web https://example.com --out shot.png --full
 *   bun src/presentation/cli.ts web https://example.com --pdf docs/page.pdf
 *   bun src/presentation/cli.ts component http://localhost:3000 --selector "header" --out nav.png
 *   bun src/presentation/cli.ts terminal --cmd "git log --oneline -5" --out cli.png
 *   bun src/presentation/cli.ts app --title "WezTerm" --out term.png
 *   bun src/presentation/cli.ts all --base http://localhost:3000 --discover
 */

import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { captureWeb, captureComponent } from '../core/browser'
import { captureTerminal } from '../core/terminal'
import { captureApp } from '../core/app'

const args = process.argv.slice(2)
const mode = args[0]
const rest = args.slice(1)

const arg = (name: string, def = ''): string => {
  const i = rest.indexOf(`--${name}`)
  return i >= 0 ? rest[i + 1] ?? def : def
}
const has = (name: string) => rest.includes(`--${name}`)

const usage = () => {
  console.log(`usage: bun src/presentation/cli.ts <web|component|terminal|app|all> [options]
  web <url> [--out f.png] [--full] [--annotate] [--pdf f.pdf] [--wait ms] [--headed]
  component <url> --selector <css> --out f.png [--wait ms]
  terminal --cmd "<command>" --out f.png|svg|html [--tool auto] [--theme dark] [--title t]
  app --out f.png [--title <window-title-substring>]
  all --base <url> [--routes a,b|--routes-file f|--discover] [--components spec]
      [--devices desktop,mobile|name=WxH] [--full] [--wait ms] [--out dir]`)
}

switch (mode) {
  case 'web': {
    const url = rest.find((a) => !a.startsWith('--'))
    if (!url) {
      console.error('ERROR: web requires <url>')
      process.exit(1)
    }
    process.exit(
      captureWeb({
        url,
        out: arg('out') || undefined,
        pdf: arg('pdf') || undefined,
        full: has('full'),
        annotate: has('annotate'),
        headed: has('headed'),
        waitMs: Number(arg('wait', '0')),
        session: arg('session', 'capture'),
      }),
    )
  }
  case 'component': {
    const url = rest.find((a) => !a.startsWith('--'))
    const selector = arg('selector')
    if (!url || !selector || !arg('out')) {
      console.error('ERROR: component requires <url> --selector <css> --out <file>')
      process.exit(1)
    }
    process.exit(
      captureComponent({
        url,
        selector,
        out: arg('out'),
        waitMs: Number(arg('wait', '800')),
        session: arg('session', 'capture'),
      }),
    )
  }
  case 'terminal': {
    const cmd = arg('cmd')
    const out = arg('out')
    if (!cmd || !out) {
      console.error('ERROR: terminal requires --cmd "<command>" --out <file>')
      process.exit(1)
    }
    process.exit(
      captureTerminal({
        cmd,
        out,
        tool: arg('tool', 'auto'),
        theme: arg('theme', 'dark'),
        title: arg('title') || undefined,
      }),
    )
  }
  case 'app': {
    const out = arg('out')
    if (!out) {
      console.error('ERROR: app requires --out <file.png>')
      process.exit(1)
    }
    process.exit(captureApp({ out, title: arg('title') || undefined }))
  }
  case 'all': {
    const here = dirname(dirname(fileURLToPath(import.meta.url)))
    const r = spawnSync('bun', [join(here, 'all.ts'), ...rest], { stdio: 'inherit', shell: true })
    process.exit(r.status ?? 1)
  }
  case undefined:
  case 'help':
  case '--help':
  case '-h':
    usage()
    process.exit(mode ? 0 : 1)
  default:
    console.error(`ERROR: unknown mode "${mode}"`)
    usage()
    process.exit(1)
}
