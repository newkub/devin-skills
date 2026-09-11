import { fetchDiff, fetchPrMeta, fetchChecks } from './git.js';
import { handleAction } from './actions.js';
import { recordPing, promptOnClose } from './lifecycle.js';
import { cli, sourceToQuery } from './state.js';
import type { DiffSource } from '../types.js';

const KINDS = ['pr', 'git', 'branch', 'file'] as const;

function isDiffSource(body: unknown): body is DiffSource {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  if (!KINDS.includes(b.kind as any)) return false;
  if (b.kind === 'pr') return typeof b.pr === 'number' && b.pr > 0;
  if (b.kind === 'git') return typeof b.ref === 'string' && b.ref.length > 0;
  if (b.kind === 'branch') return typeof b.base === 'string' && typeof b.head === 'string' && b.base.length > 0 && b.head.length > 0;
  return typeof b.old === 'string' && typeof b.new === 'string' && b.old.length > 0 && b.new.length > 0;
}

export async function handleApi(request: Request): Promise<Response> {
  const path = new URL(request.url).pathname.replace(/^\/api\/?/, '');
  try {
    if (path === 'ping') {
      recordPing();
      return new Response('pong');
    }

    if (path === 'close' && request.method === 'POST') {
      promptOnClose();
      return new Response('ok');
    }

    if (path === 'default') {
      return Response.json(cli?.source ? sourceToQuery(cli.source) : null);
    }

    if (path === 'checks') {
      return Response.json(await fetchChecks(cli?.source));
    }

    if (path === 'diff' && request.method === 'POST') {
      const body: unknown = await request.json();
      if (!isDiffSource(body)) return Response.json({ error: 'Invalid diff source' }, { status: 400 });
      const raw = await fetchDiff(body);
      const prMeta = body.kind === 'pr' ? await fetchPrMeta(body) : null;
      return Response.json({ source: body, raw, prMeta });
    }

    if (path === 'action' && request.method === 'POST') {
      const body = (await request.json()) as { action?: string; method?: string; body?: string };
      if (!body.action) return Response.json({ ok: false, error: 'Missing action' }, { status: 400 });
      const result = await handleAction(body as any, cli?.source);
      if (result.ok) console.log(`[open-diff] ${body.action} → ${result.output || 'ok'}`);
      else console.log(`[open-diff] ${body.action} failed: ${result.error}`);
      return Response.json(result);
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  } catch (e: any) {
    return Response.json({ error: e?.message ?? 'Internal error' }, { status: 500 });
  }
}
