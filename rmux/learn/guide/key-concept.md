# Key Concepts

แนวคิดหลักของ RMUX

## Overview

RMUX เป็น terminal multiplexer ที่เขียนด้วย Rust ออกแบบมาเพื่อ:
- Automation ของ terminal sessions
- Programmatic control ผ่าน Rust SDK
- Compatible กับ tmux
- High performance ด้วย Rust

## Core Concepts

- **Sessions**: จัดการ terminal sessions หลายๆ ตัว
- **Panes**: แบ่ง terminal เป็นส่วนๆ
- **Windows**: จัดการ terminal windows ภายใน session
- **Rust SDK**: Control ผ่าน Rust code
