import { Glob } from 'bun';

export interface Lang {
  id: string;
  glob: string;
  sg: string;
}

export const LANGS: Lang[] = [
  { id: 'ts', glob: '**/*.{ts,mts,cts}', sg: 'ts' },
  { id: 'tsx', glob: '**/*.tsx', sg: 'tsx' },
  { id: 'rust', glob: '**/*.rs', sg: 'rust' },
];

const EXCLUDED_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'target', '.cache', '.agents', '.devin', 'coverage', '.next']);

function isExcluded(path: string): boolean {
  return path.split(/[\\/]/).some((part) => EXCLUDED_DIRS.has(part));
}

export async function collectFiles(root: string): Promise<Map<string, string[]>> {
  const byLang = new Map<string, string[]>();
  for (const lang of LANGS) {
    const found: string[] = [];
    const glob = new Glob(lang.glob);
    for await (const rel of glob.scan({ cwd: root, absolute: false, dot: false })) {
      if (!isExcluded(rel)) found.push(rel.replace(/\\/g, '/'));
    }
    byLang.set(lang.id, found.sort());
  }
  return byLang;
}

export function langFor(id: string): Lang {
  const lang = LANGS.find((l) => l.id === id);
  if (!lang) throw new Error(`unknown lang id: ${id}`);
  return lang;
}
