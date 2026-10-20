# chrome-devtools-mcp Tools Reference

| key | value |
|-----|-------|
| package | `chrome-devtools-mcp` (npm, GoogleChromeLabs) |
| install/register | `bunx chrome-devtools-mcp@1.10.1` as a stdio MCP server |
| stable version | `1.10.1` (published 2026-09-23, verified 2026-10-03) |
| requires | Chrome installed locally (launch/connect via CDP) |
| docs/repo | https://github.com/ChromeDevTools/chrome-devtools-mcp |

Every tool takes `pageId` (number) for the target page — obtained from `list_pages`/`new_page`; interact tools take a `uid` from `take_snapshot`

## Pages And Navigation

| tool | description | key params |
|------|-------------|-----------|
| `new_page` | Open a new tab with a URL | `url`, `background` |
| `navigate_page` | Navigate the current page | `url`, `type` (navigate/back/forward/reload), `timeout`, `ignoreCache` |
| `list_pages` | List all pages with their pageId | — |
| `select_page` | Select the active page | `pageId` |
| `close_page` | Close a page (the last page cannot be closed) | `pageId` |
| `wait_for` | Wait for a condition | `text` (array), `timeout` |
| `resize_page` | Resize the page viewport | `width`, `height` |

## Interaction (uid from snapshot)

| tool | description | key params |
|------|-------------|-----------|
| `take_snapshot` | Read the a11y tree → uids of elements | `verbose`, `filePath` |
| `click` | click element (`dblClick: true` = double) | `uid`, `dblClick`, `includeSnapshot` |
| `hover` | Hover an element | `uid`, `includeSnapshot` |
| `fill` | Fill an input/textarea/select | `uid`, `value`, `includeSnapshot` |
| `fill_form` | Fill multiple fields at once — preferred for forms | `elements: [{uid,value}]`, `includeSnapshot` |
| `type_text` | Type text (keyboard events) | `text`, `submitKey` |
| `press_key` | Press a key/shortcut | `key` (e.g. `Enter`, `Control+A`) |
| `drag` | Drag an element onto another element | `from_uid`, `to_uid` |
| `upload_file` | Upload a file into an input | `uid`, `filePath` |
| `handle_dialog` | accept/dismiss dialog + prompt text | `action`, `promptText` |
| `evaluate_script` | Run a JS function in the page (returns JSON) | `function`, `args`, `filePath`, `dialogAction`, `waitForStableDom` |

## Inspection

| tool | description | key params |
|------|-------------|-----------|
| `list_console_messages` | Console messages since the latest navigation | `types`, `pageSize`, `pageIdx`, `includePreservedMessages`, `includeStackTraces` |
| `get_console_message` | Details of a message by `msgid` | `msgid` |
| `list_network_requests` | All requests (status, method, url, type) | `pageSize`, `pageIdx`, `resourceTypes` |
| `get_network_request` | Headers/cookies/body of a request | `reqid`, `requestFilePath`, `responseFilePath` |
| `get_css_styles` | Matched/inline/inherited/cascade rules of an element | `uid`, `pageSize`, `pageIdx` |
| `take_screenshot` | Capture an image | `format` (png/jpeg/webp), `quality`, `fullPage`, `uid` (element), `filePath` |

## Performance, Memory And Audits

| tool | description | key params |
|------|-------------|-----------|
| `performance_start_trace` | Start recording a performance trace | `reload`, `autoRecord` |
| `performance_stop_trace` | Stop the trace and get the result | `filePath` |
| `performance_analyze_insight` | Analyze the trace → CWV insights | `insightSetId`, `insightName` |
| `take_heapsnapshot` | Heap snapshot for memory analysis | `filePath` |
| `lighthouse_audit` | Audit a11y/SEO/best-practices/agentic (perf excluded) | `mode` (navigation/snapshot), `device` (desktop/mobile), `outputDirPath` |

## Emulation

| tool | description | key params |
|------|-------------|-----------|
| `emulate` | Emulate conditions for a page | `networkConditions`, `cpuThrottlingRate`, `geolocation`, `userAgent`, `colorScheme`, `viewport`, `extraHttpHeaders` |
