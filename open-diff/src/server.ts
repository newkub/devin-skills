import { fetchDiff, fetchPrMeta } from './exec.js';
import { parseArgs } from './cli.js';
import type { DiffSource } from './types.js';
import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIME: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

function guessType(path: string) {
  const ext = path.includes('.') ? path.slice(path.lastIndexOf('.')) : '';
  return MIME[ext] || 'application/octet-stream';
}

let lastPing = Date.now();
let firstPing = false;
let pending = 0;
let tabClosed = false;

const cli = parseArgs(process.argv);

const server = Bun.serve({
  port: Number(Bun.env.OPEN_DIFF_PORT) || 0,
  async fetch(req) {
    pending++;
    try {
      const url = new URL(req.url);
      const pathname = url.pathname;

      if (pathname === '/api/ping') {
        lastPing = Date.now();
        firstPing = true;
        tabClosed = false;
        return new Response('pong');
      }

      if (pathname === '/api/close') {
        promptOnClose();
        return new Response('ok');
      }

      if (pathname === '/api/action' && req.method === 'POST') {
        const body = (await req.json()) as any;
        const result = await handleAction(body);
        if (result.ok) console.log(`[open-diff] ${body.action} → ${result.output || 'ok'}`);
        else console.log(`[open-diff] ${body.action} failed: ${result.error}`);
        return new Response(JSON.stringify(result), { headers: { 'content-type': 'application/json' } });
      }

      if (pathname === '/api/default') {
        if (!cli) return new Response('null', { headers: { 'content-type': 'application/json' } });
        return new Response(JSON.stringify(cli.source), { headers: { 'content-type': 'application/json' } });
      }

      if (pathname === '/api/diff' && req.method === 'POST') {
        const source = (await req.json()) as DiffSource;
        const raw = await fetchDiff(source);
        const prMeta = source.kind === 'pr' ? await fetchPrMeta(source) : null;
        return new Response(JSON.stringify({ source, raw, prMeta }), { headers: { 'content-type': 'application/json' } });
      }

      const distRoot = resolve(process.cwd(), 'dist');
      let filePath = resolve(distRoot, pathname === '/' ? 'index.html' : `.${pathname}`);
      if (!filePath.startsWith(distRoot)) {
        return new Response('Not found', { status: 404 });
      }
      if (existsSync(filePath)) {
        return new Response(Bun.file(filePath), { headers: { 'content-type': guessType(filePath) } });
      }
      return new Response(Bun.file(resolve(distRoot, 'index.html')), { headers: { 'content-type': 'text/html' } });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'content-type': 'application/json' } });
    } finally {
      pending--;
      if (pending < 0) pending = 0;
    }
  },
});

const port = server.port;
const query = cli?.openQuery ?? '';
const appUrl = `http://localhost:${port}${query}`;

const interval = setInterval(() => {
  if (pending > 0) {
    lastPing = Date.now();
    return;
  }
  if (firstPing && !tabClosed && Date.now() - lastPing > 5000) {
    tabClosed = true;
    promptOnClose();
  }
}, 1000);

const rl = readline.createInterface({ input, output });
let prompting = false;

function promptOnClose() {
  if (prompting || tabClosed) return;
  tabClosed = true;
  prompting = true;
  console.log('\n[open-diff] Browser tab closed.');
  if (!process.stdin.isTTY) {
    console.log('[open-diff] Non-TTY: continuing to serve.');
    prompting = false;
    return;
  }
  rl.question('[open-diff] Choose: (r)eopen, (q)uit, (c)ontinue: ', (answer) => {
    prompting = false;
    const a = answer.trim().toLowerCase();
    if (a === 'r' || a === 'reopen') {
      Bun.spawn({ cmd: ['powershell', '-Command', `Start-Process '${appUrl}'`] });
    } else if (a === 'q' || a === 'quit') {
      clearInterval(interval);
      rl.close();
      server.stop();
      process.exit(0);
    } else {
      console.log('[open-diff] Continuing to serve. Open tab again to reconnect.');
    }
  });
}

async function runAction(args: string[]): Promise<string> {
  const proc = Bun.spawn({ cmd: args, stdio: ['ignore', 'pipe', 'pipe'] });
  const [out, code] = await Promise.all([
    new Response(proc.stdout).text(),
    proc.exited,
  ]);
  const err = await new Response(proc.stderr).text();
  if (code !== 0) throw new Error(err || out || 'Action failed');
  return out || 'ok';
}

async function handleAction(body: any): Promise<{ ok: boolean; output?: string; error?: string }> {
  try {
    const source = cli?.source;
    if (!source) throw new Error('No source configured');
    console.log(`\n[open-diff] Action: ${body.action}${body.method ? ` (${body.method})` : ''}`);

    if (body.action === 'approve') {
      if (source.kind !== 'pr') throw new Error('approve only available for PR source');
      const args = ['gh', 'pr', 'review', String(source.pr), '--approve'];
      if (source.repo) args.push('--repo', source.repo);
      const output = await runAction(args);
      return { ok: true, output };
    }

    if (body.action === 'merge') {
      if (source.kind !== 'pr') throw new Error('merge only available for PR source');
      const args = ['gh', 'pr', 'merge', String(source.pr)];
      if (source.repo) args.push('--repo', source.repo);
      if (body.method === 'squash') args.push('--squash');
      if (body.method === 'rebase') args.push('--rebase');
      const output = await runAction(args);
      return { ok: true, output };
    }

    if (body.action === 'close') {
      if (source.kind !== 'pr') throw new Error('close only available for PR source');
      const args = ['gh', 'pr', 'close', String(source.pr)];
      if (source.repo) args.push('--repo', source.repo);
      const output = await runAction(args);
      return { ok: true, output };
    }

    if (body.action === 'comment') {
      if (source.kind !== 'pr') throw new Error('comment only available for PR source');
      const args = ['gh', 'pr', 'comment', String(source.pr), '--body', body.body];
      if (source.repo) args.push('--repo', source.repo);
      const output = await runAction(args);
      return { ok: true, output };
    }

    if (body.action === 'checkout') {
      const ref = source.kind === 'pr' ? `refs/pull/${source.pr}/head` : (source as any).ref;
      const output = await runAction(['git', 'checkout', ref]);
      return { ok: true, output };
    }

    if (body.action === 'terminal') {
      console.log(`\n[open-diff] Terminal message: ${body.message}`);
      return { ok: true, output: 'logged' };
    }

    throw new Error(`Unknown action: ${body.action}`);
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

if (!Bun.env.OPEN_DIFF_NO_OPEN) {
  if (process.platform === 'win32') {
    Bun.spawn({ cmd: ['powershell', '-Command', `Start-Process '${appUrl}'`] });
  } else if (process.platform === 'darwin') {
    Bun.spawn({ cmd: ['open', appUrl] });
  } else {
    Bun.spawn({ cmd: ['xdg-open', appUrl] });
  }
}

console.log(`open-diff running at ${appUrl}`);
