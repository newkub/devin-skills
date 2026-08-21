# Cloud Rendering

## Overview

Remotion รองรับ cloud rendering บน:
- **AWS Lambda** - Serverless rendering บน AWS
- **GCP Cloud Run** - Serverless rendering บน Google Cloud

## Why Cloud Rendering?

- **Scalability** - Render หลาย videos พร้อมกัน
- **Cost-effective** - Pay per use
- **No Infrastructure** - ไม่ต้อง manage servers
- **Fast** - Distributed rendering

## AWS Lambda

### Setup

```bash
bun add @remotion/lambda
```

### Deploy Lambda Function

```bash
bunx remotion lambda functions deploy
```

### Render on Lambda

```ts
import { renderMediaOnLambda } from '@remotion/lambda';

const { renderId, bucketName } = await renderMediaOnLambda({
  region: 'us-east-1',
  functionName: 'remotion-render',
  composition: {
    id: 'MyComposition',
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 150,
    props: {},
  },
  serveUrl: 'https://my-bucket.s3.amazonaws.com/bundle.zip',
  inputProps: {},
  codec: 'h264',
  imageFormat: 'jpeg',
  maxRetries: 3,
  privacy: 'public',
});

console.log(`Render ID: ${renderId}`);
console.log(`Bucket: ${bucketName}`);
```

### Check Render Status

```ts
import { getRenderProgress } from '@remotion/lambda';

const progress = await getRenderProgress({
  renderId,
  bucketName,
  region: 'us-east-1',
});

console.log(`Progress: ${progress.progress * 100}%`);
console.log(`Status: ${progress.renderStatus}`);
```

### Download Result

```ts
import { downloadMedia } from '@remotion/lambda';

await downloadMedia({
  renderId,
  bucketName,
  region: 'us-east-1',
  outputLocation: './out/video.mp4',
});
```

### Lambda Configuration

```ts
await renderMediaOnLambda({
  // ... options
  timeoutInSeconds: 120,
  memorySizeInMb: 2048,
  framesPerLambda: 10,
});
```

## GCP Cloud Run

### Setup

```bash
bun add @remotion/cloudrun
```

### Deploy Cloud Run Service

```bash
bunx remotion cloudrun services deploy
```

### Render on Cloud Run

```ts
import { renderMediaOnCloudrun } from '@remotion/cloudrun';

const { renderId } = await renderMediaOnCloudrun({
  region: 'us-central1',
  serviceUrl: 'https://my-service.run.app',
  composition: {
    id: 'MyComposition',
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 150,
    props: {},
  },
  serveUrl: 'https://storage.googleapis.com/bucket/bundle.zip',
  inputProps: {},
  codec: 'h264',
  imageFormat: 'jpeg',
});

console.log(`Render ID: ${renderId}`);
```

### Check Render Status

```ts
import { getRenderProgress } from '@remotion/cloudrun';

const progress = await getRenderProgress({
  renderId,
  serviceUrl: 'https://my-service.run.app',
});

console.log(`Progress: ${progress.progress * 100}%`);
console.log(`Status: ${progress.renderStatus}`);
```

### Download Result

```ts
import { downloadMedia } from '@remotion/cloudrun';

await downloadMedia({
  renderId,
  serviceUrl: 'https://my-service.run.app',
  outputLocation: './out/video.mp4',
});
```

## Comparison

| Feature | AWS Lambda | GCP Cloud Run |
|---------|-----------|---------------|
| **Platform** | AWS | Google Cloud |
| **Pricing** | Pay per request | Pay per request |
| **Timeout** | 15 minutes (configurable) | 60 minutes |
| **Memory** | Up to 10GB | Up to 32GB |
| **Cold Starts** | Yes | Yes |
| **Scalability** | High | High |

## Best Practices

### AWS Lambda

1. **Bundle Size** - Keep bundle size small (< 50MB)
2. **Timeout** - Set appropriate timeout
3. **Memory** - Use sufficient memory (2048MB+)
4. **Frames per Lambda** - Balance between speed and cost
5. **Retry Logic** - Implement retry logic

### GCP Cloud Run

1. **Service URL** - Use HTTPS
2. **Timeout** - Set appropriate timeout
3. **Memory** - Use sufficient memory
4. **Concurrency** - Configure concurrency limits
5. **Retry Logic** - Implement retry logic

## Cost Optimization

### AWS Lambda

- ใช้ appropriate memory size
- ลด bundle size
- ใช้ frames per lambda ที่เหมาะสม
- Monitor usage ด้วย CloudWatch

### GCP Cloud Run

- ใช้ appropriate memory/CPU
- ลด bundle size
- Configure concurrency limits
- Monitor usage ด้วย Cloud Monitoring

## Troubleshooting

### Timeout Issues

```ts
// AWS Lambda
await renderMediaOnLambda({
  timeoutInSeconds: 300, // 5 minutes
});

// GCP Cloud Run
await renderMediaOnCloudrun({
  timeoutInSeconds: 300,
});
```

### Memory Issues

```ts
// AWS Lambda
await renderMediaOnLambda({
  memorySizeInMb: 4096, // 4GB
});

// GCP Cloud Run
await renderMediaOnCloudrun({
  memory: '4Gi',
});
```

### Cold Starts

- Keep functions warm ด้วย scheduled invocations
- Use provisioned concurrency (AWS Lambda)
- Use minimum instances (GCP Cloud Run)

## Security

### IAM Permissions (AWS)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

### IAM Roles (GCP)

```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:SERVICE_ACCOUNT" \
  --role="roles/storage.objectAdmin"
```

## Best Practices Summary

1. **Choose Platform** - เลือก platform ตาม requirements
2. **Optimize Bundle** - Keep bundle size small
3. **Monitor Usage** - Track costs และ performance
4. **Implement Retry** - Handle failures gracefully
5. **Secure Access** - Use appropriate IAM permissions
