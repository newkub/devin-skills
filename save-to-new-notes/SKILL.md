---
name: save-to-new-notes
description: Create a new note in the repo D:\newkub\notes from a given file or text
argument-hint: "[scope]"
related:
  - list-newkub-notes

---

## Goal

Create a new note in `D:\newkub\notes` from a file or text

## Scope

- Takes input from the argument (file path or content)
- Supports both files and content
- Commits and pushes automatically

## Execute

### 1. Prepare Note Content

> Goal: Have the content to be saved into the repo

1. Take input from the argument
2. If the input is a file path, read the content
3. If there is no input, ask the user
4. Take `--name` or `--title` from the argument, or ask the user
5. Set the filename `<title>.md` in `D:\newkub\notes`

### 2. Create Note

> Goal: The note is created in the repo

1. Write the content to `D:\newkub\notes\<title>.md`
2. `git add . && git commit -m "add: <title> note" && git push`

### 3. Open And Report

> Goal: Show the note URL

1. Open `https://github.com/newkub/notes/blob/main/<title>.md`
2. Report the URL and path

## Rules

### 1. Input Handling

- If the argument matches an existing file path, read the file
- If it doesn't match a file path, treat it as text

### 2. Title

- If not specified, summarize from the content
- Use it as the filename

### 3. Safety

- Never save files containing secrets or credentials
- Check the content before committing
- If the file is larger than 10 MB, notify the user

- Use /list-newkub-notes if needed
- Use /open-web if needed

## Expected Outcome

- The note is created in `D:\newkub\notes`
- A correct URL is returned
- Saved and pushed successfully
