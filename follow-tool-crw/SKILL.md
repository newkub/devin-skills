---
name: follow-tool-crw
description: Guidelines for using CRW (fastCRW) for web scraping, crawling, search and serving
argument-hint: "[scope]"
related:
  - use-agent-browser
  - use-astgrep
  - follow-tool-aube
  - follow-tool-usage
  - follow-best-practice
  - setup-cicd

---

## Goal

Use CRW (fastCRW) for web scraping, crawling, search and serving at maximum efficiency and speed while reducing AI tokens

## Scope

Use `follow-tool-crw` for the tasks and workflows it covers (tool crw)

- Boundary: use `crw` when you need batch or structured scrape/crawl/search/map output to cut AI tokens — for interactive browser sessions (click, form, login) use `/use-agent-browser` instead; for a simple single-page fetch the built-in webfetch is fine
- For web search/scrape with crw see `references/apis.md`

- Latest: `crw-mcp@0.36.0` / `crw` CLI v0.36.0 (verified 2026-09-24)
- Install: `curl -fsSL https://fastcrw.com/install | sh` · `brew install us/crw/crw` · `cargo install crw-cli` · `bunx crw-mcp` (MCP only) · `docker run ghcr.io/us/crw`
- References: [apis](references/apis.md) | [cli](references/cli.md) 
## Execute

### 1. Web Search

> Goal: use `crw search` for web search via SearXNG

Use `crw search` for web search via SearXNG:

```bash
crw search "query"
crw search "rust web scraper" --format json
crw search "query" --json --fields title,url,snippet --limit 3
```

Key options:
- `--json` - shorthand for `--format json`
- `--fields <LIST>` - project only the given fields (title, url, description, snippet, position, score, category) to cut tokens
- `--limit <N>` - limit the number of results (default 5, max 20)
- `crw setup` must run before the first use of search (self-hosted needs no key; hosted uses `CRW_API_KEY`)

Best for:
- Searching many sources at once
- Needing structured results (JSON)
- Reducing AI tokens by using a search engine instead of AI generation

### 2. URL Scraping

> Goal: use `crw scrape` or the default mode to scrape a single URL

```bash
crw example.com
crw scrape example.com --format json
crw example.com --format markdown --output result.md
```

Key options:
- `--format markdown|json|html|rawhtml|text|links` - pick the output format
- `--output <FILE>` - write to a file instead of stdout
- `--raw` - disable main content extraction (return the full page)
- `--js` - enable JavaScript rendering
- `--css <SELECTOR>` - extract only the matching elements
- `--xpath <EXPR>` - extract only the elements matching the XPath

Best for:
- Pulling content from a single URL
- Needing a specific format (markdown, json, etc.)
- Extracting only the needed parts with CSS/XPath

### 3. Website Crawling

> Goal: use `crw crawl` for BFS website crawling

```bash
crw crawl example.com --depth 3
crw crawl example.com --depth 2 --format json
```

Best for:
- Crawling an entire site with BFS
- Needing content from multiple pages
- A clearly bounded depth

### 4. URL Discovery

> Goal: use `crw map` to discover URLs on a website

Use `crw map` to discover URLs on a website:

```bash
crw map example.com
crw map example.com --format json
```

Best for:
- Discovering URLs via sitemap and crawling
- Needing the full URL list
- Analyzing site structure

### 5. Structured Data Extraction

> Goal: use `--extract` with a JSON Schema to extract structured data

```bash
crw example.com --extract '{"type": "object", "properties": {"title": {"type": "string"}}}'
crw example.com --extract @schema.json
```

Best for:
- Extracting structured data
- Reducing AI tokens with schema validation
- Needing consistent data

### 6. AI Summary

> Goal: use `--summary` or `--prompt` to generate an AI summary

```bash
crw example.com --summary
crw example.com --summary --prompt "in 3 bullet points"
```

LLM options:
- `--llm-provider <NAME>` - override the LLM provider (anthropic, openai, deepseek, azure, openrouter)
- `--llm-key <KEY>` - override the LLM API key
- `--llm-model <MODEL>` - override the LLM model
- `--llm-base-url <URL>` - override the LLM base URL

Best for:
- Automatic summary generation
- Needing formatted output
- Using an already-configured LLM

### 7. MCP Server

> Goal: use `crw mcp` to start the MCP server

Use `crw mcp` to start the MCP server:

```bash
crw mcp
```

Environment variables:
- `CRW_BROWSER_PATH` - path to a browser executable (Chrome/Edge) for JS rendering
- Example: `C:\Program Files\Google\Chrome\Application\chrome.exe`
- `CRW_API_URL` - proxy mode: forward tool calls to a remote CRW server (cloud or self-hosted)
- `CRW_API_KEY` - API key for hosted fastcrw.com

MCP tools: `crw_scrape`, `crw_search`, `crw_crawl`, `crw_map`, `crw_extract`, `crw_parse_file` (PDF/file — has no CLI verb), `crw_check_crawl_status`

Best for:
- Integration with MCP-compatible tools
- Serving as an MCP server for AI agents
- Real-time web access via MCP
- JavaScript rendering for SPA/React/Vue/Angular sites
- Parsing PDF/files via `crw_parse_file` or the REST `/v2/parse`

### 8. Browser Automation

> Goal: use `crw browse` for the browser automation MCP

```bash
crw browse
```

Best for:
- Browser automation through MCP
- Needing advanced JavaScript rendering
- Interactive web testing

### 9. REST API Server

> Goal: use `crw serve` to start a REST API server (Firecrawl-compatible)

```bash
crw serve --port 3000
```

Best for:
- Integration with existing systems
- A Firecrawl-compatible API
- Serving over an HTTP endpoint

## Rules

### 1. Command Selection

Pick the command by use case:
- Search: `crw search` - for web search
- Scrape: `crw scrape` or `crw <url>` - for a single URL
- Crawl: `crw crawl` - for multiple pages
- Map: `crw map` - for URL discovery
- Extract: `--extract` - for structured data
- Summary: `--summary` - for an AI summary

### 2. Performance Optimization

- Use `--format json` for structured output and fewer AI tokens
- Use `--css` or `--xpath` to extract only the needed parts
- Avoid `--depth` values beyond necessity in crawl mode
- Use `--output` to write to a file instead of stdout

### 3. Token Reduction

- Use `crw search` instead of AI generation for web search
- Use `--extract` with a JSON Schema instead of AI parsing
- Use `--format markdown` for direct LLM consumption
- Use `--prompt` to style the AI summary and reduce iteration

### 4. Format Selection

Pick the format by use case:
- markdown: for LLM consumption and documentation
- json: for structured data and programmatic access
- html: for web rendering
- rawhtml: for full HTML content
- text: for plain text
- links: for URL extraction

- Use /use-agent-browser if needed
- Use /use-astgrep if needed
- Use /follow-tool-aube if needed
- Use /follow-tool-usage if needed
- Use /follow-best-practice if needed
- Use /setup-cicd if needed

- See best-practices/ for recommended patterns and pitfalls

## Expected Outcome

- CRW used at maximum effectiveness
- AI tokens reduced with the right commands
- Formats and options chosen per use case
- Smooth integration with MCP and the REST API

