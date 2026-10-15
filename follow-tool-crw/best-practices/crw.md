# fastCRW — Best Practices

Web scraping/crawling/search tool — scrape, map, crawl, extract discipline

## Recommended Patterns

- Pick the tool by job: `crw_scrape` = one page as clean markdown, `crw_map` = discover a site's URLs, `crw_crawl` = multiple pages by pattern, `crw_extract` = structured data from a schema
- Always `crw_map` first when the site structure is unknown — get the URL list, then scrape only what is needed
- Always bound `crw_crawl` with depth/limit/path filters — an unbounded crawl = wasted time + burned quota
- Use `crw_extract` with an explicit schema when you need specific fields — markdown scrape for human reading, extract for pipelines

## Common Pitfalls

- Respect robots.txt + rate limits — aggressive crawling = IP ban + ethical issue; use delays/low concurrency on small sites
- JS-heavy sites: a scrape may return an empty shell — check the output; if real rendering is required consider `/playwright`/`agent-browser`
- Paywalled/auth content — crw does not bypass auth; never try to scrape behind a login wall
- The output markdown strips boilerplate but not perfectly — verify before quoting; SPA pages may be missing content
- URLs must come from the user or discovery — never generate/guess URLs yourself

## Efficiency

- Batch: map once → filter URLs → parallel scrape ≤10/batch (per the `/deep-research` convention)
- Cache results in temp/files for large crawls — do not re-crawl within the same session
- Search-first workflow: `/crw` search → pick real URLs → scrape — never crawl a whole domain to find one page

## Do / Don't

| Do | Don't |
|----|-------|
| map → filter → targeted scrape | crawl the whole site unbounded |
| respect robots.txt + rate limits | hammer a site with fast concurrency |
| verify output before quoting | trust stripped markdown blindly |
| search first, then fetch | guess URLs from patterns |
