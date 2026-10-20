---
name: idea-new-devin-global-skills
description: Generate ideas for new devin global skills or improvements — refactor, merge, rename, extract
argument-hint: "[scope]"
related:
  - idea-use-skills-relations
  - check-my-global-cli
  - deep-review-codebase
  - follow-devin-global-skills
  - rethink
  - report
  - follow-single-responsibility
  - review-devin-global-harness
  - deep-research
  - follow-math-concepts
  - update-devin-global-skills

---

## Goal

Generate ideas for new or improved devin global skills, so they are complete, non-redundant, and consistent with the current repo

## Scope

Use when you want to find ideas to improve the skills repo by analyzing duplicates, overlap, missing, outdated, structure, and global CLI conventions

## Execute

### 1. Analyze Current State

> Goal: Understand the current state of the skills repo

1. Run `/review-devin-global-harness` for quality conventions
2. Run `/check-skills-structure` to find broken references and structure gaps
3. Run `/scan-codebase` to find duplicated logic or overlapping skills
4. Run `/report-file-structure` to see the current structure
5. Run `/check-my-global-cli` to check installed CLI tools and find new skill ideas
6. Run `/follow-devin-global-skills` to check the conventions of global skills

### 2. Identify Opportunities

> Goal: Find points that should be improved

1. Find skills with similar names or that do the same work
2. Find skills that reference each other redundantly or circularly
3. Find skills with incomplete frontmatter or a description that's too long
4. Find skills that still force the old architecture without being conditional
5. Find skills that should be extracted into references/templates
6. If there's uncertainty about impact → use `/follow-math-concepts`

### 3. Generate Ideas

> Goal: Generate a list of ideas

1. Separate each idea per `/follow-single-responsibility`
2. Use `/report table` for the output format; columns: `No.`, `Idea`, `Category`, `Impact`, `Effort`, `Scope`
3. Divide into categories:
   - Merge/Remove
   - Rename
   - Extract references
   - Add missing skills
   - Update conventions
4. Specify references:
   - the related `/<skill-name>`
   - file/folder paths
   - URLs if necessary

### 4. Prioritize

> Goal: Rank the ideas

1. Use `/rethink` on each idea and answer keep/revise/replace/defer
2. Assess impact against effort
3. Rank by foundation → high impact → low risk
4. If there are many trade-offs → use `/follow-math-concepts`

### 5. Report

> Goal: Present the ideas

1. Run `/report table` with numbered main items + sub-bullets
2. Show `## Summary` first
3. Show `## Refactor Ideas` in priority order
4. If there is a follow-up action from the previous idea → use `/follow-your-suggestion`
5. Show the related `## References`
6. End with `## Next Action` pointing to `/update-devin-global-skills` or `/refactor`

## Rules

### 1. Single Responsibility Per Idea

- Each idea does one thing
- If you find multiple "and"s → split it up
- Don't combine implementation and idea in one item

### 2. Evidence Based

- Only cite real skills/files
- Use `/deep-research` if you need to find best practices
- Don't create references that don't exist

### 3. Backward Compatibility

- Rename or merge ideas must consider references
- Specify migration steps
- Use `/update-references` if you implement

### 4. Output Format

- Use numbered + bullet
- Include references: `/<skill-name>`, `references/<file>.md`, URLs
- No more than 250 lines

- Use `/follow-math-concepts` if necessary
- Use /deep-review-codebase if necessary


## Expected Outcome

- A list of ideas for the devin skills repo
- Each idea has a single responsibility, priority, impact
- References are complete
- Ready to hand off to `/refactor` or `/update-devin-global-skills`
