# review-devin-global-harness — Full Dimension Checklist

## 1. Package Structure

- [ ] frontmatter valid: name = dir name, description ≤100 chars, argument-hint, related
- [ ] sections order: Goal → Scope → Execute → Rules → Expected Outcome
- [ ] ≤250 lines, headings Title Case, ไม่มี `**` bold

## 2. Content Quality

- [ ] steps actionable, single-responsibility, deterministic
- [ ] no TODO/MOCK/placeholder, no stale versions/URLs
- [ ] commands verified against current tool versions

## 3. Cross-Skill Consistency

- [ ] terminology, language style, report format uniform
- [ ] `related` bidirectional ที่เหมาะสม, no dangling refs

## 4. Redundancy (merged: review-redundancy)

- [ ] purpose overlap >70% → merge candidate
- [ ] content overlap >50% → dedup candidate
- [ ] unused skills, orphan references

## 5. References Integrity (merged: review-references)

- [ ] AGENTS.md ↔ skills aligned, global_rules.md refs valid
- [ ] in-body `/skill-name` refs resolve, no circular deps
- [ ] `references/*.md` links exist, anchor targets valid

## 6. Refactor Quality

- [ ] splits/merges preserve content, provenance noted
- [ ] moved refs renamed to avoid collisions

## Scoring

- ตาม references/scoring.md; grade A (90+), B (80+), C (70+), D (60+), F (<60)
