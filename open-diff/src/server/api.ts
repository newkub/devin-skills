import { Elysia, t } from 'elysia';
import { fetchDiff, fetchPrMeta, fetchChecks } from './git.js';
import { handleAction } from './actions.js';
import { recordPing, promptOnClose } from './lifecycle.js';
import { cli } from './state.js';

const DiffSourceBody = t.Union([
  t.Object({ kind: t.Literal('pr'), pr: t.Number(), repo: t.Optional(t.String()), theme: t.Optional(t.String()) }),
  t.Object({ kind: t.Literal('git'), ref: t.String(), repo: t.Optional(t.String()), theme: t.Optional(t.String()) }),
  t.Object({ kind: t.Literal('branch'), base: t.String(), head: t.String(), repo: t.Optional(t.String()), theme: t.Optional(t.String()) }),
  t.Object({ kind: t.Literal('file'), old: t.String(), new: t.String(), theme: t.Optional(t.String()) }),
]);

export const api = new Elysia({ prefix: '/api' })
  .onError(({ error, set }) => {
    set.status = 500;
    return { error: error instanceof Error ? error.message : String(error) };
  })
  .all('/ping', () => {
    recordPing();
    return 'pong';
  })
  .post('/close', () => {
    promptOnClose();
    return 'ok';
  })
  .get('/default', () => cli?.source ?? null)
  .get('/checks', () => fetchChecks(cli?.source))
  .post(
    '/diff',
    async ({ body }) => {
      const raw = await fetchDiff(body);
      const prMeta = body.kind === 'pr' ? await fetchPrMeta(body) : null;
      return { source: body, raw, prMeta };
    },
    { body: DiffSourceBody },
  )
  .post(
    '/action',
    async ({ body }) => {
      const result = await handleAction(body, cli?.source);
      if (result.ok) console.log(`[open-diff] ${body.action} → ${result.output || 'ok'}`);
      else console.log(`[open-diff] ${body.action} failed: ${result.error}`);
      return result;
    },
    {
      body: t.Object({
        action: t.String(),
        method: t.Optional(t.String()),
        body: t.Optional(t.String()),
      }),
    },
  );

export type Api = typeof api;
