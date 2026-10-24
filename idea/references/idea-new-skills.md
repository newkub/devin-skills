# idea-new-skills (merged content)

## Goal

Generate concrete ideas for new Devin skills by analyzing gaps in the existing skill set, user workflows, and common tasks

## Scope

Use when the user wants ideas for a new skill, notices that some workflow is missing, or asks "should there be a skill for X?" The output is an ordered list of skill proposals with name, description, and trigger

See also: /review-dot-agents-global-and-fix, /update-agents-skills-global, /search-skills

## Execute

### 1. Identify Context

> Goal: Identify context

1. Take the topic or general gap from the argument or context, optionally
2. If there's no topic, ask the user which kind of work is still missing a skill
3. Examples: terminal tools, git workflows, report skills, deployment, IDE integration
4. Record the topic in `todo_write`

### 2. Scan Existing Skills

> Goal: Survey the existing skills

1. List all skills in `%APPDATA%\devin\skills`
2. Use `find_file_by_name` to find skills related to the topic
3. Use `grep` to find existing skills that may already cover the idea
4. Identify gaps: common work with no dedicated skill, skills that are too broad, or workflows that are still missing

### 3. Analyze Workflows

> Goal: Analyze workflows

1. Run `/scan-codebase` if the idea relates to a project
2. Look at the user's recent commands and session history, if any
3. Identify patterns or work the user repeats manually
4. Check `AGENTS.md` and `global_rules.md` to find workflow gaps

### 4. Generate Ideas

> Goal: Generate ideas

1. Use `/deep-thinking` to brainstorm the concept of the skills
2. For each idea, define:
   - `name` in kebab-case
   - `description` no more than 100 characters
   - `trigger` for when the skill should run
   - `related` skills
   - the main steps in `Execute` (no more than 6-8 steps)
3. Avoid duplication with existing skills
4. Prioritize the ideas by impact and effort

### 5. Present Ideas

> Goal: Present the ideas

1. Show the list of skill proposals as a 2-column table:
   - `New skill`: name, description, and trigger
   - `Skills to use`: the list of existing skills this new skill should integrate with
2. Group the ideas by category (terminal, git, report, review, deploy, etc.)
3. Specify impact and effort for each idea
4. Ask the user which idea(s) they want to implement

### 6. Create Selected Skills

> Goal: Create the selected skills

1. For each selected idea, call `/new-skills` or `/update-agents-skills-global`
2. Let the user customize the skill before creating
3. Verify each skill with `/deep-validate`
4. Update references with `/update-references`

## Rules

### 1. No Duplicates

- Check existing skills before proposing a new skill
- If a similar skill already exists, propose extending that skill instead
- Use `/update-agents-skills-global` (`## Conventions → Related Skills`) when you find overlap

### 2. Concrete And Focused

- Each idea must have a clear name, description, and trigger
- The description must not exceed 100 characters
- An idea should solve a single workflow problem, not every problem

### 3. User-Driven

- Ask the user before creating skills
- Let the user order or reject ideas
- Never create skills without confirmation

### 4. Align With Standards

- New skill ideas must follow the conventions of general skills
- Choose the prefix `follow-*`, `check-*`, `report-*`, `run-*`, `review-*`, or `view-*` when appropriate
- Avoid generic names like `helper` or `tool`

### 5. Evidence-Based

- Base ideas on real gaps, repeated work, or user requests
- Never create a skill that doesn't solve a real workflow problem

## Expected Outcome

- An ordered list of new skill ideas with name, description, trigger, and related skills
- The selected skills are created and verified
- No duplicate or overly broad skills are created
- The user gets a clear proposal before any files are written
