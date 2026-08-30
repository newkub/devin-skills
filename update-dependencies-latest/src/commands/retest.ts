import { join, resolve } from 'node:path';
import { promises as fs } from 'node:fs';
import { findManifests, type Manifest } from '../manifests.js';
import { commandExists, error, info, spawn, success, tempClone, warn } from '../utils.js';

export interface RetestOptions {
  temp: boolean;
  root?: string;
}

async function getGitRemoteUrl(cwd: string): Promise<string | null> {
  try {
    const { code, stdout } = await spawn(
      'git',
      ['remote', 'get-url', 'origin'],
      { cwd, quiet: true }
    );
    if (code === 0) return stdout.trim();
  } catch {
    // ignore
  }
  return null;
}

async function copyDir(src: string, dest: string): Promise<void> {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'target') continue;
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function runTestsForManifest(manifest: Manifest): Promise<number> {
  const cwd = manifest.absPath.replace(/[\\/][^\\/]+$/, '');
  info(`Running tests for ${manifest.file} in ${cwd}`);

  switch (manifest.ecosystem) {
    case 'bun': {
      if (!(await commandExists('bun'))) {
        warn('bun not found; skipping bun tests');
        return 1;
      }
      const install = await spawn('bun', ['install'], { cwd });
      if (install.code !== 0) return install.code ?? 1;
      const test = await spawn('bun', ['run', 'test'], { cwd });
      return test.code ?? 1;
    }
    case 'rust': {
      const test = await spawn('cargo', ['test'], { cwd });
      return test.code ?? 1;
    }
    case 'python': {
      const install = await spawn('pip', ['install', '-e', '.'], { cwd });
      if (install.code !== 0) return install.code ?? 1;
      const test = await spawn('python', ['-m', 'pytest'], { cwd });
      return test.code ?? 1;
    }
    case 'go': {
      const test = await spawn('go', ['test', './...'], { cwd });
      return test.code ?? 1;
    }
    default: {
      warn(`No test runner for ecosystem ${manifest.ecosystem}`);
      return 0;
    }
  }
}

export async function retestCommand(options: RetestOptions): Promise<number> {
  const cwd = resolve(options.root ?? process.cwd());
  let target = cwd;

  if (options.temp) {
    const remote = await getGitRemoteUrl(cwd);
    if (remote) {
      info(`Cloning ${remote} to temp directory for retest...`);
      target = await tempClone(remote);
    } else {
      warn('No git origin found; copying current directory to temp location');
      target = join(cwd, '../.updatedeps-temp-copy');
      await copyDir(cwd, target);
    }
  }

  const manifests = await findManifests(target);
  if (manifests.length === 0) {
    warn(`No manifests found in ${target}; defaulting to bun test`);
    if (!(await commandExists('bun'))) {
      error('bun not found');
      return 1;
    }
    const install = await spawn('bun', ['install'], { cwd: target });
    if (install.code !== 0) return install.code ?? 1;
    const test = await spawn('bun', ['run', 'test'], { cwd: target });
    return test.code ?? 1;
  }

  let exitCode = 0;
  for (const manifest of manifests) {
    const code = await runTestsForManifest(manifest);
    if (code !== 0) exitCode = code;
  }

  if (exitCode === 0) {
    success('All tests passed.');
  } else {
    error(`Some tests failed (exit code ${exitCode}).`);
  }
  return exitCode;
}
