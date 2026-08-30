import { dirname } from 'node:path';
import { promises as fs } from 'node:fs';
import type { Manifest } from '../manifests.js';
import { dryRun, info, spawn, warn } from '../utils.js';
import { parseVersion } from './rust.js';

export interface PythonUpdateOptions {
  type: 'all' | 'patch' | 'minor' | 'major';
  write: boolean;
  dryRun: boolean;
}

interface PypiResponse {
  info: { version: string };
  releases: Record<string, unknown>;
}

function normalizePypiName(name: string): string {
  return name.toLowerCase().replace(/[-_.]+/g, '-');
}

export function matchesVersionType(
  type: PythonUpdateOptions['type'],
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

export async function queryPypiLatest(
  pkg: string,
  type: PythonUpdateOptions['type'],
  currentVersion: string
): Promise<string | null> {
  try {
    const res = await fetch(`https://pypi.org/pypi/${pkg}/json`);
    if (!res.ok) return null;
    const data = (await res.json()) as PypiResponse;

    const current = parseVersion(currentVersion);
    if (current && data.releases) {
      const candidates = Object.keys(data.releases)
        .filter((v) => !/[a-zA-Z]/.test(v))
        .map((v) => ({ version: v, parts: parseVersion(v) }))
        .filter((v): v is { version: string; parts: number[] } => v.parts !== null)
        .filter((v) => matchesVersionType(type, current, v.parts))
        .sort((a, b) => compareVersion(b.parts, a.parts));
      if (candidates.length) return candidates[0].version;
    }

    return data.info?.version ?? null;
  } catch (err) {
    warn(`PyPI query failed for ${pkg}: ${(err as Error).message}`);
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

export interface Requirement {
  name: string;
  version: string;
  operator: string;
  full: string;
  start: number;
  end: number;
}

export function parseRequirements(content: string): Requirement[] {
  const reqs: Requirement[] = [];
  const re = /^([A-Za-z0-9_.\-]+)\s*(==|>=|<=|!=|~=|>|<)?\s*([^\s#]+)?/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const [full, name, operator, version] = m;
    if (!version) continue;
    reqs.push({
      name,
      version,
      operator: operator ?? '',
      full,
      start: m.index,
      end: m.index + full.length,
    });
  }
  return reqs;
}

export async function updatePython(manifest: Manifest, options: PythonUpdateOptions): Promise<void> {
  const cwd = dirname(manifest.absPath);

  if (options.dryRun) {
    dryRun(`Would update ${manifest.file} (${options.type}) in ${cwd}`);
  }

  const content = await fs.readFile(manifest.absPath, 'utf-8');

  if (manifest.file.endsWith('requirements.txt')) {
    const reqs = parseRequirements(content);
    let updated = content;
    let changed = false;
    for (const req of reqs) {
      const latest = await queryPypiLatest(
        normalizePypiName(req.name),
        options.type,
        req.version
      );
      if (latest && latest !== req.version) {
        info(`  ${req.name}: ${req.version} -> ${latest}`);
        const newSpec = `${req.name}${req.operator || '=='}${latest}`;
        updated = updated.slice(0, req.start) + newSpec + updated.slice(req.end);
        // Adjust indices for subsequent replacements
        const offset = newSpec.length - req.full.length;
        for (const r of reqs) {
          if (r.start > req.start) {
            r.start += offset;
            r.end += offset;
          }
        }
        changed = true;
      }
    }
    if (changed && !options.dryRun) {
      await fs.writeFile(manifest.absPath, updated, 'utf-8');
      info(`Wrote updates to ${manifest.file}`);
    }
    return;
  }

  if (manifest.file.endsWith('pyproject.toml')) {
    const depPattern = /([A-Za-z0-9_.\-]+)\s*([=<>!~]+)\s*([0-9a-zA-Z._+!-]+)/g;
    let updated = content;
    let changed = false;

    const matches: { name: string; version: string; start: number; end: number }[] = [];
    let m: RegExpExecArray | null;
    while ((m = depPattern.exec(content)) !== null) {
      matches.push({ name: m[1], version: m[3], start: m.index, end: m.index + m[0].length });
    }

    for (const match of matches) {
      const latest = await queryPypiLatest(
        normalizePypiName(match.name),
        options.type,
        match.version
      );
      if (latest && latest !== match.version) {
        info(`  ${match.name}: ${match.version} -> ${latest}`);
        const updatedSpec = `${match.name}==${latest}`;
        updated = updated.slice(0, match.start) + updatedSpec + updated.slice(match.end);
        const offset = updatedSpec.length - (match.end - match.start);
        for (const mm of matches) {
          if (mm.start > match.start) {
            mm.start += offset;
            mm.end += offset;
          }
        }
        changed = true;
      }
    }

    if (changed && !options.dryRun) {
      await fs.writeFile(manifest.absPath, updated, 'utf-8');
      info(`Wrote updates to ${manifest.file}`);
    }

    if (!options.dryRun) {
      const pip = await spawn('pip', ['install', '-e', '.'], { cwd });
      if (pip.code !== 0) warn(`pip install failed in ${cwd}`);
    }
    return;
  }

  warn(`Unknown Python manifest: ${manifest.file}`);
}
