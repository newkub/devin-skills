import { isPlaceholderMarker, isProhibitedOrLegit, textOutsideInlineCode } from "../parse";
import type { Context, SkillMeta } from "../types";

export function checkStyle(m: SkillMeta, ctx: Context) {
  const rpath = m.path.replace(ctx.skillsRoot + "\\", "").replace(ctx.skillsRoot + "/", "");

  // Bold markers outside code
  for (let i = 0; i < m.nonCodeLines.length; i++) {
    const outside = textOutsideInlineCode(m.nonCodeLines[i]);
    if (/\*\*[^*]+\*\*/.test(outside)) {
      ctx.addFinding({ file: rpath, line: i + 1, category: "style", severity: "Medium", finding: "uses bold markers **", evidence: m.nonCodeLines[i].trim() }, m.skill);
      break;
    }
  }

  // TODO/MOCK/placeholder markers
  for (let i = 0; i < m.nonCodeLines.length; i++) {
    const l = m.nonCodeLines[i];
    const outside = textOutsideInlineCode(l).toLowerCase();
    if (/\b(todo|mock|placeholder)\b/.test(outside) && isPlaceholderMarker(l) && !isProhibitedOrLegit(l)) {
      ctx.addObservation({ file: rpath, line: i + 1, category: "content", severity: "Info", finding: "contains TODO/MOCK/placeholder mention", evidence: l.trim() }, m.skill);
      break;
    }
  }

  // Heading Title Case
  for (let i = 0; i < m.bodyLines.length; i++) {
    const l = m.bodyLines[i];
    if (/^#{2,3}\s+[a-z]/.test(l)) {
      const heading = l.replace(/^#{2,3}\s+/, "");
      if (!/^`.*`$/.test(heading)) {
        ctx.addFinding({ file: rpath, line: i + 1, category: "style", severity: "Low", finding: "heading is not Title Case", evidence: l }, m.skill);
      }
    }
  }
}

const THAI_RE = /[฀-๿]/g;
const LATIN_WORD_RE = /[A-Za-z]{4,}/g;

export function checkLanguage(m: SkillMeta, ctx: Context) {
  const rpath = m.path.replace(ctx.skillsRoot + "\\", "").replace(ctx.skillsRoot + "/", "");
  const prose = m.nonCodeLines.map(textOutsideInlineCode).join("\n");
  const thai = (prose.match(THAI_RE) || []).length;
  const latinWords = (prose.match(LATIN_WORD_RE) || []).length;
  if (latinWords > 80 && thai < latinWords * 0.05) {
    ctx.addFinding({ file: rpath, line: 1, category: "style", severity: "Info", finding: "global skill appears all-English (should be Thai)", evidence: `thai chars: ${thai}, latin words: ${latinWords}` }, m.skill);
  }
}
