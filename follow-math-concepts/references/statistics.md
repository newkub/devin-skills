# Statistics

## Goal

Understand statistics for software: descriptive stats, percentiles, distributions, hypothesis testing, regression, and their application in metrics, logs, benchmarks

## Scope

- Use to analyze performance metrics, error rates, user behavior
- Covers mean, median, mode, variance, standard deviation, percentiles
- Introduces hypothesis testing and confidence intervals

## Execute

### 1. Descriptive Statistics

> Goal: summarize a dataset

1. Find the mean (average), median (middle value), mode (most-repeated value)
2. Find the variance and standard deviation
3. Find the min, max, range
4. Find the percentiles: p50, p90, p95, p99
5. Use a histogram to view the distribution

### 2. Choose Central Tendency

> Goal: pick the suitable measure

1. Use the mean when there are no outliers
2. Use the median when there are outliers or the distribution is skewed
3. Use the mode for categorical data
4. Use percentiles for latency / response time

### 3. Hypothesis Testing

> Goal: test a hypothesis

1. Define the null hypothesis and the alternative hypothesis
2. Choose the test: t-test, chi-square, Mann-Whitney U
3. Set the significance level `α` (e.g. 0.05)
4. Compute the p-value
5. If p < α → reject the null hypothesis

### 4. Compare Distributions

> Goal: compare data groups

1. Use a box plot to compare percentiles
2. Use a CDF to compare distributions
3. Use the KS test to compare 2 distributions

### 5. Map To Code

> Goal: apply in software

1. Analyze latency: mean, p95, p99
2. A/B test: compare conversions with a t-test
3. Detect anomalies: find values beyond 3 standard deviations
4. Capacity planning: use percentiles to set resources

## Rules

### 1. Data Quality

- Check missing values before analyzing
- Beware outliers
- State the sample size

### 2. Distribution Awareness

- Don't assume the data is always normal
- Use a non-parametric test if the distribution is unknown

### 3. Code Mapping

- Use streaming for percentiles on large data
- Use reservoir sampling for large datasets
- Use time-series when there is temporal data

- Use /follow-math-concepts if needed
- Use /deep-test if needed
- Use /deep-debug (Triage Incident) if needed
- Use /follow-goal if needed

## Expected Outcome

- Able to compute descriptive statistics
- Able to choose the suitable central tendency
- Able to do basic hypothesis testing
- Able to analyze metrics/logs/benchmarks
