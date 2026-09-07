import { SLEEP_MS, type Run, type RunView } from "./types.ts";

function repoFlag(repo?: string): string[] {
	return repo ? ["-R", repo] : [];
}

function shSync(args: string[]): string {
	const result = Bun.spawnSync({
		cmd: args,
		stdout: "pipe",
		stderr: "pipe",
	});
	if (result.exitCode !== 0) {
		throw new Error(
			result.stderr.toString().trim() ||
				`command failed (${result.exitCode}): ${args.join(" ")}`,
		);
	}
	return result.stdout.toString();
}

function execJson<T>(args: string[]): T {
	return JSON.parse(shSync(args)) as T;
}

export function sleep(ms: number): Promise<void> {
	return Bun.sleep(ms);
}

export function getLatestRun(repo?: string): Run {
	const [run] = execJson<Run[]>([
		"gh",
		"run",
		"list",
		...repoFlag(repo),
		"--limit",
		"1",
		"--json",
		"databaseId,headBranch,displayTitle,status,conclusion,event,url,createdAt,updatedAt",
	]);
	if (!run) {
		process.stderr.write("No recent GitHub Actions run found.\n");
		process.exit(1);
	}
	return run;
}

export function getRunView(runId: number, repo?: string): RunView {
	return execJson<RunView>([
		"gh",
		"run",
		"view",
		String(runId),
		...repoFlag(repo),
		"--json",
		"jobs,conclusion,headBranch,displayTitle,createdAt,updatedAt,status",
	]);
}

export function getRunDetails(runId: number, repo?: string): string {
	try {
		return shSync([
			"gh",
			"run",
			"view",
			String(runId),
			...repoFlag(repo),
		]).slice(0, 4_000);
	} catch {
		return "";
	}
}

export async function waitForRun(
	runId: number,
	timeoutMs: number,
	repo?: string,
): Promise<RunView> {
	const started = Date.now();
	while (true) {
		const view = getRunView(runId, repo);
		if (view.status === "completed") return view;
		if (Date.now() - started > timeoutMs) {
			process.stderr.write(`Timeout watching run ${runId}\n`);
			process.exit(1);
		}
		process.stdout.write(`Run ${runId} status: ${view.status}; waiting...\n`);
		await sleep(SLEEP_MS);
	}
}

export async function rerunRun(runId: number, repo?: string): Promise<number> {
	shSync(["gh", "run", "rerun", String(runId), ...repoFlag(repo)]);
	await sleep(3_000);
	const latest = getLatestRun(repo);
	return latest.databaseId;
}
