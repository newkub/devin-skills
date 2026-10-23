---
name: idea-convert-my-global-cli-to-skills
description: Generate ideas and a draft to convert installed CLI tools into Devin skills
argument-hint: "[cli-name]"
related:
  - check-my-global-cli
  - update-agents-skills-global
  - create-plan-in-dot-agents
  - learn
  - delete
  - report
  - run-test

---

## Goal

Generate ideas and a draft for converting CLI tools installed on the machine, or a specified CLI, into Devin skills per the standard

## Scope

Use after `/check-my-global-cli` or when you want to convert any CLI into skills:

- Survey the commands of installed CLI tools
- Assess which commands should become skills
- Write a draft skill per `/update-agents-skills-global`
- Support a single CLI, multiple tools, and a global CLI set

## Execute

### 1. Select CLI Tools

> Goal: Identify the CLI to convert

1. Look at the list from `/check-my-global-cli` or ask the user
2. If there's no report, run `/check-my-global-cli` to list what's installed
3. Select 1-3 tools per round — if more, run `/create-plan-in-dot-agents`
4. Check version, installation path, and global availability

### 2. Explore Commands

> Goal: Learn each tool's command structure

1. Run `/learn` (cli) with each tool
2. Run `<tool> --help` and `<tool> <command> --help`
3. Record:
   - command and subcommand names
   - frequently used flags/options
   - input/output patterns, exit codes
   - examples of common usage

### 3. Evaluate Conversion Candidates

> Goal: Assess which commands are worth becoming skills

1. Use criteria:
   - Used often in the project or workflow
   - Has many flags/options that need guidelines
   - Complex to use or requires remembering the sequence of steps
   - Reusable in other workspaces
2. Score 1-5 for each command on each criterion
3. Total the scores and rank: High (≥14), Medium (9-13), Low (<9)
4. Group similar commands into one skill if the goal matches

### 4. Group And Prioritize

> Goal: Group commands by concern and priority

1. Split complex or very frequently used commands into their own skill
2. Combine create/delete/list of the same resource into one skill if appropriate
3. Identify low-priority commands that may not need a skill
4. Define skill names in the form `<tool>-<command>` or `<tool>-<purpose>`

### 5. Draft Skills

> Goal: Write a draft skill for the selected candidates

1. Use `/update-agents-skills-global` for each skill
2. In the draft, specify:
   - a meaningful `name`
   - `description` ≤100 characters
   - `triggers`, `allowed-tools`, `related`
   - `Goal`, `Scope`, `Execute`, `Rules`, `Expected Outcome`
3. Add `related` pointing to other skills in the same ecosystem
4. Run `/report table` to summarize the draft skills created, with columns: `No.`, `Skill`, `Command(s)`, `Priority`, `Notes`

### 6. Validate And Suggest

> Goal: Verify and present the next direction

1. Run `/deep-validate` to check frontmatter, references, and various conditions
2. Check that there are no duplicate skill names with `grep`
3. If the draft passes → run `/update-agents-skills-global` to commit or save the skills
4. If it needs adjusting → run `/check-my-global-cli` again or `/learn` (cli)
5. If there is a follow-up action from the previous idea → use `/follow-your-suggestion`
6. If there are no candidates → run `/suggest-next-action`

## Rules

### 1. Conversion Criteria

- Only create a skill for commands with a clear justification
- Don't duplicate existing skills — `grep` for similar names first
- One skill covers a command or group of commands with the same goal
- Don't create a skill for commands that complete in one line and have no important options

### 2. Naming And Semantics

- A skill name should reflect the real command, e.g. `<tool>-<command>` or `<tool>-<purpose>`
- Use the CLI's original flags/options in the instructions
- Preserve the CLI's exit codes and error handling
- Avoid generic names like `use-cli` or `my-cli`
- If a command is used across many workspaces, name it generically

### 3. Draft Quality

- Use Thai for the content
- Use backticks for `commands`, `tools`, `paths` and skill references
- No more than 250 lines per skill
- Specify `allowed-tools` according to the tools the command calls directly
- Use /deep-test cli if necessary
- Use /run-test if necessary


## Expected Outcome

- A list of CLI tools and commands that should be converted into skills with scores
- Groups of commands arranged into the same skill and priority
- Draft skills for High priority commands
- A summary table of commands, draft skill names, and next action
- Every draft passes `/deep-validate` and has no duplicate names
