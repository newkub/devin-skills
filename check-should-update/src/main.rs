use std::process::ExitCode;

use check_should_update::{Args, run};
use clap::Parser;

fn main() -> ExitCode {
    let args = Args::parse();
    match run(&args.targets, &args.refs, args.verbose) {
        Ok(decision) => {
            println!("{}", decision);
            ExitCode::SUCCESS
        }
        Err(err) => {
            eprintln!("ERROR: {}", err);
            ExitCode::FAILURE
        }
    }
}
