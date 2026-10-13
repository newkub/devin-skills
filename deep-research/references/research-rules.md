# Deep Research Rules

## 1. When To Use Deep Research

Use deep research when:

- Comparing libraries, frameworks, or tools
- Needing best practices from multiple sources
- Verifying compatibility and version requirements
- Needing more depth than a single source can provide
- The result affects an important decision

## 2. When Not To Use Deep Research

Do not use deep research when:

- Just reading docs for one library (use `/follow-best-practice`)
- Just needing to learn a concept quickly (use `/learn` (web))
- Only verifying a single reference (use `/check-reference`)
- A low-risk case that needs no deep information
- Searching would take longer than just doing it

## 3. Source Selection

Prefer multiple sources for accuracy:

- Use `NPM Registry` for package information
- Use `GitHub` + `GitHub MCP` for repositories and code
- Use `DeepWiki` for GitHub repositories
- Use `Context7` for library documentation
- Use `CRW` to crawl official documentation
- Use `Windsurf WebSearch` for web search and sources without an MCP

## 4. Credibility Check

Check the credibility of sources:

- Check source reputation and benchmark scores
- Check download counts and maintenance
- Check stars, forks, and issues on GitHub
- Filter results from credible sources
- Compare data from multiple sources

## 5. AI Documentation Tools

Use AI documentation tools effectively:

- Use DeepWiki (`mcp3_ask_question`, `mcp3_read_wiki_contents`, `mcp3_read_wiki_structure`) for GitHub repositories
- Use Context7 (`context7_resolve-library-id`, `context7_get-library-docs`) for library documentation
- Use GitHub MCP (`mcp7_search_code`, `mcp7_search_repositories`) for code search
- Ask specific questions instead of reading everything

## 6. CRW For Official Documentation

Use CRW to crawl official documentation effectively:

- Use `crw map <domain>` to discover all URLs from the official site
- Use `crw crawl <domain> --depth <n>` to crawl and read every page
- Use `--format markdown` for LLM-friendly output
- Use `--output <file>` to save the results
- Follow `/follow-tool-crw` to get the most out of CRW

## 7. Windsurf WebSearch Usage

Use Windsurf WebSearch effectively:

- Use `search_web` for general web search
- Use `read_url_content` to read content from official documentation URLs
- Use `view_content_chunk` for large documents
- Use it for sources without MCP integration

## 8. Information Freshness

Check dates and recency of information, prioritizing the most recent year:

- Search for the most recent year across all sources before using the data
- Use `search_web` with queries that include the current year, e.g. `<topic> 2026`
- Compare publish dates and release dates from NPM, GitHub, and official docs
- Check version compatibility against the latest year
- Make the most recent data your primary source
- Track updates from major sources

## 9. Time Budget

- For small research, spend no more than 5 minutes (2-3 sources)
- For medium research, spend no more than 15 minutes (3-5 sources)
- For large research, take as long as needed but still produce a summary
- If research runs too long, use `/ask-me` to get scope from the user

## 10. Integration With Other Workflows

Connect with other workflows:

- Run `/deep-thinking` before research to review the scope
- Run `/learn` (web) for quick learning
- Run `/follow-best-practice` after research to apply what you found
- Run `/follow-tool-crw` to get the most out of CRW
- Run `/check-reference` to verify the references you found
- Run `/ask-me` if the research is still unclear
