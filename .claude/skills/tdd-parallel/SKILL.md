---
name: tdd-parallel
description: TDD 기반 병렬 개발 파이프라인. Git Worktree를 활용해 4개의 서브 에이전트(QA Backend, QA Frontend, Backend Dev, Frontend Dev)가 병렬로 작업. /tdd-setup, /tdd-pipeline, /tdd-cleanup 명령어 사용 시 이 스킬 참조.
---

# TDD Parallel Development Pipeline

## Architecture
```
Phase 1 (Parallel):     Phase 2 (Parallel):        Phase 3:
┌─────────────┐        ┌─────────────┐
│ QA Backend  │───────▶│ Backend Dev │──────┐
└─────────────┘        └─────────────┘      │     ┌──────────┐
                                            ├────▶│ dev merge│──▶ MR to beta
┌─────────────┐        ┌─────────────┐      │     └──────────┘
│ QA Frontend │───────▶│Frontend Dev │──────┘
└─────────────┘        └─────────────┘
```

## Commands

### /tdd-setup
Worktree 환경 설정. `scripts/setup-worktrees.sh` 실행.

### /tdd-pipeline [feature_description]

**Step 1: Feature 분석 (Extended Thinking)**
- API 계약 설계 (endpoints, request/response)
- DB 스키마 설계
- 컴포넌트 구조 설계
- 테스트 시나리오 도출

**Step 2: Phase 1 - QA Tests (Parallel)**

Task 1 - QA Backend:
```
cd ../worktrees/qa-back
# references/qa-backend.md 참조
# 테스트 작성 후:
git add . && git commit -m "test(backend): [feature] tests" && git push origin feat/qa-back
```

Task 2 - QA Frontend:
```
cd ../worktrees/qa-front
# references/qa-frontend.md 참조
# MSW handlers + 테스트 작성 후:
git add . && git commit -m "test(frontend): [feature] tests" && git push origin feat/qa-front
```

**Step 3: Phase 2 - Implementation (Parallel)**

Task 3 - Backend Dev:
```
cd ../worktrees/backend
git fetch origin feat/qa-back && git merge origin/feat/qa-back --no-edit
# references/backend-dev.md 참조
# 모든 테스트 통과까지 반복 (테스트 수정 금지!)
git add . && git commit -m "feat(backend): [feature] impl" && git push origin feat/backend
```

Task 4 - Frontend Dev:
```
cd ../worktrees/frontend
git fetch origin feat/qa-front && git merge origin/feat/qa-front --no-edit
# references/frontend-dev.md 참조
# 모든 테스트 통과까지 반복 (테스트 수정 금지!)
git add . && git commit -m "feat(frontend): [feature] impl" && git push origin feat/frontend
```

**Step 4: Phase 3 - Integration & MR**
```bash
git checkout dev && git pull origin dev
git merge origin/feat/qa-back --no-edit
git merge origin/feat/qa-front --no-edit
git merge origin/feat/backend --no-edit
git merge origin/feat/frontend --no-edit

# 전체 테스트
cd backend && npm run test && npm run test:e2e && cd ..
cd frontend && npm run test && cd ..

git push origin dev

# MR 생성
gh pr create --base beta --head dev --title "feat: [feature]" --body "..."
# 또는 GitLab: glab mr create --source-branch dev --target-branch beta ...
```

### /tdd-cleanup
```bash
git worktree remove ../worktrees/qa-back
git worktree remove ../worktrees/qa-front
git worktree remove ../worktrees/backend
git worktree remove ../worktrees/frontend
git push origin --delete feat/qa-back feat/qa-front feat/backend feat/frontend
git branch -D feat/qa-back feat/qa-front feat/backend feat/frontend
```

## Agent References
각 에이전트 상세 가이드:
- QA Backend: `references/qa-backend.md`
- QA Frontend: `references/qa-frontend.md`
- Backend Dev: `references/backend-dev.md`
- Frontend Dev: `references/frontend-dev.md`

## Critical Rules
1. QA 에이전트: 테스트만 작성, 구현 코드 금지
2. Dev 에이전트: 테스트 파일 수정/삭제 절대 금지
3. Dev 에이전트: 모든 테스트 통과까지 무한 반복
4. 각 에이전트는 지정된 worktree에서만 작업
