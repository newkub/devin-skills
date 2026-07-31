---
title: Rust Use Cases
description: กรณีการใช้งาน Rust ในสถานการณ์ต่างๆ
---

## Use Cases

### Systems Programming

**เหมาะสำหรับ:**
- OS kernels และ device drivers
- Embedded systems และ microcontrollers
- File systems และ storage engines
- Network stacks และ protocols

**ตัวอย่าง:**
- Redox OS - operating system ที่เขียนด้วย Rust
- Tokio - async runtime สำหรับ networking
- TiKV - distributed key-value store

### WebAssembly

**เหมาะสำหรับ:**
- Web applications ที่ต้องการ high-performance
- Image processing บน browser
- Game engines บน web
- Video/audio processing

**ตัวอย่าง:**
- Yew - framework สำหรับ building web apps
- Seed - framework สำหรับ Rust + WebAssembly
- Leptos - full-stack framework สำหรับ Rust

### CLI Tools

**เหมาะสำหรับ:**
- Command-line applications
- Developer tools
- System utilities
- Build tools

**ตัวอย่าง:**
- ripgrep - fast grep alternative
- bat - cat alternative พร้อม syntax highlighting
- fd - find alternative ที่เร็วกว่า

### Network Services

**เหมาะสำหรับ:**
- Web servers และ APIs
- Microservices
- Database proxies
- Message brokers

**ตัวอย่าง:**
- Actix-web - web framework
- Axum - web framework ที่ modern
- Rocket - web framework ที่ easy to use

### Game Development

**เหมาะสำหรับ:**
- Game engines
- Game logic
- Physics simulations
- Graphics rendering

**ตัวอย่าง:**
- Bevy - game engine
- Amethyst - data-driven game engine
- ggez - 2D game framework

### Blockchain

**เหมาะสำหรับ:**
- Smart contracts
- Cryptocurrency implementations
- Blockchain infrastructure
- DeFi applications

**ตัวอย่าง:**
- Solana - blockchain platform
- Polkadot - interoperable blockchain
- Near Protocol - sharded blockchain

### Data Processing

**เหมาะสำหรับ:**
- Data pipelines
- ETL processes
- Analytics engines
- Machine learning inference

**ตัวอย่าง:**
- DataFusion - query engine
- Polars - data manipulation library
- Burn - deep learning framework
