import { resolve } from 'node:path';
import { findManifests } from '../manifests.js';
import { updateBun, updateRust, updatePython, updateGo, updateDocker } from '../updaters/index.js';
import { dryRun, error, info, success } from '../utils.js';

export interface UpdateOptions {
  root: string;
  type: 'all' | 'patch' | 'minor' | 'major';
  write: boolean;
  interactive: boolean;
  recursive: boolean;
  dryRun: boolean;
}

export async function updateCommand(options: UpdateOptions): Promise<number> {
  const root = resolve(options.root);
  const manifests = await findManifests(root);

  if (manifests.length === 0) {
    error(`No supported manifest files found in ${root}`);
    return 1;
  }

  if (options.dryRun) {
    dryRun('Dry-run mode: no files will be written');
  }

  for (const manifest of manifests) {
    info(`Processing ${manifest.file} (${manifest.ecosystem})`);
    try {
      switch (manifest.ecosystem) {
        case 'bun':
          await updateBun(manifest, {
            type: options.type,
            write: options.write,
            interactive: options.interactive,
            recursive: options.recursive,
            dryRun: options.dryRun,
          });
          break;
        case 'rust':
          await updateRust(manifest, {
            type: options.type,
            write: options.write,
            dryRun: options.dryRun,
          });
          break;
        case 'python':
          await updatePython(manifest, {
            type: options.type,
            write: options.write,
            dryRun: options.dryRun,
          });
          break;
        case 'go':
          await updateGo(manifest, {
            type: options.type,
            write: options.write,
            dryRun: options.dryRun,
          });
          break;
        case 'docker':
          await updateDocker(manifest, {
            type: options.type,
            write: options.write,
            dryRun: options.dryRun,
          });
          break;
        default:
          info(`Skipping unknown ecosystem for ${manifest.file}`);
      }
    } catch (err) {
      error(`Failed to update ${manifest.file}: ${(err as Error).message}`);
    }
  }

  if (options.dryRun) {
    info('Dry-run complete. Use --write to apply changes.');
  } else {
    success('Update check complete.');
  }
  return 0;
}
