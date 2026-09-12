# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `runs-on/runs-on` |
| Registry | `GitHub Releases` |
| Latest Version | `v3.3.1` |
| Release Date | `2026-09-10` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | RunsOn |
| License | `unknown` (commercial product — no SPDX license published on the repo) |
| Repository | `https://github.com/runs-on/runs-on` |
| Website | `https://runs-on.com/` |
| Documentation | `https://runs-on.com/installation/` |
| Releases / Changelog | `https://github.com/runs-on/runs-on/releases` |

## Install

```bash
# No package install — deploy the CloudFormation template:
# https://runs-on.s3.eu-west-1.amazonaws.com/cloudformation/template-v3.3.1.yaml
# or Terraform module: runs-on/runs-on/aws//flex (version v3.3.1)
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `runs-on/runs-on/aws//flex` | `Terraform Registry` | `v3.3.1` | Alternative Terraform install path (Flex mode) |
| `aws-cli` | `system` | `unknown` | Required for stack deploy and `create-service-linked-role` |

## Notes

- Breaking changes in latest major: v3.x uses CloudFormation quick-create or Terraform `flex` module; verify the current template version at `https://runs-on.com/installation/` before use
- Version pinned in SKILL.md: `v3.3.1` (template snapshot — updated from `v3.2.3`)
