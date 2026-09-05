import { getLatestRun } from "./lib/gh.ts";
import { MAX_RETRIES, type Args, type Run } from "./lib/types.ts";
import { watchCi, watchUrl } from "./lib/watch.ts";

function parseArgs(argv: string[]): Args {
	let runId: number | undefined;
	let url: string | undefined;
	let maxRetries = MAX_RETRIES;
	let noRetry = false;

	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === "--run-id") runId = Number.parseInt(argv[++i], 10);
		else if (a === "--url") url = argv[++i];
		else if (a === "--max-retries")
			maxRetries = Number.parseInt(argv[++i], 10);
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

async function main() {
	const args = parseArgs(process.argv.slice(2));

	if (args.url) {
		await watchUrl(args.url, args.maxRetries, args.noRetry);
		return;
	}

	const run = args.runId
		? ({ databaseId: args.runId } as Run)
		: getLatestRun();
	await watchCi(run.databaseId, args.maxRetries, args.noRetry);
}

await main();
