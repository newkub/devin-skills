// Fixup pass: restore provenance lines mangled by global replace, remove self-refs in related lists.
const fs = require('fs');
const path = require('path');
const ROOT = 'C:\\Users\\Veerapong\\AppData\\Roaming\\devin\\skills';

const MAP = {
  'improve-accessibility': 'review-accessibility', 'improve-alignment': 'review-references',
  'improve-api': 'review-api', 'improve-architecture': 'review-architecture',
  'improve-auth': 'review-auth', 'improve-backend': 'review-backend',
  'improve-business': 'review-business', 'improve-cli-ux': 'review-quality',
  'improve-compliance': 'review-compliance', 'improve-consistency': 'review-quality',
  'improve-correctness': 'review-correctness', 'improve-data-structure': 'review-data-structure',
  'improve-data-validation': 'review-data-validation', 'improve-database': 'review-database',
  'improve-dependencies': 'review-dependencies', 'improve-docs': 'review-docs',
  'improve-error-handling': 'review-stability', 'improve-error-messages': 'review-stability',
  'improve-features': 'review-implement', 'improve-frontend': 'review-frontend',
  'improve-logging': 'review-observability', 'improve-migration': 'review-migration',
  'improve-naming': 'review-writing', 'improve-observability': 'review-observability',
  'improve-onboarding': 'review-docs', 'improve-performance': 'review-performance',
  'improve-readability': 'review-readability', 'improve-redundancy': 'review-redundancy',
  'improve-security': 'review-security', 'improve-seo': 'review-seo',
  'improve-simplicity': 'review-quality', 'improve-stability': 'review-stability',
  'improve-test-coverage': 'review-test', 'improve-test-data': 'review-test',
  'improve-uxui': 'review-uxui', 'improve': 'review-then-fix',
  'optimize-algorithm': 'review-algorithm', 'optimize-assets': 'review-assets',
  'optimize-build': 'review-bundle', 'optimize-bundle': 'review-bundle',
  'optimize-ci': 'review-delivery', 'optimize-cost': 'review-cost',
  'optimize-css': 'review-frontend', 'optimize-deps': 'review-dependencies',
  'optimize-docker': 'review-delivery', 'optimize-fonts': 'review-assets',
  'optimize-git-repo': 'review-workspace', 'optimize-hydration': 'review-frontend',
  'optimize-images': 'review-assets', 'optimize-imports': 'review-quality',
  'optimize-mcp': 'review-config', 'optimize-memory': 'review-performance',
  'optimize-network': 'review-performance', 'optimize-offline': 'review-frontend',
  'optimize-performance': 'review-performance', 'optimize-queries': 'review-database',
  'optimize-rendering': 'review-frontend', 'optimize-search': 'review-database',
  'optimize-serialization': 'review-performance', 'optimize-startup': 'review-performance',
  'optimize-terminal': 'check-shell-profile', 'optimize-tests': 'review-test',
  'optimize-token-usage': 'review-cost', 'optimize-videos': 'review-assets',
  'optimize-workspace': 'review-workspace',
};

const byTarget = {};
for (const [s, t] of Object.entries(MAP)) (byTarget[t] = byTarget[t] || []).push(s);

const report = [];
for (const [target, sources] of Object.entries(byTarget)) {
  const tFile = path.join(ROOT, target, 'SKILL.md');
  if (!fs.existsSync(tFile)) continue;
  let text = fs.readFileSync(tFile, 'utf8');
  // 1. restore "Merged from:" line with original source names
  text = text.replace(/^Merged from:.*$/m, `Merged from: ${sources.join(', ')}`);
  // 2. remove self entries in related: list ("- <target>" lines)
  text = text.replace(new RegExp(`^\\s*-\\s*${target}\\s*$\\r?\\n?`, 'gm'), '');
  fs.writeFileSync(tFile, text);
  report.push(`FIXED ${target}`);
}

// 4. restore "(merged from: ...)" header in each fix-*.md
for (const [src, dst] of Object.entries(MAP)) {
  const f = path.join(ROOT, dst, 'references', `fix-${src}.md`);
  if (!fs.existsSync(f)) { report.push(`MISSING ${f}`); continue; }
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/^\(merged from:.*\)$/m, `(merged from: ${src})`);
  fs.writeFileSync(f, c);
}
console.log(report.join('\n'));
