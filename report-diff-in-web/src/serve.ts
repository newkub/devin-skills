import { existsSync, statSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { handleApi } from './server/api.js';
import { cli } from './server/state.js';
import { openBrowser, setAppUrl, startWatchdog } from './server/lifecycle.js';

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function contentType(path: string) {
  const dot = path.lastIndexOf('.');
  return MIME[dot >= 0 ? path.slice(dot) : ''] || 'application/octet-stream';
}

const distRoot = resolve(import.meta.dir, '..', 'dist');
const indexPath = resolve(distRoot, 'index.html');

if (!existsSync(indexPath)) {
  console.error('[report-diff-in-web] dist/index.html not found — run `bun run build` first');
  process.exit(1);
}

const server = Bun.serve({
  port: Number(Bun.env.OPEN_DIFF_PORT ?? 4780),
  async fetch(request) {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith('/api/')) return handleApi(request);

    const relative = decodeURIComponent(pathname.slice(1));
    const filePath = resolve(distRoot, relative);
    const inside = filePath === distRoot || filePath.startsWith(distRoot + sep);
    if (relative && inside && existsSync(filePath) && statSync(filePath).isFile()) {
      const immutable = pathname.startsWith('/assets/');
      return new Response(Bun.file(filePath), {
        headers: {
          'content-type': contentType(filePath),
          'cache-control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
        },
      });
    }

    return new Response(Bun.file(indexPath), {
      headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' },
    });
  },
});

const appUrl = `http://localhost:${server.port}${cli?.openQuery ?? ''}`;
setAppUrl(appUrl);
startWatchdog();

if (!Bun.env.OPEN_DIFF_NO_OPEN) openBrowser(appUrl);

console.log(`report-diff-in-web running at ${appUrl}`);
