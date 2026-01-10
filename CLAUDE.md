# BMAD6: Autonomous TDD Software Factory

## 0. Absolute principle
****

## 1. Overview
NestJS + React 풀스택 프로젝트를 위한 **1인 개발 에이전트 오케스트레이션** 환경입니다.
**Contract-First** 설계와 **Red-Green-Refactor** 사이클을 GitHub Ops 자동화로 강제합니다.

## 2. Tech Stack & Tools
- **App:** NestJS 10.x, React 18, Drizzle, TanStack Query
- **Test:** Jest, Supertest, MSW, RTL
- **Ops:** `zx` (Scripting), GitHub CLI (`gh`), Git Worktree

## 3. Agent Roles & Workflows
모든 작업은 **Planner의 티켓 생성**으로 시작되며, **Reviewer의 승인**으로 끝납니다.

| Role | Agent Name | Responsibility | Worktree Path |
|------|------------|----------------|---------------|
| **Planner** | `PM` | 요구사항 분석, Tech Spec 정의, GitHub Issue 생성 | (Root) |
| **Architect** | `Arch` | **Phase 0:** API Contract(Zod) 정의, Skeleton Code 작성 | `../worktrees/architect` |
| **QA** | `QA-Back`<br>`QA-Front` | **Phase 1 (Red):** 실패하는 테스트 케이스 작성 | `../worktrees/qa-back`<br>`../worktrees/qa-front` |
| **Developer** | `Dev-Back`<br>`Dev-Front` | **Phase 2 (Green):** 테스트 통과 구현 및 리팩토링 | `../worktrees/backend`<br>`../worktrees/frontend` |
| **Reviewer** | `Reviewer` | **Phase 3:** CI 결과 확인, 코드 리뷰, Merge 승인 | (Root) |

## 4. Automation Commands (Skills)
이 프로젝트는 `.claude/skills/github-ops`를 사용하여 파이프라인을 제어합니다.

- **`/ops ticket [title] "[detail]"`**
    - (Planner) 요구사항을 분석하여 GitHub Issue를 생성하고 TODO 리스트를 작성합니다.
- **`/ops start [issue-id]`**
    - (Architect) 해당 이슈 처리를 위한 `topic/feat-[id]` 브랜치를 생성하고, 모든 Worktree를 해당 브랜치로 동기화(Checkout)합니다.
- **`/ops ready`**
    - (QA/Dev) 현재 작업 내용을 Push하고, 진행 상황(Issue Comment)을 업데이트합니다.
- **`/ops pr`**
    - (Dev) 구현이 완료되면 `dev` 브랜치를 향한 PR을 생성합니다.
- **`/ops merge [pr-id]`**
    - (Reviewer) CI(GitHub Actions)가 통과되었는지 확인 후 PR을 병합합니다.

## 5. Directory & Permission Rules
에이전트는 자신의 역할에 맞는 파일만 건드려야 합니다.

| Agent | Write Access (허용) | Read-Only (참조) | Forbidden (금지) |
|-------|---------------------|------------------|------------------|
| **Architect** | `libs/shared/**/*`<br>`backend/src/**/*.ts` (Skeleton)<br>`frontend/src/**/*.tsx` (Skeleton) | 전체 | 테스트 코드 |
| **QA-Back** | `backend/src/**/*.spec.ts`<br>`backend/test/**/*.e2e-spec.ts` | `libs/shared` | 구현 코드 (`.ts`) |
| **QA-Front** | `frontend/src/**/*.test.tsx`<br>`frontend/mocks/**` | `libs/shared` | 구현 코드 (`.tsx`) |
| **Dev-Back** | `backend/src/**/*.ts` | `libs/shared`<br>`*.spec.ts` | 테스트 수정 |
| **Dev-Front** | `frontend/src/**/*.{ts,tsx}` | `libs/shared`<br>`*.test.tsx` | 테스트 수정 |

## 6. Git Strategy
- **`dev`**: 개발 메인 브랜치 (항상 배포 가능 상태 유지, 직접 Push 금지)
- **`topic/feat-[id]-[name]`**: 작업 브랜치. 모든 Agent가 이 브랜치를 공유하며 작업함.
- **Worktree Sync**: `/ops start` 실행 시 5개의 Worktree가 모두 동일한 Topic Branch를 바라보게 됨.