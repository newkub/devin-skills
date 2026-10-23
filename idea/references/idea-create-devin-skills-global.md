# idea-create-devin-skills-global (merged content)

## Goal

Recommend related devin global skills that should be used next from the current context, and generate ideas for new skills that should exist

## Scope

Use after analyzing or working with any skill, task, file, or project to analyze and recommend other skills that should be used together

## Execute

### 1. Analyze Current Context

> Goal: Analyze Current Context

Analyze the current context to understand the purpose and input

1. If it's a skill → read the frontmatter, `name`, `description`, `Goal`, `Scope` of `SKILL.md`
2. If it's a task, file, or project → read the relevant files and identify requirements, patterns, technologies
3. Identify the `related` skills that already exist
4. Analyze the `Execute` steps, `Rules`, or requirements to understand the usage
5. Identify the skill category (`analysis`, `implementation`, `quality`, `deployment`, `maintenance`, `idea`)

### 2. List Available Skills

> Goal: List Available Skills

Gather all existing devin global skills

1. Read all `SKILL.md` files in `%APPDATA%\devin\skills\`
2. Look at the `name` and `description` of each skill
3. Group by category (`analysis`, `implementation`, `quality`, `deployment`, `maintenance`, `idea`)
4. Check that you don't recommend a skill that's already in `related`

### 3. Match Related Skills

> Goal: Match Related Skills

Match skills that are related to the current context

1. Analyze the relevance from `Goal`, `Scope`, and `Execute`
2. Rank the relevance: `direct dependency`, `complementary`, `follow-up`, `alternative`
3. Check that the recommended skills actually exist in `%APPDATA%\devin\skills\`
4. Filter out irrelevant skills

### 4. Suggest Skills And New Ideas

> Goal: Suggest Skills And New Ideas

Recommend skills with reasons and new ideas

1. Recommend existing skills as a list with reasons why they should be used
2. Specify the relevance type in parentheses (`direct dependency`, `complementary`, `follow-up`, `alternative`)
3. Specify usage conditions such as "use when..." or "use after..."
4. Analyze gaps and propose ideas for new skills that should be created
5. If the current context involves a CLI or tools → recommend `/idea-convert-my-global-cli-to-skills`
6. Rank from most relevant to least relevant

### 5. Update Related Skills

> Goal: Update Related Skills

Update the `related` in the current skill (if any)

1. If the context is a skill → add the recommended skills into the `related` of `SKILL.md`
2. Check that it doesn't duplicate what already exists
3. Run `/update-references` to update references in other relevant files

## Rules

### 1. Relevance Analysis

- Analyze from `Goal`, `Scope`, and `Execute`, not just `name` or `description`
- Consider both the input and output of the context
- Check that the skills can actually be used together
- Don't recommend a skill that does redundant work

### 2. Suggestion Format

- Specify the skill name with backticks, e.g. `skill-name`
- Give a short, concise reason
- Specify the relevance type in parentheses
- For new ideas, specify the proposed skill name and rationale
- Rank from most to least

### 3. Validation

- Check that the recommended skills actually exist
- Check that you don't recommend the skill itself
- Check that it doesn't duplicate the existing `related`
- Run `/check-reference` to confirm the references exist

### 4. Cross-Reference Update

- Update `related` in both files (current and suggested)
- Use `/update-references` for the update
- Check that you don't add a reference in an irrelevant file

- Use /idea-features if necessary
- Use /update-agents-skills-global if necessary

## Expected Outcome

- Related devin global skills are recommended with clear reasons
- Ideas for new skills that should be created are identified with rationale
- `related` in the frontmatter is fully updated
- The connections between skills are clearer
- Fewer skills that should be used together are missed
