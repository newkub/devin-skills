use std::fs;
use std::io::Write;
use std::path::Path;

pub(crate) fn emit_concat(
    paths: &[String],
    root: &Path,
    max_lines: Option<usize>,
    out: &mut dyn Write,
) -> std::io::Result<()> {
    for rel_path in paths {
        writeln!(out, "===== {} =====", rel_path)?;
        let full = root.join(rel_path.replace('/', std::path::MAIN_SEPARATOR_STR));
        match fs::read_to_string(&full) {
            Ok(content) => {
                if let Some(max) = max_lines {
                    let mut count = 0;
                    for line in content.lines() {
                        if count >= max {
                            writeln!(out, "… (truncated at {} lines)", max)?;
                            break;
                        }
                        writeln!(out, "{}", line)?;
                        count += 1;
                    }
                } else {
                    out.write_all(content.as_bytes())?;
                    if !content.ends_with('\n') {
                        writeln!(out)?;
                    }
                }
            }
            Err(e) => writeln!(out, "(unreadable: {})", e)?,
        }
    }
    Ok(())
}
