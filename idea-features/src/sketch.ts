import type { Feature } from './types';
import { impactIcon, riskIcon } from './ui';

const W = 64;
const INNER = W - 4;

const pad = (s: string, n: number) => (s || '-').slice(0, n).padEnd(n);

const wrap = (text: string, n: number): string[] => {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += n) {
    chunks.push(pad(text.slice(i, i + n), n));
  }
  if (chunks.length === 0) chunks.push(pad('-', n));
  return chunks;
};

const line = (s: string) => `│  ${s}  │`;
const sep = () => `├${'─'.repeat(INNER)}┤`;
const top = () => `┌${'─'.repeat(INNER)}┐`;
const bottom = () => `└${'─'.repeat(INNER)}┘`;

export const generateSketch = (f: Feature) => {
  const title = pad(f.feature, INNER - 4);
  const nav = pad('[List] [Detail] [Sketch] [Settings]', INNER - 4);
  const impact = pad(`${impactIcon(f.impact)} Impact: ${f.impact}`, 22);
  const risk = pad(`${riskIcon(f.risk)} Risk: ${f.risk}`, 22);
  const phase = pad(`🚀 Phase: ${f.phase}`, 22);
  const effort = pad(`📊 Effort: ${f.effort}`, 22);
  const mvp = pad(`⭐ MVP Score: ${f.mvpScore} / 10`, INNER - 4);
  const type = pad(`🏷 Type: ${f.type}`, INNER - 4);
  const descLines = wrap(f.description, INNER - 6);
  const reasonLines = wrap(f.reason || '-', INNER - 6);
  const howLines = wrap(f.how || '-', INNER - 6);
  const riskLines = wrap(f.riskDetail || '-', INNER - 6);
  const webTitle = pad(f.feature.slice(0, 24), 24);
  const mobileTitle = pad(f.feature.slice(0, 22), 22);
  const mobileDesc = pad(f.description.slice(0, 30), 30);

  const lines: string[] = [];
  lines.push(top());
  lines.push(line(pad('🖼 UX/UI SKETCH', INNER - 4)));
  lines.push(sep());
  lines.push(line(title));
  lines.push(line(nav));
  lines.push(sep());
  lines.push(line(`${impact}  ${risk}`));
  lines.push(line(`${phase}  ${effort}`));
  lines.push(line(mvp));
  lines.push(line(type));
  lines.push(sep());
  lines.push(line(pad('📝 Description', INNER - 4)));
  for (const d of descLines) lines.push(line(`  ${d}`));
  lines.push(sep());
  lines.push(line(pad('💡 Why', INNER - 4)));
  for (const r of reasonLines) lines.push(line(`  ${r}`));
  lines.push(line(pad('🛠 How', INNER - 4)));
  for (const h of howLines) lines.push(line(`  ${h}`));
  lines.push(line(pad('⚠ Risk', INNER - 4)));
  for (const r of riskLines) lines.push(line(`  ${r}`));
  lines.push(sep());
  lines.push(line(pad('🖥 Web Layout', INNER - 4)));
  lines.push(line(`  ┌─ Header: ${webTitle} ──┐`));
  lines.push(line(`  │ Sidebar  │ Feature Card │`));
  lines.push(line(`  │ [List]   │ [Select]     │`));
  lines.push(line(`  │ [Sketch] │ [View Detail]│`));
  lines.push(line(`  └──────────┴──────────────┘`));
  lines.push(sep());
  lines.push(line(pad('📱 Mobile Screen', INNER - 4)));
  lines.push(line(`  ┌───┐  ${mobileTitle}`));
  lines.push(line(`  │ ≡ │`));
  lines.push(line(`  └───┘`));
  lines.push(line(`  ${mobileDesc}`));
  lines.push(line(`  [Tap for detail]  [Select]`));
  lines.push(bottom());

  return lines.join('\n');
};
