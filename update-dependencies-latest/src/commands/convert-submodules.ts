import { resolve } from 'node:path';
import { askYesNo, error, info, spawn, success, warn } from '../utils.js';

export interface ConvertSubmodulesOptions {
  target: string;
  remote?: string;
  push: boolean;
  force: boolean;
}

export async function convertSubmodulesCommand(options: ConvertSubmodulesOptions): Promise<number> {
  if (!options.remote) {
    error('Missing required --remote <git-url>');
    return 1;
  }

  const target = resolve(options.target);
  info(`Adding git submodule from ${options.remote} at ${target}`);

  const { code: addCode, stderr: addErr } = await spawn(
    'git',
    ['submodule', 'add', options.remote, target],
    { cwd: process.cwd() }
  );

  if (addCode !== 0) {
    error(`git submodule add failed: ${addErr}`);
    return addCode ?? 1;
  }

  const { code: commitCode, stderr: commitErr } = await spawn(
    'git',
    ['commit', '-m', `add submodule ${options.remote} at ${target}`],
    { cwd: process.cwd() }
  );

  if (commitCode !== 0) {
    warn(`git commit failed: ${commitErr}`);
  } else {
    success(`Committed new submodule at ${target}`);
  }

  if (options.push) {
    if (!options.force) {
      if (!process.stdin.isTTY) {
        error('--push requires --force in non-interactive mode');
        return 1;
      }
      const ok = await askYesNo(`Push submodule addition to remote?`);
      if (!ok) {
        info('Push cancelled.');
        return 0;
      }
    }

    const { code: pushCode, stderr: pushErr } = await spawn('git', ['push'], {
      cwd: process.cwd(),
    });
    if (pushCode !== 0) {
      error(`git push failed: ${pushErr}`);
      return pushCode ?? 1;
    }
    success('Pushed submodule changes.');
  }

  return 0;
}
