import { readFileSync } from 'node:fs';
import { collectFiles, langFor } from './langs';
import { NL, relFrom, sgFind, trunc, unquote } from './util';
import { doc, table } from './render';
import type { Row } from './types';
import type { SgMatch } from './types';

const GROUP_SUFFIXES = ['Args', 'Opts', 'Options', 'Command', 'Cmd'];

function isGroupName(name: string): boolean {
  return GROUP_SUFFIXES.some((s) => name.endsWith(s));
}

function groupName(name: string): string {
  const suffix = GROUP_SUFFIXES.find((s) => name.endsWith(s));
  const base = suffix && name.length > suffix.length ? name.slice(0, -suffix.length) : name;
  return base.split('_').join('-').toLowerCase();
}

function toKebab(name: string): string {
  return name.split('_').join('-').toLowerCase();
}

async function tsCommandRows(root: string): Promise<Row[]> {
  const rows: Row[] = [];
  const files = await collectFiles(root);
  for (const [langId, list] of files) {
    if (langId === 'rust' || list.length === 0) continue;
    const lang = langFor(langId);
    const abs = list.map((f) => root + '/' + f);
    for (const m of await sgFind('$A.command($N)', lang.sg, abs)) {
      const name = unquote(m.vars.N ?? '');
      if (!name) continue;
      rows.push({ Command: name, Kind: 'command', File: relFrom(root, m.file), Line: String(m.line + 1) });
    }
    for (const m of await sgFind('$A.command($N, $$$)', lang.sg, abs)) {
      const name = unquote(m.vars.N ?? '');
      if (!name) continue;
      rows.push({ Command: name, Kind: 'command', File: relFrom(root, m.file), Line: String(m.line + 1) });
    }
  }
  return rows;
}

async function rustCommandRows(root: string): Promise<Row[]> {
  const rows: Row[] = [];
  const files = await collectFiles(root);
  const list = files.get('rust') ?? [];
  if (list.length === 0) return rows;
  const abs = list.map((f) => root + '/' + f);
  for (const pattern of ['pub struct $N { $$$ }', 'struct $N { $$$ }']) {
    for (const m of await sgFind(pattern, 'rust', abs)) {
      const name = m.vars.N ?? '';
      if (!isGroupName(name)) continue;
      rows.push({ Command: groupName(name), Kind: 'clap group (' + name + ')', File: relFrom(root, m.file), Line: String(m.line + 1) });
    }
  }
  for (const m of await sgFind('$A.subcommand($$$)', 'rust', abs)) {
    rows.push({ Command: '(subcommand)', Kind: 'clap builder', File: relFrom(root, m.file), Line: String(m.line + 1) });
  }
  return rows;
}

function fieldNameAfter(fileLines: string[], attrLine: number): string {
  for (let i = attrLine + 1; i < Math.min(attrLine + 6, fileLines.length); i++) {
    const line = fileLines[i].trim();
    if (!line || line.startsWith('#') || line.startsWith('//')) continue;
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    let name = line.slice(0, colon).trim();
    if (name.startsWith('pub ')) name = name.slice(4).trim();
    if (/^[A-Za-z_]\w*$/.test(name)) return name;
    return '';
  }
  return '';
}

async function flagRows(root: string): Promise<Row[]> {
  const rows: Row[] = [];
  const files = await collectFiles(root);
  const lineCache = new Map<string, string[]>();
  for (const [langId, list] of files) {
    if (list.length === 0) continue;
    const lang = langFor(langId);
    const abs = list.map((f) => root + '/' + f);
    if (langId === 'rust') {
      const matches: SgMatch[] = [];
      for (const m of await sgFind('#[arg($$$)]', 'rust', abs)) matches.push(m);
      for (const m of matches) {
        let lines = lineCache.get(m.file);
        if (!lines) {
          try {
            lines = readFileSync(m.file, 'utf8').split(NL);
          } catch {
            continue;
          }
          lineCache.set(m.file, lines);
        }
        const field = fieldNameAfter(lines, m.line);
        const flag = field ? '--' + toKebab(field) : '(flag)';
        rows.push({ Flag: flag, Definition: trunc(m.text), File: relFrom(root, m.file), Line: String(m.line + 1) });
      }
    } else {
      for (const pattern of ['$A.option($N)', '$A.option($N, $$$)']) {
        for (const m of await sgFind(pattern, lang.sg, abs)) {
          const flag = unquote(m.vars.N ?? '');
          if (!flag) continue;
          rows.push({ Flag: flag.split(' ')[0], Definition: trunc(m.text), File: relFrom(root, m.file), Line: String(m.line + 1) });
        }
      }
    }
  }
  return rows;
}

export async function generateCli(root: string): Promise<string> {
  const commands = [...(await tsCommandRows(root)), ...(await rustCommandRows(root))];
  const flags = await flagRows(root);
  return doc('CLI Reference', [
    '',
    '## Commands',
    '',
    table(['Command', 'Kind', 'File', 'Line'], commands),
    '',
    '## Flags',
    '',
    table(['Flag', 'Definition', 'File', 'Line'], flags),
  ]);
}
