# Game Theory

## Goal

Understand game theory: minimax, Nash equilibrium, zero-sum games, dominant strategies, prisoner's dilemma, and their use in AI opponents, scheduling, auctions, and decision systems

## Scope

- Use for multi-agent systems, AI opponents, resource contention
- Covers normal form games, extensive form, mixed strategies
- Introduces minimax, alpha-beta pruning, Nash equilibrium

## Execute

### 1. Model The Game

> Goal: identify players, strategies, and payoffs

1. Identify all players
2. Identify each player's strategies
3. Identify the payoff matrix
4. State whether it's zero-sum or non-zero-sum
5. State whether there is perfect information

### 2. Find Dominant Strategies

> Goal: find the best strategy

1. Check for a dominant strategy: better no matter what the opponent does
2. Check for dominated strategies and remove them
3. Find a pure-strategy Nash equilibrium
4. If no pure one exists → find a mixed strategy

### 3. Minimax For Zero-Sum Games

> Goal: find the optimal strategy in zero-sum

1. Player A wants to maximize the minimum payoff
2. Player B wants to minimize the maximum payoff
3. Find the saddle point if one exists
4. Use alpha-beta pruning to cut the search space

### 4. Nash Equilibrium

> Goal: find the point where no player wants to deviate

1. In a Nash equilibrium each player picks a best response
2. There may be multiple equilibria
3. Used in auctions, negotiations, routing

### 5. Map To Code

> Goal: apply it in software

1. AI opponents use minimax in two-player games
2. Scheduling uses Nash equilibrium for resource contention
3. Load balancing uses mixed strategies
4. Use game theory in auction/bidding systems

## Rules

### 1. Game Type

- State zero-sum vs non-zero-sum
- State cooperative vs non-cooperative
- State perfect vs imperfect information

### 2. Assumptions

- Rational players
- Common knowledge of payoffs
- If the assumptions don't hold → use behavioral game theory

### 3. Code Mapping

- Use recursion for minimax
- Use memoization for repeated subgames
- Use simulation when payoffs are unclear

- Use /follow-math-concepts if needed
- Use /follow-goal if needed
- Use /follow-parallel if needed

## Expected Outcome

- Able to model a game with players/strategies/payoffs
- Able to find dominant strategies and Nash equilibria
- Able to use minimax/alpha-beta
- Able to apply it in AI and multi-agent systems
