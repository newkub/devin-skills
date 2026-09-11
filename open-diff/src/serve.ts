import { Elysia } from 'elysia';
import { api } from './server/api.js';
import { cli } from './server/state.js';
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

const app = new Elysia()
  .use(api)
  .get('/*', ({ params, set }) => {
    const rel = (params['*'] as string) || '';
    const filePath = resolve(distRoot, rel);
    if (!filePath.startsWith(distRoot)) {
      set.status = 404;
      return 'Not found';
    }
    if (rel && existsSync(filePath) && statSync(filePath).isFile()) {
      return new Response(Bun.file(filePath), { headers: { 'content-type': guessType(filePath) } });
    }
    return new Response(Bun.file(shell), { headers: { 'content-type': 'text/html' } });
  })
  .listen(Number(Bun.env.OPEN_DIFF_PORT) || 0);

const port = app.server?.port ?? 0;
const appUrl = `http://localhost:${port}${cli?.openQuery ?? ''}`;

setAppUrl(appUrl);
startWatchdog();

if (!Bun.env.OPEN_DIFF_NO_OPEN) {
  openBrowser(appUrl);
}

console.log(`open-diff running at ${appUrl}`);
