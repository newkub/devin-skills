# Python Integration (PyO3)

```toml
[package]
name = "my-python-module"
version = "0.1.0"
edition = "2021"

[lib]
name = "my_module"
crate-type = ["cdylib"]

[dependencies]
pyo3 = { version = "0.20", features = ["extension-module"] }
```

```rust
use pyo3::prelude::*;
use pyo3::wrap_pyfunction;

#[pyfunction]
fn sum_as_string(a: i32, b: i32) -> String {
    (a + b).to_string()
}

#[pymodule]
fn my_module(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(sum_as_string, m)?)?;
    Ok(())
}
```
