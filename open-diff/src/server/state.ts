import { parseArgs } from '../cli.js';
import type { DiffSource } from '../types.js';

export const cli = parseArgs(process.argv);

export function sourceToQuery(source: DiffSource): Record<string, string> {
  const { kind, ...rest } = source as any;
  const out: Record<string, string> = { source: kind };
  for (const [k, v] of Object.entries(rest)) {
    if (v !== undefined && v !== null && k !== 'theme') out[k] = String(v);
  }
  return out;
}
