# Format codeblock

## report-codeblock (merged content)

### Goal

Format code/text output (codeblocks, diffs, JSON, markdown) cleanly and readably

### Scope

Used for formatting:
- Code snippets with syntax highlighting
- Code diffs and changes
- JSON output for API responses and structured data
- Markdown documents for documentation and README

### Execute

#### 1. Format Code Blocks

> Goal: Format Code Blocks

1. Declare the programming language for syntax highlighting
2. Use correct language tags (`typescript`, `python`, `rust`, etc.)
3. Use proper indentation (2 or 4 spaces)
4. Add comments for complex code

#### 2. Format Diffs

> Goal: Format Diffs

1. Use the standard unified diff format (`+`, `-`, context)
2. Group changes by file
3. Add file paths and change statistics (additions, deletions)
4. Use context lines for readability

#### 3. Format JSON

> Goal: Format JSON

1. Use pretty print with 2-space indentation
2. Use consistent naming conventions (`camelCase` or `snake_case`)
3. Use `null` instead of undefined or empty strings
4. Add metadata: `timestamp`, `version`, `status`

#### 4. Format Markdown

> Goal: Format Markdown

1. Use the heading hierarchy (H1-H6) appropriately
2. Use H1 for the document title (only once)
3. Use H2-H3 for main sections, H4-H6 for subsections
4. Do not skip heading levels

#### 5. Add Metadata

> Goal: Add Metadata

1. Add the filename or path above the code block
2. Add line numbers if needed
3. Add the commit hash for diffs
4. Add a timestamp for JSON output

#### 6. Highlight Key Parts

> Goal: Highlight Key Parts

1. Use bold for important keywords
2. Use comments for explanations in code
3. Use markers for function/class changes in diffs
4. Use inline annotations when needed

### Rules

#### Report UX/UI

> Goal: Reports read easily, summarize key findings on top, and lead to action

1. Summarize key findings on top before details
2. Use `/report table` for multi-column comparison tables
3. Use `/report-progress` for status/progress/logs reports
4. Use the "No." column first, numbered 1, 2, 3, ... with clear headers, grouped/ordered by importance
5. Use symbols ✅ ❌ ⚠️ for status indicators
6. Always end with `/suggest-next-action`

#### Code Formatting

- Use correct standard language tags
- Use consistent indentation through the code block
- Use consistent code style
- Use plain text when no suitable language exists

#### Diff Format

- Use the standard unified diff format
- Use consistent markers for additions/deletions
- Use sufficient context for readability
- State the change type (added, modified, deleted)

#### JSON Format

- Use consistent naming conventions throughout the JSON
- Order fields by importance
- Use nested objects for related data
- Check there are no circular references

#### Markdown Format

- Use bold for keywords, italic for emphasis
- Use code blocks with language tags
- Use backticks for inline code
- Use descriptive link text and alt text

### Expected Outcome

- Code blocks with correct syntax highlighting
- Clear readable diffs
- Valid consistent JSON output
- Readable well-structured markdown documents
- Report readable with key findings on top
- Clear next action
