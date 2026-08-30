import { promises as fs } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { walkDir, info } from './utils.js';

export type Ecosystem = 'bun' | 'rust' | 'python' | 'go' | 'docker' | 'unknown';

export interface Manifest {
  ecosystem: Ecosystem;
  file: string;
  absPath: string;
}

const MANIFESTS: Record<string, Ecosystem | ((name: string, dir: string) => Ecosystem | null)> = {
  'package.json': 'bun',
  'Cargo.toml': 'rust',
  'pyproject.toml': 'python',
  'requirements.txt': 'python',
  'go.mod': 'go',
  'Dockerfile': 'docker',
};

const WORKFLOW_DIR = join('.github', 'workflows');

export async function findManifests(root: string): Promise<Manifest[]> {
  const resolved = resolve(root);
  const manifests: Manifest[] = [];
  const seen = new Set<string>();

  for await (const file of walkDir(resolved)) {
    const rel = relative(resolved, file);
    const base = rel.split(/[/\\]/).pop() ?? '';
    const dir = rel.split(/[/\\]/).slice(0, -1).join('/') || '.';

    const ecoRule = MANIFESTS[base];
    if (ecoRule) {
      const ecosystem = typeof ecoRule === 'function' ? ecoRule(base, dir) : ecoRule;
      if (ecosystem && !seen.has(rel)) {
        seen.add(rel);
        manifests.push({ ecosystem, file: rel, absPath: file });
      }
    }

    if (rel.includes(WORKFLOW_DIR) && (base.endsWith('.yml') || base.endsWith('.yaml'))) {
      if (!seen.has(rel)) {
        seen.add(rel);
        manifests.push({ ecosystem: 'docker', file: rel, absPath: file });
      }
    }
  }

  info(`Detected ${manifests.length} manifest(s) in ${resolved}`);
  return manifests.sort((a, b) => a.file.localeCompare(b.file));
}

export function getEcosystemLabel(eco: Ecosystem): string {
  return eco[0].toUpperCase() + eco.slice(1);
}
