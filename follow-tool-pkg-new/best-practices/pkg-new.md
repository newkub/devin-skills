# pkg.pr.new — Best Practices

Continuous preview releases — install PR builds without publishing to the real registry

## Recommended Patterns

- GitHub Action: the `pkg.pr.new` workflow publishes every commit/PR as an installable preview URL — `npm i https://pkg.pr.new/...`
- Use for PR review testing — reviewers install the preview build without checking out and building themselves
- Template comments on the PR with install URLs — the action does this automatically when configured
- `--compact`/`--binary` flags per repo needs; monorepos use `--pnpm`/workspace support
- Pair with conventional commits/changesets — preview versions stay meaningful

## Common Pitfalls

- Preview URLs are ephemeral — never use them as real deps in package.json; revert after experimenting
- Private repos: pkg.pr.new needs org/subscription access — verify the access model before relying on it
- Builds must be deterministic: a preview publishes the real build — make builds reproducible before enabling
- Secrets: the workflow needs a token — use GITHUB_TOKEN/minimal permissions
- Don't publish previews for every commit in a big monorepo — scope with paths filters

## Workflow

- Reviewer flow: open PR → comment carries the install URL → `bun add <url>` → test → feedback
- CI: the pkg.pr.new job runs after the build passes — a failed build means no preview
- Cleanup: previews expire on their own — nothing to manage

## Do / Don't

| Do | Don't |
|----|-------|
| Preview builds for PR testing | Pinning preview URLs in package.json |
| Auto-comment install links | Manual "checkout to test" instructions |
| Scope publishing with paths | Publishing every commit in every workspace |
| Verify build determinism | Publishing broken builds as previews |
