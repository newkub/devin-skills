#!/usr/bin/env bun
// list-x-reposts — list reposts (retweets) of an X user via X API v2
// usage: bun run scripts/list-x-reposts.ts [username] [--limit n] [--json]
// env:   X_BEARER_TOKEN (set in env or .env in this skill directory)

const args = process.argv.slice(2);
const json = args.includes("--json");
const limitIdx = args.indexOf("--limit");
const limit = limitIdx >= 0 ? Number(args[limitIdx + 1]) : 50;
const username = args.find((a) => !a.startsWith("--") && a !== String(limit)) ?? "newkrubx";

const token = process.env.X_BEARER_TOKEN;
if (!token) {
  console.error("missing X_BEARER_TOKEN — set it in .env or environment (https://developer.x.com)");
  process.exit(1);
}

const api = async (path: string) => {
  const res = await fetch(`https://api.x.com${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`X API ${res.status}: ${await res.text()}`);
  return res.json();
};

const user = await api(`/2/users/by/username/${encodeURIComponent(username)}?user.fields=name,username`);
if (!user.data) throw new Error(`user @${username} not found`);

const params = new URLSearchParams({
  max_results: String(Math.min(limit, 100)),
  expansions: "referenced_tweets.id,referenced_tweets.id.author_id",
  "tweet.fields": "created_at,author_id,referenced_tweets",
  "user.fields": "username,name",
});

const tl = await api(`/2/users/${user.data.id}/tweets?${params}`);

const tweets = new Map<string, any>((tl.includes?.tweets ?? []).map((t: any) => [t.id, t]));
const users = new Map<string, any>((tl.includes?.users ?? []).map((u: any) => [u.id, u]));

const reposts = (tl.data ?? [])
  .filter((t: any) => t.referenced_tweets?.some((r: any) => r.type === "retweeted"))
  .map((t: any) => {
    const ref = t.referenced_tweets.find((r: any) => r.type === "retweeted");
    const orig = tweets.get(ref.id);
    const author = orig ? users.get(orig.author_id) : null;
    return {
      reposted_at: t.created_at,
      author: author ? `@${author.username}` : "unknown",
      text: (orig?.text ?? "").replace(/\s+/g, " ").slice(0, 120),
      url: `https://x.com/i/status/${ref.id}`,
    };
  });

if (json) {
  console.log(JSON.stringify(reposts, null, 2));
} else {
  for (const r of reposts) console.log([r.reposted_at, r.author, r.text, r.url].join("\t"));
  console.error(`${reposts.length} reposts for @${username}`);
}
