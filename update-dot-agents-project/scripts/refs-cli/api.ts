import { existsSync, readFileSync } from 'node:fs';
import { Glob } from 'bun';
import { collectFiles, langFor } from './langs';
import { NL, relFrom, sgFind, unquote } from './util';
import { doc, table } from './render';
import type { Row } from './types';

const HTTP_METHODS = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'];

const TS_SYMBOL_PATTERNS: [string, string][] = [
  ['export function $N($$$)', 'function'],
  ['export async function $N($$$)', 'function'],
  ['export declare function $N($$$)', 'function'],
  ['export class $N { $$$ }', 'class'],
  ['export interface $N { $$$ }', 'interface'],
  ['export type $N = $$$', 'type'],
  ['export const $N = $$$', 'const'],
];

const RUST_SYMBOL_PATTERNS: [string, string][] = [
  ['pub fn $N($$$) { $$$ }', 'fn'],
  ['pub fn $N($$$) -> $R { $$$ }', 'fn'],
  ['pub fn $N($$$);', 'fn'],
  ['pub struct $N { $$$ }', 'struct'],
  ['pub enum $N { $$$ }', 'enum'],
  ['pub trait $N { $$$ }', 'trait'],
];

function packageJsonRows(root: string): Row[] {
  const p = root + '/package.json';
  if (!existsSync(p)) return [];
  let json: Record<string, Record<string, string> | undefined>;
  try {
    json = JSON.parse(readFileSync(p, 'utf8'));
  } catch {
    return [];
  }
  const rows: Row[] = [];
  for (const section of ['dependencies', 'devDependencies', 'peerDependencies']) {
    for (const [name, version] of Object.entries(json[section] ?? {})) {
      rows.push({ Package: name, Version: version, Source: 'package.json (' + section + ')', Language: 'node/ts' });
    }
  }
  return rows;
}

function cargoTextRows(relPath: string, text: string): Row[] {
  const rows: Row[] = [];
  let section = '';
  for (const raw of text.split(NL)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('[')) {
      section = line.replace('[', '').replace(']', '').trim();
      continue;
    }
    if (section !== 'dependencies' && section !== 'dev-dependencies') continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const name = line.slice(0, eq).trim();
    const rest = line.slice(eq + 1).trim();
    let version = '';
    if (rest.startsWith('{')) {
      const vi = rest.indexOf('version');
      if (vi !== -1) {
        const q1 = rest.indexOf('"', vi);
        const q2 = rest.indexOf('"', q1 + 1);
        if (q1 !== -1 && q2 !== -1) version = rest.slice(q1 + 1, q2);
      }
    } else {
      version = rest.replace(/["',]/g, '');
    }
    const source = relPath + ' (' + section + ')';
    rows.push({ Package: name, Version: version || '(inline)', Source: source, Language: 'rust' });
  }
  return rows;
}

async function cargoRows(root: string): Promise<Row[]> {
  const rows: Row[] = [];
  const seenDirs = new Set<string>();
  for await (const rel of new Glob('**/Cargo.toml').scan({ cwd: root, absolute: false, dot: false })) {
    const dir = rel.split('/').slice(0, -1).join('/');
    if (dir.split('/').some((d) => d === 'target' || d === 'node_modules')) continue;
    if (seenDirs.has(dir)) continue;
    seenDirs.add(dir);
    const text = readFileSync(root + '/' + rel, 'utf8');
    rows.push(...cargoTextRows(rel.split('\\').join('/'), text));
  }
  return rows;
}

async function symbolRows(root: string): Promise<Row[]> {
  const rows: Row[] = [];
  const files = await collectFiles(root);
  for (const [langId, list] of files) {
    if (list.length === 0) continue;
    const lang = langFor(langId);
    const specs = langId === 'rust' ? RUST_SYMBOL_PATTERNS : TS_SYMBOL_PATTERNS;
    const abs = list.map((f) => root + '/' + f);
    for (const [pattern, kind] of specs) {
      for (const m of await sgFind(pattern, lang.sg, abs)) {
        const name = m.vars.N;
        if (!name) continue;
        rows.push({ Symbol: name, Kind: kind, File: relFrom(root, m.file), Line: m.line + 1 });
      }
    }
  }
  return rows;
}

async function endpointRows(root: string): Promise<Row[]> {
  const rows: Row[] = [];
  const files = await collectFiles(root);
  for (const [langId, list] of files) {
    if (list.length === 0) continue;
    const lang = langFor(langId);
    const abs = list.map((f) => root + '/' + f);
    if (langId === 'rust') {
      for (const method of HTTP_METHODS) {
        for (const m of await sgFind('#[' + method + '($P)]', lang.sg, abs)) {
          const path = unquote(m.vars.P ?? '');
          if (!path) continue;
          rows.push({ Method: method.toUpperCase(), Path: path, File: relFrom(root, m.file), Line: m.line + 1 });
        }
      }
    } else {
      for (const pattern of ['$R.$M($P, $$$)', '$R.$M($P)']) {
        for (const m of await sgFind(pattern, lang.sg, abs)) {
          const method = (m.vars.M ?? '').toLowerCase();
          const path = unquote(m.vars.P ?? '');
          if (!HTTP_METHODS.includes(method) || !path.startsWith('/')) continue;
          rows.push({ Method: method.toUpperCase(), Path: path, File: relFrom(root, m.file), Line: m.line + 1 });
        }
      }
    }
  }
  return rows;
}

export async function generateApi(root: string): Promise<string> {
  const deps = [...packageJsonRows(root), ...(await cargoRows(root))];
  const symbols = await symbolRows(root);
  const endpoints = await endpointRows(root);
  return doc('API Reference', [
    '',
    '## Dependencies',
    '',
    table(['Package', 'Version', 'Source', 'Language'], deps),
    '',
    '## Exported Symbols',
    '',
    table(['Symbol', 'Kind', 'File', 'Line'], symbols),
    '',
    '## Endpoints',
    '',
    table(['Method', 'Path', 'File', 'Line'], endpoints),
  ]);
}
