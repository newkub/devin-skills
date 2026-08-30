import { promises as fs } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { error, info, spawn, success, tempClone, warn } from '../utils.js';

export interface RefactorOptions {
  temp: boolean;
  command?: string;
  root?: string;
}

async function getGitRemoteUrl(cwd: string): Promise<string | null> {
  try {
    const { code, stdout, stderr } = await spawn(
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

async function chooseDefaultCommand(cwd: string): Promise<string[]> {
  const pkgPath = join(cwd, 'package.json');
  try {
    const raw = await fs.readFile(pkgPath, 'utf-8');
    const pkg = JSON.parse(raw) as { scripts?: Record<string, string> };
    if (pkg.scripts?.lint) {
      return ['bun', 'run', 'lint'];
    }
  } catch {
    // ignore
  }
  return ['bunx', '@ast-grep/cli', 'scan'];
}

export async function refactorCommand(options: RefactorOptions): Promise<number> {
  const cwd = resolve(options.root ?? process.cwd());
  let target = cwd;

  if (options.temp) {
    const remote = await getGitRemoteUrl(cwd);
    if (remote) {
      info(`Cloning ${remote} to temp directory...`);
      target = await tempClone(remote);
    } else {
      warn('No git origin found; copying current directory to temp location');
      target = join(cwd, '../.updatedeps-temp-copy');
      await copyDir(cwd, target);
    }
  }

  const command = options.command
    ? options.command.split(' ')
    : await chooseDefaultCommand(target);

  info(`Running ${command.join(' ')} in ${target}`);
  const { code } = await spawn(command[0], command.slice(1), { cwd: target });
  if (code !== 0) {
    error(`Refactor command failed with code ${code}`);
    return code ?? 1;
  }

  success('Refactor command completed.');
  return 0;
}
