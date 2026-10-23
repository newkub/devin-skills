import type { DiffSource } from './types.js';

export interface CliConfig {
  source: DiffSource;
  openQuery: string;
}

export function parseArgs(argv: string[]): CliConfig | null {
  const args = argv.slice(2);
  if (args.length === 0) return null;

  const kind = args[0];
  const repoIndex = args.indexOf('--repo');
  const repo = repoIndex >= 0 ? args[repoIndex + 1] : undefined;
  if (repoIndex >= 0) args.splice(repoIndex, 2);

  if (kind === 'pr') {
    const pr = Number.parseInt(args[1] || '', 10);
    if (!Number.isFinite(pr) || pr <= 0) return null;
    const source: DiffSource = { kind: 'pr', pr, ...(repo ? { repo } : {}) };
    return { source, openQuery: `?${new URLSearchParams(sourceToQuery(source)).toString()}` };
  }

  if (kind === 'git') {
    if (!args[1]) return null;
    const source: DiffSource = { kind: 'git', ref: args[1], ...(repo ? { repo } : {}) };
    return { source, openQuery: `?${new URLSearchParams(sourceToQuery(source)).toString()}` };
  }

  if (kind === 'branch') {
    const [base, head] = (args[1] || '').split('..');
    if (!base || !head) return null;
    const source: DiffSource = { kind: 'branch', base, head, ...(repo ? { repo } : {}) };
    return { source, openQuery: `?${new URLSearchParams(sourceToQuery(source)).toString()}` };
  }

  if (kind === 'file') {
    if (!args[1] || !args[2]) return null;
    const source: DiffSource = { kind: 'file', old: args[1], new: args[2] };
    return { source, openQuery: `?${new URLSearchParams(sourceToQuery(source)).toString()}` };
  }

  return null;
}

export function sourceToQuery(source: DiffSource): Record<string, string> {
  const out: Record<string, string> = { source: source.kind };
  for (const [key, value] of Object.entries(source)) {
    if (key === 'kind' || value === undefined || value === null) continue;
    out[key] = String(value);
  }
  return out;
}
