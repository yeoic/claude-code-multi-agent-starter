---
name: github-ops
description: Handles GitHub Issue creation, Branch management, and PR operations. Use for project management tasks.
allowed-tools: Bash, Read, Write
---

# GitHub Operations Skill

## Capability
This skill provides the standard procedures for managing the BMAD6 project lifecycle.

## Instructions

### 1. Create Ticket
When asked to create a ticket:
1.  Format the body with clear "Tech Spec" and "TODOs".
2.  Run: `gh issue create --title "[Title]" --body "[Body]"`
3.  Output the created Issue Number.

### 2. Start Work
When starting work on Issue #ID:
1.  Run: `git fetch origin`
2.  Run: `git checkout -b topic/feat-[#ID]`
3.  Run: `./scripts/sync-worktrees.sh topic/feat-[#ID]` (Assumes script exists)

### 3. Pull Request
When work is done:
1.  Run: `git push origin topic/feat-[#ID]`
2.  Run: `gh pr create --base dev --head topic/feat-[#ID] --fill`