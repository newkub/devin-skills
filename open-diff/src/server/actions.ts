import type { DiffSource } from '../types.js';

async function readStream(stream: ReadableStream<Uint8Array>, tag: string): Promise<string> {
  const reader = stream.getReader();
  const dec = new TextDecoder();
  let full = '';
  let buf = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = dec.decode(value, { stream: true });
    full += chunk;
    buf += chunk;
    let i: number;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i);
      buf = buf.slice(i + 1);
      if (line.trim()) console.log(`[open-diff:${tag}] ${line}`);
    }
  }
  if (buf.trim()) console.log(`[open-diff:${tag}] ${buf}`);
  return full;
}

async function runAction(args: string[]): Promise<string> {
  console.log(`[open-diff] $ ${args.join(' ')}`);
  const proc = Bun.spawn({ cmd: args, stdio: ['ignore', 'pipe', 'pipe'] });
  const [out, code, err] = await Promise.all([
    readStream(proc.stdout, 'out'),
    proc.exited,
    readStream(proc.stderr, 'err'),
  ]);
  if (code !== 0) throw new Error(err || out || 'Action failed');
  console.log(`[open-diff] done (exit ${code})`);
  return out || 'ok';
}

export async function handleAction(
  body: { action: string; method?: string; body?: string },
  source: DiffSource | undefined,
): Promise<{ ok: boolean; output?: string; error?: string }> {
  try {
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
      const args = ['gh', 'pr', 'comment', String(source.pr), '--body', body.body ?? ''];
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
      console.log(`\n[open-diff] Terminal message: ${body.body}`);
      return { ok: true, output: 'logged' };
    }

    throw new Error(`Unknown action: ${body.action}`);
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}
