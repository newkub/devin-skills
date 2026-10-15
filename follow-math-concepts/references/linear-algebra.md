# Linear Algebra

## Goal

Understand linear algebra: vectors, matrices, dot product, cross product, matrix multiplication, transformations, and their use in ML, graphics, and embeddings

## Scope

- Use for embeddings, graphics, transformations, ML basics
- Covers vectors, matrices, dot/cross product, norm, transpose, inverse
- Introduces basic eigenvalues/eigenvectors

## Execute

### 1. Work With Vectors

> Goal: compute vector operations

1. Represent a vector as a tuple `(x, y, z)`
2. Find the length/norm: `||v|| = sqrt(x^2 + y^2 + z^2)`
3. Add/subtract vectors component-wise
4. Multiply by a scalar
5. Find the dot product: `a · b = Σ a_i * b_i`

### 2. Use Dot Product

> Goal: find similarity or projection

1. Cosine similarity: `(a · b) / (||a|| ||b||)`
2. Use it to compare embeddings
3. Find the projection of vector a onto b
4. Use the dot product to check orthogonality

### 3. Work With Matrices

> Goal: compute matrix operations

1. Add/subtract matrices of the same size
2. Multiply matrices: `(AB)_ij = Σ_k A_ik * B_kj`
3. Find the transpose `A^T`
4. Find the identity matrix `I`
5. Use transformations: scale, rotate, translate

### 4. Apply To Code

> Goal: apply it in software

1. Use embedding similarity in search/AI
2. Use matrix transformations in graphics/WebGL
3. Use linear regression with least squares
4. Use PCA to reduce dimensions

## Rules

### 1. Dimensions Must Match

- Vector/matrix operations must have correct dimensions
- Dot products need equal sizes
- Matrix multiplication needs A's columns = B's rows

### 2. Avoid Misuse

- Cosine similarity measures direction, not magnitude
- Euclidean distance differs from the dot product
- Use normalized vectors when comparing direction

### 3. Code Mapping

- Use TypedArrays for performance
- Use libraries like `mathjs` or `numpy` when complex
- Use WebGL matrices for graphics

- Use /follow-math-concepts if needed

## Expected Outcome

- Able to compute vector/matrix operations
- Able to compute cosine similarity
- Able to use linear algebra in embeddings/graphics/ML
- Able to tell when a library is warranted
