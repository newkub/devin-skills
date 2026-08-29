# Service Aws Sdk API & Dependencies

## Install

```sh
bun add -D @aws-sdk/client-s3
# or
npm install --save-dev @aws-sdk/client-s3
```

## Version

- Latest: 3.1121.0
- [Package Registry](https://www.npmjs.com/package/@aws-sdk/client-s3)
- [Repository](https://github.com/aws/aws-sdk-js-v3)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install @aws-sdk/client-s3 SDK | latest version | --save |
| `createClient` | Create service client | env-based | --url, --key |
| `query` | Query data | all rows | filters, order |
| `insert` | Insert data | new record | --returning |
| `configure` | Configure connection | project defaults | --config |

## Source

- Official docs: https://aws.amazon.com/sdk-for-javascript
- Description: AWS SDK for JavaScript S3 Client for Node.js, Browser and React Native
