# Architecture

## Anime.js Architecture

- **Timeline System** - Core timeline สำหรับจัดการ animations
- **Animation Objects** - Objects ที่ represent animations
- **Player System** - สำหรับ playback control
- **Plugin System** - Extensible plugin architecture

## Core Components

### Timeline

Timeline เป็นหัวใจของ Anime.js:
- จัดการ multiple animations
- ควบคุม timing และ sequencing
- รองรับ parallel และ sequential animations

### Animation Objects

Animation objects มี:
- Target elements
- Properties ที่จะ animate
- Duration และ easing
- Callbacks และ events

## Plugin Architecture

Plugins ขยาย functionality:
- Custom easings
- Custom properties
- Performance optimizations
