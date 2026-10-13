# WebP Conversion

Convert PNG/JPG/GIF images to `.webp` quickly with a `bunx` CLI.

## Scope

- Accept input as a file or a directory
- Supports quality, output directory, and recursive mode
- Supports several CLIs depending on the environment

## Identify Input

1. Take the input path from the user
2. Check whether it is a file or a directory
3. If a file → identify the extension `.png`, `.jpg`, `.jpeg`, `.gif`, `.tiff`
4. If a directory → determine whether to recurse

## Choose CLI

1. Primary: `bunx lazywebp <input>`
   - Single file: `bunx lazywebp -q 85 photo.png`
   - Multiple files: `bunx lazywebp a.png b.png`
   - Directory: `bunx lazywebp -r -q 85 -o output/ images/`
2. Fallback: `bunx @nathievzm/lumi -i <input> -f .webp`
3. Fallback: `bunx 2webp <input> --format=webp --output=<dir>`
4. If no CLI is available → write a Bun script with `sharp`

## Run Conversion

1. Run the command with the specified quality (default 85)
2. Check the output path
3. If the input is a directory, preserve its structure
4. Wait until the process finishes

## Validate

1. Check that the output file size is > 0
2. Open it or use the `file` command to verify the type
3. Report the input/output paths and file sizes

## Rules

### Quality

- default quality = 85
- If the user gives no quality, use 85
- quality 0-100

### Backup

- Never delete the source file by default
- If the user wants to replace → ask for confirmation

### Fallback Chain

- Try `lazywebp` first
- On failure → `lumi` or `2webp`
- Last resort → a `sharp` script

## Expected Outcome

- A `.webp` file is created from the input
- The output is smaller than the source
- Report the paths, quality, and tool used
