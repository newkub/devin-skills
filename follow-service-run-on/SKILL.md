---
name: follow-service-run-on
description: Install, configure, and validate self-hosted GitHub Actions runners on AWS with RunsOn
argument-hint: "[scope]"
related:
  - ask-me
  - deep-validate
  - git-commit
---

## Goal

Install and configure self-hosted GitHub Actions runners on AWS with RunsOn — from the AWS stack, IAM, GitHub App, `.github/runs-on.yml` through validation

## Scope

Used for:
- Installing the RunsOn stack on AWS with CloudFormation or Terraform
- Configuring IAM, VPC, GitHub App
- Creating/editing `.github/runs-on.yml` and `.github/workflows/*.yml`
- Validating that runners really work
Not included: creating an AWS account, purchasing a license, or automatic commit/push

## Execute

### Workflows

| Topic  | Workflow |
|--------|----------|
| Setup  | `## Merged Details → setup-run-on` — AWS stack, GitHub App registration |
| Config | `## Merged Details → config-run-on` — `runs-on.yml` runner definitions, workflow labels |
| Verify | `## Merged Details → verify-connection` — stack healthy, runners register, labels match |

Read `workflows/<name>/SKILL.md` per topic and follow the flow there — do not execute from this table directly

### 1. Prepare Context

> Goal: Check context and permissions before installing

1. Check `aws --version` and AWS credentials with permission to create a CloudFormation stack
2. Confirm the GitHub organization/personal account and the RunsOn license key
3. Pick an AWS region such as `us-east-1`, `us-west-2`, `eu-west-1`
4. If context is not ready → stop and `/ask-me`

### 2. Deploy RunsOn Stack

> Goal: Install the AWS infrastructure for RunsOn

Note: template version `v3.3.1` is a pinned snapshot — check the latest template at `https://runs-on.com/installation/` before use (verified 2026-09-12)

1. Use the CloudFormation quick-create URL:
   `https://<region>.console.aws.amazon.com/cloudformation/home?region=<region>#/stacks/quickcreate?templateUrl=https://runs-on.s3.eu-west-1.amazonaws.com/cloudformation/template-v3.3.1.yaml&stackName=runs-on`
2. Fill in the main parameters: GitHub org, `LicenseKey`, email for cost alerts, `Environment` (optional)
3. If the stack fails with `Unable to assume the service linked role`, run:
   `aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com`
4. Wait for stack status `CREATE_COMPLETE`, then save the `RunsOnEntryPoint` output URL
5. If Terraform is wanted: use module `runs-on/runs-on/aws//flex` version `v3.3.1`

### 3. Register GitHub App And Repository

> Goal: Connect the GitHub repo with RunsOn

1. Open the `RunsOnEntryPoint` URL and press `Register app` to create a private GitHub App
2. Select the repositories the app may access
3. Open `https://github.com/organizations/<org>/settings/actions` to enable repository-level self-hosted runners
4. For warm pools or shared runner definitions, create `.github-private/.github/runs-on.yml` in the org (optional)

### 4. Configure Runners

> Goal: Configure custom runners and workflow labels

1. Create/edit `.github/runs-on.yml` in the repository (Flex) for custom runner definitions:
   ```yaml
   runners:
     gpu-type1:
       family: ["g4dn", "g5"]
       image: ubuntu24-gpu-x64
       cpu: [4, 16]
       spot: price-capacity-optimized
       extras: ["s3-cache"]
   ```
2. Edit `.github/workflows/<file>.yml` to use `runs-on` labels:
   ```yaml
   jobs:
     build:
       runs-on: runs-on=${{ github.run_id }}/runner=gpu-type1
   ```
3. If `.github/runs-on.yml` is not used, specify labels directly in the `runs-on:` value:
   - `runs-on=${{ github.run_id }}` to prevent the runner from being claimed
   - `runner=2cpu-linux-x64` or `cpu=`, `ram=`, `family=`, `image=`, `volume=`, `spot=`, `extras=`
4. For Fleet, use `runs-on: runs-on/fleet=<fleet-name>/env=<env>`

### 5. Validate Deployment

> Goal: Confirm the runner works

1. Push a commit or trigger `workflow_dispatch`
2. Check GitHub Actions logs that the job runs on a `runs-on` runner
3. Watch the AWS EC2 console / CloudWatch logs that the instance launches and terminates correctly
4. Confirm the email for the SNS cost/alert subscription
5. If the workflow fails, run `/deep-validate` then `/ask-me`

## Rules

### 1. AWS And IAM

- Install RunsOn in a dedicated AWS sub-account for isolation
- CloudFormation automatically creates IAM roles with limited permissions for the service
- Never hardcode `LicenseKey` in skill files or source code

### 2. GitHub Actions Integration

- Always use `runs-on=${{ github.run_id }}` as the routing key
- Use `runner=<name>` when `.github/runs-on.yml` exists
- Use backticks for `commands`, `paths`, and runner labels

### 3. Configuration Files

- `.github/runs-on.yml` is for custom runners in Flex
- `.github-private/.github/runs-on.yml` is for warm pools and org-wide runner definitions
- Edit `.github/workflows/*.yml` with `edit` or `write` as appropriate

### 4. Safety

- Ask the user before deploying the stack or changing important repos
- No automatic commit/push — the user runs it or uses `git-commit` as desired
- If data or permissions are missing → stop and report

## Merged Details

### config-run-on

##### Goal

Set/edit RunsOn runner configuration — `.github/runs-on.yml` runner definitions and `runs-on:` labels in workflows — merging with the existing config

##### Scope

- Covers `.github/runs-on.yml`, `.github-private/.github/runs-on.yml`, and `.github/workflows/*.yml`
- If the stack is not deployed yet → do `## Merged Details → setup-run-on` first
- Does not include automatic commit/push

##### Execute

###### 1. Read Current Config

> Goal: Know the current runner config before editing

1. Read `.github/runs-on.yml` and workflows that already use `runs-on:`
2. Do `/deep-review` domain `review-config` if the config must be compared with the deployed stack
3. If no config is found → do `## Merged Details → setup-run-on` first

###### 2. Define Runners

> Goal: runner definitions match the workload

1. Create/edit `.github/runs-on.yml` in the repo (Flex), e.g.:
   ```yaml
   runners:
     gpu-type1:
       family: ["g4dn", "g5"]
       image: ubuntu24-gpu-x64
       cpu: [4, 16]
       spot: price-capacity-optimized
       extras: ["s3-cache"]
   ```
2. For org-wide definitions/warm pools → use `.github-private/.github/runs-on.yml`
3. Pick `family`, `image`, `cpu`, `ram`, `spot`, `extras` per workload — check official docs if unsure

###### 3. Update Workflow Labels

> Goal: jobs route to the right runners

1. Edit `runs-on:` in `.github/workflows/<file>.yml`, e.g. `runs-on: runs-on=${{ github.run_id }}/runner=gpu-type1`
2. If `runs-on.yml` is not used → specify labels directly, e.g. `runner=2cpu-linux-x64`, `cpu=`, `ram=`, `image=`, `spot=`
3. Always use `runs-on=${{ github.run_id }}` as the routing key to prevent the runner from being claimed
4. If creating a new workflow → follow `/follow-create-github-action`

###### 4. Validate

> Goal: the config really works on the runner

1. Trigger `workflow_dispatch` or push a commit, then watch Actions logs
2. Confirm the instance launches per labels and cost/spot behavior is correct
3. If it fails → run `/deep-validate` then `/ask-me`

##### Rules

- Edit only the necessary runner definitions/labels — never rewrite whole workflows
- Always use `runs-on=${{ github.run_id }}` in the routing key
- No automatic commit/push — let the user confirm

##### Expected Outcome

- `.github/runs-on.yml` and workflow labels correct for the chosen Flex/Fleet mode
- The workflow runs successfully on the specified runner

### setup-run-on

##### Goal

Install the RunsOn stack on AWS (CloudFormation/Terraform), register the GitHub App, and enable self-hosted runners for the repo — first-time setup

##### Scope

- Covers the AWS stack, GitHub App registration, and org settings
- Does not include creating an AWS account, purchasing a license, or automatic commit/push
- Runner label/workflow config → `## Merged Details → config-run-on`

##### Execute

###### 1. Check Prerequisites

> Goal: context and permissions ready before deploying the stack

1. Check `aws --version` and AWS credentials have permission to create a CloudFormation stack
2. Confirm the GitHub organization/account and the RunsOn license key with the user
3. Pick an AWS region such as `us-east-1`
4. If context is missing → stop and run `/ask-me`

###### 2. Deploy AWS Stack

> Goal: RunsOn infrastructure running on AWS

1. Use the CloudFormation quick-create URL from https://runs-on.com/installation/ — always check the latest template before use
2. Fill in parameters: GitHub org, `LicenseKey`, email for cost alerts
3. If it fails with `Unable to assume the service linked role` → run `aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com`
4. Wait for stack status `CREATE_COMPLETE`, then save the `RunsOnEntryPoint` output URL
5. Store `LicenseKey` via `/follow-secret-manager` — never commit it

###### 3. Register GitHub App

> Goal: repo connected to RunsOn

1. Open the `RunsOnEntryPoint` URL and press `Register app` to create a private GitHub App
2. Select the repositories the app may access
3. Open org settings → Actions to enable repository-level self-hosted runners

###### 4. Validate

> Goal: the runner really works

1. Create a test workflow or trigger `workflow_dispatch` with a `runs-on:` label
2. Check GitHub Actions logs that it runs on a `runs-on` runner and the EC2 instance launches/terminates correctly
3. If it fails → run `/deep-validate` then `/ask-me`

##### Rules

- Ask the user before deploying the stack — it is an infrastructure change with cost
- Install in a dedicated AWS sub-account for isolation
- Never hardcode `LicenseKey` in any file
- Use official docs https://runs-on.com as the primary source

##### Expected Outcome

- RunsOn stack `CREATE_COMPLETE` and GitHub App registered
- The test workflow runs successfully on a self-hosted runner
- Ready for `## Merged Details → config-run-on`

### verify-connection

##### Goal

Confirm after setup/config that RunsOn (self-hosted GitHub runners on AWS) really works — stack healthy, runners registered with the repo/org, workflow labels match

##### Scope

- Used when `/follow-service-run-on` dispatches to `verify`/`verify-connection`
- Read-only: check only — do not change the stack or workflows

##### Execute

###### 1. Check AWS Stack

> Goal: the RunsOn CloudFormation stack is healthy

1. `aws cloudformation describe-stacks --stack-name runs-on` — status `CREATE_COMPLETE`/`UPDATE_COMPLETE`
2. Flag stacks in `*_FAILED` or `ROLLBACK_*` state

###### 2. Check Runner Registration

> Goal: runners register with GitHub

1. `gh api repos/{owner}/{repo}/actions/runners` — runners are online
2. Flag: no runners, all runners offline, runner labels not matching `runs-on.yml`

###### 3. Check Workflow Labels

> Goal: workflows use labels the runners support

1. Compare `runs-on:` labels in workflows with runner definitions in `runs-on.yml`
2. Flag labels with no runner definition — the job will hang unrun

###### 4. Report

> Goal: Summarize connection status

1. Use `/report` columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `stack-unhealthy` / `no-runners` / `label-mismatch`

##### Rules

- Use describe/list calls only — never modify the stack
- Label mismatch = common silent failure — always flag
- Stack issues → report for the setup workflow to handle

##### Expected Outcome

- Verdict with stack status + runner count + label evidence

### references/package-manifest

#### Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review` runs.

##### Primary Package

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

##### Install

```bash
#### No package install — deploy the CloudFormation template:
#### https://runs-on.s3.eu-west-1.amazonaws.com/cloudformation/template-v3.3.1.yaml
#### or Terraform module: runs-on/runs-on/aws//flex (version v3.3.1)
```

##### Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `runs-on/runs-on/aws//flex` | `Terraform Registry` | `v3.3.1` | Alternative Terraform install path (Flex mode) |
| `aws-cli` | `system` | `unknown` | Required for stack deploy and `create-service-linked-role` |

##### Notes

- Breaking changes in latest major: v3.x uses CloudFormation quick-create or Terraform `flex` module; verify the current template version at `https://runs-on.com/installation/` before use
- Version pinned in SKILL.md: `v3.3.1` (template snapshot — updated from `v3.2.3`)

## Expected Outcome

- RunsOn stack running on AWS and GitHub App registered
- `.github/runs-on.yml` and workflows correct for the chosen Flex/Fleet mode
- The workflow runs successfully on a self-hosted runner on EC2
- Validation logs show the instance launches per the specified labels
