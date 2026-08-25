# AWS SDK For JavaScript (v3) Reference

## Overview

AWS SDK for JavaScript v3 is a modular rewrite of v2 with first-class TypeScript support, a new middleware stack, and a separate package for each AWS service. Packages are published under the `@aws-sdk/` scope on npm.

## Version Info

- **Package example**: `@aws-sdk/client-s3`
- **Latest stable**: `3.1117.0`
- **Node.js requirement**: `>=20.0.0`
- **License**: Apache-2.0
- **Architecture**: Modular — one package per service

## Install

Install only the service clients you need:

```sh
bun add @aws-sdk/client-s3
# or
bun add @aws-sdk/client-s3
# or
pnpm add @aws-sdk/client-s3
# or
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

## Prerequisites

- Install [Node.js](https://nodejs.org/en/download) — AWS recommends the Active LTS version
- Configure SDK authentication (IAM roles for production, environment variables for development)

## Configuration

### Credentials

The SDK uses the default credential provider chain. For development, set environment variables:

```sh
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_REGION="us-east-1"
```

For production, use IAM roles — do not hardcode credentials.

### `package.json`

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

## Code Examples

### S3 — Create Client And Upload Object

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

### S3 — Specify Region Explicitly

```js
import { S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({ region: "us-east-1" });
```

### S3 — Pagination

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

### DynamoDB — Document Client

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

### Error Handling With Retry

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

## Common Service Client Packages

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

## Migration From v2 To v3

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

## Source

- [AWS SDK for JavaScript](https://aws.amazon.com/sdk-for-javascript/)
- [Set up the SDK](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-up.html)
- [Get started with Node.js](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html)
- [API Reference](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [Migration Guide](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/migrating.html)
