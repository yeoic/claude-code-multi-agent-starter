---
name: e2e-test
description: Runs E2E integration tests using Playwright MCP for browser automation.
allowed-tools: Bash, Read, mcp__playwright__*
---

# E2E Integration Test Skill

## Capability
This skill provides browser-based E2E integration testing using **Playwright MCP**.
Use this to verify that frontend and backend work together correctly in a real browser environment.

## Prerequisites
- Playwright MCP server configured in `.mcp.json`
- Backend server running on `http://localhost:3000`
- Frontend server running on `http://localhost:5173`

## Instructions

### 1. Start Servers
Before running E2E tests, ensure both servers are running:

```bash
# Start backend (background)
cd backend && npm run start &

# Start frontend (background)
cd frontend && npm run dev &

# Wait for servers to be ready
sleep 5
```

### 2. Run Browser Tests
Use Playwright MCP tools to automate browser testing:

#### Navigate to Page
```
mcp__playwright__browser_navigate
- url: "http://localhost:5173"
```

#### Take Snapshot (for text verification)
```
mcp__playwright__browser_snapshot
```
- Returns accessibility tree with all visible text
- Use to verify text content like "hello world"

#### Take Screenshot (for visual verification)
```
mcp__playwright__browser_screenshot
```
- Captures current page state as image
- Use to verify visual layout

#### Click Element
```
mcp__playwright__browser_click
- element: "button"
- ref: "submit-btn"
```

#### Type Text
```
mcp__playwright__browser_type
- element: "input"
- ref: "search-input"
- text: "search query"
```

### 3. Verify Results
Compare actual results with expected behavior:

| Check | Tool | Verification |
|-------|------|--------------|
| Page loads | `browser_navigate` | No error returned |
| Text visible | `browser_snapshot` | Expected text in output |
| UI correct | `browser_screenshot` | Visual inspection |
| Interaction works | `browser_click` | State changes correctly |

### 4. Report Results
After testing, generate a test report with:
- Test cases executed
- Expected vs Actual results
- Pass/Fail status
- Screenshots (if applicable)

## Common Test Scenarios

### Hello World Verification
```
1. browser_navigate → http://localhost:5173
2. browser_snapshot → Check for "hello world" text
3. browser_screenshot → Capture visual proof
```

### Form Submission Test
```
1. browser_navigate → /form-page
2. browser_type → Fill input fields
3. browser_click → Submit button
4. browser_snapshot → Verify success message
```

### API Integration Test
```
1. browser_navigate → Page that calls API
2. Wait for data to load
3. browser_snapshot → Verify API data displayed
```

## Cleanup
After testing, stop the background servers:
```bash
pkill -f "nest start" || true
pkill -f "vite" || true
```
