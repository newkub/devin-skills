# CLI Reference

## Commands

### Development

```bash
# Start preview server (Studio)
bunx remotion studio

# Start with specific port
bunx remotion studio --port 3000

# Start with specific composition
bunx remotion studio --composition=MyComposition
```

### Rendering

```bash
# Render as MP4
bunx remotion render <composition-id>

# Render as GIF
bunx remotion render <composition-id> --output.gif

# Render specific frame range
bunx remotion render <composition-id> --frames=0-100

# Render with props
bunx remotion render <composition-id> --props='{"title":"Hello"}'

# Render with custom config
bunx remotion render <composition-id> --config=remotion.config.ts

# Render with environment variables
bunx remotion render <composition-id> --env="MY_VAR=value"
```

### Project Management

```bash
# Add a Remotion package
bunx remotion add <package-name>

# Upgrade Remotion
bunx remotion upgrade

# Create new project
bunx create-video@latest

# List compositions
bunx remotion compositions

# Validate project
bunx remotion validate
```

## Options

| Option | Description |
|--------|-------------|
| `--out` | Output file path |
| `--config` | Config file path |
| `--props` | JSON props for composition |
| `--quality` | Quality (0-100) |
| `--crf` | CRF value for H.264 |
| `--frames` | Frame range (start-end) |
| `--log` | Log level |

## Common Examples

```bash
# Full HD video
bunx remotion render MyComposition --width=1920 --height=1080

# High quality
bunx remotion render MyComposition --quality=100

# With custom FPS
bunx remotion render MyComposition --fps=60

# Transparent output
bunx remotion render MyComposition --output=webm --codec=vp9
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `REMOTION_PUBLIC_FOLDER` | Public folder path |
| `REMOTION_AUDIO_CODEC` | Audio codec |
| `REMOTION_VIDEO_CODEC` | Video codec |

### Still Rendering

```bash
# Render single frame
bunx remotion still <composition-id> --frame=30

# Render with scale
bunx remotion still <composition-id> --frame=30 --scale=0.25

# Render as PNG
bunx remotion still <composition-id> --frame=30 --output=image.png
```

### FFmpeg Tools

```bash
# Run FFmpeg command
bunx remotion ffmpeg -i input.mp4 -c:v libx264 output.mp4

# Run FFprobe
bunx remotion ffprobe input.mp4
```

### Cache Management

```bash
# Clear cache
bunx remotion cache clear

# List cache
bunx remotion cache list
```

---

For more details, see [Remotion CLI Documentation](https://www.remotion.dev/docs/cli).
