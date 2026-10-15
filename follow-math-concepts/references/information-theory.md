# Information Theory

## Goal

Understand information theory: entropy, information content, encoding, compression, KL-divergence, and their use in data analysis, logs, compression, and AI

## Scope

- Use to analyze uncertainty, predictability, and encoding efficiency
- Covers Shannon entropy, Huffman coding, source coding
- Introduces KL-divergence and mutual information

## Execute

### 1. Calculate Entropy

> Goal: find the uncertainty of the data

1. Identify the probability distribution `P(x_i)`
2. Compute the entropy: `H(X) = -Σ P(x_i) * log2(P(x_i))`
3. The unit is bits
4. High entropy = high uncertainty = hard to predict

### 2. Information Content

> Goal: find the information of an event

1. `I(x) = -log2(P(x))`
2. Rare events carry high information
3. Use it to weigh the importance of log events

### 3. Encoding And Compression

> Goal: find an efficient encoding

1. Use Huffman coding for symbols with differing frequencies
2. Use prefix codes to avoid ambiguity
3. Compute the expected code length: `Σ P(x_i) * length(code_i)`
4. Compare against the entropy to judge efficiency

### 4. KL-Divergence And Mutual Information

> Goal: compare distributions

1. KL-divergence: `D_KL(P || Q) = Σ P(x) * log(P(x)/Q(x))`
2. Measures the difference between two distributions
3. Mutual information: `I(X;Y) = H(X) - H(X|Y)`
4. Measures the relationship between variables

### 5. Map To Code

> Goal: apply it in software

1. Analyze logs: which events are predictable, which are surprising
2. Find compression opportunities in data
3. Use entropy in feature selection for ML
4. Use KL-divergence when comparing models/distributions

## Rules

### 1. Probability Distribution

- Must be a valid distribution (sums to 1, non-negative)
- Beware `log(0)` — use a limit or smoothing

### 2. Log Base

- base 2 = bits
- base e = nats
- Use base 2 for information/compression

### 3. Code Mapping

- Use `Math.log2()` where available
- Use streaming algorithms for large datasets
- Estimate distributions with a histogram or count-min sketch

- Use /follow-math-concepts if needed
- Use /follow-context-engineering if needed
- Use /follow-tool-knip if needed

## Expected Outcome

- Able to compute entropy
- Able to design Huffman-like encodings
- Able to use KL-divergence to compare distributions
- Able to analyze the predictability of logs/data
