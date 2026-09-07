// Merge improve-*/optimize-* skills into review-* (or designated) targets.
// Usage: node .merge-improve-optimize.cjs [--apply]
const fs = require('fs');
const path = require('path');
const ROOT = 'C:\\Users\\Veerapong\\AppData\\Roaming\\devin\\skills';
const APPLY = process.argv.includes('--apply');

const MAP = {
  'improve-accessibility': 'review-accessibility',
  'improve-alignment': 'review-references',
  'improve-api': 'review-api',
  'improve-architecture': 'review-architecture',
  'improve-auth': 'review-auth',
  'improve-backend': 'review-backend',
  'improve-business': 'review-business',
  'improve-cli-ux': 'review-quality',
  'improve-compliance': 'review-compliance',
  'improve-consistency': 'review-quality',
  'improve-correctness': 'review-correctness',
  'improve-data-structure': 'review-data-structure',
  'improve-data-validation': 'review-data-validation',
  'improve-database': 'review-database',
  'improve-dependencies': 'review-dependencies',
  'improve-docs': 'review-docs',
  'improve-error-handling': 'review-stability',
  'improve-error-messages': 'review-stability',
  'improve-features': 'review-implement',
  'improve-frontend': 'review-frontend',
  'improve-logging': 'review-observability',
  'improve-migration': 'review-migration',
  'improve-naming': 'review-writing',
  'improve-observability': 'review-observability',
  'improve-onboarding': 'review-docs',
  'improve-performance': 'review-performance',
  'improve-readability': 'review-readability',
  'improve-redundancy': 'review-redundancy',
  'improve-security': 'review-security',
  'improve-seo': 'review-seo',
  'improve-simplicity': 'review-quality',
  'improve-stability': 'review-stability',
  'improve-test-coverage': 'review-test',
  'improve-test-data': 'review-test',
  'improve-uxui': 'review-uxui',
  'improve': 'review-then-fix',
  'optimize-algorithm': 'review-algorithm',
  'optimize-assets': 'review-assets',
  'optimize-build': 'review-bundle',
  'optimize-bundle': 'review-bundle',
  'optimize-ci': 'review-delivery',
  'optimize-cost': 'review-cost',
  'optimize-css': 'review-frontend',
  'optimize-deps': 'review-dependencies',
  'optimize-docker': 'review-delivery',
  'optimize-fonts': 'review-assets',
  'optimize-git-repo': 'review-workspace',
  'optimize-hydration': 'review-frontend',
  'optimize-images': 'review-assets',
  'optimize-imports': 'review-quality',
  'optimize-mcp': 'review-config',
  'optimize-memory': 'review-performance',
  'optimize-network': 'review-performance',
  'optimize-offline': 'review-frontend',
  'optimize-performance': 'review-performance',
  'optimize-queries': 'review-database',
  'optimize-rendering': 'review-frontend',
  'optimize-search': 'review-database',
  'optimize-serialization': 'review-performance',
  'optimize-startup': 'review-performance',
  'optimize-terminal': 'check-shell-profile',
  'optimize-tests': 'review-test',
  'optimize-token-usage': 'review-cost',
  'optimize-videos': 'review-assets',
  'optimize-workspace': 'review-workspace',
};
const RENAME = { 'improve-review-cli': 'update-review-cli' };

function splitFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { fm: '', body: text };
  return { fm: m[0], body: text.slice(m[0].length) };
}
function getDesc(fm) {
  const m = fm.match(/description:\s*(.+)/);
  return m ? m[1].trim() : '';
}
function read(p) { return fs.readFileSync(p, 'utf8'); }
function write(p, c) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c); }
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    e.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

// group sources by target
const byTarget = {};
for (const [src, dst] of Object.entries(MAP)) {
  (byTarget[dst] = byTarget[dst] || []).push(src);
}

const report = [];
for (const [target, sources] of Object.entries(byTarget)) {
  const tDir = path.join(ROOT, target);
  const tFile = path.join(tDir, 'SKILL.md');
  if (!fs.existsSync(tFile)) { report.push(`MISSING TARGET ${target}`); continue; }
  const guides = [];
  for (const src of sources) {
    const sFile = path.join(ROOT, src, 'SKILL.md');
    if (!fs.existsSync(sFile)) { report.push(`MISSING SOURCE ${src}`); continue; }
    const { fm, body } = splitFrontmatter(read(sFile));
    const desc = getDesc(fm);
    const short = src.replace(/^improve-|^optimize-/, '');
    const sRef = path.join(ROOT, src, 'references');
    const hasRefs = fs.existsSync(sRef);
    // only rewrite references/ paths when source actually ships a references dir
    const fixed = hasRefs
      ? body.replace(/references\//g, `references/fix-${short}/`)
      : body;
    const refName = `fix-${src}.md`;
    if (APPLY) write(path.join(tDir, 'references', refName), `# Fix Guide\n\n(merged from: ${src})\n\n${fixed.trim()}\n`);
    guides.push({ refName, src, desc });
    if (hasRefs) {
      if (APPLY) copyDir(sRef, path.join(tDir, 'references', `fix-${short}`));
      report.push(`COPIED refs ${src} -> ${target}/references/fix-${short}`);
    }
  }
  // build Fix section
  const guideList = guides.map(g => `- \`references/${g.refName}\` — ${g.desc}`).join('\n');
  const mergedNames = sources.join(', ');
  const section = [
    '## Fix',
    '',
    '> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings หลังรายงาน — ข้ามถ้า scope เป็น review/report-only เช่นถูก dispatch จาก `/deep-review-codebase` หรือ `/follow-review`',
    '',
    `Merged from: ${mergedNames}`,
    '',
    '1. จัดลำดับ findings ตาม severity — critical ก่อน แล้วแก้ทีละรายการพร้อม verify ทันทีหลังแก้',
    '2. เลือก fix guide ที่ตรงกับ finding จากรายการด้านล่าง',
    '3. ทุก fix ต้องรักษา behavior เดิม ผ่าน `/run-check` และ `/run-test` ถ้ามี แล้วสรุปผลด้วย `/report-before-after`',
    '',
    guideList,
    '',
  ].join('\n');
  let tText = read(tFile);
  if (tText.includes('## Fix')) { report.push(`SKIP (already has Fix) ${target}`); continue; }
  const idx = tText.search(/^## Expected Outcome/m);
  if (idx >= 0) tText = tText.slice(0, idx) + section + tText.slice(idx);
  else tText = tText.trimEnd() + '\n\n' + section;
  if (APPLY) fs.writeFileSync(tFile, tText);
  report.push(`MERGED ${sources.length} -> ${target} (${sources.join(', ')})`);
}

// rename improve-review-cli -> update-review-cli
for (const [oldName, newName] of Object.entries(RENAME)) {
  const o = path.join(ROOT, oldName), n = path.join(ROOT, newName);
  if (!fs.existsSync(o)) { report.push(`MISSING RENAME SRC ${oldName}`); continue; }
  if (APPLY) {
    fs.renameSync(o, n);
    const f = path.join(n, 'SKILL.md');
    fs.writeFileSync(f, read(f).replace(/^name:\s*.+$/m, `name: ${newName}`));
  }
  report.push(`RENAMED ${oldName} -> ${newName}`);
}

// delete sources
for (const src of Object.keys(MAP)) {
  const d = path.join(ROOT, src);
  if (fs.existsSync(d)) { if (APPLY) fs.rmSync(d, { recursive: true, force: true }); report.push(`DELETED ${src}`); }
}

// global reference replacement across repo text files + global_rules.md
// word-boundary guarded: blocks matches inside other names (e.g. review-improvement)
const names = Object.keys(MAP).filter(n => n !== 'improve')
  .concat(Object.keys(RENAME))
  .sort((a, b) => b.length - a.length);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const repl = (text) => {
  let t = text;
  for (const n of names) {
    const target = MAP[n] || RENAME[n];
    t = t.replace(new RegExp(`(?<![\\w-])${esc(n)}(?![-\\w])`, 'g'), target);
  }
  // bare skill ref "improve" -> review-then-fix (slash ref, related list item, backticked)
  t = t.replace(/\/improve(?![-\w])/g, '/review-then-fix');
  t = t.replace(/^(\s*-\s+)improve\s*$/gm, '$1review-then-fix');
  t = t.replace(/`improve`/g, '`review-then-fix`');
  return t;
};
const EXTS = new Set(['.md', '.json', '.yaml', '.yml', '.toml', '.ts', '.txt']);
let filesChanged = 0;
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== '.git' && e.name !== 'node_modules') walk(p); continue; }
    if (!EXTS.has(path.extname(e.name))) continue;
    if (e.name === '.merge-improve-optimize.cjs') continue;
    const t = read(p); const n = repl(t);
    if (n !== t) { if (APPLY) fs.writeFileSync(p, n); filesChanged++; }
  }
}
walk(ROOT);
const GR = 'C:\\Users\\Veerapong\\.codeium\\windsurf\\memories\\global_rules.md';
if (fs.existsSync(GR)) { const t = read(GR); const n = repl(t); if (n !== t) { if (APPLY) fs.writeFileSync(GR, n); filesChanged++; } }

console.log(report.join('\n'));
console.log(`\nFILES UPDATED: ${filesChanged}`);
console.log(APPLY ? '=== APPLIED ===' : '=== DRY RUN ===');
