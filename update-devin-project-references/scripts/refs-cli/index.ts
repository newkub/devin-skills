import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { generateApi } from './api';
import { generateCli } from './cli';
import { genWebsite } from './website';
import { NL } from './util';

const HELP = [
  'refs-cli — generate website.md / api.md / cli.md reference tables from source + crw',
  '',
  'Usage: bun scripts/refs-cli/index.ts [website|api|cli ...] [flags]',
  '',
  'Flags:',
  '  --root <dir>   Project root (default: cwd)',
  '  --out <dir>    Output dir (default: <root>/.devin/references)',
  '  --url <url>    Base URL — required for website domain (crw map)',
  '  --dry-run      Print markdown to stdout instead of writing files',
  '  --help         Show this help',
].join(NL);

const GENERATORS: Record<string, (root: string, url?: string) => Promise<string>> = {
  website: (_root, url) => genWebsite(url ?? ''),
  api: (root) => generateApi(root),
  cli: (root) => generateCli(root),
};

function parseArgs(argv: string[]) {
  const domains: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') flags.help = true;
    else if (a === '--dry-run') flags.dryRun = true;
    else if (a === '--root' || a === '--out' || a === '--url') flags[a.slice(2)] = argv[++i] ?? '';
    else if (a.startsWith('--')) throw new Error('unknown flag: ' + a);
    else if (GENERATORS[a]) domains.push(a);
    else throw new Error('unknown domain: ' + a + ' (expected website|api|cli)');
  }
  return { domains: domains.length > 0 ? domains : ['api', 'cli'], flags };
}

async function main() {
  const { domains, flags } = parseArgs(process.argv.slice(2));
  if (flags.help) {
    console.log(HELP);
    return;
  }
  const root = resolve(String(flags.root ?? process.cwd()));
  const out = resolve(String(flags.out ?? root + '/.devin/references'));
  const url = flags.url ? String(flags.url) : undefined;
  if (domains.includes('website') && !url) throw new Error('website domain requires --url <url> (crw maps a served site)');

  if (!flags.dryRun) mkdirSync(out, { recursive: true });
  for (const domain of domains) {
    const md = await GENERATORS[domain](root, url);
    if (flags.dryRun) {
      console.log(md);
      continue;
    }
    const file = out + '/' + domain + '.md';
    writeFileSync(file, md);
    const rows = md.split(NL).filter((l) => l.startsWith('| ')).length;
    console.log('wrote ' + file + ' (' + rows + ' table rows)');
  }
}

main().catch((err) => {
  console.error('refs-cli: ' + (err instanceof Error ? err.message : String(err)));
  process.exit(1);
});
