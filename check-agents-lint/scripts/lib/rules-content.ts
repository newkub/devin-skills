import { existsSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
import { finding } from "./catalog.ts";
import { packageFiles, readText } from "./files.ts";
import { headings, sectionEnd, stripInlineCode, type Heading } from "./md.ts";
import { allDocs, bodyLines, relPath } from "./parse.ts";
import type { Ctx, Finding, SkillDoc } from "./types.ts";

const PLACEHOLDER = /(?:^|[\s([{*#/-])(TODO|FIXME|TBD|XXX)(?:\([^)]*\))?\s*:/;
const BARE_PLACEHOLDER = /^\s*(?:(?:\/\/|#|--|<!--)\s*)?(TODO|FIXME|TBD|XXX)\s*(?:-->)?\s*$/;
const LOREM = /\blorem ipsum\b(?=\s+\p{L})/iu;
const USER_PATH =
  /(?:[A-Za-z]:[\\/]Users[\\/]([A-Za-z0-9._-]+)|\/Users\/([A-Za-z0-9._-]+)|\/home\/([A-Za-z0-9._-]+))/;
const GENERIC_USER = new Set(["user", "username", "you", "yourname", "name", "me", "shared", "public", "example"]);
const VERSION =
  /\b(?:bun|bunx|node|deno|npm|pnpm|yarn|biome|ast-grep|sg|gitleaks|shellcheck|lychee|typescript|wrangler|vitest|vite|react|next\.js|nuxt)\s+v?\d+\.\d+\.\d+\b/i;
const SCRIPT_EXTS = new Set([".ts", ".js", ".mjs", ".cjs", ".sh", ".py", ".ps1"]);

function loc(ctx: Ctx, doc: SkillDoc): string {
  return relPath(ctx.root, doc.file);
}

function hasWorkflowsHeading(heads: Heading[]): boolean {
  return heads.some((h) => h.level === 3 && h.text.toLowerCase().replace(/\s+/g, " ").trim() === "workflows");
}

function emit(
  ctx: Ctx,
  doc: SkillDoc,
  out: Finding[],
  rule: string,
  test: (line: string) => string | null,
  proseOnly = true,
): void {
  for (const line of bodyLines(doc)) {
    if (line.inFence || line.isFence) continue;
    const message = test(proseOnly ? stripInlineCode(line.line) : line.line);
    if (message) out.push(finding(rule, loc(ctx, doc), line.no, message));
  }
}

function content(ctx: Ctx, doc: SkillDoc, out: Finding[]): void {
  if (doc.fmError) return;

  emit(ctx, doc, out, "content/no-placeholder", (line) => {
    const hit = line.match(PLACEHOLDER) ?? line.match(BARE_PLACEHOLDER);
    if (hit) return `placeholder marker "${hit[1]}" remains`;
    return LOREM.test(line) ? 'placeholder text "lorem ipsum" remains' : null;
  });

  emit(
    ctx,
    doc,
    out,
    "content/stale-version-pin",
    (line) => {
      const hit = line.match(VERSION);
      return hit ? `pinned full version "${hit[0].trim()}" goes stale` : null;
    },
    false,
  );

  const heads = headings(doc);
  const lines = doc.body.split(/\r?\n/);
  for (let i = 0; i < heads.length; i++) {
    const from = heads[i].line - doc.fmLines - 1;
    const stop = sectionEnd(heads, i);
    const until = stop < heads.length ? heads[stop].line - doc.fmLines - 1 : lines.length;
    let filled = false;
    for (let j = from + 1; j < until; j++) {
      if (lines[j]?.trim()) {
        filled = true;
        break;
      }
    }
    if (!filled)
      out.push(finding("content/empty-section", loc(ctx, doc), heads[i].line, `section "${heads[i].text}" is empty`));
  }
}

export function runContent(ctx: Ctx): Finding[] {
  const out: Finding[] = [];
  for (const doc of allDocs(ctx)) content(ctx, doc, out);

  for (const skill of ctx.skills) {
    for (const file of packageFiles(skill.dirPath, "text")) {
      const lines = readText(file).split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        const hit = lines[i].match(USER_PATH);
        if (!hit) continue;
        const segment = hit[1] ?? hit[2] ?? hit[3] ?? "";
        if (GENERIC_USER.has(segment.toLowerCase())) continue;
        out.push(
          finding(
            "content/hardcoded-user-path",
            relPath(ctx.root, file),
            i + 1,
            `machine-specific home path "${hit[0]}"`,
          ),
        );
      }
    }
  }

  for (const wf of ctx.workflows) {
    if (!wf.hasSkillMd || !wf.parent) continue;
    const parent = ctx.skillDirs.get(wf.parent);
    if (!parent || !parent.hasSkillMd || hasWorkflowsHeading(headings(parent))) continue;
    const name = wf.dir.split("/")[2] ?? "";
    const safe = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(^|[^a-z0-9-])${safe}([^a-z0-9-]|$)`, "i");
    if (!re.test(parent.body))
      out.push(
        finding(
          "content/workflow-dispatch",
          relPath(ctx.root, parent.file),
          1,
          `workflow "${name}" is not dispatched from SKILL.md`,
        ),
      );
  }

  for (const skill of ctx.skills) {
    const dir = join(skill.dirPath, "scripts");
    if (!existsSync(dir)) continue;
    let entries: ReturnType<typeof readdirSync>;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (!entry.isFile() || entry.name.endsWith(".d.ts")) continue;
      if (!SCRIPT_EXTS.has(extname(entry.name).toLowerCase())) continue;
      const file = join(dir, entry.name);
      const first = readText(file).split(/\r?\n/, 1)[0] ?? "";
      if (!first.startsWith("#!"))
        out.push(finding("content/script-shebang", relPath(ctx.root, file), 1, `${entry.name} has no shebang`));
    }
  }

  return out;
}
