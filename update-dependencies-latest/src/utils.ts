import { spawn as cpSpawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline';

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

export function info(message: string): void {
  console.log(`${C.blue}[updatedeps]${C.reset} ${message}`);
}

export function warn(message: string): void {
  console.warn(`${C.yellow}[updatedeps]${C.reset} ${message}`);
}

export function error(message: string): void {
  console.error(`${C.red}[updatedeps]${C.reset} ${message}`);
}

export function success(message: string): void {
  console.log(`${C.green}[updatedeps]${C.reset} ${message}`);
}

export function dryRun(message: string): void {
  console.log(`${C.dim}[updatedeps]${C.reset} ${C.cyan}(dry-run)${C.reset} ${message}`);
}

export interface SpawnResult {
  code: number | null;
  stdout: string;
  stderr: string;
}

export function spawn(
  command: string,
  args: string[],
  options: { cwd?: string; env?: NodeJS.ProcessEnv; quiet?: boolean } = {}
): Promise<SpawnResult> {
  return new Promise((resolve, reject) => {
    const child = cpSpawn(command, args, {
      cwd: options.cwd,
      env: { ...process.env, ...options.env },
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: false,
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data: Buffer) => {
      const chunk = data.toString();
      stdout += chunk;
      if (!options.quiet) {
        process.stdout.write(chunk);
      }
    });

    child.stderr?.on('data', (data: Buffer) => {
      const chunk = data.toString();
      stderr += chunk;
      if (!options.quiet) {
        process.stderr.write(chunk);
      }
    });

    child.on('error', (err) => {
      reject(err);
    });

    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

export async function commandExists(command: string): Promise<boolean> {
  try {
    const which = process.platform === 'win32' ? 'where' : 'which';
    const { code } = await spawn(which, [command], { quiet: true });
    return code === 0;
  } catch {
    return false;
  }
}

export async function makeTempDir(prefix: string): Promise<string> {
  const random = `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
  const dir = join(tmpdir(), `updatedeps-${prefix}-${random}`);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function tempClone(url: string, branch = ''): Promise<string> {
  const dir = await makeTempDir('clone');
  const args = ['clone', '--depth', '1'];
  if (branch) {
    args.push('--branch', branch);
  }
  args.push(url, dir);
  info(`Cloning ${url} into ${dir}`);
  const { code, stderr } = await spawn('git', args, { quiet: false });
  if (code !== 0) {
    throw new Error(`git clone failed: ${stderr}`);
  }
  return dir;
}

export function askYesNo(question: string): Promise<boolean> {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(`${C.cyan}[updatedeps]${C.reset} ${question} (y/N): `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'y' || answer.trim().toLowerCase() === 'yes');
    });
  });
}

export async function* walkDir(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'target') {
        continue;
      }
      yield* walkDir(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}
