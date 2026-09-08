import type { DiffSource } from './types.js';

export function parseArgs(argv: string[]): { source: DiffSource; openQuery: string } | null {
  const args = argv.slice(2);
  if (args.length === 0) return null;

  const kind = args[0];
  let repo: string | undefined;
  let i = args.indexOf('--repo');
  if (i >= 0) {
    repo = args[i + 1];
    args.splice(i, 2);
  }

  if (kind === 'pr') {
    if (!args[1]) return null;
    return { source: { kind: 'pr', pr: parseInt(args[1], 10), repo }, openQuery: `?source=pr&pr=${args[1]}&repo=${encodeURIComponent(repo || '')}` };
  }

  if (kind === 'git') {
    if (!args[1]) return null;
    return { source: { kind: 'git', ref: args[1], repo }, openQuery: `?source=git&ref=${encodeURIComponent(args[1])}&repo=${encodeURIComponent(repo || '')}` };
  }

  if (kind === 'branch') {
    if (!args[1]) return null;
    const [base, head] = args[1].split('..');
    if (!base || !head) return null;
    return { source: { kind: 'branch', base, head, repo }, openQuery: `?source=branch&base=${encodeURIComponent(base)}&head=${encodeURIComponent(head)}&repo=${encodeURIComponent(repo || '')}` };
  }

  if (kind === 'file') {
    if (!args[1] || !args[2]) return null;
    return { source: { kind: 'file', old: args[1], new: args[2] }, openQuery: `?source=file&old=${encodeURIComponent(args[1])}&new=${encodeURIComponent(args[2])}` };
  }

  return null;
}
