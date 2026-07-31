# Configuration Reference

## Config File

Create `remotion.config.ts` in project root:

```typescript
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setPixelFormat('yuv420p');
Config.setQuality(80);
Config.setFps(30);
```

## Key Configuration Options

### Video Settings

```typescript
// Set default video quality
Config.setQuality(80);

// Set pixel format
Config.setPixelFormat('yuv420p');

// Set frame rate
Config.setFps(30);

// Set video codec
Config.setCodec('h264');

// Set video image format
Config.setVideoImageFormat('jpeg');

// Set CRF value
Config.setCrf(23);
```

### Output Settings

```typescript
// Set output directory
Config.setOutputDir('./out');

// Set overwrite output
Config.setOverwriteOutput(true);

// Set bundler define
Config.setBundlerDefine('MY_VARIABLE', '"value"');

// Set image sequence
Config.setImageSequence(false);
```

### Server Settings

```typescript
// Set port for preview server
Config.setPort(3000);

// Enable HTTPS
Config.setHttpsLocalhost({
  enabled: true,
});

// Set webpack config
Config.setWebpackOverride((config) => {
  config.module.rules.push({
    test: /\.svg$/,
    use: 'svg-loader',
  });
  return config;
});

// Set bundler (webpack or rspack)
Config.setBundler('rspack');
```

### Chromium Settings

```typescript
// Set Chrome executable path
Config.setChromiumExecutablePath('/path/to/chrome');

// Set Chrome flags
Config.setChromiumFlags(['--no-sandbox', '--disable-gpu']);
```

### Environment Variables

```typescript
// Set environment variable
Config.setEnvironmentVariable('MY_VAR', 'value');
```

## package.json Configuration

```json
{
  "scripts": {
    "start": "remotion studio",
    "build": "remotion render",
    "upgrade": "remotion upgrade"
  }
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `REMOTION_PUBLIC_FOLDER` | Public folder path |
| `NODE_OPTIONS` | Node.js options |

## TypeScript Configuration

```json title="tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

---

For full configuration options, see [Remotion Configuration Documentation](https://www.remotion.dev/docs/configuration).