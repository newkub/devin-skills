#!/usr/bin/env bun
// bench-deps — dependency comparison table report
// usage: bun run scripts/bench-deps.ts [--json] [--top N] [--no-bundle]

import { Glob } from "bun";

interface DepRow {
  name: string;
  installed: string;
  latest: string;
  released: string;
  status: string;
  bundleKb: number | null;
  downloads: number | null;
  license: string;
  usedIn: string;
}

const args = process.argv.slice(2);
const flagJson = args.includes("--json");
const flagNoBundle = args.includes("--no-bundle");
const topIdx = args.indexOf("--top");
const topN = topIdx >= 0 ? parseInt(args[topIdx + 1], 10) : 0;

const rel = (d: string | undefined): string => {
  if (!d) return "-";
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 864e5);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${(days / 365).toFixed(1)}y ago`;
};

const human = (n: number | null): string =>
  n == null ? "-" : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : `${n}`;

const major = (v: string): number => {
  const m = v.replace(/^[\^~>=<\s]*/, "").match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
};

// ---------- 1. collect deps ----------
const depMap = new Map<string, { spec: string; usedIn: Set<string> }>();

const addDeps = (pkgPath: string, ws: string, pj: any) => {
  for (const key of ["dependencies", "devDependencies", "peerDependencies"] as const) {
    for (const [name, spec] of Object.entries(pj[key] ?? {})) {
      const e = depMap.get(name) ?? { spec: spec as string, usedIn: new Set<string>() };
      e.usedIn.add(ws);
      depMap.set(name, e);
    }
  }
};

const root = JSON.parse(await Bun.file("package.json").text().catch(() => "{}"));
if (!root.name) { console.error("no package.json in cwd"); process.exit(1); }
addDeps("package.json", "*", root);

const wsPatterns: string[] = root.workspaces?.packages ?? root.workspaces ?? [];
for (const pat of wsPatterns) {
  const g = new Glob(`${pat}/package.json`);
  for await (const f of g.scan(".")) {
    const pj = JSON.parse(await Bun.file(f).text().catch(() => "{}"));
    addDeps(f, pj.name ?? f.replace(/\/package\.json$/, ""), pj);
  }
}

// ---------- 2. gather metrics (batched, best-effort) ----------
const enc = (n: string) => n.replace("/", "%2f");
const get = async <T>(url: string, ms = 8000): Promise<T | null> => {
  try {
    const r = await fetch(url, {
      headers: { Accept: "application/vnd.npm.install-v1+json" },
      signal: AbortSignal.timeout(ms),
    });
    return r.ok ? ((await r.json()) as T) : null;
  } catch { return null; }
};

const rows: DepRow[] = [];
const names = [...depMap.keys()];
const BATCH = 10;
for (let i = 0; i < names.length; i += BATCH) {
  await Promise.all(
    names.slice(i, i + BATCH).map(async (name) => {
      const e = depMap.get(name)!;
      const meta: any = await get(`https://registry.npmjs.org/${enc(name)}`);
      const latest: string = meta?.["dist-tags"]?.latest ?? "-";
      const lv: any = meta?.versions?.[latest];
      const released = meta?.time?.[latest] ?? meta?.modified;
      const dl: any = await get(`https://api.npmjs.org/downloads/point/last-week/${enc(name)}`, 5000);
      let bundleKb: number | null = null;
      if (!flagNoBundle) {
        const b: any = await get(
          `https://bundlephobia.com/api/size?package=${enc(name)}@${latest}`,
          10000
        );
        if (b?.gzip) bundleKb = Math.round(b.gzip / 102.4) / 10;
      }
      let status = "stable";
      if (lv?.deprecated) status = "deprecated";
      else if (latest.includes("-")) status = "prerelease";
      else if (released && Date.now() - new Date(released).getTime() > 730 * 864e5) status = "unmaintained";
      const instMajor = major(e.spec), latMajor = major(latest);
      if (status === "stable" && latMajor > instMajor) status = "outdated";
      else if (status === "stable" && latest !== "-" && !e.spec.includes(latest)) status = "behind";
      rows.push({
        name,
        installed: e.spec,
        latest,
        released: rel(released),
        status,
        bundleKb,
        downloads: dl?.downloads ?? null,
        license: lv?.license ?? meta?.license ?? "-",
        usedIn: e.usedIn.size > 3 ? `${e.usedIn.size} ws` : [...e.usedIn].join(","),
      });
    })
  );
}

// ---------- 3. sort + render ----------
const rank: Record<string, number> = { deprecated: 0, unmaintained: 1, outdated: 2, behind: 3 };
rows.sort(
  (a, b) =>
    (rank[a.status] ?? 9) - (rank[b.status] ?? 9) ||
    (b.bundleKb ?? 0) - (a.bundleKb ?? 0)
);
const out = topN > 0 ? rows.slice(0, topN) : rows;

if (flagJson) {
  console.log(JSON.stringify(out, null, 2));
} else {
  const cols: [keyof DepRow | ((r: DepRow) => string), string][] = [
    ["name", "Package"], ["installed", "Installed"], ["latest", "Latest"],
    ["released", "Released"], ["status", "Status"],
    [(r) => (r.bundleKb == null ? "-" : `${r.bundleKb}K`), "Bundle"],
    [(r) => human(r.downloads), "DL/wk"], ["license", "License"], ["usedIn", "Used in"],
  ];
  const cell = (r: DepRow, c: (typeof cols)[number]) =>
    typeof c[0] === "function" ? c[0](r) : String(r[c[0]]);
  const w = cols.map((c) => Math.max(c[1].length, ...out.map((r) => cell(r, c).length)));
  const line = (vals: string[]) => "| " + vals.map((v, i) => v.padEnd(w[i])).join(" | ") + " |";
  console.log(line(cols.map((c) => c[1])));
  console.log("|" + w.map((x) => "-".repeat(x + 2)).join("|") + "|");
  for (const r of out) console.log(line(cols.map((c) => cell(r, c))));
  const dep = rows.filter((r) => r.status === "deprecated").length;
  const unm = rows.filter((r) => r.status === "unmaintained").length;
  const outd = rows.filter((r) => r.status === "outdated").length;
  const bundleTotal = rows.reduce((s, r) => s + (r.bundleKb ?? 0), 0);
  console.log(`\n${rows.length} deps — ${outd} outdated majors, ${dep} deprecated, ${unm} unmaintained, ~${Math.round(bundleTotal)}K gzip total`);
}
