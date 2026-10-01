#!/usr/bin/env bun
// types-def — inspect type definitions → table (name/type/options/default/comment)
// usage: bun run types-def.ts <path-or-package> [--json]
// supports: .d.ts/.ts (interfaces, type aliases, enums), .rs (pub struct/enum + doc comments)

import { resolve, join } from "path";

interface Row { name: string; type: string; options: string; default: string; comment: string; optional: boolean }

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const flagJson = process.argv.includes("--json");
const target = args[0];
if (!target) { console.error("usage: types-def <path-or-package> [--json]"); process.exit(1); }

// ---------- locate ----------
let file = target;
if (!file.includes("/") && !file.includes("\\") && !file.endsWith(".ts") && !file.endsWith(".rs")) {
  // treat as package name → resolve types entry
  const pj = JSON.parse(await Bun.file(`node_modules/${target}/package.json`).text().catch(() => "{}"));
  file = pj.types ?? pj.typings ?? pj.exports?.["."]?.types ?? "";
  if (file) file = join(`node_modules/${target}`, file);
}
if (!file) { console.error(`cannot resolve types for: ${target}`); process.exit(1); }
const src = await Bun.file(resolve(file)).text().catch(() => "");
if (!src) { console.error(`cannot read: ${file}`); process.exit(1); }

// ---------- parse ----------
const rows: Row[] = [];
const jsdoc = (block: string): { comment: string; def: string } => {
  let comment = "", def = "-";
  for (const l of block.split("\n")) {
    const t = l.replace(/^\s*\*\s?/, "").trim();
    if (t.startsWith("@default")) def = t.replace(/@defaultValue?|@default/, "").trim() || "-";
    else if (t && !t.startsWith("@")) comment += (comment ? " " : "") + t;
    else if (t.startsWith("@deprecated")) comment += (comment ? " " : "") + "[deprecated] " + t.slice(11).trim();
  }
  return { comment, def };
};
const optsOf = (t: string): string => {
  const m = t.match(/('[^']*'|"[^"]*"|`[^`]*`)(\s*\|\s*('[^']*'|"[^"]*"|`[^`]*`))+/);
  return m ? m[0] : "-";
};

if (file.endsWith(".rs")) {
  // Rust: pub struct fields + /// docs + #[serde(default...)]
  const re = /(?:\/\/\/[^\n]*\n|#\[serde\([^\]]*\)\]\s*\n|#\[[^\]]*\]\s*\n)*(?:pub\s+)?(?:struct|enum)\s+(\w+)[^\{]*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(src))) {
    const body = m[2];
    let docs: string[] = [], def = "-";
    for (const line of body.split("\n")) {
      const d = line.match(/\/\/\/\s*(.*)/);
      if (d) { docs.push(d[1].trim()); continue; }
      const s = line.match(/#\[serde\(default(?:\s*=\s*"([^"]+)")?\)\]/);
      if (s) { def = s[1] ?? "Default::default()"; continue; }
      const f = line.match(/pub\s+(\w+)\s*:\s*([^,]+)/);
      if (f) rows.push({ name: f[1], type: f[2].trim(), options: f[2].includes("|") ? optsOf(f[2]) : "-", default: def, comment: docs.join(" "), optional: f[2].includes("Option<") });
      else docs = [];
    }
  }
} else {
  // TS: interface/type members with JSDoc
  const re = /export\s+(?:interface|type)\s+(\w+)[^=]*(?:=\s*\{|\{)([^]*?)\n\}/g;
  let m;
  while ((m = re.exec(src))) {
    const body = m[2];
    let docBuf = "";
    for (const line of body.split("\n")) {
      if (/\/\*\*/.test(line)) { docBuf = line; continue; }
      if (docBuf && !/\*\//.test(docBuf)) { docBuf += "\n" + line; if (!/\*\//.test(line)) continue; }
      const f = line.match(/^\s*(?:readonly\s+)?(\w+)(\?)?\s*:\s*([^;]+);?/);
      if (f) {
        const { comment, def } = jsdoc(docBuf);
        rows.push({ name: f[1], type: f[3].trim(), options: optsOf(f[3]), default: def, comment, optional: !!f[2] });
      }
      if (/\*\//.test(line)) docBuf = "";
    }
  }
}

// ---------- render ----------
if (flagJson) { console.log(JSON.stringify(rows, null, 2)); process.exit(0); }
const cols: [keyof Row | ((r: Row) => string), string][] = [
  [(r) => r.name + (r.optional ? "?" : ""), "Name"], ["type", "Type"],
  ["options", "Options"], ["default", "Default"], ["comment", "Comment"],
];
const cell = (r: Row, c: (typeof cols)[number]) => (typeof c[0] === "function" ? c[0](r) : String(r[c[0]]));
const w = cols.map((c) => Math.max(c[1].length, ...rows.map((r) => cell(r, c).length)));
const line = (v: string[]) => "| " + v.map((x, i) => x.padEnd(w[i])).join(" | ") + " |";
console.log(line(cols.map((c) => c[1])));
console.log("|" + w.map((x) => "-".repeat(x + 2)).join("|") + "|");
for (const r of rows) console.log(line(cols.map((c) => cell(r, c))));
console.log(`\n${rows.length} members`);
