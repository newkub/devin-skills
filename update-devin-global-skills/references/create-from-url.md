# Create From URL

> Create a skill package from a URL/domain. Cited as `update-devin-global-skills` `## Conventions → Create From URL` — keep the section name stable.

User sends a URL/domain → create parent + workflows:

1. Single URL → `/webfetch`; domain → `/web_search` for key pages; several URLs → `run_subagent` in parallel ≤10/batch (deep crawl → `/learn-from-web` ≤20 URLs/batch); summarize each page: topics, commands, config, examples — official docs only
2. Group by workload → `workflows/<domain>/<workflow>/SKILL.md` named `<domain>-<workflow>`; parent `<domain>-workflows/SKILL.md` dispatches by argument — `related` lists every workflow; start with parent + 3-5 workflows, don't over-create before user confirmation; validate → `/deep-validate` + `/check-reference` + `/git-commit` + `/report`
