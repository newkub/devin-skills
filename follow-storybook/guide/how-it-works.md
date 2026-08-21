# How It Works

## Storybook Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Storybook Architecture                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    UI Layer                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │
│  │  │  Stories    │  │  Controls   │  │  Addons     │   │   │
│  │  │  Panel      │  │  Panel      │  │  Panel      │   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│                              │                              │
│                              ▼                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Preview Iframe                          │   │
│  │                                                       │   │
│  │   ┌─────────────────────────────────────────────┐    │   │
│  │   │            Component Under Test               │    │   │
│  │   │                                              │    │   │
│  │   │   <Button variant="primary">Click</Button>    │    │   │
│  │   │                                              │    │   │
│  │   └─────────────────────────────────────────────┘    │   │
│  │                                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Component Story Format (CSF3)

```
┌─────────────────────────────────────────────────────────────┐
│                    Story Definition                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Meta Definition                                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ import type { Meta, StoryObj } from '@storybook/*'; │   │
│  │                                                    │   │
│  │ const meta: Meta<typeof Button> = {               │   │
│  │   component: Button,                             │   │
│  │   tags: ['autodocs'],                             │   │
│  │ };                                                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  2. Story Export                                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ export const Primary: StoryObj<typeof Button> = { │   │
│  │   args: { variant: 'primary' },                    │   │
│  │ };                                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Story Loading Flow

```
.storybook/main.ts
       │
       ▼
  Storyglobs (*.stories.*)
       │
       ▼
  ┌─────────────────┐
  │  Story Loader   │ (Parses CSF)
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │  Story Index    │ (stories.json)
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │   Storybook UI   │ (Rendered)
  └─────────────────┘
```

## Addon System

```
┌─────────────────────────────────────────────────────────────┐
│                    Addon Architecture                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌────────────┐ │
│  │   Essentials │────►│ Interactions │────►│  Controls  │ │
│  │    Bundle    │     │              │     │            │ │
│  └──────────────┘     └──────────────┘     └────────────┘ │
│         │                   │                    │          │
│         └───────────────────┼────────────────────┘          │
│                             │                               │
│                             ▼                               │
│                    ┌─────────────────┐                      │
│                    │   Addon API     │                      │
│                    │                 │                      │
│                    │ - addDecorator  │                      │
│                    │ - addParameters │                      │
│                    │ - addArgTypes   │                      │
│                    └─────────────────┘                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Controls Flow

```
User Input (Controls Panel)
       │
       ▼
  argTypes JSON Schema
       │
       ▼
  ┌─────────────────┐
  │  Control Render │ (Select, Text, Range, Color, etc.)
  └────────┬────────┘
           │
           ▼
  Update Story Args
           │
           ▼
  ┌─────────────────┐
  │  Re-render      │ → Preview Iframe
  │  Component      │
  └─────────────────┘
```

## Testing with Playwright

```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';

const preview: Preview = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
  },
};

export default preview;
```

## Auto-Docs Generation

```
┌─────────────────────────────────────────────────────────────┐
│                   Autodocs Flow                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  @component                        @tags(['autodocs'])       │
│     │                                    │                   │
│     │                                    ▼                   │
│     │                          ┌─────────────────┐          │
│     │                          │   Docgen        │          │
│     │                          │   Extractor     │          │
│     │                          └────────┬────────┘          │
│     │                                   │                    │
│     │                                   ▼                    │
│     │                         ┌─────────────────┐           │
│     │                         │  MDX Generation │           │
│     │                         └────────┬────────┘           │
│     │                                  │                     │
│     ▼                                  ▼                     │
│  ┌─────────┐                  ┌─────────────────┐          │
│  │ Stories │                  │  Documentation  │          │
│  │ (CSF)   │                  │     Page        │          │
│  └─────────┘                  └─────────────────┘          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```