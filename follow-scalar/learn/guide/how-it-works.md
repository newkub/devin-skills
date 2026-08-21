# How It Works - Scalar

## Overview

Scalar API Designer ทำงานโดยการอ่าน GraphQL schema และสร้าง interface สำหรับทดสอบและดูเอกสารแบบ interactive

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Scalar Architecture                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐         │
│  │   Schema    │ ──── │   Parser    │ ──── │   Renderer  │         │
│  │   Input     │      │             │      │             │         │
│  └─────────────┘      └─────────────┘      └─────────────┘         │
│         │                    │                    │                 │
│         ▼                    ▼                    ▼                 │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐        │
│  │  .graphql    │      │ AST Graph   │      │   Web UI    │        │
│  │  .json       │      │             │      │             │        │
│  │  OpenAPI     │      └─────────────┘      └─────────────┘        │
│  └─────────────┘                                 │                  │
│         │                                        ▼                  │
│         │                               ┌─────────────┐             │
│         └──────────────────────────────│ Playground  │             │
│                                         │   Editor    │             │
│                                         └─────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                         Data Flow                                 │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐    │
│  │  Input  │ ──▶ │ Schema  │ ──▶ │  Mock   │ ──▶ │   API   │    │
│  │ Sources │     │ Parser  │     │ Server  │     │  Docs   │    │
│  └─────────┘     └─────────┘     └─────────┘     └─────────┘    │
│                                                                   │
│  Sources:                                                         │
│  ├── GraphQL SDL files                                            │
│  ├── Existing GraphQL endpoints                                   │
│  ├── OpenAPI/Swagger specs                                        │
│  └── Manual type definition                                       │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Schema Parser

Parse GraphQL schema เป็น internal representation:

```
Input: type User { id: ID!, name: String! }
                │
                ▼
Output: { types: [{ name: "User", fields: [...] }] }
```

### 2. Mock Server

สร้าง mock data อัตโนมัติตาม schema types:

| Type | Mock Strategy |
|------|----------------|
| String | Random words |
| Int | Random numbers (1-1000) |
| Boolean | Random true/false |
| ID | UUID |
| DateTime | ISO timestamp |
| Enum | Random enum value |

### 3. Documentation Generator

สร้าง API docs จาก schema descriptions และ comments

### 4. Playground Editor

Interactive GraphQL query editor พร้อม:

- Syntax highlighting
- Autocomplete
- Variable panel
- Response viewer

## Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Typical Workflow                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. 📝 Define Schema ──▶ 2. 🔍 Test Queries                     │
│          │                      │                               │
│          ▼                      ▼                               │
│  3. 📚 Generate Docs ──▶ 4. 🚀 Deploy/Share                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Configuration Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                     Configuration Flow                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  scalar.config.json ──▶ Environment Variables ──▶ CLI Flags      │
│         │                      │                    │              │
│         └──────────────────────┴────────────────────┘             │
│                                │                                  │
│                                ▼                                  │
│                      Final Configuration                          │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## Key Processes

| Process | Description |
|---------|-------------|
| Schema Loading | Parse และ validate GraphQL schema |
| Type Introspection | Extract types, fields, directives |
| Mock Generation | Create realistic mock data |
| Documentation | Generate human-readable docs |
| Request Proxy | Forward requests to actual API |