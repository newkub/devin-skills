# References

## CLI Tools

| Tool | Command | Note |
|---|---|---|
| ffmpeg | `ffmpeg -i <video> -vf "fps=1/5,scale=640:-1" frame_%03d.jpg` | extract frames |
| ffprobe | `ffprobe -v error -show_entries format=duration` | get duration |

## Related Skills

| Skill | Responsibility |
|---|---|
| `/analyze-image` | analyze frames |
| `/gen-subtitle-video` | transcribe audio |
