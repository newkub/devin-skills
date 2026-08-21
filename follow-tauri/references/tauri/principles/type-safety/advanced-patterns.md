# Advanced Patterns

## 1. Phantom Types

```rust
use std::marker::PhantomData;

struct Meter<T> {
    value: f64,
    _phantom: PhantomData<T>,
}

struct Length;
struct Time;

fn calculate_speed(distance: Meter<Length>, time: Meter<Time>) -> f64 {
    distance.value / time.value
}
```

## 2. Type-Level State Machines

```rust
struct Locked;
struct Unlocked;

struct Door<State> {
    _state: PhantomData<State>,
}

impl Door<Locked> {
    fn unlock(self) -> Door<Unlocked> {
        Door { _state: PhantomData }
    }
}

impl Door<Unlocked> {
    fn lock(self) -> Door<Locked> {
        Door { _state: PhantomData }
    }
}
```

## 3. Dependent Types (Simulation)

```rust
struct Vector<const N: usize> {
    data: [f64; N],
}

impl<const N: usize> Vector<N> {
    fn new(data: [f64; N]) -> Self {
        Self { data }
    }

    fn dot(&self, other: Vector<N>) -> f64 {
        self.data.iter()
            .zip(other.data.iter())
            .map(|(a, b)| a * b)
            .sum()
    }
}
```
