import { dirname } from 'node:path';
import { promises as fs } from 'node:fs';
import type { Manifest } from '../manifests.js';
import { dryRun, info, warn } from '../utils.js';
import { parseVersion } from './rust.js';

export interface DockerUpdateOptions {
  type: 'all' | 'patch' | 'minor' | 'major';
  write: boolean;
  dryRun: boolean;
}

interface DockerTag {
  name: string;
  last_updated?: string;
}

function isStableTag(tag: string): boolean {
  return !/(?:-rc|-beta|-alpha|-preview|-dev|-snapshot|latest|main|master|develop)/i.test(tag);
}

export async function queryDockerHubLatest(
  repo: string,
  type: DockerUpdateOptions['type'],
  currentTag: string
): Promise<string | null> {
  try {
    const url = `https://hub.docker.com/v2/repositories/${repo}/tags/?page_size=100&ordering=last_updated`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as { results?: DockerTag[] };
    const tags = (data.results ?? []).filter((t) => isStableTag(t.name));

    const current = parseVersion(currentTag);
    if (current && type !== 'all') {
      const candidates = tags
        .map((t) => ({ ...t, parts: parseVersion(t.name) }))
        .filter((t): t is DockerTag & { parts: number[] } => t.parts !== null)
        .filter((t) => {
          if (type === 'major') return true;
          if (type === 'minor') return t.parts[0] === current[0];
          if (type === 'patch') return t.parts[0] === current[0] && t.parts[1] === current[1];
          return true;
        })
        .sort((a, b) => compareVersion(b.parts, a.parts));
      if (candidates.length) return candidates[0].name;
    }

    return tags[0]?.name ?? null;
  } catch (err) {
    warn(`Docker Hub query failed for ${repo}: ${(err as Error).message}`);
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

export async function queryGitHubLatest(owner: string, repo: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
    if (!res.ok) {
      const tags = await fetch(`https://api.github.com/repos/${owner}/${repo}/tags?per_page=1`);
      if (tags.ok) {
        const data = (await tags.json()) as Array<{ name: string }>;
        return data[0]?.name ?? null;
      }
      return null;
    }
    const data = (await res.json()) as { tag_name?: string };
    return data.tag_name ?? null;
  } catch (err) {
    warn(`GitHub query failed for ${owner}/${repo}: ${(err as Error).message}`);
    return null;
  }
}

export function resolveDockerRepo(image: string): string | null {
  // official images have no slash
  if (!image.includes('/')) return `library/${image}`;
  // Docker Hub repos have format owner/repo (up to one slash)
  const parts = image.split('/');
  if (parts.length === 2) return image;
  // Multi-part (e.g. mcr.microsoft.com/...) not handled by Docker Hub
  return null;
}

export async function updateDocker(manifest: Manifest, options: DockerUpdateOptions): Promise<void> {
  const cwd = dirname(manifest.absPath);
  if (options.dryRun) {
    dryRun(`Would update ${manifest.file} (${options.type}) in ${cwd}`);
  }

  const content = await fs.readFile(manifest.absPath, 'utf-8');
  let updated = content;

  if (manifest.file.includes('Dockerfile') || manifest.file.endsWith('Dockerfile')) {
    const fromRe = /FROM\s+([\w./\-]+)(?::([\w.\-]+))?/gi;
    const matches: { full: string; image: string; tag: string; start: number; end: number }[] = [];
    let m: RegExpExecArray | null;
    while ((m = fromRe.exec(content)) !== null) {
      const [full, image, tag = 'latest'] = m;
      matches.push({ full, image, tag, start: m.index, end: m.index + full.length });
    }

    for (const match of matches) {
      const repo = resolveDockerRepo(match.image);
      if (!repo) continue;
      const latest = await queryDockerHubLatest(repo, options.type, match.tag);
      if (latest && latest !== match.tag) {
        info(`  ${match.image}: ${match.tag} -> ${latest}`);
        const newFrom = `FROM ${match.image}:${latest}`;
        updated = updated.slice(0, match.start) + newFrom + updated.slice(match.end);
        const offset = newFrom.length - match.full.length;
        for (const mm of matches) {
          if (mm.start > match.start) {
            mm.start += offset;
            mm.end += offset;
          }
        }
      }
    }
  }

  if (manifest.file.includes('.github/workflows') && manifest.file.endsWith('.yml')) {
    const usesRe = /uses:\s*([\w.\-]+)\/([\w.\-]+)@([\w.\-]+)/g;
    const matches: { full: string; owner: string; repo: string; ref: string; start: number; end: number }[] = [];
    let m: RegExpExecArray | null;
    while ((m = usesRe.exec(content)) !== null) {
      const [full, owner, repo, ref] = m;
      matches.push({ full, owner, repo, ref, start: m.index, end: m.index + full.length });
    }

    for (const match of matches) {
      const latest = await queryGitHubLatest(match.owner, match.repo);
      if (latest && latest !== match.ref) {
        info(`  ${match.owner}/${match.repo}: ${match.ref} -> ${latest}`);
        const newUses = `uses: ${match.owner}/${match.repo}@${latest}`;
        updated = updated.slice(0, match.start) + newUses + updated.slice(match.end);
        const offset = newUses.length - match.full.length;
        for (const mm of matches) {
          if (mm.start > match.start) {
            mm.start += offset;
            mm.end += offset;
          }
        }
      }
    }
  }

  if (updated !== content) {
    if (!options.dryRun && options.write) {
      await fs.writeFile(manifest.absPath, updated, 'utf-8');
      info(`Wrote updates to ${manifest.file}`);
    }
  } else {
    info(`No Docker/CI updates for ${manifest.file}`);
  }
}
