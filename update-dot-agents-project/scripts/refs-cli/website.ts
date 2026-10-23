import { Glob } from 'bun';
import { run, toolAvailable, trunc, unquote } from './util';
import { table, doc } from './render';
import type { Row } from './types';

function extractUrls(text: string, base: string): string[] {
  const urls = new Set<string>();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = null;
  }
  const walk = (node: unknown): void => {
    if (typeof node === 'string') {
      if (/^https?:\/\//.test(node)) urls.add(node);
    } else if (Array.isArray(node)) {
      node.forEach(walk);
    } else if (node && typeof node === 'object') {
      Object.values(node).forEach(walk);
    }
  };
  if (parsed !== null && parsed !== undefined) walk(parsed);
  for (const m of text.matchAll(/https?:\/\/[^\s"'<>\\]+/g)) urls.add(m[0]);
  urls.add(base);
  return [...urls].sort();
}

export async function genWebsite(url: string): Promise<string> {
  if (!(await toolAvailable(['crw', '--version']))) {
    throw new Error('crw not found — see /follow-tool-crw for install');
  }
  const r = await run(['crw', 'map', url, '--format', 'json']);
  if (r.code !== 0) throw new Error(`crw map failed: ${trunc(r.stderr || r.stdout, 200)}`);
  const rows: Row[] = extractUrls(r.stdout, url).map((u) => {
    const path = new URL(u).pathname;
    const segments = path.split('/').filter(Boolean);
    return {
      URL: u,
      Path: path || '/',
      Segments: segments.length ? segments.join(' / ') : '(root)',
      Depth: segments.length,
    };
  });
  return doc('Website Routes', [
    `Source: \`${url}\` via \`crw map\``,
    '',
    '## Routes',
    '',
    table(['URL', 'Path', 'Segments', 'Depth'], rows),
  ]);
}
