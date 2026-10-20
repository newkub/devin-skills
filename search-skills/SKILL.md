---

name: search-skills
description: Search skills efficiently with the `skills find <keyword>` command
argument-hint: "[keyword]"
related:
  - follow-best-practice
  - suggest-next-action
  - resolve-errors
  - follow-tool-crw

---

## Goal

Search for skills related to a keyword with the `skills find` command to find the right skills for the job

## Scope

Use `search` for the specific (skills) tasks and workflows it covers

## Execute

### 1. Define Search Keyword

> Goal: Define Search Keyword

Specify the keyword for searching skills

1. Specify the keyword to search for (e.g., framework, library, task, domain)
2. Consider related words and synonyms if needed
3. Define the scope of the search (specific or general)
4. If the query is a symptom/problem (e.g., "disk full", "build fail") → open [references/issue-map.md](references/issue-map.md) — symptom → skill table (merged from follow-skills-map)

### 2. Execute Skills Find

> Goal: Execute Skills Find

Search skills with the `skills find` command

1. Use `skills find <keyword>` to find skills matching the keyword
2. Analyze the results returned by the command
3. Record the skills found with details

### 3. Analyze Results

> Goal: Analyze Results

Analyze and group the skills found

1. Group skills by relevance to the keyword
2. Rate each skill's importance (high/medium/low)
3. Compare similar skills
4. Check whether the skills relate to the current task

### 4. Summarize Findings

> Goal: Summarize Findings

Summarize the results in table form

1. Build a summary table of the skills found
2. Split into Direct matches, Related skills, Recommended
3. Recommend the skills to use

## Rules

### 1. Search Strategy

Search strategy

- Use specific, clearly meaningful keywords
- Try synonyms or related words if no results are found
- Search both exact match and partial match
- Prioritize skills with official support

### 2. Result Evaluation

Result evaluation

- Check that the skills found match the need
- Look at description and supporting files to assess suitability
- Pick the skills most useful for the task
- Avoid redundant or unrelated skills

### 3. Result Format

Result presentation format

| Column | Description |
|--------|-------------|
| No. | Sequence number |
| Skill Name | Skill name |
| Match Type | Direct/Related/Recommended |
| Priority | Importance level |
| Description | Short description |

- Use /follow-best-practice if needed
- Use /suggest-next-action if needed
- Use /resolve-errors if needed
- Use /follow-tool-crw if needed
- Use /follow-tool-crw if needed
- Use /learn-from-web if needed

## Expected Outcome

- Summary table of all skills found, with sequence numbers
- List of recommended skills to use
- Guidance on choosing the most suitable skills