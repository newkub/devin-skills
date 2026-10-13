---
name: use-related-skills
description: Find related skills and propose new skill ideas
argument-hint: "[skill-name]"
related:
  - idea-use-skills-relations
  - list-devin
  - scan-codebase
  - check-reference
  - update-references
  - deep-review
  - report

---

## Goal

Recommend related devin global skills to use after the current skill, and propose new skills worth creating

## Scope

Use after writing or editing a `SKILL.md`, to analyze and recommend other skills that should be used together

## Execute

### 1. Analyze Current Skill

> Goal: Understand the current skill

1. Read the current skill's frontmatter, `name`, `description`, `Goal`, `Scope`
2. Identify the existing `related` skills
3. Analyze the `Execute` steps and `Rules` to understand how it is used
4. Determine the skill category (`analysis`, `implementation`, `quality`, `deployment`, `maintenance`, `idea`)

### 2. List Available Skills

> Goal: Know all available skills

1. Run `/list-devin-global-skills` or `/scan-codebase`
2. Review each skill's `name` and `description`
3. Group them by category
4. Ensure no skill already listed in `related` gets recommended

### 3. Match Related Skills

> Goal: Match related skills

1. Analyze relevance from `Goal`, `Scope`, and `Execute`
2. Rank the relevance: `direct dependency`, `complementary`, `follow-up`, `alternative`
3. Verify that the recommended skills actually exist
4. Filter out unrelated skills

### 4. Suggest Skills And New Ideas

> Goal: Suggest new skills and existing skills

1. Recommend existing skills as a list with reasons and relation types
2. State usage conditions such as "use when..." or "use after..."
3. Analyze gaps and propose new skill ideas worth creating
4. If the current skill relates to a CLI or tools → recommend `/idea-convert-my-global-cli-to-skills`
5. Analyze reverse usage — which skills should invoke this one — per the merged capabilities
6. Use `/report` to present the results

### 5. Update Related Skills

> Goal: Update `related` in the current skill

1. Add the recommended skills to `related`
2. Check that nothing is duplicated
3. Run `/update-references` to sync
4. Run `/check-reference` to verify

## Rules

### 1. Relevance Analysis

- Analyze from `Goal`, `Scope`, and `Execute`, not just `name` or `description`
- Consider both the skill's input and output
- Verify that the skills can genuinely be used together
- Do not recommend a skill that duplicates an existing role

### 2. Suggestion Format

- Give skill names in backticks such as `skill-name`
- Give a brief, to-the-point reason
- State the relation type in parentheses
- For new ideas, give the proposed skill name and rationale
- Rank from most to least relevant

### 3. Validation

- Verify that the recommended skills actually exist
- Verify that the skill itself is not recommended
- Verify there is no duplication with the existing `related`
- Run `/check-reference` to verify

### 4. Cross-Reference Update

- Update `related` in both files (current and suggested)
- Use `/update-references` for the updates
- Verify that no reference is added to an unrelated file

- Use /deep-review if needed
- When writing invocations of other skills in `SKILL.md` → see `update-devin-global-skills` (`## Conventions → Invoke Skills`)

## Expected Outcome

- Related Devin global skills are recommended with clear reasons
- New skill ideas worth creating are identified with rationale
- `related` in the frontmatter is fully updated
- The connections between skills are clearer
- `/report` is used to present the analysis results

- To pick and invoke another skill for a task, see `references/in-another-skills.md`
