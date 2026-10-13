# update-devin-global-subagents — Full Dimension Checklist

## 1. Frontmatter

- [ ] name matches the directory, description is clear, tools declared
- [ ] model/permission fields valid per the current spec

## 2. Prompt Quality

- [ ] system prompt is specific, single responsibility is clear
- [ ] input/output contract stated, guardrails present
- [ ] no overlap with other agents, scope boundaries stated

## 3. Safety

- [ ] least-privilege tools, no unnecessary write/exec
- [ ] destructive ops gated, secrets handling rules
- [ ] failure/report behavior defined

## 4. Integration

- [ ] references existing skills/rules that actually exist
- [ ] AGENTS.md/registry consistent, related links valid

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
