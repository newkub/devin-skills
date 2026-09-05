import { textOutsideInlineCode } from "../parse";
import type { Context, SkillMeta } from "../types";

function normalizeStep(text: string): string {
  return textOutsideInlineCode(text)
    .toLowerCase()
    .replace(/[^a-z0-9฀-๿]+/g, " ")
    .trim();
}

export function checkCrossSkill(skills: SkillMeta[], ctx: Context) {
  // 1. Duplicate step content across skills (same normalized step in >=3 skills)
  const stepOwners = new Map<string, Set<string>>();
  for (const m of skills) {
    const seen = new Set<string>();
    for (const line of m.nonCodeLines) {
      const n = normalizeStep(line);
      if (n.length < 40 || seen.has(n)) continue;
      seen.add(n);
      if (!stepOwners.has(n)) stepOwners.set(n, new Set());
      stepOwners.get(n)!.add(m.skill);
    }
  }
  let dupCount = 0;
  for (const [step, owners] of stepOwners) {
    if (owners.size >= 5) {
      dupCount++;
      ctx.addObservation({ file: "-", line: 0, category: "cross-skill-consistency", severity: "Info", finding: "duplicated content line across skills", evidence: `"${step.slice(0, 70)}" in ${owners.size} skills: ${[...owners].slice(0, 6).join(", ")}` }, "_repo");
    }
  }
  if (dupCount === 0) {
    ctx.addObservation({ file: "-", line: 0, category: "cross-skill-consistency", severity: "Info", finding: "no widespread duplicate content lines", evidence: "threshold: >=5 skills" }, "_repo");
  }

  // 2. Naming conventions: -with-/-using- should be -by-, non-kebab names
  for (const m of skills) {
    if (/-(with|using)-/.test(m.skill)) {
      ctx.addFinding({ file: m.skill, line: 0, category: "naming", severity: "Low", finding: "uses -with-/-using- instead of -by- convention", evidence: m.skill }, m.skill);
    }
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(m.skill)) {
      ctx.addFinding({ file: m.skill, line: 0, category: "naming", severity: "Medium", finding: "name is not kebab-case", evidence: m.skill }, m.skill);
    }
  }

  // 3. Prefix distribution (replaces stale hardcoded family counts)
  const dist: Record<string, number> = {};
  for (const m of skills) {
    const prefix = m.skill.split("-")[0];
    dist[prefix] = (dist[prefix] || 0) + 1;
  }
  const top = Object.entries(dist).sort((a, b) => b[1] - a[1]).slice(0, 12);
  ctx.addObservation({ file: "-", line: 0, category: "cross-skill-consistency", severity: "Info", finding: "skill prefix distribution", evidence: top.map(([k, v]) => `${k}-*:${v}`).join(", ") }, "_repo");

  // 4. 2-node circular related pairs (informational — symmetric see-also is allowed)
  const relatedMap = new Map<string, Set<string>>();
  for (const m of skills) relatedMap.set(m.skill, new Set(m.frontmatter?.related ?? []));
  const pairs: string[] = [];
  for (const [a, rels] of relatedMap) {
    for (const b of rels) {
      if (relatedMap.get(b)?.has(a) && a < b) pairs.push(`${a} <-> ${b}`);
    }
  }
  if (pairs.length > 0) {
    ctx.addObservation({ file: "-", line: 0, category: "cross-skill-consistency", severity: "Info", finding: `${pairs.length} mutual related pairs`, evidence: pairs.slice(0, 10).join("; ") }, "_repo");
  }
}
