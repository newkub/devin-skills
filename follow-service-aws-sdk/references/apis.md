# Service Aws Sdk API & Dependencies

## Install

Install only the service clients you need — AWS SDK for JavaScript v3 is modular (one package per service):

```sh
bun add @aws-sdk/client-s3
# or
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

## Version

- Latest (`@aws-sdk/client-s3`): 3.1127.0
- Node.js requirement: `>= 20.0.0`
- [Package Registry](https://www.npmjs.com/package/@aws-sdk/client-s3)
- [Repository](https://github.com/aws/aws-sdk-js-v3)

## Dependencies

- All v3 packages publish under the `@aws-sdk/` scope; shared runtime code (middleware stack, retry, HTTP) comes from `@smithy/*` packages installed automatically.
- TypeScript types are bundled — no `@types/*` packages needed.
- The SDK resolves credentials via the default credential provider chain (env vars, shared config, IAM roles).

## Common API / Commands

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

## Source

- Official docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/
- S3 client reference: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/
- Developer guide: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/
- Migration guide (v2 → v3): https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/migrating-to-v3.html
