---
name: gen-voice
description: Generate speech audio from text with a bunx TTS CLI
argument-hint: "[text]"
related:
  - gen-subtitle-video
---

## Goal

Generate a speech audio file from text with a TTS CLI

## Scope

- Use `bunx` CLIs for text-to-speech
- Supports multiple languages and voices
- Supports output `.mp3`, `.wav`, `.ogg`

## Execute

### 1. Prepare Text

> Goal: Have clear text

1. Receive the text from the user or a file
2. If the text is too long → split it into multiple chunks
3. Specify the language (default auto-detect)
4. Specify voice, speed, and output format

### 2. Choose CLI

> Goal: Pick the TTS tool

1. Primary: `bunx @pollinations/cli gen audio "<text>" --voice nova --output speech.mp3`
   - No API key required
   - Supports multiple voices
2. Fallback: `bunx talk-tts "<text>" -o out.wav`
   - Uses Kokoro, offline after download
   - Supports 150+ voices
3. Fallback: `bunx tts-cli "<text>" --save speech.mp3`
   - Uses Microsoft Edge TTS
   - Requires internet
4. Fallback: `bunx @illyism/transcribe` is not TTS (skip)

### 3. Generate Voice

> Goal: Create the audio file

1. Run the command with text, voice, and output
2. Wait until it finishes
3. Verify the output file size > 0
4. If the language is wrong → add `--lang` and re-run

### 4. Validate

> Goal: Check the audio

1. Use `ffprobe` or `file` to verify the type
2. If it opens → report the duration
3. Report the path, voice, and format

## Rules

### 1. Language

- Use auto-detect when unspecified
- If the text mixes languages → split chunks or pick a voice that supports them

### 2. Chunks

- For long text → split into multiple files then concat with ffmpeg
- Never send text beyond the provider's limit

### 3. No Leaks

- Never hardcode API keys
- Use an environment variable or ask the user

- Use /gen-subtitle-video if needed
- Use /gen-media-ai-videos if needed

## Expected Outcome

- A speech audio file generated from text
- The report includes path, voice, duration, and the tool used
- On failure, a fallback approach is given
