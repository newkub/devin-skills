import type { Context, Finding } from "./types";

// Auto-fix safe findings. Reserved for future fixable categories.
export async function applyFixes(_findings: Finding[], _ctx: Context): Promise<number> {
  return 0;
}
