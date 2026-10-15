# Devin CLI — Best Practices

Devin/Cascade AI coding assistant — session, skills, and harness discipline

## Recommended Patterns

- Give full context from the start: files, errors, intent — Devin works well when the scope is clear
- Use the skills (`/<name>`) that fit the job — the repo already has dispatchers wrapping them; do not re-explain how to do something a skill covers
- Sessions: one task per session — context pollution degrades output; spawn child sessions for parallel independent work
- Check `git status` before and after always — agent changes must be reviewable
- Use subagents for several independent pieces of work — fan out via `/use-subagents`, not sequentially in one session

## Common Pitfalls

- Vague instructions = vague output — state files/paths, acceptance criteria, and constraints
- Long sessions drift — summarize/checkpoint; context near full → `/follow-context-engineering`
- Secrets in prompts = leak risk — use env vars/secret managers; never paste credentials
- Don't assume tools: verify a command/skill actually exists before invoking it — many skills are workflows, not executables
- Destructive ops (rm, migrations, pushes) need explicit confirmation — the agent should not guess

## Workflow Tips

- `/deep-research` for current docs — model knowledge goes stale for fast-moving tools
- Follow `/update-devin-global-skills` conventions when writing skills — the format has a spec
- Report-first flow: findings → confirm → fix — avoid auto-fix before review when the scope is large

## Do / Don't

| Do | Don't |
|----|-------|
| state scope/files/criteria clearly | send vague "fix this" briefs |
| spawn subagents for parallel work | serialize multi-domain tasks in one thread |
| env/secret-manager for credentials | paste secrets into prompts |
| verify diffs before committing | trust agent output without review |
