# Invoke Skills

> How one skill invokes another. Cited as `update-devin-global-skills` `## Conventions → Invoke Skills` — keep the section name stable.

- Delegate when another skill already owns it — `run /skill-name to <reason>` instead of copying steps; never copy another skill's `## Execute` (SSOT); inline only small steps no skill covers
- Syntax: unconditional `run /x to <reason>`; conditional `if <measurable condition> → run /x`; optional `use /x if needed`; pointer `see also: /x, /y` — always state the context passed along (paths, args, evidence)
- Ordering: Foundation → Dependencies → High impact → Critical path → High risk; respect `check` → `review` → `### 7. Fix`; independent items → parallel per `/follow-parallel`
- `related` contract: every entry has a real dir + is mentioned in the body; invocations should be in `related` (≤15); never list yourself/duplicates; A calls B → consider a reverse link; on change → `/update-references` both directions
- Limits: nested dispatch ≤2 levels (deeper → a `deep-*` orchestrator or `/use-subagents`); ≤~5 skill calls per step; never call yourself/deprecated; heavily overlapping scope → merge instead of long chains
- Validate: read the target SKILL.md to verify the contract → `/review-devin-global-harness` (cycles + broken refs) → `/deep-validate`
