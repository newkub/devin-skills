import type { DiffSource } from '../types.js';

async function exists(cmd: string): Promise<boolean> {
  try {
    const proc = Bun.spawn({
      cmd: process.platform === 'win32' ? ['where', cmd] : ['which', cmd],
      stdio: ['ignore', 'ignore', 'ignore'],
    });
    const code = await proc.exited;
    return code === 0;
  } catch {
    return false;
  }
}

async function run(args: string[], cwd?: string, retries = 2): Promise<string> {
  let proc;
  try {
    proc = Bun.spawn({
      cmd: args,
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (e: any) {
    if (retries > 0 && /spawn|EUNKNOWN/i.test(e?.message || '')) {
      await new Promise((r) => setTimeout(r, 300));
      return run(args, cwd, retries - 1);
    }
    throw e;
  }
  const [out, code] = await Promise.all([
    new Response(proc.stdout).text(),
    proc.exited,
  ]);
  if (code !== 0) {
    const err = await new Response(proc.stderr).text();
    if (code === 1 && !err && out) return out;
    throw new Error(`${args.join(' ')} failed: ${err || out}`);
  }
  return out;
}

export async function fetchDiff(source: DiffSource): Promise<string> {
  if (source.kind === 'pr') {
    if (!(await exists('gh'))) throw new Error('gh CLI not found in PATH');
    const args = ['pr', 'diff', String(source.pr)];
    if (source.repo) args.push('--repo', source.repo);
    return run(['gh', ...args]);
  }

  if (source.kind === 'git') {
    if (!(await exists('git'))) throw new Error('git not found in PATH');
    const cwd = source.repo;
    return run(['git', 'diff', `${source.ref}..HEAD`], cwd);
  }

  if (source.kind === 'branch') {
    if (!(await exists('git'))) throw new Error('git not found in PATH');
    const cwd = source.repo;
    return run(['git', 'diff', `${source.base}..${source.head}`], cwd);
  }

  if (source.kind === 'file') {
    if (!(await exists('git'))) throw new Error('git not found in PATH');
    return run(['git', 'diff', '--no-index', '--', source.old, source.new]);
  }

  throw new Error('Unknown diff source');
}

export async function fetchPrMeta(source: Extract<DiffSource, { kind: 'pr' }>) {
  if (!(await exists('gh'))) return null;
  const args = ['pr', 'view', String(source.pr), '--json', 'title,author,state,url,number'];
  if (source.repo) args.push('--repo', source.repo);
  try {
    const out = await run(['gh', ...args]);
    return JSON.parse(out);
  } catch {
    return null;
  }
}

export interface ChecksResult {
  available: boolean;
  checks: { name: string; state: string; bucket: string }[];
  summary: 'pass' | 'fail' | 'pending' | 'none' | 'error';
  failing?: string[];
  pending?: number;
  error?: string;
}

export async function fetchChecks(source: DiffSource | undefined): Promise<ChecksResult> {
  if (!source || source.kind !== 'pr') {
    return { available: false, checks: [], summary: 'none' };
  }
  try {
    const args = ['gh', 'pr', 'checks', String(source.pr), '--json', 'name,state,bucket'];
    if (source.repo) args.push('--repo', source.repo);
    const proc = Bun.spawn({ cmd: args, stdio: ['ignore', 'pipe', 'pipe'] });
    const out = await new Response(proc.stdout).text();
    await proc.exited;
    const checks = JSON.parse(out || '[]') as { name: string; state: string; bucket: string }[];
    const failing = checks.filter((c) => c.bucket === 'fail' || c.bucket === 'cancel');
    const pending = checks.filter((c) => c.bucket === 'pending');
    const summary = checks.length === 0 ? 'none' : failing.length ? 'fail' : pending.length ? 'pending' : 'pass';
    return { available: true, checks, summary, failing: failing.map((c) => c.name), pending: pending.length };
  } catch (e: any) {
    return { available: false, checks: [], summary: 'error', error: e.message };
  }
}
