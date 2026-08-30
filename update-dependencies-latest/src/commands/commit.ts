import { error, info, spawn, success, warn } from '../utils.js';

export interface CommitOptions {
  message?: string;
  push: boolean;
  root?: string;
}

export async function commitCommand(options: CommitOptions): Promise<number> {
  const cwd = options.root ?? process.cwd();
  const message = options.message ?? 'chore: update dependencies';

  const { code: addCode, stderr: addErr } = await spawn('git', ['add', '-A'], { cwd });
  if (addCode !== 0) {
    error(`git add failed: ${addErr}`);
    return addCode ?? 1;
  }

  const { code: commitCode, stderr: commitErr } = await spawn(
    'git',
    ['commit', '-m', message],
    { cwd }
  );
  if (commitCode !== 0) {
    if (commitErr.includes('nothing to commit')) {
      warn('Nothing to commit.');
    } else {
      error(`git commit failed: ${commitErr}`);
      return commitCode ?? 1;
    }
  } else {
    success(`Committed with message: ${message}`);
  }

  if (options.push) {
    const { code: pushCode, stderr: pushErr } = await spawn('git', ['push'], { cwd });
    if (pushCode !== 0) {
      error(`git push failed: ${pushErr}`);
      return pushCode ?? 1;
    }
    success('Pushed changes.');
  }

  return 0;
}
