import type { SgMatch } from './types';

export const NL = String.fromCharCode(10);
export const BS = String.fromCharCode(92);

export function toPosix(p: string): string {
  return p.split(BS).join('/');
}

export function relFrom(root: string, file: string): string {
  const f = toPosix(file);
  const r = toPosix(root);
  return f.startsWith(r + '/') ? f.slice(r.length + 1) : f;
}

export async function run(cmd: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
  const proc = Bun.spawn(cmd, { stdout: 'pipe', stderr: 'pipe' });
  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();
  return { code: await proc.exited, stdout, stderr };
}

export async function toolAvailable(cmd: string[]): Promise<boolean> {
  try {
    return (await run(cmd)).code === 0;
  } catch {
    return false;
  }
}

export function chunks<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

interface SgRaw {
  file: string;
  lines?: string;
  range?: { start?: { line?: number } };
  metaVariables?: { single?: Record<string, { text?: string }> };
}

function toMatch(m: SgRaw): SgMatch {
  const vars: Record<string, string> = {};
  for (const [k, v] of Object.entries(m.metaVariables?.single ?? {})) vars[k] = String(v?.text ?? '');
  return { file: m.file, line: m.range?.start?.line ?? 0, text: m.lines ?? '', vars };
}

export async function sgFind(pattern: string, sgLang: string, files: string[]): Promise<SgMatch[]> {
  const out: SgMatch[] = [];
  for (const chunk of chunks(files, 50)) {
    const r = await run(['ast-grep', 'run', '-p', pattern, '-l', sgLang, '--json', ...chunk]);
    if (r.code !== 0) continue;
    try {
      out.push(...(JSON.parse(r.stdout) as SgRaw[]).map(toMatch));
    } catch {
      /* non-JSON output → skip pattern */
    }
  }
  return out;
}

export function unquote(s: string): string {
  return s.trim().replace(/^(['"`])(\s*[\w./:-][^'"`]*)\1$/, '$2').trim();
}

export function trunc(s: string, n = 120): string {
  const flat = s.replace(/\s+/g, ' ').trim();
  return flat.length > n ? `${flat.slice(0, n - 1)}…` : flat;
}
