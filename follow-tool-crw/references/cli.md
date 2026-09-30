| key | value |
|---|---|
| repository | https://github.com/us/crw |
| docs | https://github.com/us/crw |

| commands | description | default | options |
|---|---|---|---|
| `crw scrape <url>` | Scrape a URL to markdown stdout | — | `--format`, `-o`, `--js`, `--css`, `--xpath`, `--proxy`, `--stealth`, `--raw`, `--extract` |
| `crw crawl <url>` | Crawl a site to markdown/JSON | — | `-d, --depth`, `-l, --limit`, `--format`, `--js`, `--rate-limit`, `--concurrency`, `--timeout`, `--proxy`, `--stealth`, `--raw` |
| `crw extract <url>` | Extract structured data with JSON schema | — | `--extract @schema.json`, `-o`, `--llm-provider`, `--llm-key`, `--llm-model` |
| `crw --help` | Show help | — | (none) |

| Option | Description |
|---|---|---||---|---|---||
| `--format` | Output: `markdown`, `html`, `rawhtml`, `text`, `links`, `json` |
| `-o, --output` | Save to file |
| `--js` | Force JS rendering |
| `--css` / `--xpath` | Keep/drop selectors |
| `--proxy` | Proxy URL |
| `--stealth` | Stealth mode |
| `--raw` | Disable nav/footer stripping |
| `--extract` | JSON schema for extraction |
