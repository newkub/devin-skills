import { dirname } from 'node:path';
import type { Manifest } from '../manifests.js';
import { commandExists, dryRun, info, spawn, warn } from '../utils.js';

export interface GoUpdateOptions {
  type: 'all' | 'patch' | 'minor' | 'major';
  write: boolean;
  dryRun: boolean;
}

export async function updateGo(manifest: Manifest, options: GoUpdateOptions): Promise<void> {
  const cwd = dirname(manifest.absPath);

  if (options.dryRun) {
    dryRun(`Would update ${manifest.file} (${options.type}) in ${cwd}`);
  }

  const hasGo = await commandExists('go');
  if (!hasGo) {
    warn(`go not found; cannot update ${manifest.file}`);
    return;
  }

  if (!options.dryRun) {
    info(`Running go get -u ./... in ${cwd}`);
    const get = await spawn('go', ['get', '-u', './...'], { cwd });
    if (get.code !== 0) {
      warn(`go get -u failed in ${cwd}`);
    }

    info(`Running go list -m -u all in ${cwd}`);
    const list = await spawn('go', ['list', '-m', '-u', 'all'], { cwd });
    if (list.code !== 0) {
      warn(`go list -m -u all failed in ${cwd}`);
    }

    info(`Running go mod tidy in ${cwd}`);
    await spawn('go', ['mod', 'tidy'], { cwd });
  }
}
