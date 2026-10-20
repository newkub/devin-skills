# Use Case — Embeddings and Retrieval

> Turn documents into vectors you can search, keep the model and dimensions pinned, and rank chunks by cosine similarity before they reach the prompt. Source: https://platform.openai.com/docs/guides/embeddings (accessed 2026-10-20)

## 1. Embed a batch of chunks

```ts
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 30_000 });

const EMBED_MODEL = "text-embedding-3-small";
const DIMENSIONS = 512;

const { data } = await client.embeddings.create({
  model: EMBED_MODEL,
  input: chunks,
  dimensions: DIMENSIONS,
  encoding_format: "float",
});

const vectors = [...data]
  .sort((a, b) => a.index - b.index)
  .map((item) => item.embedding);
```

Send an array, not one request per chunk: batching is the difference between one round trip and a thousand. Sort by `index` before pairing vectors with chunks — the response order is not part of the contract.

## 2. Chunk on structure, not on character count

```ts
export function chunkByParagraph(text: string, maxChars = 1_200, overlap = 120): string[] {
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    if (current.length + paragraph.length > maxChars && current) {
      chunks.push(current);
      current = current.slice(-overlap);
    }
    current = `${current}\n\n${paragraph}`.trim();
  }

  if (current) chunks.push(current);
  return chunks;
}
```

A fixed 800-character window cuts sentences and table rows in half, and the resulting embedding points at a fragment that answers nothing. Split on the document's own boundaries first, then apply the size cap. The overlap keeps a sentence that straddles two chunks retrievable from either.

## 3. Rank by cosine similarity

```ts
function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

const query = await client.embeddings.create({
  model: EMBED_MODEL,
  input: "how do refunds work",
  dimensions: DIMENSIONS,
});

const [queryVector] = query.data;
if (!queryVector) throw new Error("embedding API returned no vector");

const ranked = vectors
  .map((vector, index) => ({ index, score: cosine(queryVector.embedding, vector) }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 5);
```

Normalize once at write time if you search often — `text-embedding-3-*` vectors are already unit length, so the denominator is 1 and the dot product alone ranks correctly.

## 4. Pin model and dimensions in the schema

```sql
CREATE TABLE doc_chunk (
  id text PRIMARY KEY,
  source text NOT NULL,
  content text NOT NULL,
  embed_model text NOT NULL,
  embedding vector(512) NOT NULL
);

CREATE INDEX doc_chunk_embedding_idx ON doc_chunk USING hnsw (embedding vector_cosine_ops);
```

```sql
SELECT id, content, 1 - (embedding <=> $1::vector) AS score
FROM doc_chunk
WHERE embed_model = 'text-embedding-3-small'
ORDER BY embedding <=> $1::vector
LIMIT 5;
```

Store the model name next to the vector. A vector from another model has the same shape and no comparable meaning, so a mixed table returns confident nonsense. Changing `dimensions` later means a new column and a re-embed, not an `ALTER`.

## 5. Never re-embed unchanged text

```ts
const hash = new Bun.CryptoHasher("sha256").update(chunk).digest("hex");
const existing = await db.docChunk.findUnique({ where: { id: hash } });
if (existing) return existing.embedding;
```

Keying by the content hash makes an incremental rebuild cheap and idempotent: edit one page, pay for one page. Keying by file path alone re-embeds the whole file whenever a comma moves.

## 6. Verify

1. Query with an exact sentence from a document — its own chunk is the top hit
2. Query something unrelated — the top score is visibly low, which is the threshold you tune
3. Count rows in `doc_chunk` against the number of chunks produced by the splitter — equal
4. Re-run the ingestion with no source change — zero embedding calls
5. Swap `dimensions` and run the query — it fails loudly instead of returning garbage
6. `/run-verify` and `/run-test`

## Pitfalls

- Embedding the query with a different model or dimension count than the documents.
- Sending one request per chunk and hitting the rate limit instead of batching.
- Assuming `data` arrives in input order and pairing the wrong vector with the wrong chunk.
- Chunking mid-sentence, so no chunk contains a complete answer.
- Storing vectors without the model name, which makes a later migration indistinguishable from a bug.
- Similarity alone as the answer: a high score means "related", not "answers the question" — rerank or filter before prompting.
- Sending more than the top few chunks to the model, paying for context that dilutes the answer.

## Related

- `references/apis.md`
- `best-practices/usage.md`
- `usecases/retry-rate-limits-and-usage.md`
- `usecases/structured-output.md`
