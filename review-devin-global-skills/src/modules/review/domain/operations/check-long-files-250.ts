import { THRESHOLD } from "../../../../shared/constants.ts";
import type { Issue, SkillFile } from "../../../../shared/types.ts";

export function checkLongFiles(files: Pick<SkillFile, "path" | "lineCount">[]): Issue[] {
  const over = files.filter((f) => f.lineCount > THRESHOLD);
  over.sort((a, b) => b.lineCount - a.lineCount);

  return over.map((f) => ({
    file: f.path,
    line: 1,
    message: `${f.lineCount} lines (max ${THRESHOLD})`,
  }));
}
