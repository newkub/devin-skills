use std::process::Command;

use anyhow::{Context, Result};

pub fn is_inside_work_tree() -> Result<bool> {
    let output = Command::new("git")
        .args(["rev-parse", "--is-inside-work-tree"])
        .output()
        .context("failed to run git rev-parse")?;
    if !output.status.success() {
        return Ok(false);
    }
    Ok(String::from_utf8_lossy(&output.stdout).trim() == "true")
}

pub fn start_ref_exists(refs: &str) -> Result<bool> {
    let start = refs.split("..").next().unwrap_or(refs);
    if start.is_empty() {
        return Ok(false);
    }
    let output = Command::new("git")
        .args(["rev-parse", "--verify", start])
        .output()
        .context("failed to run git rev-parse")?;
    Ok(output.status.success())
}
