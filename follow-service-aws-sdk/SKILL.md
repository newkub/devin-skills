---
name: follow-service-aws-sdk
description: Use the AWS SDK per best practices for connecting to AWS cloud services
argument-hint: "[scope]"
related:
  - follow-create-sdk
  - follow-service-cloudflare
  - follow-secret-manager
  - follow-best-practice
  - learn
  - setup-cicd

---

## Goal

Use the AWS SDK per best practices for connecting to AWS cloud services

## Scope

Use for developing applications that need to interact with AWS services such as S3, Lambda, DynamoDB, and others

## Execute

### Workflows

| Topic  | Workflow |
|--------|----------|
| Setup  | `## Merged Details → setup-aws-sdk` — SDK v3 modular install, credentials |
| Config | `## Merged Details → config-aws-sdk` — region, credentials chain, endpoint config |
| Verify | `## Merged Details → verify-connection` — smoke test credentials/connectivity |

Read `workflows/<name>/SKILL.md` per topic and follow the flow there — do not execute from this table directly

### 1. Install And Configure

> Goal: Install the AWS SDK and configure credentials

Latest: `@aws-sdk/client-s3@3.1139.0` (verified 2026-09-24) — use AWS SDK v3 (modular) only; `aws-sdk` v2 is deprecated

1. Install the SDK with `bun add @aws-sdk/client-s3` for the needed service
2. Configure credentials with IAM roles for production or environment variables for development
3. Create a client instance with `new S3Client({ region: 'us-east-1' })`
4. Use TypeScript for type safety and autocomplete

### 2. Make API Calls

> Goal: Call AWS services with the command pattern

1. Make API calls with the command pattern such as `await client.send(new PutObjectCommand(...))`
2. Handle errors with try-catch and use built-in retry logic
3. Use streaming for large files
4. Use pagination helpers for large datasets

## Rules

### 1. Installation

- Use `bun add` or `bun add -D` instead of `bun install`
- Install only the clients you need (modular v3)

### 2. Security

- Use IAM roles for production
- Use environment variables for development
- Never hardcode credentials in code

### 3. Error Handling

- Handle AWS SDK errors properly
- Implement retry logic with built-in retries
- Log errors for debugging

### 4. Type Safety

- Use TypeScript for type safety
- Use streaming for large files
- Use pagination helpers for large datasets

- Use /follow-create-sdk if needed
- Use /follow-service-cloudflare if needed
- Use /follow-secret-manager if needed
- Use /follow-best-practice if needed
- Use /learn-from-web if needed
- Use /setup-cicd if needed

## Merged Details

### config-aws-sdk

##### Goal

Set/edit AWS SDK configuration — region, credentials chain, endpoint overrides, and client options — merging with the existing config

##### Scope

- Covers env keys, client options, and local endpoints (e.g. LocalStack)
- If not yet installed/credentials missing → do `## Merged Details → setup-aws-sdk` first

##### Execute

###### 1. Read Current Config

> Goal: Know the current config before editing

1. Read the current client construction, env keys (`AWS_REGION`, `AWS_PROFILE`, `AWS_ENDPOINT_URL*`), and `~/.aws/config` if relevant
2. Do `/deep-review-codebase` domain `review-config` if env must be compared with code
3. If no client is found → do `## Merged Details → setup-aws-sdk` first

###### 2. Configure Region

> Goal: region correct and consistent

1. Use the `AWS_REGION` env var as the primary source — client option `{ region }` only when an override is needed
2. Confirm the region matches the real resources (S3 bucket region, DynamoDB table region)

###### 3. Configure Credentials Chain

> Goal: the SDK resolves credentials in the right order

1. Use the default provider chain: env vars → shared config/`AWS_PROFILE` → IAM role
2. For assume role → use `@aws-sdk/credential-providers` (`fromTemporaryCredentials`) per the official docs
3. All secrets through `/follow-secret-manager` — never hardcode

###### 4. Configure Endpoints And Options

> Goal: endpoint overrides correctly scoped

1. For local dev (LocalStack) → set `endpoint` in client options or the `AWS_ENDPOINT_URL` env var in dev only
2. Add only options actually used, such as `maxAttempts` and `requestHandler` timeouts
3. Guard endpoint overrides with `NODE_ENV` — never point at a local endpoint in production

###### 5. Verify

> Goal: config works against real AWS or the local endpoint

1. Run a smoke call such as `ListBucketsCommand` or `DescribeTableCommand`
2. Do `/run-verify` for lint, typecheck
3. If broken → revert the key just changed, then report the diff

##### Rules

- Edit only the necessary keys/options — never overwrite the whole config
- Production uses IAM roles — never static credentials
- Endpoint overrides must be scoped per environment
- Use `/follow-best-practice` for retry/timeout patterns

##### Expected Outcome

- Region/credentials chain correct per environment
- Endpoint overrides work in dev without affecting production
- Smoke call succeeds — lint, typecheck pass

### setup-aws-sdk

##### Goal

Install AWS SDK v3 (modular packages) and prepare credentials so the client can call AWS services — first-time setup

##### Scope

- Install `@aws-sdk/client-<service>` only for services used — `aws-sdk` v2 is deprecated
- Configure credentials via env/IAM role
- If already set up → verify only; region/endpoint config → `## Merged Details → config-aws-sdk`

##### Execute

###### 1. Check Prerequisites

> Goal: Confirm the project is ready and not yet set up

1. Check `package.json` for existing `@aws-sdk/client-*` — if present → install only what's missing
2. Check env/secrets for `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, or `AWS_PROFILE`
3. If credentials are missing → store them via `/follow-secret-manager` or use an IAM role (production)

###### 2. Install SDK

> Goal: Install only the modular clients actually used

1. Run `bun add @aws-sdk/client-s3` (or the needed service such as `@aws-sdk/client-dynamodb`, `@aws-sdk/client-lambda`)
2. Confirm the import works, e.g. `import { S3Client } from '@aws-sdk/client-s3'`
3. Use TypeScript for type safety

###### 3. Configure Credentials

> Goal: correct credential chain

1. development → env vars `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` or `aws configure` + `AWS_PROFILE`
2. production → IAM role/instance profile — never put static keys
3. Never hardcode credentials in code — the SDK resolves them from the default chain automatically

###### 4. Create Client And Smoke Check

> Goal: the client really works

1. Create a client such as `new S3Client({ region })` — read region from env/config
2. Run a smoke check with a read-only call such as `client.send(new ListBucketsCommand({}))`
3. If the local AWS CLI is ready → check identity with `aws sts get-caller-identity`

###### 5. Verify

> Goal: the SDK actually works

1. Do `/run-verify` for lint, typecheck
2. If verify fails → do `/resolve-errors` max 3 rounds, then stop and report
3. Success → do `/suggest-next-action`

##### Rules

- Use AWS SDK v3 only — never add `aws-sdk` v2
- Install only the clients actually used (modular)
- Use `/follow-best-practice` and `/learn-from-web` when unsure about the API — see official docs https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/

##### Expected Outcome

- `@aws-sdk/client-*` installed only for services used
- Credentials live in env/IAM role, never in code
- Smoke check passes — ready for `## Merged Details → config-aws-sdk`

### verify-connection

##### Goal

Confirm after setup/config that the AWS SDK really connects — credentials valid, region correct, permissions sufficient

##### Scope

- Used when `/follow-service-aws-sdk` dispatches to `verify`/`verify-connection`
- Read-only: check only — do not change credentials

##### Execute

###### 1. Check Credentials Loaded

> Goal: credentials exist and load via the right chain

1. Check `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` or the credentials chain (profile, SSO, IAM role)
2. Check `AWS_REGION` is set and matches what the config expects

###### 2. Smoke Test API Call

> Goal: a real call responds

1. `aws sts get-caller-identity` — must return Account/Arn
2. If the SDK is used in code → a minimal read call (e.g. `sts.getCallerIdentity()` via the SDK)
3. If service-specific → a read-only call of that service (e.g. `s3.listBuckets()`, `dynamodb.listTables()`)

###### 3. Report

> Goal: Summarize connection status

1. Use `/report` columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `wrong-region` / `missing-permission`

##### Rules

- Use read-only calls only — never calls that change state
- Do not print secret values — show only Account/Arn/Region
- Auth failure → recommend `/follow-secret-manager` — do not fix it yourself

##### Expected Outcome

- Connection verdict with Account/Region evidence

### references/apis

#### Service Aws Sdk API & Dependencies

##### Install

Install only the service clients you need — AWS SDK for JavaScript v3 is modular (one package per service):

```sh
bun add @aws-sdk/client-s3
#### or
npm install @aws-sdk/client-s3
```

Other common clients and helpers:

```sh
bun add @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
bun add @aws-sdk/client-lambda @aws-sdk/client-sqs
bun add @aws-sdk/client-ssm @aws-sdk/client-secrets-manager
bun add @aws-sdk/client-sts @aws-sdk/client-sns
bun add @aws-sdk/s3-request-presigner      # presigned URLs
bun add @aws-sdk/credential-providers    # fromIni(), fromEnv(), fromSSO()
```

##### Version

- Latest (`@aws-sdk/client-s3`): 3.1127.0
- Node.js requirement: `>= 20.0.0`
- [Package Registry](https://www.npmjs.com/package/@aws-sdk/client-s3)
- [Repository](https://github.com/aws/aws-sdk-js-v3)

##### Dependencies

- All v3 packages publish under the `@aws-sdk/` scope; shared runtime code (middleware stack, retry, HTTP) comes from `@smithy/*` packages installed automatically.
- TypeScript types are bundled — no `@types/*` packages needed.
- The SDK resolves credentials via the default credential provider chain (env vars, shared config, IAM roles).

##### Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `new S3Client({ region })` | Create an S3 client | default credential chain | `region`, `credentials`, `endpoint`, `forcePathStyle` |
| `client.send(command)` | Dispatch any command to the service | built-in retry (3 attempts, standard mode) | custom `retryStrategy`, `requestHandler` |
| `new CreateBucketCommand({ Bucket })` | Create an S3 bucket | — | `CreateBucketConfiguration`, `ObjectLockEnabledForBucket` |
| `new PutObjectCommand({ Bucket, Key, Body })` | Upload an object to S3 | — | `ContentType`, `Metadata`, `ACL`, `StorageClass` |
| `new GetObjectCommand({ Bucket, Key })` | Download an object | — | `Range`, `VersionId`, `ResponseContentType` |
| `new ListObjectsV2Command({ Bucket })` | List objects (ListObjectsV2) | max 1000 keys/request | `Prefix`, `MaxKeys`, `ContinuationToken`, `Delimiter` |
| `new HeadObjectCommand({ Bucket, Key })` | Get object metadata only | — | `VersionId`, `IfModifiedSince` |
| `new DeleteObjectCommand({ Bucket, Key })` | Delete one object | — | `VersionId`, `BypassGovernanceRetention` |
| `new DeleteObjectsCommand({ Bucket, Delete })` | Delete up to 1000 objects | — | `Delete.Objects[]`, `Quiet` |
| `new CopyObjectCommand({ Bucket, Key, CopySource })` | Copy object between buckets/keys | — | `MetadataDirective`, `StorageClass` |
| `getSignedUrl(client, command, { expiresIn })` | Presign URL (`@aws-sdk/s3-request-presigner`) | 900 s | `expiresIn` seconds (max 604800 / 7 days) |
| `paginateListObjectsV2(config, input)` | Async-iterator paginator | iterates all pages | `pageSize`, `client`, `withCommand` |
| `waitUntilBucketExists({ client }, { Bucket })` | Waiter utility | polls until ready | `maxWaitTime`, `maxDelay`, `minDelay` |
| `DynamoDBDocumentClient.from(client)` | Doc client (`@aws-sdk/lib-dynamodb`) | auto marshalling of JS types | `marshallOptions`, `unmarshallOptions` |
| `new PutCommand({ TableName, Item })` | Put item (doc client) | — | `ConditionExpression`, `ReturnValues` |
| `new GetCommand({ TableName, Key })` | Get item (doc client) | eventually consistent | `ConsistentRead`, `ProjectionExpression` |
| `new QueryCommand({ TableName, KeyConditionExpression })` | Query items (doc client) | — | `IndexName`, `ScanIndexForward`, `Limit` |
| `new PutItemCommand({ TableName, Item })` | Low-level DynamoDB put | — | `Item` in AttributeValue form |
| `new TransactWriteItemsCommand({ TransactItems })` | ACID multi-item transaction | — | up to 100 items |
| `new InvokeCommand({ FunctionName, Payload })` | Invoke a Lambda function | `RequestResponse` | `InvocationType` (`Event`, `DryRun`), `Qualifier` |
| `new SendMessageCommand({ QueueUrl, MessageBody })` | Send SQS message | — | `DelaySeconds`, `MessageAttributes`, `MessageGroupId` |
| `new ReceiveMessageCommand({ QueueUrl })` | Receive SQS messages | 1 msg, short poll | `MaxNumberOfMessages` (1-10), `WaitTimeSeconds` (long poll), `VisibilityTimeout` |
| `new DeleteMessageCommand({ QueueUrl, ReceiptHandle })` | Delete processed SQS message | — | — |
| `new GetParameterCommand({ Name })` | SSM Parameter Store get | encrypted value returned raw | `WithDecryption` |
| `new PutParameterCommand({ Name, Value })` | SSM Parameter Store put | `String` type | `Type` (`SecureString`), `Overwrite` |
| `new GetSecretValueCommand({ SecretId })` | Secrets Manager get | — | `VersionId`, `VersionStage` |
| `new PublishCommand({ TopicArn, Message })` | SNS publish to topic | — | `Subject`, `MessageAttributes` |
| `new GetCallerIdentityCommand({})` | STS identity check | — | — |
| `fromIni() / fromEnv() / fromSSO()` | Credential providers (`@aws-sdk/credential-providers`) | — | `profile`, `filepath`, `roleArn` |
| `fromTemporaryCredentials({ params })` | Assume-role credentials | — | `RoleArn`, `RoleSessionName`, `DurationSeconds` |

##### Source

- Official docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/
- S3 client reference: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/
- Developer guide: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/
- Migration guide (v2 → v3): https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/migrating-to-v3.html

### references/aws-sdk

#### AWS SDK For JavaScript (v3) Reference

##### Overview

AWS SDK for JavaScript v3 is a modular rewrite of v2 with first-class TypeScript support, a new middleware stack, and a separate package for each AWS service. Packages are published under the `@aws-sdk/` scope on npm.

##### Version Info

- Package example: `@aws-sdk/client-s3`
- Latest stable: `3.1117.0`
- Node.js requirement: `>=20.0.0`
- License: Apache-2.0
- Architecture: Modular — one package per service

##### Install

Install only the service clients you need:

```sh
bun add @aws-sdk/client-s3
#### or
bun add @aws-sdk/client-s3
#### or
pnpm add @aws-sdk/client-s3
#### or
yarn add @aws-sdk/client-s3
```

Other common clients:

```sh
bun add @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
bun add @aws-sdk/client-lambda
bun add @aws-sdk/client-sqs
bun add @aws-sdk/client-ssm
bun add @aws-sdk/client-secrets-manager
```

##### Prerequisites

- Install [Node.js](https://nodejs.org/en/download) — AWS recommends the Active LTS version
- Configure SDK authentication (IAM roles for production, environment variables for development)

##### Configuration

###### Credentials

The SDK uses the default credential provider chain. For development, set environment variables:

```sh
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_REGION="us-east-1"
```

For production, use IAM roles — do not hardcode credentials.

###### `package.json`

Add `"type": "module"` to use modern ESM syntax:

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@aws-sdk/client-s3": "^3.1117.0"
  }
}
```

##### Code Examples

###### S3 — Create Client And Upload Object

```js
import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({});

// Create a bucket
const bucketName = `test-bucket-${Date.now()}`;
await s3Client.send(
  new CreateBucketCommand({ Bucket: bucketName })
);

// Put an object
await s3Client.send(
  new PutObjectCommand({
    Bucket: bucketName,
    Key: "my-first-object.txt",
    Body: "Hello JavaScript SDK!",
  })
);

// Read the object
const { Body } = await s3Client.send(
  new GetObjectCommand({
    Bucket: bucketName,
    Key: "my-first-object.txt",
  })
);
console.log(await Body.transformToString());
```

###### S3 — Specify Region Explicitly

```js
import { S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({ region: "us-east-1" });
```

###### S3 — Pagination

```js
import { paginateListObjectsV2 } from "@aws-sdk/client-s3";

const paginator = paginateListObjectsV2(
  { client: s3Client },
  { Bucket: bucketName }
);
for await (const page of paginator) {
  const objects = page.Contents;
  if (objects) {
    for (const object of objects) {
      console.log(object.Key);
    }
  }
}
```

###### DynamoDB — Document Client

```js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

await docClient.send(
  new PutCommand({
    TableName: "my-table",
    Item: { id: "1", name: "Example" },
  })
);
```

###### Error Handling With Retry

The SDK has built-in retry logic (default 3 attempts). Wrap calls in try-catch:

```js
try {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: "file.txt",
      Body: "content",
    })
  );
} catch (error) {
  console.error("S3 upload failed:", error);
  throw error;
}
```

##### Common Service Client Packages

| Package | Service |
|---|---|
| `@aws-sdk/client-s3` | Amazon S3 |
| `@aws-sdk/client-dynamodb` | Amazon DynamoDB |
| `@aws-sdk/lib-dynamodb` | DynamoDB Document Client |
| `@aws-sdk/client-lambda` | AWS Lambda |
| `@aws-sdk/client-sqs` | Amazon SQS |
| `@aws-sdk/client-sns` | Amazon SNS |
| `@aws-sdk/client-ssm` | AWS Systems Manager |
| `@aws-sdk/client-secrets-manager` | AWS Secrets Manager |
| `@aws-sdk/client-cloudformation` | AWS CloudFormation |
| `@aws-sdk/client-sts` | AWS STS |

##### Migration From v2 To v3

Use the codemod for automated migration:

```sh
npx aws-sdk-js-codemod -i src/
```

Key changes in v3:
- Modular packages (import only what you need)
- Command pattern (`client.send(new Command(...))`)
- First-class TypeScript support
- New middleware stack
- Reduced bundle size

##### Source

- [AWS SDK for JavaScript](https://aws.amazon.com/sdk-for-javascript/)
- [Set up the SDK](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-up.html)
- [Get started with Node.js](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html)
- [API Reference](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [Migration Guide](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/migrating.html)

### references/package-manifest

#### Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review-codebase` runs.

##### Primary Package

| Field | Value |
|-------|-------|
| Package | `@aws-sdk/client-s3` |
| Registry | `npm` |
| Latest Version | `3.1133.0` |
| Release Date | `2026-09-11` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | AWS |
| License | `Apache-2.0` |
| Repository | `https://github.com/aws/aws-sdk-js-v3` |
| Website | `https://aws.amazon.com/` |
| Documentation | `https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/` |
| Releases / Changelog | `https://github.com/aws/aws-sdk-js-v3/releases` |

##### Install

```bash
bun add @aws-sdk/client-s3
```

##### Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@aws-sdk/client-*` | `npm` | `3.1131.x` | Other modular v3 service clients (DynamoDB, Lambda, etc.) share the same release train |
| `aws-sdk` | `npm` | deprecated | v2 monolith — end-of-support, do not install |

##### Notes

- Breaking changes in latest major: v3 is fully modular — install only the `@aws-sdk/client-*` packages needed; `aws-sdk` v2 is deprecated
- Version pinned in SKILL.md: `3.1133.0`

### references/routes

#### Follow Service Aws Sdk Route Map

- Website: <https://aws.amazon.com/sdk-for-javascript>
- Documentation: <https://aws.amazon.com/getting-started/?nc2=h_dsc_aa_gs>
- Total routes discovered: 3378

##### Top routes by section

###### marketplace
- /marketplace
- /marketplace/account-management
- /marketplace/agentmode
- ... and 3374 more

###### sdk-for-javascript
- /sdk-for-javascript

### references/website

#### Service Aws Sdk Official Resources

- [Website](https://aws.amazon.com/sdk-for-javascript)
- [Documentation](https://aws.amazon.com/getting-started/?nc2=h_dsc_aa_gs)
- [Repository](https://github.com/aws/aws-sdk-js-v3)
- [Package Registry](https://www.npmjs.com/package/@aws-sdk/client-s3)
- About: Develop and deploy applications with the AWS SDK for JavaScript, Node.js, React Mobile, and TypeScript. The SDK makes it easy to call AWS...

## Expected Outcome

- Reliable integration with AWS services
- Code that follows best practices
- Robust error handling
- Appropriate security
