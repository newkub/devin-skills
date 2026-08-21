# Quick Start

เริ่มต้นใช้งาน RMUX อย่างรวดเร็ว

## Installation

```bash
cargo install rmux
```

## Basic Usage

```bash
# Create session
rmux new-session -s mysession

# Attach to session
rmux attach -t mysession

# List sessions
rmux ls

# Kill session
rmux kill-session -t mysession
```
