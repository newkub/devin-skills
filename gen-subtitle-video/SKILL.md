---
name: gen-subtitle-video
description: Generate .srt subtitles from a video with a bunx CLI
argument-hint: "[video-path]"
related:
  - gen-voice
---

## Goal

Generate a subtitle `.srt` file from a video or audio with a speech-to-text CLI

## Scope

- Use `bunx` CLIs for transcription
- Supports multiple providers: `@illyism/transcribe`, Pollinations, `whisper.cpp`
- Supports multiple languages

## Execute

### 1. Prepare Input

> Goal: Check the input

1. Receive the video or audio path
2. Verify the file exists and its format is supported (mp4, mov, avi, mkv, mp3, wav, m4a)
3. Specify the output path (default `<input>.srt`)
4. Specify the language if the user knows it

### 2. Choose CLI

> Goal: Pick the transcription tool

1. Primary: `bunx @illyism/transcribe <video>`
   - Uses the OpenAI Whisper API
   - Generates `.srt` automatically
   - Accepts video directly
2. Fallback: `bunx @pollinations/cli gen transcribe <video>`
   - No API key required
   - If the API supports video transcription
3. Fallback (local): `whisper-subs <video> --model <model> --language <lang>`
   - Requires downloading a model
4. Last resort: extract audio with `ffmpeg` then use Python `whisper`

### 3. Run Transcription

> Goal: Generate the subtitles

1. Run the command with the output path
2. Wait until it finishes
3. Verify the `.srt` file size > 0
4. If the language is wrong → add `--language` and re-run

### 4. Validate

> Goal: Check the subtitles

1. Skim the `.srt` file to check syntax
2. Count the cues
3. Report the path, cue count, and duration

## Rules

### 1. API Key

- `@illyism/transcribe` requires `OPENAI_API_KEY`
- If absent → use Pollinations or local whisper
- Never hardcode keys

### 2. ffmpeg

- If a tool needs audio only → use `ffmpeg -i <video> -vn -acodec pcm_s16le -ar 16000 -ac 1 audio.wav`
- Verify ffmpeg is installed

### 3. Output

- Default output is `<input>.srt`
- Supports `.vtt` if the user wants it
- Never overwrite an existing file without asking

- Use /convert-files-format if needed
- Use /gen-voice if needed

## Expected Outcome

- A `.srt` file synced with the video
- The report includes path, cue count, and the tool used
- On failure, a fallback approach is given
