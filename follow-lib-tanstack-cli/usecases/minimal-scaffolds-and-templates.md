# Use Case — Choose a Blank, Router-Only, or Template Baseline

> Pick the smallest scaffold the spec supports, or ship a repeatable one as a template. Source: https://tanstack.com/cli/latest/docs/templates (accessed 2026-10-20)

## 1. Pick the baseline

| Need | Baseline | What you get |
|------|----------|--------------|
| smallest runnable Start app | `--blank` | one route, no starter UI, examples, Tailwind, devtools, test stack, or Intent setup |
| SPA with file-based routing only | `--router-only` | Router without Start; add-ons, deployment, and templates disabled |
| something to click through | default | Start with starter UI, examples, and the full toolchain |
| the same shape on every new repo | custom template | your source files plus declared add-on dependencies |

Start from the smallest baseline that can host the spec. The starter UI and unused add-ons are code you have to delete before the first real feature.

## 2. Create a blank Start app

```bash
bunx @tanstack/cli create my-service --blank -y
```

`--blank` still creates a valid TanStack Start project; explicit add-ons and a deployment adapter can add their own files and dependencies on top:

```bash
bunx @tanstack/cli create my-service --blank --deployment cloudflare -y
```

Pass `--intent` when the project should include local skill mappings for coding agents — `--blank` omits TanStack Intent setup by default.

## 3. Create a router-only SPA

```bash
bunx @tanstack/cli create my-spa --router-only --toolchain eslint --no-examples -y
```

`--router-only` disables add-ons, deployment, and templates. Passing any of those together with it is ignored or rejected, so wire libraries manually in a router-only app or drop `--router-only`.

## 4. Create from a template

```bash
bunx @tanstack/cli create my-app --template ecommerce
bunx @tanstack/cli create my-app --template ./template.json
bunx @tanstack/cli create my-app --template https://example.com/template.json
```

`--template` accepts a built-in id, a local path, or a URL. Combine it with `--no-install` and `--target-dir` when a CI job generates into a prepared workspace.

## 5. Author and maintain a template

```bash
# 1. Build the project shape you want once
bunx @tanstack/cli create my-template --add-ons clerk,drizzle,sentry -y

cd my-template
# 2. Write template metadata
bunx @tanstack/cli template init

# 3. Edit template-info.json, then compile the distributable file
bunx @tanstack/cli template compile
```

`template init` creates `template-info.json` and `template.json`; `compile` regenerates `template.json` from the source project. Re-run `compile` after every source change, then publish the file to the URL your team uses. Use immutable or versioned URLs in production so a scaffold cannot change under a build.

## 6. Verify the baseline

1. `/run-dev` — the app boots with the routes the baseline implies
2. `/run-typecheck` — an untouched `--blank` or `--router-only` app is green
3. For a template: scaffold into a clean directory and confirm add-on dependencies arrive
4. Commit the untouched baseline before customizing

## Verify

- The chosen baseline has no UI, add-on, or toolchain you did not ask for
- `--router-only` output has no SSR entry or server functions
- A template scaffold reproduces the source project's add-ons and files
- `template.json` was recompiled after the last source change

## Pitfalls

- Passing `--add-ons`, `--deployment`, or `--template` with `--router-only`, which disables them.
- Expecting `--blank` to include Tailwind or the test stack; both are omitted by design.
- Forgetting `--intent` on a blank project that agents will work in.
- Hand-editing `template.json`; it is compiled output and the next `template compile` overwrites it.
- Publishing a template from a dirty source project, so every scaffold inherits debug leftovers.
- Pointing `--template` at a directory instead of the compiled file or its URL.

## Related

- `references/cli.md`
- `best-practices/tanstack-cli.md`
- `usecases/scaffold-with-add-ons.md`
- `usecases/audit-generated-project.md`
