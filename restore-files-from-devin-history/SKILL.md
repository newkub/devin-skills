---
name: restore-files-from-devin-history
description: Recover badly damaged files from Devin session history when git restore no longer works
argument-hint: "[file]"
related:
  - deep-debug
  - ask-me
---
## Goal

Recover data or understand what happened before the file was damaged, when git can no longer restore it, by reading the Devin CLI session history

## Scope

Used when a file or workspace is badly damaged such that `git restore` does not help, there is no other backup, and you need to investigate what the AI did beforehand

## Execute

### 1. Assess Git State

> Goal: Check the git state first

1. Run `git status` in the damaged repo
2. Check `git log -1 --format='%H %ci %s'` to know the last commit time
3. Try `git diff` or `git show HEAD:<file>` to see whether the important data is still there
4. If the necessary data is missing from git → proceed

### 2. Inspect Devin Session History

> Goal: Read the Devin CLI history

1. Look at the folder `%APPDATA%\devin\cli\summaries`
2. Find the latest `history_*.md` file (sorted by name or modified time)
3. Read the latest summary file that matches the period before the file was damaged
4. Search for the commands the user gave and the actions the agent took
5. Look in the folder `%APPDATA%\devin\cli` for additional logs or session files if any
6. Record the list of related commands/files

### 3. Correlate With Last Commit

> Goal: Compare the times

1. Record the last commit time from step 1
2. Record the time of the damaged file (`ls -la` or `Get-ChildItem`)
3. Record the time of the latest Devin summary
4. Build a timeline: last commit → actions taken → file damaged

### 4. Report Findings

> Goal: Report what was found

1. Summarize the damaged files and the suspected cause
2. Specify the last commit time and git state
3. Report the important commands or actions from the Devin session
4. Specify the data that can still be recovered (if any), such as from temp files, summaries, logs
5. Do not recommend doing the restore yourself without asking the user first

### 5. Ask Next Step

> Goal: Ask the user how to proceed

1. Use the `ask-me` skill to ask the user with clear options
2. Options such as:
   - Try to recover manually from the session logs
   - Go back to work at the last commit and redo it
   - Skip that file and proceed with something else
   - Have the user send the remaining backup or reference
3. Explain the risk of each option

## Rules

### 1. Do Not Guess

- Do not guess what the file contained before it was damaged
- Reference only information that can be read from git, summaries, logs
- If there is no evidence, tell the user directly

### 2. No Auto-Destructive Recovery

- Do not run `git clean`, `git reset --hard`, or delete files without asking
- Do not overwrite files that may still contain data
- Make a backup before every recovery

### 3. Session Privacy

- Read only the summaries that are necessary
- Do not share secret data (keys, tokens) that may be found in logs
- Report only what is related to the damaged files

### 4. Clear Communication

- Use concise language
- Show the timeline as bullet points
- Do not answer questions before all the information has been gathered

- Use /deep-debug if necessary
- Use /restore-files-from-git-log if necessary

## Expected Outcome

- Know whether git restore truly cannot help
- Have a timeline of the events before the damage
- Have a report of the important commands and actions from the Devin session
- The user receives recovery options with risks and confirms before anything is done
