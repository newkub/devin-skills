import { dirname, join } from 'node:path';
import { promises as fs } from 'node:fs';
import type { Manifest } from '../manifests.js';
import { commandExists, dryRun, info, spawn, warn } from '../utils.js';

export interface BunUpdateOptions {
  type: 'all' | 'patch' | 'minor' | 'major';
  write: boolean;
  interactive: boolean;
  recursive: boolean;
  dryRun: boolean;
}

export async function queryNpmLatest(pkg: string): Promise<string | null> {
  try {
    const res = await fetch(`https://registry.npmjs.org/${pkg}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { 'dist-tags'?: { latest?: string } };
    return data['dist-tags']?.latest ?? null;
  } catch (err) {
    warn(`npm query failed for ${pkg}: ${(err as Error).message}`);
    return null;
  }
}

export async function getPackageDependencies(file: string): Promise<Record<string, string>> {
  const content = await fs.readFile(file, 'utf-8');
  const pkg = JSON.parse(content) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
  };
  return {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.peerDependencies,
  };
}

export async function updateBun(manifest: Manifest, options: BunUpdateOptions): Promise<void> {
  const cwd = dirname(manifest.absPath);

  if (options.dryRun) {
    dryRun(`Would update ${manifest.file} (${options.type}) in ${cwd}`);
  }

  const bunx = await commandExists('bunx');
  const bun = await commandExists('bun');

  if (bunx) {
    const args = ['taze'];
    if (options.type !== 'all') args.push(options.type);
    if (options.write) args.push('-w');
    if (options.interactive) args.push('-i');
    if (options.recursive) args.push('-r');

    info(`Running bunx ${args.join(' ')} in ${cwd}`);
    if (!options.dryRun) {
      const { code } = await spawn('bunx', args, { cwd });
      if (code !== 0) {
        warn(`taze exited with code ${code} in ${cwd}`);
      }
    }
    return;
  }

  if (bun) {
    info(`Running bun update --latest in ${cwd}`);
    if (!options.dryRun) {
      const { code } = await spawn('bun', ['update', '--latest'], { cwd });
      if (code !== 0) {
        warn(`bun update exited with code ${code} in ${cwd}`);
      }
    }
    return;
  }

  // Fallback: query npm registry and rewrite package.json
  info(`Bun not found; querying npm registry for ${manifest.file}`);
  const deps = await getPackageDependencies(manifest.absPath);
  const changes: { name: string; from: string; to: string }[] = [];

  for (const [name, version] of Object.entries(deps)) {
    const latest = await queryNpmLatest(name);
    if (latest && latest !== version) {
      changes.push({ name, from: version, to: latest });
    }
  }

  if (changes.length === 0) {
    info(`No npm dependency updates found for ${manifest.file}`);
    return;
  }

  for (const change of changes) {
    info(`  ${change.name}: ${change.from} -> ${change.to}`);
  }

  if (options.write && !options.dryRun) {
    let content = await fs.readFile(manifest.absPath, 'utf-8');
    for (const { name, to } of changes) {
      const pattern = new RegExp(`("${name}")\\s*:\\s*"[^"]+"`, 'g');
      content = content.replace(pattern, `$1: "${to}"`);
    }
    await fs.writeFile(manifest.absPath, content, 'utf-8');
    info(`Wrote updates to ${manifest.file}`);
  }
}
