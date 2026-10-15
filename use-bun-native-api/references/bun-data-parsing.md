# Bun Data Parsing APIs

| API | Description |
|-----|-------------|
| `Bun.JSON5.parse()` / `.stringify()` | JSON5 (comments, trailing commas, unquoted keys) |
| `Bun.JSONL.parseStream()` / `.stringify()` | Line-delimited JSON streaming |
| `Bun.TOML.parse()` / `.decode()` / `.encode()` | TOML parsing and serialization |
| `Bun.YAML.parse()` / `.stringify()` | YAML parsing and serialization |
| `Bun.XML.parse()` | XML parsing |
| `Bun.markdown` | Built-in Markdown parser/renderer (CommonMark+GFM; `.html()`/`.render()`/`.react()`/`.ansi()` — HTML output is not sanitized) |
| `Bun.color()` | Color parsing and conversion (RGB, HSL, HEX, CSS names) |
| `Bun.Cookie` / `Bun.CookieMap` | HTTP cookie parsing and serialization |
