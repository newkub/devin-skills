# ctx CLI Reference

> Source: https://github.com/ctxrs/ctx/blob/main/docs/cli-reference.md (accessed 2026-10-22)

| command | description | options |
|---|---|---|
| `ctx setup` | create the data root, discover sources, build and publish the index | `--wait`, `--no-daemon`, `--format json`, `--progress plain\|json\|none`, `--quiet` |
| `ctx status` | index readiness, daemon health, usage markers | `--sample <seconds>`, `--usage enable\|disable\|reset`, `--format json` |
| `ctx doctor` | diagnostics for a broken index | `--format json` |
| `ctx stats` | retrieval, provenance, and delivery report | `--detail`, `--format json` |
| `ctx sources` | local provider roots that exist | `--format json` |
| `ctx import` | import provider history | `--all`, `--resume`, `--no-blame`, `--path`, `--format json` |
| `ctx index` | observe or drive indexing | `mode auto\|manual`, `watch`, `wait`, `--format json` |
| `ctx semantic` | semantic index lifecycle | `enable [--executor builtin\|<url>] [--wait]`, `status`, `disable` |
| `ctx daemon` | persistent index worker | `run`, `status` |
| `ctx search` | search indexed agent history | `--term`, `--file`, `--workspace`, `--provider`, `--since`, `--session`, `--exclude-session`, `--event-type`, `--content-scope`, `--backend`, `--scope`, `--refresh background\|wait\|off`, `--limit`, `--events`, `--primary-only`, `--include-current-session`, `--verbose`, `--format` |
| `ctx show event` | render one event hit | `--window <n>`, `--before <n>`, `--after <n>`, `--format text\|markdown\|json\|jsonl` |
| `ctx show session` | render one transcript | `--mode lite\|full\|log`, `--max-events <n>`, `--provider-session`, `--provider-key`, `--source-id`, `--out <file>`, `--format` |
| `ctx list events` | enumeration surface for scripts | `--content full\|text\|none`, `--since`, `--until`, `--direction`, `--limit`, `--format json\|jsonl` |
| `ctx locate` | source identity metadata | `event\|session <id>`, `--provider`, `--provider-session`, `--provider-key`, `--source-id`, `--format` |
| `ctx blame` | committed code to agent session | `file\|commit\|pr <target>`, `--type file\|commit\|pr`, `--lines <start>[:<end>]`, `--repository`, `--limit`, `--cursor`, `--format text\|json` |
| `ctx graph` | code relationships | `search\|callers\|impact <symbol>`, `stats`, `index .`, `update`, `--db <path>` |
| `ctx sift` | compact noisy output | `-- <program> <args...>`, `compact <file>`, `restore --encoding <encoding> <file>` |
| `ctx docs` | embedded docs | `show <topic>`, `search "<topic>"` |
| `ctx integrations` | context-skill and MCP lifecycle | `list`, install/remove for the ctx agent skill and MCP |
| `ctx mcp` | MCP server over stdio | `serve` |
| `ctx upgrade` | self-upgrade the CLI | |
| global flags | apply to every command | `--data-root <path>`, `--server <name>`, `--quiet` |
