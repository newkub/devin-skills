#!/usr/bin/env bun
/**
 * UnoCSS theme lint — token parity, dark completeness, semantic violations.
 * usage: bun theme-lint.ts [rootDir] [--json]
 * exit: 1 on Critical/High findings, 0 otherwise.
 * supports: --color-* naming AND generic token names (--bg, --ink, ...);
 *           .dark / [data-theme] / media-query dark strategies.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, basename } from "node:path";

const args = process.argv.slice(2);
const root = args.find((a) => !a.startsWith("--")) ?? ".";
const asJson = args.includes("--json");

type Sev = "Critical" | "High" | "Medium" | "Info";
interface Finding { sev: Sev; check: string; file: string; line: number; msg: string }
const findings: Finding[] = [];
const add = (sev: Sev, check: string, file: string, line: number, msg: string) =>
  findings.push({ sev, check, file, line, msg });
const rel = (p: string) => relative(root, p) || basename(p);

const PALETTE = new Set(["slate","gray","zinc","neutral","stone","red","orange","amber","yellow","lime","green","emerald","teal","cyan","sky","blue","indigo","violet","purple","fuchsia","pink","rose"]);
const PAIR_SURFACES = ["card","popover","primary","secondary","muted","accent","destructive","success","warning","info"];
const COLOR_PREFIXES = ["bg","text","border","ring","divide","outline","stroke","fill","from","via","to","decoration","placeholder","caret","accent"];
const NON_COLOR: Record<string, RegExp> = {
  text: /^(xs|sm|base|lg|xl|[2-9]xl|\d+(?:\.\d+)?|left|center|right|justify|start|end|ellipsis|clip|wrap|nowrap|balance|pretty|align|overflow|decoration|transform|indent|shadow|stroke|rendering|underline|overline|line-through|no-underline|uppercase|lowercase|capitalize|normal-case|antialiased|subpixel-antialiased)$/,
  border: /^(\d+|x|y|t|r|b|l|s|e|solid|dashed|dotted|double|hidden|none|collapse|separate|top|right|bottom|left|color|width|style|radius|spacing|block|inline)$/,
  outline: /^(\d+|none|dashed|dotted|double|solid|hidden|offset-.*|offset|color|style|width|auto)$/,
  stroke: /^(\d+|none|width|color|linecap|linejoin|dasharray|dashoffset|miterlimit|opacity)$/,
  fill: /^(none|rule|opacity|evenodd|nonzero)$/,
  accent: /^(color|auto)$/,
  caret: /^(color|auto)$/,
  placeholder: /^(color|shown)$/,
  decoration: /^(color|style|thickness|offset|line|auto|from-font)$/,
  from: /^(position)$/,
  via: /^(position)$/,
  to: /^(position)$/,
  ring: /^(\d+|inset|offset-.*|offset|width|color)$/,
  bg: /^(none|fixed|local|scroll|clip-.*|origin-.*|bottom|center|left|left-bottom|left-top|right|right-bottom|right-top|top|repeat.*|no-repeat|auto|cover|contain|gradient-to-.*|blend-.*)$/,
  divide: /^(\d+|x|y|solid|dashed|dotted|double|none|reverse)$/,
};
const GENERIC = new Set(["inherit", "transparent", "current", "black", "white"]);
const SKIP_DIRS = new Set(["node_modules", "dist", "build", ".output", ".next", ".nuxt", ".git", "coverage", "out"]);
const HSL_RE = /^\d+(?:\.\d+)?\s+\d+(?:\.\d+)?%\s+\d+(?:\.\d+)?%$/;
const COLOR_VAL_RE = /^(#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\(|oklch\(|color-mix\(|var\()/;
const VAR_RE = /(--[\w-]+)\s*:\s*([^;]+);/g;


const SRC_EXT = /\.(ts|tsx|js|jsx|mts|vue|svelte|astro|html|css)$/;
const WIRING_EXT = /\.(ts|tsx|js|jsx|vue|svelte|html|css)$/;
const walk = (dir: string, out: string[] = [], filter?: (name: string) => boolean): string[] => {
  for (const e of readdirSync(dir)) {
    if (SKIP_DIRS.has(e)) continue;
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out, filter);
    else if (filter ? filter(e) : /uno\.config\.(ts|mts|js|mjs)$/.test(e)) out.push(p);
  }
  return out;
};
const srcFiles = () => walk(root, [], (e) => SRC_EXT.test(e));

// ---------- locate ----------
const configFile = walk(root)[0];
const cfg = configFile ? readFileSync(configFile, "utf8") : "";
const cfgVarRefs = new Set([...cfg.matchAll(/var\((--[\w-]+)\)/g)].map((m) => m[1]));

const cssFiles: string[] = [];
for (const p of srcFiles()) {
  if (!p.endsWith(".css")) continue;
  const text = readFileSync(p, "utf8");
  if (text.includes("--color-") || [...cfgVarRefs].some((v) => text.includes(v)) || /:root[^{]*\{[^}]*--[\w-]+\s*:/.test(text)) cssFiles.push(p);
}
const themeCss = cssFiles.find((f) => /theme\.css$/.test(f)) ?? cssFiles[0];
if (!themeCss) {
  console.log(`No theme layer found (no CSS file declares custom properties) under ${root} — run /follow-unocss-theme create path.`);
  process.exit(0);
}
const css = readFileSync(themeCss, "utf8");
if (!configFile) add("High", "config", "<none>", 0, "uno.config.* not found — token map parity skipped");

// ---------- parse css blocks ----------
type Block = { sel: string; vars: Map<string, { value: string; line: number }> };
const blocks: Block[] = [];
for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const sel = m[1].trim();
  if (!/:(root|where)|\.dark|\[data-theme/.test(sel) && !/^\.dark/.test(sel)) continue;
  const vars = new Map<string, { value: string; line: number }>();
  for (const v of css.slice(m.index, m.index + m[0].length).matchAll(VAR_RE)) {
    const line = css.slice(0, m.index + v.index).split("\n").length;
    vars.set(v[1], { value: v[2].trim(), line });
  }
  blocks.push({ sel, vars });
}
const rootBlock = blocks.find((b) => /:root/.test(b.sel));
const darkBlock = blocks.find((b) => /\.dark|\[data-theme=['"]?dark/.test(b.sel));
if (!rootBlock) add("Critical", "structure", rel(themeCss), 0, "no :root block with CSS variables");
const rootVars = rootBlock?.vars ?? new Map();
const darkVars = darkBlock?.vars ?? new Map();

// color-ish vars only for parity/format checks (fonts, radii, spacing excluded)
const isColorVar = (name: string, value: string) =>
  name.startsWith("--color-") || COLOR_VAL_RE.test(value);
const colorKeys = (m: Map<string, { value: string }>) =>
  [...m.entries()].filter(([k, v]) => isColorVar(k, v.value)).map(([k]) => k);

// ---------- css checks ----------
for (const [name, v] of rootVars) {
  if (name.startsWith("--color-") && !HSL_RE.test(v.value))
    add("High", "format", rel(themeCss), v.line, `${name} = "${v.value}" — not raw HSL channels (expect "H S% L%")`);
}
if (darkBlock) {
  for (const k of colorKeys(rootVars)) if (!darkVars.has(k)) {
    const line = rootVars.get(k)!.line;
    add("Critical", "dark-parity", rel(themeCss), line, `${k} defined in light block but missing in dark`);
  }
  for (const k of colorKeys(darkVars)) if (!rootVars.has(k))
    add("High", "dark-parity", rel(themeCss), darkVars.get(k)!.line, `${k} in dark but not in light`);
} else {
  add("High", "dark-parity", rel(themeCss), 0, "no dark block (.dark / [data-theme=dark] / media query) — dark mode tokens missing");
}
const globalFg = ["--ink", "--foreground", "--fg", "--color-ink", "--color-foreground"].find((v) => rootVars.has(v));
for (const s of PAIR_SURFACES) {
  const has = (m: Map<string, { value: string }>) => m.has(`--color-${s}`) || m.has(`--${s}`);
  const pairOf = (m: Map<string, { value: string }>) => m.has(`--color-${s}-foreground`) || m.has(`--${s}-foreground`);
  if (has(rootVars) && !pairOf(rootVars)) {
    const v = rootVars.get(`--color-${s}`) ?? rootVars.get(`--${s}`)!;
    if (globalFg) add("Info", "foreground-pair", rel(themeCss), v.line, `--${s} relies on shared foreground ${globalFg} — add --${s}-foreground only if it needs its own`);
    else add("High", "foreground-pair", rel(themeCss), v.line, `--${s} has no --${s}-foreground pair`);
  }
}

// ---------- config parity ----------
for (const [k, v] of rootVars)
  if (isColorVar(k, v.value) && !cfgVarRefs.has(k)) add("High", "config-map", rel(themeCss), v.line, `${k} never referenced in uno.config (orphan variable)`);
for (const ref of cfgVarRefs) {
  const inCss = [...rootVars.keys(), ...darkVars.keys()].includes(ref);
  if (!inCss) add("Critical", "config-map", rel(configFile!), 0, `config references var(${ref}) but ${rel(themeCss)} does not define it`);
}
const darkOpt = cfg.match(/dark\s*:\s*['"](\w+)['"]/)?.[1] ?? (/dark\s*:\s*\{/.test(cfg) ? "custom" : undefined);
const usesDotDark = darkBlock ? /\.dark/.test(darkBlock.sel) : false;
if (usesDotDark && darkOpt === "media")
  add("Critical", "dark-strategy", rel(configFile!), 0, `config uses dark:'media' but ${rel(themeCss)} relies on .dark selector — selector never applied`);
if (usesDotDark && darkOpt === undefined)
  add("High", "dark-strategy", configFile ? rel(configFile) : "<none>", 0, ".dark block exists but presetWind4 has no dark option — class strategy never enabled");

// ---------- source scan ----------
// tokens usable as utility values: all root var names minus "--" (config parity enforces mapping)
const definedTokens = new Set([...rootVars.keys()].map((k) => k.replace(/^--(?:color-)?/, "")));
// plain CSS classes authored in project stylesheets (e.g. .mut, .text-red) — not UnoCSS utilities
const cssClasses = new Set<string>();
for (const p of cssFiles)
  for (const m of readFileSync(p, "utf8").matchAll(/\.([a-zA-Z_][\w-]*)/g)) cssClasses.add(m[1]);
const usedTokens = new Set<string>();
let scanned = 0;
for (const p of srcFiles()) {
  if (p.endsWith(".css")) continue;
  const f = rel(p);
  scanned++;
  const lines = readFileSync(p, "utf8").split("\n");
  lines.forEach((lineText, i) => {
    const ln = i + 1;
    // config theme-map entries (`'name': 'var(--name)'`) are definitions, not utilities
    if (/^\s*'?[\w-]+'?\s*:\s*'var\(--[\w-]+\)'\s*,?\s*$/.test(lineText)) return;
    // any var(--token) reference counts as usage (arbitrary values, inline styles, shortcuts)
    for (const vm of lineText.matchAll(/var\(--([\w-]+)\)/g)) usedTokens.add(vm[1].replace(/^color-/, ""));
    for (const sm of lineText.matchAll(/style\s*=\s*["'{][^}"']*(#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\()/g))
      add("Medium", "inline-color", f, ln, "raw color in inline style — use a semantic token");
    for (const cm of lineText.matchAll(/["'`]([^"'`{}]*)["'`]/g)) {
      const str = cm[1];
      if (!str.includes("-")) continue;
      for (const tok of str.split(/\s+/)) {
        // hyphenated token names (muted-foreground, card-2) need a dedicated pass —
        // the generic value class below stops at `-` to keep `border-t-*` out
        const hy = tok.match(/^((?:[\w-]+:)*)([\w-]+?)-(.+)$/);
        if (hy && COLOR_PREFIXES.includes(hy[2]) && definedTokens.has(hy[3])) {
          usedTokens.add(hy[3]);
          if (hy[1].split(":").includes("dark"))
            add("Medium", "dark-redundant", f, ln, `${tok} — token colors already switch via dark CSS vars; dark: variant is redundant`);
          continue;
        }
        const m = tok.match(/^((?:[\w-]+:)*)([\w-]+?)-([\w.\[\]#%()/]+)$/);
        if (!m) continue;
        const [, variants, prefix, rawValue] = m;
        if (!COLOR_PREFIXES.includes(prefix)) continue;
        if (rawValue.startsWith("[")) continue;
        const value = rawValue.replace(/\/\d+$/, "");
        if (GENERIC.has(value) || NON_COLOR[prefix]?.test(value)) continue;
        const pm = value.match(/^([a-z]+)-(\d{2,3})$/);
        if (pm && PALETTE.has(pm[1])) {
          add("Medium", "palette-hardcode", f, ln, `${tok} — palette color; prefer semantic token from uno.config.ts theme`);
          continue;
        }
        const bare = tok.split(":").pop() ?? tok;
        if (cssClasses.has(bare)) continue;
        if (!definedTokens.has(value)) {
          add("High", "undefined-token", f, ln, `${tok} — '${value}' not defined as a theme variable`);
          continue;
        }
        usedTokens.add(value);
        if (variants.split(":").includes("dark"))
          add("Medium", "dark-redundant", f, ln, `${tok} — token colors already switch via dark CSS vars; dark: variant is redundant`);
      }
    }
  });
}
for (const t of definedTokens)
  if (!usedTokens.has(t) && isColorVar(`--${t}`, rootVars.get(`--${t}`)?.value ?? ""))
    add("Info", "unused-token", rel(themeCss), rootVars.get(`--${t}`)?.line ?? 0, `--${t} defined but no utility uses it`);

// ---------- dark wiring ----------
let hasToggle = false, hasPersist = false, hasFoucGuard = false;
for (const p of walk(root, [], (e) => WIRING_EXT.test(e))) {
  const c = readFileSync(p, "utf8");
  if (/classList\.(toggle|add|remove)\(['"]dark|useDark\(|setAttribute\(['"]data-theme|dataset\.theme\s*=/.test(c)) hasToggle = true;
  if (/localStorage\.(theme|setItem\(['"`][^'"`]*theme|getItem\(['"`][^'"`]*theme)/.test(c)) hasPersist = true;
  if (/prefers-color-scheme/.test(c)) hasFoucGuard = true;
}
if (darkBlock && !hasToggle && !hasFoucGuard) add("Medium", "dark-wiring", rel(themeCss), 0, "dark tokens defined but no toggle (data-theme/classList/useDark) or media query found");
if (hasToggle && !hasPersist) add("Info", "dark-wiring", root, 0, "dark toggle found but no localStorage persistence");
if (darkBlock && !hasFoucGuard) add("Medium", "dark-wiring", root, 0, "no prefers-color-scheme handling — system dark preference ignored / possible flash");

// ---------- report ----------
const order: Sev[] = ["Critical", "High", "Medium", "Info"];
const counts = Object.fromEntries(order.map((s) => [s, findings.filter((f) => f.sev === s).length]));
const summary = {
  themeCss: rel(themeCss), config: configFile ? rel(configFile) : null, scanned,
  tokens: {
    defined: definedTokens.size,
    mapped: [...rootVars.keys()].filter((k) => cfgVarRefs.has(k)).length,
    used: usedTokens.size,
  },
  counts,
};
if (asJson) {
  console.log(JSON.stringify({ summary, findings }, null, 2));
} else {
  console.log(`\nUnoCSS Theme Lint — ${root}`);
  console.log(`theme.css: ${summary.themeCss} | config: ${summary.config ?? "none"} | sources scanned: ${scanned}`);
  for (const sev of order) {
    const list = findings.filter((f) => f.sev === sev);
    if (!list.length) continue;
    console.log(`\n${sev} (${list.length})`);
    for (const f of list) console.log(`  ${f.file}:${f.line}  [${f.check}] ${f.msg}`);
  }
  console.log(`\nSummary: ${counts.Critical} critical, ${counts.High} high, ${counts.Medium} medium, ${counts.Info} info`);
  console.log(`Tokens: defined ${summary.tokens.defined} / mapped ${summary.tokens.mapped} / used ${summary.tokens.used}`);
}
process.exit(counts.Critical + counts.High > 0 ? 1 : 0);
