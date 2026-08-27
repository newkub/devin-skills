use std::path::PathBuf;
use std::process::Command;

use anyhow::{Context, Result, anyhow};

pub mod args;
pub mod decision;
pub mod git;

pub use args::Args;
pub use decision::Decision;

pub const DEFAULT_REFS: &str = "HEAD~1..HEAD";

pub fn run(targets: &[PathBuf], refs: &str, verbose: bool) -> Result<Decision> {
    if targets.is_empty() {
        return Err(anyhow!("no target path specified"));
    }

    for target in targets {
        if !target.exists() {
            if verbose {
                eprintln!("create: target does not exist: {}", target.display());
            }
            return Ok(Decision::Create);
        }
    }

    if !git::is_inside_work_tree()? {
        if refs == DEFAULT_REFS {
            eprintln!("Warning: not inside a git repository; assuming update");
            return Ok(Decision::Update);
        }
        return Err(anyhow!("not inside a git repository"));
    }

    if !git::start_ref_exists(refs)? {
        if refs == DEFAULT_REFS {
            eprintln!(
                "Warning: cannot resolve default ref '{}'; assuming update",
                refs
            );
            return Ok(Decision::Update);
        }
        return Err(anyhow!("git ref not found: {}", refs));
    }

    let mut cmd = Command::new("git");
    cmd.args(["diff", refs, "--name-only", "--"]);
    for target in targets {
        cmd.arg(target);
    }

    if verbose {
        eprintln!("running: {:?}", cmd);
    }

    let output = cmd.output().context("failed to run git diff")?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        if refs == DEFAULT_REFS {
            eprintln!(
                "Warning: git diff failed ({}); assuming update",
                stderr.trim()
            );
            return Ok(Decision::Update);
        }
        return Err(anyhow!("git diff failed: {}", stderr.trim()));
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    if stdout.trim().is_empty() {
        Ok(Decision::Skip)
    } else {
        Ok(Decision::Update)
    }
}
