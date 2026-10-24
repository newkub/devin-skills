| key | value |
|---|---|
| install | `bun add -D @stryker-mutator/core` |
| version | 10.0.0 (verified 2026-10-23) |
| node | >= 22 |
| package registry | https://www.npmjs.com/package/@stryker-mutator/core |
| repository | https://github.com/stryker-mutator/stryker-js |
| docs | https://stryker-mutator.io/docs/stryker-js/ |

| runner plugin | test runner |
|---|---|
| `@stryker-mutator/vitest-runner` | vitest |
| `@stryker-mutator/jest-runner` | jest |
| `@stryker-mutator/mocha-runner` | mocha (v12) |
| `@stryker-mutator/karma-runner` | karma |
| `@stryker-mutator/typescript-checker` | TypeScript type check (TS 7 support is experimental) |

| config key | value | note |
|---|---|---|
| `testRunner` | `"vitest"`, `"jest"`, `"mocha"`, ... | must match the installed runner plugin |
| `mutate` | glob array, e.g. `["src/**/*.ts", "!src/**/*.test.ts"]` | explicit; never include tests or generated code |
| `ignorePatterns` | glob array | excluded from the sandbox copy |
| `coverageAnalysis` | `"perTest"` \| `"all"` \| `"off"` | `perTest` is the efficient default |
| `reporters` | `["html", "clear-text", "progress"]` + `"dashboard"` | `dashboard` needs a project/stage config |
| `thresholds` | `{ high, low, break }` | run fails when the score drops below `break` |
| `incremental` | `true` \| `false` | reuse `reports/stryker-incremental.json` |
| `mutators` | array of mutator names | e.g. `empty-expression-mutator` |
| `mutator.excludedMutations` | map of mutator → group names | project-wide suppression |
| `timeoutMS` / `timeoutFactor` | number | per-mutant kill timeout |
| `concurrency` | number or percentage | parallel workers |
| `checkers` | `["typescript"]` | requires the typescript-checker plugin |
| `plugins` | module paths | custom mutators/reporters/checkers |
| `ignoreStatic` | boolean | skip static mutants (slower to prove) |

| plugin config | value |
|---|---|
| `tsconfigFile` | path to `tsconfig.json` used by the checker |
| `dashboard.project` | `github.com/<owner>/<repo>` |
| `dashboard.version` | branch or tag reported to the dashboard |
| `dashboard.module` | optional module name for monorepos |

| mutator groups | meaning |
|---|---|
| `ArithmeticOperator` | `+` → `-`, `*` → `/` |
| `ArrayDeclaration` | empty an array literal |
| `BlockStatement` | empty a block |
| `BooleanLiteral` | flip `true`/`false` |
| `ConditionalExpression` | invert a ternary branch |
| `EqualityOperator` | `===` → `!==`, `<` → `<=` |
| `LogicalOperator` | `&&` ↔ `\|\|` |
| `ObjectLiteral` | empty an object literal |
| `OptionalChaining` | remove `?.` |
| `StringLiteral` | empty a string |
| `UnaryOperator` | flip `-`/`+`/`!` |

`empty-expression-mutator` is a v10 addition: it replaces an expression with nothing, which reveals code whose only effect is a value nobody asserts on.
