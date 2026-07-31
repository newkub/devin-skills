# How It Works

## หลักการทำงานของ Anime.js

Anime.js ใช้ `requestAnimationFrame` API สำหรับสร้าง animation loop ที่มีประสิทธิภาพสูง

## Animation Flow

```
┌─────────────┐
│  Create     │
│  Instance   │
└──────┬──────┘
       ↓
┌─────────────┐
│  Configure  │
│  Parameters │
└──────┬──────┘
       ↓
┌─────────────┐
│  Start      │
│  Animation  │
└──────┬──────┘
       ↓
┌─────────────────────────────┐
│  Animation Loop             │
│  ┌───────────────────────┐  │
│  │ requestAnimationFrame │  │
│  └───────────┬───────────┘  │
│              ↓              │
│  ┌───────────────────────┐  │
│  │ Calculate Progress    │  │
│  │ (time / duration)     │  │
│  └───────────┬───────────┘  │
│              ↓              │
│  ┌───────────────────────┐  │
│  │ Apply Easing         │  │
│  │ to Progress          │  │
│  └───────────┬───────────┘  │
│              ↓              │
│  ┌───────────────────────┐  │
│  │ Calculate Values      │  │
│  │ (start + diff * eased)│  │
│  └───────────┬───────────┘  │
│              ↓              │
│  ┌───────────────────────┐  │
│  │ Update DOM/Canvas     │  │
│  └───────────┬───────────┘  │
│              ↓              │
│  ┌───────────────────────┐  │
│  │ Trigger Callbacks     │  │
│  │ (update, complete)    │  │
│  └───────────┬───────────┘  │
└──────────────┼──────────────┘
               ↓
        ┌─────────────┐
        │  Complete   │
        └─────────────┘
```

## การคำนวณ Animation Values

### 1. Progress Calculation

```javascript
// Progress = (currentTime - startTime) / duration
const progress = (currentTime - startTime) / duration;
// progress: 0 → 1
```

### 2. Easing Application

```javascript
// Apply easing function to progress
const easedProgress = easingFunction(progress);
// easedProgress: 0 → 1 (with timing curve)
```

### 3. Value Calculation

```javascript
// Calculate current value
const currentValue = startValue + (endValue - startValue) * easedProgress;
```

## ตัวอย่าง Easing Functions

| Function | Curve | Description |
|----------|-------|-------------|
| linear | ━━━━━━━━━━━ | ความเร็วคงที่ |
| easeInQuad | `━━━━━━━` | เริ่มช้า แล้วเร็วขึ้น |
| easeOutQuad | `      ━━━━━━━━` | เริ่มเร็ว แล้วช้าลง |
| easeInOutQuad | `  ━━━━━━  ` | เริ่มช้า กลางเร็ว จบช้า |

## Timeline Scheduling

Timeline ใช้สำหรับจัดลำดับ animations หลายๆ ตัว:

```
┌─────────────────────────────────────────────┐
│ Timeline                                    │
├─────────────────────────────────────────────┤
│ Animation 1: ━━━━━━━━━━━                   │
│ Animation 2:       ━━━━━━━━━━━              │
│ Animation 3:           ━━━━━━━━━━━          │
│ Animation 4:               ━━━━━━━━━━━      │
└─────────────────────────────────────────────┘
              Time →
```

## Performance Optimization

Anime.js ใช้เทคนิคต่อไปนี้เพื่อประสิทธิภาพ:

1. **requestAnimationFrame** - ใช้ browser's native animation loop
2. **GPU Acceleration** - ใช้ CSS transforms แทน position properties
3. **Batch Updates** - รวม DOM updates ในแต่ละ frame
4. **Lazy Evaluation** - คำนวณค่าเมื่อจำเป็นเท่านั้น

## Memory Management

- Animation instances ถูกเก็บใน array ภายใน Anime.js
- ใช้ `.remove()` หรือ `.cancel()` เพื่อลบ instance
- ใช้ `.reset()` เพื่อรีเซ็ตค่าเริ่มต้น
- ใช้ `.pause()` และ `.play()` เพื่อควบคุม playback
