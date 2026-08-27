use std::path::PathBuf;

use clap::Parser;

use crate::DEFAULT_REFS;

#[derive(Parser, Debug)]
#[command(
    name = "check-should-update",
    version,
    about = "ตรวจสอบ git changes เพื่อตัดสินใจว่า target ต้องอัปเดทหรือไม่"
)]
pub struct Args {
    /// Target path(s) to check
    #[arg(required = true, value_name = "TARGET")]
    pub targets: Vec<PathBuf>,

    /// Git ref range to diff (e.g. HEAD~1..HEAD)
    #[arg(short, long, default_value = DEFAULT_REFS, value_name = "REFS")]
    pub refs: String,

    /// Verbose output
    #[arg(short, long)]
    pub verbose: bool,
}
