# PR Metadata Checks

## Goal

Check the pull request metadata before reviewing code changes

## Checks

1. Check the title against conventional commit format (`<type>: <subject>`)
2. Check the description for context, linked issue, and changes summary
3. Check that the base branch is correct
4. Check PR size: small (<10 files), medium (<30 files), large (>30 files) — suggest splitting if too large
5. Check merge conflicts, draft status, required reviews
6. Check commit messages follow conventional commits with no WIP or fixup commits

## Severity

- Critical: wrong base branch, PR is a draft but must merge, merge conflicts
- High: title not following conventional commit, missing description, large PR that is not split
- Medium: missing linked issue, WIP commits
- Low: minor commit message issue, missing labels
