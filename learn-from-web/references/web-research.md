# Web Research

Learn from the primary website and documentation systematically — use when the source is a tool, library, framework, or topic that needs external information

## 1. Research Strategy

Define the priority order of the sources:

1. `Official Documentation` — always the primary source (highest priority)
2. `DeepWiki` — for GitHub repositories
3. `Context7` — for libraries and frameworks
4. `Web Search` — fallback when there is no information from the other sources

## 2. Official Website Research

1. Identify the official website of the tool, library, or framework you want to learn
2. Use `webfetch`/`read_url_content` to read the documentation pages directly
3. Use CRW (`crw_scrape`, `crw_map`, `crw_crawl`) to crawl the whole documentation site
4. Always start from the getting started or quickstart page
5. Read the API reference and guides in order
6. Record code examples and configuration examples from the official site
7. Check the version that matches the current project
8. Use the domain filter in Web Search to limit results to the official site only, e.g., domain: "bun.sh"

## 3. DeepWiki Research

1. Use `read_wiki_structure` to view all topics
2. Use `read_wiki_contents` to read the content of the selected topic
3. Use `ask_question` for specific questions
4. Start with structure to view all topics first
5. Select topics relevant to the current work
6. Read getting started before advanced topics
7. Record code examples and configuration examples

## 4. Context7 Research

1. Use `resolve-library-id` to find the correct library ID
2. Use `query-docs` for the documentation you need
3. Make the query specific, e.g., "How to setup authentication with JWT in Express.js"
4. Check the source reputation and benchmark scores
5. Choose a library with High or Medium source reputation
6. Read the examples and code snippets Context7 provides
7. Check the version compatible with the project
8. Do not call Context7 more than 3 times per question

## 5. Web Search Research

1. Use `web_search`/`search_web` when there is no information from DeepWiki or Context7
2. Define a clear and specific query
3. Use the domain filter if necessary, e.g., domain: "bun.sh"
4. Compare information from multiple sources
5. Check that the information is current (check publish date)

## 6. Knowledge Extraction

1. Note down the key principles and core concepts
2. Identify all the main features and capabilities
3. Record best practices and recommendations
4. Record the important code examples together with explanations
5. Record the important configuration examples
6. Record edge cases and common pitfalls
7. Create a summary for each source

## 7. Validation

1. Try using it as learned
2. Create a sample project to test
3. Compare information from multiple sources
4. Confirm that the information is current
5. Check that the code examples actually work
6. Test edge cases and error handling

## 8. Application

1. Apply the knowledge in a real project
2. Create examples or tutorials for the team
3. Follow updates from the primary website regularly
4. Create a learning loop for self-development
5. Record lessons learned for future reference
6. Share knowledge with the team through documentation

## Notes

- Run `/deep-research` when you want to search from NPM, GitHub, DeepWiki, Context7, and WebSearch at the same time
- Run `/follow-best-practice` to apply the knowledge according to the standards of the language, runtime, and library
- Run `/deep-research setup` if necessary
