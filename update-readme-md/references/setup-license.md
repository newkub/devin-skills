# Step: Setup License

> Goal: Configure LICENSE.md and the package manifest license field for the root

## Execute

1. Check the existing `LICENSE.md` file and identify the current license type
2. Choose the license by project type per Rule `License Selection` — verify suitability with the business model and dependencies
3. Apply the standard template for the license type per Rule `License Templates And Manifest` — update the copyright holder name, verify correctness, and save `LICENSE.md`
4. Update the `license` field in `package.json` or `Cargo.toml` to match `LICENSE.md` using the correct SPDX identifier
5. If a workspace has no `LICENSE.md` → use the root one (don't duplicate it in the workspace)

## Rules

- If you don't want to create `LICENSE.md` → no `## License` section in the README
- Always use the correct SPDX identifier
- Don't include a year in the copyright

