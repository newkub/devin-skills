| key | value |
|---|---|
| repository | https://github.com/biomejs/biome |
| docs | https://biomejs.dev/reference/gritql/ |

| api | description | default | options |
|---|---|---|---|
| `` `pattern($x)` `` | Code snippet pattern | - | metavariables `$name` |
| `where <cond>` | Filter matches | - | `<`, `contains`, `within` |
| `language js(ts,jsx)` | Target language | - | `css`, `json`, `html` |
| `engine biome(1.0)` | Bind to Biome AST nodes | - | node names เช่น `JsIfStatement` |
| `biome search '<pattern>'` | Run pattern over project | src | --stdin-file-path |
