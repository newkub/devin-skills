import { dirname } from 'node:path';
import { promises as fs } from 'node:fs';
import type { Manifest } from '../manifests.js';
import { dryRun, info, spawn, warn } from '../utils.js';

export interface RustUpdateOptions {
  type: 'all' | 'patch' | 'minor' | 'major';
  write: boolean;
  dryRun: boolean;
}

interface CrateVersion {
  num: string;
  yanked: boolean;
}

interface CratesResponse {
  crate?: { max_version?: string; newest_version?: string };
  versions?: CrateVersion[];
}

export function parseVersion(version: string): number[] | null {
  const match = version.match(/(\d+(?:\.\d+)*)/);
  if (!match) return null;
  return match[1].split('.').map(Number);
}

function isPreRelease(version: string): boolean {
  const match = version.match(/(\d+(?:\.\d+)*)([-+].*)/);
  return !!match?.[2];
}

function matchesType(
  type: RustUpdateOptions['type'],
  current: number[],
  candidate: number[]
): boolean {
  switch (type) {
    case 'patch':
      return candidate[0] === current[0] && candidate[1] === current[1];
    case 'minor':
      return candidate[0] === current[0];
    case 'major':
    case 'all':
    default:
      return true;
  }
}

export async function queryCratesLatest(
  crate: string,
  type: RustUpdateOptions['type'],
  currentVersion: string
): Promise<string | null> {
  try {
    const res = await fetch(`https://crates.io/api/v1/crates/${crate}`);
    if (!res.ok) return null;
    const data = (await res.json()) as CratesResponse;

    const current = parseVersion(currentVersion);
    const candidates = (data.versions ?? [])
      .filter((v) => !v.yanked && !isPreRelease(v.num))
      .map((v) => ({ ...v, parts: parseVersion(v.num) }))
      .filter((v): v is CrateVersion & { parts: number[] } => v.parts !== null);

    if (current) {
      const matches = candidates
        .filter((v) => matchesType(type, current, v.parts))
        .sort((a, b) => compareVersion(b.parts, a.parts));
      if (matches.length) return matches[0].num;
    }

    return data.crate?.newest_version ?? data.crate?.max_version ?? null;
  } catch (err) {
    warn(`crates.io query failed for ${crate}: ${(err as Error).message}`);
    return null;
  }
}

function compareVersion(a: number[], b: number[]): number {
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    if (av !== bv) return av - bv;
  }
  return 0;
}

interface CargoDependency {
  name: string;
  version: string;
  start: number;
  end: number;
}

export function findCargoDependencies(content: string): CargoDependency[] {
  const deps: CargoDependency[] = [];

  // Simple "name = \"version\""
  const simple = /(\S+)\s*=\s*"([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = simple.exec(content)) !== null) {
    const [full, name, version] = m;
    if (name === 'package' || name === 'version' || name.startsWith('[')) continue;
    deps.push({ name, version, start: m.index, end: m.index + full.length });
  }

  // Inline table: name = { version = "..." }
  const inline = /(\S+)\s*=\s*\{[^}]*version\s*=\s*"([^"]+)"[^}]*\}/g;
  while ((m = inline.exec(content)) !== null) {
    const [full, name, version] = m;
    deps.push({ name, version, start: m.index, end: m.index + full.length });
  }

  return deps;
}

export async function updateRust(manifest: Manifest, options: RustUpdateOptions): Promise<void> {
  const cwd = dirname(manifest.absPath);

  if (options.dryRun) {
    dryRun(`Would update ${manifest.file} (${options.type}) in ${cwd}`);
  }

  info(`Running cargo update in ${cwd}`);
  if (!options.dryRun) {
    const { code } = await spawn('cargo', ['update'], { cwd });
    if (code !== 0) {
      warn(`cargo update exited with code ${code} in ${cwd}`);
    }
  }

  if (!options.write) return;

  const content = await fs.readFile(manifest.absPath, 'utf-8');
  const deps = findCargoDependencies(content);
  let changed = false;
  let updated = content;

  for (const dep of deps) {
    const latest = await queryCratesLatest(dep.name, options.type, dep.version);
    if (latest && latest !== dep.version) {
      info(`  ${dep.name}: ${dep.version} -> ${latest}`);
      updated =
        updated.slice(0, dep.start) +
        updated.slice(dep.start, dep.end).replace(`"${dep.version}"`, `"${latest}"`) +
        updated.slice(dep.end);
      changed = true;
    }
  }

  if (changed && !options.dryRun) {
    await fs.writeFile(manifest.absPath, updated, 'utf-8');
    info(`Wrote updates to ${manifest.file}`);
  }
}
