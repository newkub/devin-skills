# Installation

วิธีติดตั้ง ast-grep

## Using Bun (Recommended)

```bash
bun add -g @ast-grep/cli
```

## Using bun

```bash
bun install -g @ast-grep/cli
```

## Using Homebrew (macOS)

```bash
brew install ast-grep
```

## Verify Installation

```bash
ast-grep --version
```

## Project Setup

สำหรับการใช้งานใน project แนะนำให้ใช้ผ่าน bunx โดยไม่ต้องติดตั้ง:

```bash
bunx ast-grep --pattern 'console.log($ARG)' --lang ts ./src
```
