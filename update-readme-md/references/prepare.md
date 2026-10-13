# Step: Prepare

> Goal: Gather information before writing the README

## Execute

1. Run `/check-should-update` to check git changes first — if there are no changes → skip and report
2. Run `/run-release` if there is a release tag (auto-generates CHANGELOG.md)
3. Read `package.json` to determine the project type: `cli-sdk` or `app`
4. Check whether `CHANGELOG.md` exists — use it to set the status (`in development` or `active`)
5. Check whether `CONTRIBUTING.md` exists — determines whether there is a `## Contributing` section
6. Check whether `LICENSE.md` exists — determines whether there is a `## License` section
7. If `package.json` cannot be read → stop and report

## Output

- Project type (`cli-sdk` or `app`)
- Status (`in development` or `active`)
- Has `CONTRIBUTING.md` (boolean)
- Has `LICENSE.md` (boolean)
- Has `CHANGELOG.md` (boolean)

