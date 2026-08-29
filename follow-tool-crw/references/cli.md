# CRW (fastCRW) CLI

## Install

```sh
# See https://crw.dev/ for install
# Common: curl install or package manager
```

## Version

- Latest: see https://crw.dev/
- Repository: https://github.com/us/crw
- Docs: https://github.com/us/crw

## Commands

| commands | default | options |
|---|---|---||---|---|---||---|---|---||
| `crw scrape <url>` | Scrape a URL to markdown stdout | `--format`, `-o`, `--js`, `--css`, `--xpath`, `--proxy`, `--stealth`, `--raw`, `--extract` |
| `crw crawl <url>` | Crawl a site to markdown/JSON | `-d, --depth`, `-l, --limit`, `--format`, `--js`, `--rate-limit`, `--concurrency`, `--timeout`, `--proxy`, `--stealth`, `--raw` |
| `crw extract <url>` | Extract structured data with JSON schema | `--extract @schema.json`, `-o`, `--llm-provider`, `--llm-key`, `--llm-model` |
| `crw --help` | Show help | (none) |

## Options

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

## Examples

```sh
crw scrape "https://example.com" -o page.md
crw crawl "https://docs.example.com" -d 2 -l 50 --format json
crw scrape "https://example.com" --extract @schema.json -o result.json
```
