---
name: update-license-md
description: Choose and set a license with the correct SPDX identifier for a project
argument-hint: "[scope]"
related:
  - follow-agents-md
  - follow-tasks
  - publish-package-to-registry
  - update-docs
  - use-my-packages-on-registry
  - setup-cicd

---

## Goal

Set up the `LICENSE` file and specify the SPDX license identifier in the package manifest so they are correct and consistent

## Scope

Use for a project that needs a license file at the root directory and a declaration in the package manifest (`package.json`, `pyproject.toml`, `Cargo.toml`, etc.)

- Use this skill to choose a license, create the `LICENSE` file, and sync the SPDX declaration — not to audit dependency licenses (use tools like `license-md` or `license-checker` separately)
- The `license-md` package is an old badge generator (unmaintained) — the main workflow uses `gh api licenses/{key}` plus manifest fields directly; installation is not required

- Latest: version-agnostic (license/linting guide; Python build backends pinned in the skill) (verified 2026-09-13)
- References: [apis](references/apis.md) 
- References: [License Management — Choosing and Declaring a License Correctly](best-practices/licensing.md)
## Execute

### 1. Choose License

> Goal: Choose a license that fits the project

1. Choose from common licenses: `MIT`, `Apache-2.0`, `GPL-3.0-only`, `BSD-3-Clause`, `ISC`, `Unlicense`
2. See details at `https://choosealicense.com` and full SPDX IDs at `https://spdx.org/licenses`
3. If contributing to a community that already has a license → use the same license
4. If unsure → default to `MIT`; if the project is private/unpublished → do not create `LICENSE` and use `UNLICENSED` in the manifest

### 2. Create License File

> Goal: Create the `LICENSE` file at the root directory

1. Fetch the canonical license text from the GitHub Licenses API: `gh api licenses/{key} --jq .body` (e.g. `gh api licenses/mit`) or copy from `https://choosealicense.com/licenses/{key}/`
2. Create the `LICENSE` file (no extension) at the root
3. Fill in the copyright holder and year correctly. MIT example:

```text
MIT License

Copyright (c) [year] [copyright holder]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### 3. Update Package Manifest

> Goal: Declare the license in the manifest with an SPDX expression that matches the `LICENSE` file

1. `package.json` — use only an SPDX expression string:

```json
{ "license": "MIT" }
```

- Multiple licenses: `"license": "(MIT OR Apache-2.0)"`
- Unpublished: `"license": "UNLICENSED"` together with `"private": true`
- Never use the legacy `licenses` array or `license` object (`{ "type": ..., "url": ... }`) — deprecated

2. `pyproject.toml` — use the PEP 639 format (string + `license-files`):

```toml
[project]
license = "MIT"
license-files = ["LICENSE*"]
```

- Never use the legacy table forms `license = { text = "MIT" }` or `license = { file = "LICENSE" }` — deprecated under PEP 639
- Supported in setuptools >=77.0.3, hatchling >=1.27.0, flit-core >=3.12, pdm-backend >=2.4.0, poetry-core >=2.2.0, uv-build >=0.7.19 — if your build backend is older, upgrade it first

3. `Cargo.toml` — use `license = "MIT"` (an SPDX expression), or `license-file = "LICENSE"` for a license not listed in SPDX

4. Verify that the manifest value matches the `LICENSE` file

## Rules

- Use `LICENSE` (no extension) as the filename, located at the root directory
- Always use an SPDX license identifier/expression — see the list at `https://spdx.org/licenses`
- Fill in the copyright holder and year correctly
- Declare the license in the package manifest to match the `LICENSE` file
- A project with no license = no usage rights by default (see `https://choosealicense.com/no-permission/`)
- Reference `https://choosealicense.com` to pick a license

- Use `/follow-agents-md` if needed
- Use `/follow-tasks` if needed
- Use `/publish-package-to-registry` if needed
- Use `/update-readme-md` if needed
- Use `/use-my-packages-on-registry` if needed
- Use `/setup-cicd` if needed
- Use /update-docs if needed
- See best-practices/ for recommended patterns and pitfalls


## Expected Outcome

- The `LICENSE` file sits at the root directory with the canonical license text
- The copyright holder and year are correct
- The package manifest's SPDX expression matches the `LICENSE` file
- No deprecated license formats (`licenses` array, `license` object, pyproject table) remain
