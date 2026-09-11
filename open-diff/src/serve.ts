import { cli } from './server/state.js';
import { handleApi } from './server/api.js';
import { setAppUrl, startWatchdog, openBrowser } from './server/lifecycle.js';
import { existsSync, statSync } from 'node:fs';
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
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function guessType(path: string) {
  const ext = path.includes('.') ? path.slice(path.lastIndexOf('.')) : '';
  return MIME[ext] || 'application/octet-stream';
}

const distRoot = resolve(process.cwd(), 'dist/client');
const shell = resolve(distRoot, '_shell.html');

if (!existsSync(shell)) {
  console.error('[open-diff] dist/client/_shell.html not found — run `bun run build` first');
  process.exit(1);
}

const server = Bun.serve({
  port: Number(Bun.env.OPEN_DIFF_PORT) || 0,
  async fetch(req) {
    const { pathname } = new URL(req.url);

    if (pathname.startsWith('/api/')) {
      return handleApi(req);
    }

    const rel = pathname.slice(1);
    const filePath = resolve(distRoot, rel);
    if (rel && filePath.startsWith(distRoot) && existsSync(filePath) && statSync(filePath).isFile()) {
      return new Response(Bun.file(filePath), { headers: { 'content-type': guessType(filePath) } });
    }
    return new Response(Bun.file(shell), { headers: { 'content-type': 'text/html' } });
  },
});

const appUrl = `http://localhost:${server.port}${cli?.openQuery ?? ''}`;

setAppUrl(appUrl);
startWatchdog();

if (!Bun.env.OPEN_DIFF_NO_OPEN) {
  openBrowser(appUrl);
}

console.log(`open-diff running at ${appUrl}`);
