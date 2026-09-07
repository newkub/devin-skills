# AI Documentation Tools

## Goal

ใช้ AI tools สำหรับ documentation ที่มี MCP integration

## Steps

1. ใช้ DeepWiki (`mcp3_ask_question`, `mcp3_read_wiki_contents`, `mcp3_read_wiki_structure`) สำหรับ GitHub repositories
2. ใช้ Context7 (`context7_resolve-library-id`, `context7_get-library-docs`) สำหรับ library documentation
3. ใช้ DeepWiki `ask_question` เพื่อถามคำถามเฉพาะเจาะจงเกี่ยวกับ repo
4. ใช้ Context7 สำหรับดึง docs ของ library ที่ต้องการ
5. บันทึก key findings จากแต่ละ tool
