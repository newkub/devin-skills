---
name: follow-service-aws-sdk
description: ใช้ AWS SDK ตาม best practices สำหรับการเชื่อมต่อกับ AWS cloud services
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

ใช้ AWS SDK ตาม best practices สำหรับการเชื่อมต่อกับ AWS cloud services

## Scope

ใช้สำหรับการพัฒนา applications ที่ต้องการ interact กับ AWS services เช่น S3, Lambda, DynamoDB และอื่นๆ

## Execute

### Workflows

| Topic  | Workflow |
|--------|----------|
| Setup  | `workflows/setup-aws-sdk/SKILL.md` — SDK v3 modular install, credentials |
| Config | `workflows/config-aws-sdk/SKILL.md` — region, credentials chain, endpoint config |
| Verify | `workflows/verify-connection/SKILL.md` — smoke test credentials/connectivity |

อ่าน `workflows/<name>/SKILL.md` ตาม topic แล้วทำตาม flow ในนั้น — ไม่ execute จากตารางนี้โดยตรง

### 1. Install And Configure

> Goal: ติดตั้ง AWS SDK และกำหนดค่า credentials

Latest: `@aws-sdk/client-s3@3.1139.0` (verified 2026-09-24) — ใช้ AWS SDK v3 (modular) เท่านั้น, `aws-sdk` v2 ถูก deprecated

1. Install SDK ด้วย `bun add @aws-sdk/client-s3` สำหรับ service ที่ต้องการ
2. Configure credentials ด้วย IAM roles สำหรับ production หรือ environment variables สำหรับ development
3. Create client instance ด้วย `new S3Client({ region: 'us-east-1' })`
4. ใช้ TypeScript สำหรับ type safety และ autocomplete

### 2. Make API Calls

> Goal: เรียกใช้ AWS services ด้วย command pattern

1. Make API calls ด้วย command pattern เช่น `await client.send(new PutObjectCommand(...))`
2. Handle errors ด้วย try-catch และใช้ built-in retry logic
3. ใช้ streaming สำหรับ large files
4. ใช้ pagination helpers สำหรับ large datasets

## Rules

### 1. Installation

- ใช้ `bun add` หรือ `bun add -D` แทน `bun install`
- Install เฉพาะ clients ที่ต้องการ (modular v3)

### 2. Security

- ใช้ IAM roles สำหรับ production
- ใช้ environment variables สำหรับ development
- ไม่ hardcode credentials ใน code

### 3. Error Handling

- Handle AWS SDK errors อย่างเหมาะสม
- Implement retry logic ด้วย built-in retries
- Log errors สำหรับ debugging

### 4. Type Safety

- ใช้ TypeScript สำหรับ type safety
- ใช้ streaming สำหรับ large files
- ใช้ pagination helpers สำหรับ large datasets

- ใช้ /follow-create-sdk ถ้าจำเป็น
- ใช้ /follow-service-cloudflare ถ้าจำเป็น
- ใช้ /follow-secret-manager ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /learn-from-web ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น

## Merged Details

### config-aws-sdk

##### Goal

ตั้งค่า/แก้ไข AWS SDK configuration — region, credentials chain, endpoint overrides และ client options — โดย merge กับ config เดิม

##### Scope

- ครอบคลุม env keys, client options และ local endpoints (เช่น LocalStack)
- ถ้ายังไม่ได้ install/credentials → ทำ `workflows/setup-aws-sdk/SKILL.md` ก่อน

##### Execute

###### 1. Read Current Config

> Goal: รู้ config ปัจจุบันก่อนแก้

1. อ่าน client construction ปัจจุบัน, env keys (`AWS_REGION`, `AWS_PROFILE`, `AWS_ENDPOINT_URL*`) และ `~/.aws/config` ถ้าเกี่ยวข้อง
2. ทำ `/check-config-drift` ถ้าต้องเทียบ env กับ code
3. ถ้าไม่พบ client → ทำ `workflows/setup-aws-sdk/SKILL.md` ก่อน

###### 2. Configure Region

> Goal: region ถูกต้องและ consistent

1. ใช้ `AWS_REGION` env เป็นแหล่งหลัก — client option `{ region }` เฉพาะเมื่อต้อง override
2. ยืนยัน region ตรงกับ resources จริง (S3 bucket region, DynamoDB table region)

###### 3. Configure Credentials Chain

> Goal: SDK resolve credentials ถูกลำดับ

1. ใช้ default provider chain: env vars → shared config/`AWS_PROFILE` → IAM role
2. สำหรับ assume role → ใช้ `@aws-sdk/credential-providers` (`fromTemporaryCredentials`) ตาม official docs
3. secrets ทั้งหมดผ่าน `/follow-secret-manager` — ห้าม hardcode

###### 4. Configure Endpoints And Options

> Goal: endpoint overrides ถูก scope

1. สำหรับ local dev (LocalStack) → ตั้ง `endpoint` ใน client options หรือ env `AWS_ENDPOINT_URL` เฉพาะ dev
2. เพิ่ม options ที่จำเป็นเช่น `maxAttempts`, `requestHandler` timeouts — เฉพาะที่ใช้จริง
3. guard endpoint overrides ด้วย `NODE_ENV` — ห้ามชี้ local endpoint บน production

###### 5. Verify

> Goal: config ใช้ได้กับ AWS จริงหรือ local endpoint

1. รัน smoke call เช่น `ListBucketsCommand` หรือ `DescribeTableCommand`
2. ทำ `/run-verify` สำหรับ lint, typecheck
3. ถ้าพัง → revert key ที่เพิ่งแก้แล้ว report diff

##### Rules

- แก้เฉพาะ keys/options ที่จำเป็น — ห้าม overwrite config ทั้งชุด
- production ใช้ IAM role — ห้าม static credentials
- endpoint overrides ต้อง scoped ต่อ environment
- ใช้ `/follow-best-practice` สำหรับ retry/timeout patterns

##### Expected Outcome

- region/credentials chain ถูกต้องต่อ environment
- endpoint overrides ทำงานใน dev โดยไม่กระทบ production
- smoke call สำเร็จ — lint, typecheck ผ่าน

### setup-aws-sdk

##### Goal

ติดตั้ง AWS SDK v3 (modular packages) และเตรียม credentials ให้ client เรียก AWS services ได้ — first-time setup

##### Scope

- ติดตั้ง `@aws-sdk/client-<service>` เฉพาะ service ที่ใช้ — `aws-sdk` v2 ถูก deprecated
- ตั้งค่า credentials ผ่าน env/IAM role
- ถ้า setup แล้ว → verify เท่านั้น; region/endpoint config → `workflows/config-aws-sdk/SKILL.md`

##### Execute

###### 1. Check Prerequisites

> Goal: ยืนยัน project พร้อมและยังไม่ได้ setup

1. ตรวจ `package.json` ว่ามี `@aws-sdk/client-*` แล้วหรือยัง — ถ้ามี → install เฉพาะที่ขาด
2. ตรวจ env/secrets ว่ามี `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` หรือ `AWS_PROFILE` หรือยัง
3. ถ้าขาด credentials → เก็บผ่าน `/follow-secret-manager` หรือใช้ IAM role (production)

###### 2. Install SDK

> Goal: ติดตั้งเฉพาะ modular clients ที่ใช้

1. รัน `bun add @aws-sdk/client-s3` (หรือ service ที่ต้องการ เช่น `@aws-sdk/client-dynamodb`, `@aws-sdk/client-lambda`)
2. ยืนยัน import ได้ เช่น `import { S3Client } from '@aws-sdk/client-s3'`
3. ใช้ TypeScript สำหรับ type safety

###### 3. Configure Credentials

> Goal: credential chain ถูกต้อง

1. development → env vars `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` หรือ `aws configure` + `AWS_PROFILE`
2. production → IAM role/instance profile — ห้ามใส่ static keys
3. ห้าม hardcode credentials ใน code — SDK resolve จาก default chain อัตโนมัติ

###### 4. Create Client And Smoke Check

> Goal: client ทำงานได้จริง

1. สร้าง client เช่น `new S3Client({ region })` — อ่าน region จาก env/config
2. รัน smoke check ด้วย read-only call เช่น `client.send(new ListBucketsCommand({}))`
3. ถ้า local AWS CLI พร้อม → ตรวจ identity ด้วย `aws sts get-caller-identity`

###### 5. Verify

> Goal: SDK ทำงานได้จริง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report
3. สำเร็จ → ทำ `/suggest-next-action`

##### Rules

- ใช้ AWS SDK v3 เท่านั้น — ห้ามเพิ่ม `aws-sdk` v2
- install เฉพาะ clients ที่ใช้จริง (modular)
- ใช้ `/follow-best-practice` และ `/learn-from-web` ถ้าไม่แน่ใจ API — ดู official docs https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/

##### Expected Outcome

- `@aws-sdk/client-*` ติดตั้งเฉพาะ service ที่ใช้
- credentials อยู่ใน env/IAM role ไม่มีใน code
- smoke check ผ่าน — พร้อมไป `workflows/config-aws-sdk/SKILL.md`

### verify-connection

##### Goal

ยืนยันหลัง setup/config ว่า AWS SDK เชื่อมต่อได้จริง — credentials valid, region ถูก, permissions เพียงพอ

##### Scope

- ใช้เมื่อ `/follow-service-aws-sdk` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่แก้ credentials

##### Execute

###### 1. Check Credentials Loaded

> Goal: credentials มีและ load ถูก chain

1. ตรวจ `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` หรือ credentials chain (profile, SSO, IAM role)
2. ตรวจ `AWS_REGION` ตั้งไว้และตรงกับที่ config คาด

###### 2. Smoke Test API Call

> Goal: call จริงตอบกลับ

1. `aws sts get-caller-identity` — ต้องคืน Account/Arn
2. ถ้าใช้ SDK ใน code → call minimal read (เช่น `sts.getCallerIdentity()` ผ่าน SDK)
3. ถ้า service-specific → call read-only ของ service นั้น (เช่น `s3.listBuckets()`, `dynamodb.listTables()`)

###### 3. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `wrong-region` / `missing-permission`

##### Rules

- ใช้ read-only calls เท่านั้น — ห้าม call ที่เปลี่ยน state
- ไม่ print secret values — แสดงแค่ Account/Arn/Region
- auth failure → แนะนำ `/follow-secret-manager` — ไม่แก้เอง

##### Expected Outcome

- Verdict connection พร้อม Account/Region evidence

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

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review` runs.

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

- Integration กับ AWS services ที่ reliable
- Code ที่ follow best practices
- Error handling ที่ robust
- Security ที่เหมาะสม
