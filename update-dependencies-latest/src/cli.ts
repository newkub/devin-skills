#!/usr/bin/env bun
import {
  updateCommand,
  convertSubmodulesCommand,
  refactorCommand,
  retestCommand,
  commitCommand,
} from './commands/index.js';
import { error, info } from './utils.js';

const HELP = `updatedeps [command] [options]

Commands:
  update [path]            Update dependencies (default)
    --type all|patch|minor|major   (default: all)
    --write                      Write changes to manifests
    --interactive                Interactive mode (taze -i)
    --recursive                  Recursive workspaces
    --dry-run                    Preview changes

  convert-submodules <path> <options>
    --remote <git-url>           Git URL for the submodule
    --push                       Push after commit
    --force                      Skip push confirmation

  refactor [path]            Run refactor command
    --temp                       Clone repo to temp directory
    --command <cmd>              Command to run (default: bun run lint or bunx @ast-grep/cli scan)

  retest [path]              Re-run tests
    --temp                       Clone repo to temp directory

  commit [path]              Stage and commit all changes
    -m, --message <msg>          Commit message
    --push                       Push after commit

Global:
  -h, --help                   Show this help
`;

function getArg(args: string[], flags: string[], hasValue: boolean): string | undefined {
  for (let i = 0; i < args.length; i++) {
    if (flags.includes(args[i])) {
      if (hasValue) {
        const value = args[i + 1];
        if (value && !value.startsWith('-')) return value;
      }
      return hasValue ? undefined : 'true';
    }
    if (hasValue) {
      for (const flag of flags) {
        if (args[i].startsWith(`${flag}=`)) {
          return args[i].slice(`${flag}=`.length);
        }
      }
    }
  }
  return undefined;
}

function hasFlag(args: string[], flags: string[]): boolean {
  return args.some((arg) => flags.includes(arg));
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);

  if (args.length === 0 || hasFlag(args, ['-h', '--help'])) {
    console.log(HELP);
    return 0;
  }

  let command = args[0];
  let rest = args.slice(1);

  if (command.startsWith('-')) {
    // No explicit command: default to update
    rest = args;
    command = 'update';
  }

  const dryRun = hasFlag(rest, ['--dry-run']);

  try {
    switch (command) {
      case 'update': {
        let root = process.cwd();
        if (rest[0] && !rest[0].startsWith('-')) {
          root = rest[0];
          rest = rest.slice(1);
        }
        const type = (getArg(rest, ['--type'], true) ?? 'all') as 'all' | 'patch' | 'minor' | 'major';
        return await updateCommand({
          root,
          type,
          write: hasFlag(rest, ['--write', '-w']),
          interactive: hasFlag(rest, ['--interactive', '-i']),
          recursive: hasFlag(rest, ['--recursive', '-r']),
          dryRun,
        });
      }

      case 'convert-submodules': {
        if (!rest[0] || rest[0].startsWith('-')) {
          error('convert-submodules requires a <path-or-package>');
          return 1;
        }
        const target = rest[0];
        rest = rest.slice(1);
        return await convertSubmodulesCommand({
          target,
          remote: getArg(rest, ['--remote'], true),
          push: hasFlag(rest, ['--push']),
          force: hasFlag(rest, ['--force']),
        });
      }

      case 'refactor': {
        let root = process.cwd();
        if (rest[0] && !rest[0].startsWith('-')) {
          root = rest[0];
          rest = rest.slice(1);
        }
        return await refactorCommand({
          temp: hasFlag(rest, ['--temp']),
          command: getArg(rest, ['--command'], true),
          root,
        });
      }

      case 'retest': {
        let root = process.cwd();
        if (rest[0] && !rest[0].startsWith('-')) {
          root = rest[0];
          rest = rest.slice(1);
        }
        return await retestCommand({
          temp: hasFlag(rest, ['--temp']),
          root,
        });
      }

      case 'commit': {
        let root = process.cwd();
        if (rest[0] && !rest[0].startsWith('-')) {
          root = rest[0];
          rest = rest.slice(1);
        }
        return await commitCommand({
          message: getArg(rest, ['-m', '--message'], true),
          push: hasFlag(rest, ['--push']),
          root,
        });
      }

      default:
        error(`Unknown command: ${command}`);
        console.log(HELP);
        return 1;
    }
  } catch (err) {
    error(`Unexpected error: ${(err as Error).message}`);
    return 1;
  }
}

main().then((code) => {
  process.exit(code);
});
