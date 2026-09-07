// Fixup self-references inside merge targets: `/self` -> section `## Fix` (contextual Thai phrasing).
const fs = require('fs');
const path = require('path');
const ROOT = 'C:\\Users\\Veerapong\\AppData\\Roaming\\devin\\skills';

const TARGETS = [
  'review-accessibility','review-references','review-api','review-architecture','review-auth',
  'review-backend','review-business','review-quality','review-compliance','review-correctness',
  'review-data-structure','review-data-validation','review-database','review-dependencies',
  'review-docs','review-stability','review-implement','review-frontend','review-observability',
  'review-migration','review-writing','review-performance','review-readability','review-redundancy',
  'review-security','review-seo','review-test','review-uxui','review-then-fix','review-algorithm',
  'review-assets','review-bundle','review-delivery','review-cost','review-workspace','review-config',
  'check-shell-profile',
];

for (const t of TARGETS) {
  const f = path.join(ROOT, t, 'SKILL.md');
  if (!fs.existsSync(f)) continue;
  let s = fs.readFileSync(f, 'utf8');
  const esc = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // remove trailing helper bullets pointing to self
  s = s.replace(new RegExp(`^\\s*-\\s*ใช้\\s+/${esc}\\s+ถ้าจำเป็น\\s*\\r?\\n?`, 'gm'), '');
  // contextual phrasings (backticked self ref)
  s = s.replace(new RegExp(`ส่งต่อให้\\s+\`/${esc}\``, 'g'), 'ส่งต่อไปยัง section `## Fix`');
  s = s.replace(new RegExp(`ส่งต่อ\\s+\`/${esc}\``, 'g'), 'ส่งต่อไปยัง section `## Fix`');
  s = s.replace(new RegExp(`ชี้ไป\\s+\`/${esc}\``, 'g'), 'ชี้ไป section `## Fix`');
  s = s.replace(new RegExp(`แก้ไขด้วย\\s+\`/${esc}\``, 'g'), 'แก้ไขตาม section `## Fix`');
  s = s.replace(new RegExp(`\\(ใช้\\s+\`/${esc}\`\\)`, 'g'), '(แก้ไขตาม section `## Fix`)');
  s = s.replace(new RegExp(`ผ่าน\\s+\`/${esc}\``, 'g'), 'ผ่าน section `## Fix`');
  s = s.replace(new RegExp(`ให้ทำ\\s+\`/${esc}\``, 'g'), 'ให้ทำ section `## Fix`');
  s = s.replace(new RegExp(`ทำ\\s+\`/${esc}\`\\s+กับ`, 'g'), 'ทำ section `## Fix` กับ');
  fs.writeFileSync(f, s);
}
console.log('done');
