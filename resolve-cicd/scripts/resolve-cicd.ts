import { execSync } from "node:child_process";

const SLEEP_MS = 10_000;
const CI_WATCH_TIMEOUT_MS = 900_000;
const _CD_WATCH_TIMEOUT_MS = 600_000;
const MAX_RETRIES = 5;
const MAX_SAME_FAILURE = 3;

interface Run {
	databaseId: number;
	headBranch: string;
	displayTitle: string;
	status: string;
	conclusion: string | null;
	event: string;
	url: string;
	createdAt: string;
	updatedAt: string;
}

interface RunView {
	headBranch: string;
	displayTitle: string;
	conclusion: string | null;
	status: string;
	createdAt: string;
	updatedAt: string;
	jobs: {
		name: string;
		conclusion: string | null;
		status: string;
	}[];
}

interface Args {
	runId?: number;
	url?: string;
	maxRetries: number;
	noRetry: boolean;
}

function parseArgs(argv: string[]): Args {
	let runId: number | undefined;
	let url: string | undefined;
	let maxRetries = MAX_RETRIES;
	let noRetry = false;

	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === "--run-id") runId = Number.parseInt(argv[++i], 10);
		else if (a === "--url") url = argv[++i];
		else if (a === "--max-retries") maxRetries = Number.parseInt(argv[++i], 10);
		else if (a === "--no-retry") noRetry = true;
		else if (a === "--help") {
			process.stdout.write(
				"Usage: bun resolve-cicd.ts [--run-id <id> | --url <url>] [--max-retries <n>] [--no-retry]\n",
			);
			process.exit(0);
		}
	}

	return { runId, url, maxRetries, noRetry };
}

function execJson<T>(command: string): T {
	const raw = execSync(command, {
		encoding: "utf8",
		maxBuffer: 10 * 1024 * 1024,
	});
	return JSON.parse(raw) as T;
}

function runShell(command: string): string {
	return execSync(command, { encoding: "utf8" });
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function isUnrecoverable(text: string): boolean {
	const lower = text.toLowerCase();
	return (
		lower.includes("spending limit") ||
		lower.includes("billing") ||
		lower.includes("payment") ||
		lower.includes("no runner") ||
		lower.includes("runner matching")
	);
}

function formatDuration(start: string, end: string): string {
	const diff = new Date(end).getTime() - new Date(start).getTime();
	if (diff < 1_000) return `${diff}ms`;
	return `${Math.round(diff / 1_000)}s`;
}

function getLatestRun(): Run {
	const [run] = execJson<Run[]>(
		"gh run list --limit 1 --json databaseId,headBranch,displayTitle,status,conclusion,event,url,createdAt,updatedAt",
	);
	if (!run) {
		process.stderr.write("No recent GitHub Actions run found.\n");
		process.exit(1);
	}
	return run;
}

function getRunView(runId: number): RunView {
	return execJson<RunView>(
		`gh run view ${runId} --json jobs,conclusion,headBranch,displayTitle,createdAt,updatedAt,status`,
	);
}

function getRunDetails(runId: number): string {
	try {
		return runShell(`gh run view ${runId}`).slice(0, 4_000);
	} catch {
		return "";
	}
}

async function waitForRun(runId: number, timeoutMs: number): Promise<RunView> {
	const started = Date.now();
	while (true) {
		const view = getRunView(runId);
		if (view.status === "completed") return view;
		if (Date.now() - started > timeoutMs) {
			process.stderr.write(`Timeout watching run ${runId}\n`);
			process.exit(1);
		}
		process.stdout.write(`Run ${runId} status: ${view.status}; waiting...\n`);
		await sleep(SLEEP_MS);
	}
}

async function rerunRun(runId: number): Promise<number> {
	runShell(`gh run rerun ${runId}`);
	await sleep(3_000);
	const latest = getLatestRun();
	return latest.databaseId;
}

function truncate(str: string, len: number): string {
	if (str.length <= len) return str;
	return `${str.slice(0, len - 3)}...`;
}

function stripAnsi(text: string): string {
	const esc = String.fromCharCode(0x1b);
	return text.replace(new RegExp(`${esc}\\[[0-9;]*m`, "g"), "");
}

function extractRootCause(details: string, conclusion: string): string {
	const cleaned = stripAnsi(details)
		.replace(/\r\n/g, "\n")
		.split("\n")
		.map((l) => l.replace(/^X\s+/, "").trim())
		.filter(
			(l) =>
				l.length > 0 &&
				!l.startsWith("JOBS") &&
				!l.startsWith("Triggered via") &&
				!l.startsWith("+") &&
				!l.startsWith("=") &&
				!l.startsWith("-"),
		);

	for (const line of cleaned) {
		const lower = line.toLowerCase();
		if (
			lower.includes("spending limit") ||
			lower.includes("billing") ||
			lower.includes("payment") ||
			lower.includes("no runner") ||
			lower.includes("runner matching")
		) {
			return line;
		}
	}

	for (const line of cleaned) {
		const lower = line.toLowerCase();
		if (
			lower.includes("error") ||
			lower.includes("failed") ||
			lower.includes("cannot") ||
			lower.includes("unable") ||
			lower.includes("exit code")
		) {
			return line;
		}
	}

	return `conclusion: ${conclusion}`;
}

function printReport(
	mode: "CI" | "CD",
	platform: string,
	target: string,
	status: string,
	duration: string,
	rootCause: string,
	action: string,
) {
	const cols = [
		"No.",
		"Mode",
		"Platform",
		"Target",
		"Status",
		"Duration",
		"Root Cause",
		"Action",
	];
	const widths = [3, 8, 12, 20, 8, 8, 24, 28];
	const values = [
		"1",
		mode,
		platform,
		target,
		status,
		duration,
		rootCause,
		action,
	].map((v, i) => truncate(v, widths[i]).padEnd(widths[i]));

	const sep = `+${widths.map((w) => "-".repeat(w + 2)).join("+")}+`;
	process.stdout.write(`\n${sep}\n`);
	process.stdout.write(
		`| ${cols.map((c, i) => c.padEnd(widths[i])).join(" | ")} |\n`,
	);
	process.stdout.write(`${sep}\n`);
	process.stdout.write(`| ${values.join(" | ")} |\n`);
	process.stdout.write(`${sep}\n\n`);
}

async function watchCi(runId: number, maxRetries: number, noRetry: boolean) {
	let currentRunId = runId;
	let attempts = 0;
	const seenFailures: string[] = [];

	while (attempts <= maxRetries) {
		attempts += 1;
		const view = await waitForRun(currentRunId, CI_WATCH_TIMEOUT_MS);
		const conclusion = view.conclusion ?? "unknown";
		const duration = formatDuration(view.createdAt, view.updatedAt);

		if (conclusion === "success") {
			printReport(
				"CI",
				"GitHub Actions",
				view.displayTitle,
				"success",
				duration,
				"-",
				"-",
			);
			process.exit(0);
		}

		const details = getRunDetails(currentRunId);
		const rootCause = extractRootCause(details, conclusion);

		if (isUnrecoverable(details)) {
			printReport(
				"CI",
				"GitHub Actions",
				view.displayTitle,
				"failure",
				duration,
				rootCause,
				"Check GitHub Billing & plans; re-run not possible without resolving billing",
			);
			process.exit(1);
		}

		if (noRetry || attempts > maxRetries) {
			printReport(
				"CI",
				"GitHub Actions",
				view.displayTitle,
				"failure",
				duration,
				rootCause,
				"Review logs and /resolve-errors",
			);
			process.exit(1);
		}

		seenFailures.push(rootCause);
		const sameFailureCount = seenFailures.filter((f) => f === rootCause).length;
		if (sameFailureCount >= MAX_SAME_FAILURE) {
			printReport(
				"CI",
				"GitHub Actions",
				view.displayTitle,
				"failure",
				duration,
				rootCause,
				`Same failure repeated ${MAX_SAME_FAILURE} times; recommend rollback or /resolve-errors`,
			);
			process.exit(1);
		}

		process.stdout.write(
			`Run ${currentRunId} failed (${conclusion}). Retrying... (${attempts}/${maxRetries})\n`,
		);
		currentRunId = await rerunRun(currentRunId);
	}

	process.stderr.write("Max retries reached.\n");
	process.exit(1);
}

function watchCd(url: string) {
	process.stdout.write(
		`CD mode for ${url} is not implemented in this script.\n`,
	);
	process.stdout.write(
		"Use /watch-deploy for the target platform.\n",
	);
	process.exit(1);
}

function main() {
	const args = parseArgs(process.argv.slice(2));

	if (args.url) {
		watchCd(args.url);
		return;
	}

	const run = args.runId ? ({ databaseId: args.runId } as Run) : getLatestRun();
	watchCi(run.databaseId, args.maxRetries, args.noRetry);
}

main();
