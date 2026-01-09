# TDD Parallel Development Pipeline

## Overview
NestJS + React 풀스택 프로젝트의 TDD 기반 병렬 개발 환경

## Tech Stack
- Backend: NestJS 10.x, TypeORM, PostgreSQL
- Frontend: React 18, TypeScript, TanStack Query, Tailwind CSS
- Testing: Jest, Supertest, React Testing Library, MSW

## Skills
이 프로젝트는 `.claude/skills/tdd-parallel/` 스킬을 사용합니다.
TDD 관련 작업 시 해당 스킬의 SKILL.md를 먼저 읽어주세요.

## Git Worktree Structure

| Worktree | Branch | Role |
|----------|--------|------|
| `../worktrees/qa-back` | `feat/qa-back` | Backend 테스트 작성 |
| `../worktrees/qa-front` | `feat/qa-front` | Frontend 테스트 작성 |
| `../worktrees/backend` | `feat/backend` | Backend 구현 |
| `../worktrees/frontend` | `feat/frontend` | Frontend 구현 |

## Commands

### /tdd-setup
Git worktree 초기 설정. `.claude/skills/tdd-parallel/scripts/setup-worktrees.sh` 실행.

### /tdd-pipeline [feature]
TDD 전체 파이프라인 자동 실행:
1. Phase 1: QA 테스트 작성 (병렬)
2. Phase 2: 구현 (병렬, 테스트 통과까지 반복)
3. Phase 3: dev merge → beta MR 생성

### /tdd-cleanup
Worktree 및 feature 브랜치 정리.

## Agent Work Directories

| Agent | Allowed | Forbidden |
|-------|---------|-----------|
| QA-Back | `backend/src/**/*.spec.ts`, `backend/test/**/*.e2e-spec.ts` | 구현 코드 |
| QA-Front | `frontend/src/**/*.test.tsx`, `frontend/src/**/*.spec.ts`, `frontend/src/mocks/` | 구현 코드 |
| Backend | `backend/src/**/*.ts` | `*.spec.ts`, `*.test.ts` |
| Frontend | `frontend/src/**/*.{ts,tsx}` | `*.test.*`, `*.spec.*`, `mocks/` |

## Critical Rules
- QA: 테스트만 작성, 반드시 실패하는 테스트 (Red)
- Dev: 테스트 통과까지 무한 반복, 테스트 코드 수정/삭제 절대 금지
