use std::env;
use std::path::PathBuf;

use clap::Parser;

#[derive(Parser, Debug)]
#[command(
    name = "check-broken-skills-references",
    version,
    about = "Scan devin skills repo for broken skill references in SKILL.md"
)]
struct Args {
    #[arg(short, long)]
    root: Option<PathBuf>,
}

fn default_root() -> PathBuf {
    if let Some(appdata) = env::var_os("APPDATA") {
        PathBuf::from(appdata).join("devin").join("skills")
    } else if let Some(home) = env::var_os("HOME") {
        PathBuf::from(home).join(".devin").join("skills")
    } else {
        PathBuf::from(".")
    }
}

fn main() {
    let args = Args::parse();
    check_broken_skills_references::run(args.root.unwrap_or_else(default_root));
}
