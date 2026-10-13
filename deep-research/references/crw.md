# CRW For Official Docs

## Goal

Use CRW to crawl official documentation

## Steps

1. Use `crw map <domain>` to discover all URLs from the official site
2. Use `crw crawl <domain> --depth <n>` to crawl and read every page
3. Use `--format markdown` for output that is easy for an LLM to read
4. Use `--output <file>` to save the result
5. Follow `/follow-tool-crw` to get the most out of CRW
