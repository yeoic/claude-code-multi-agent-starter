# TDD Parallel Development Pipeline

Git Worktree + Claude Code를 활용한 TDD 기반 병렬 풀스택 개발 자동화 시스템

## 📋 목차

- [개요](#개요)
- [아키텍처](#아키텍처)
- [설치](#설치)
- [사용법](#사용법)
- [명령어](#명령어)
- [에이전트 구성](#에이전트-구성)
- [워크플로우 상세](#워크플로우-상세)
- [파일 구조](#파일-구조)
- [주의사항](#주의사항)
- [FAQ](#faq)

---

## 개요

4개의 전문가 에이전트가 병렬로 TDD(Test-Driven Development) 방식으로 개발을 수행합니다.

| 에이전트 | 역할 | 브랜치 |
|---------|------|--------|
| **QA Backend** | NestJS 테스트 작성 | `feat/qa-back` |
| **QA Frontend** | React 테스트 작성 | `feat/qa-front` |
| **Backend Dev** | NestJS 구현 | `feat/backend` |
| **Frontend Dev** | React 구현 | `feat/frontend` |

### 핵심 원칙

```
1. QA가 먼저 실패하는 테스트 작성 (Red)
2. Dev가 테스트 통과하는 코드 구현 (Green)
3. 테스트 코드는 절대 수정/삭제 금지
4. 모든 테스트 통과까지 무한 반복
```

---

## 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                 /tdd-pipeline [feature]                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Phase 0: Extended Thinking                                     │
│  ├── API 설계 (endpoints, request/response)                     │
│  ├── DB 스키마 설계                                              │
│  ├── 컴포넌트 구조 설계                                          │
│  └── 테스트 시나리오 도출                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
┌───────────────────────┐           ┌───────────────────────┐
│  Phase 1: QA (병렬)    │           │  Phase 1: QA (병렬)    │
│                       │           │                       │
│  📁 ../worktrees/     │           │  📁 ../worktrees/     │
│      qa-back          │           │      qa-front         │
│                       │           │                       │
│  🌿 feat/qa-back      │           │  🌿 feat/qa-front     │
│                       │           │                       │
│  ✍️  테스트 작성       │           │  ✍️  테스트 작성       │
│  📤 commit & push     │           │  📤 commit & push     │
└───────────────────────┘           └───────────────────────┘
            │                                   │
            └─────────────────┬─────────────────┘
                              ▼
                      [ Phase 1 완료 ]
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
┌───────────────────────┐           ┌───────────────────────┐
│  Phase 2: Dev (병렬)   │           │  Phase 2: Dev (병렬)   │
│                       │           │                       │
│  📁 ../worktrees/     │           │  📁 ../worktrees/     │
│      backend          │           │      frontend         │
│                       │           │                       │
│  🌿 feat/backend      │           │  🌿 feat/frontend     │
│                       │           │                       │
│  🔀 QA 테스트 merge   │           │  🔀 QA 테스트 merge   │
│  🔄 구현 (반복)       │           │  🔄 구현 (반복)       │
│  ✅ 테스트 통과       │           │  ✅ 테스트 통과       │
│  📤 commit & push     │           │  📤 commit & push     │
└───────────────────────┘           └───────────────────────┘
            │                                   │
            └─────────────────┬─────────────────┘
                              ▼
                      [ Phase 2 완료 ]
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Phase 3: 통합                                                  │
│  ├── dev 브랜치에 모든 feature merge                            │
│  ├── 전체 테스트 실행                                           │
│  └── beta 브랜치로 MR 생성                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ✨ MR 생성 완료!
```

---

## 설치

### 1. 파일 복사

```bash
# ZIP 압축 해제
unzip tdd-parallel-pipeline.zip

# 프로젝트 루트에 파일 복사
cp tdd-parallel-pipeline/CLAUDE.md your-project/
cp -r tdd-parallel-pipeline/.claude your-project/
```

### 2. 디렉토리 구조 확인

```
your-project/
├── CLAUDE.md
├── .claude/
│   └── skills/
│       └── tdd-parallel/
│           ├── SKILL.md
│           ├── scripts/
│           │   ├── setup-worktrees.sh
│           │   └── cleanup-worktrees.sh
│           └── references/
│               ├── qa-backend.md
│               ├── qa-frontend.md
│               ├── backend-dev.md
│               └── frontend-dev.md
├── backend/          # NestJS 프로젝트
│   ├── src/
│   ├── test/
│   └── package.json
└── frontend/         # React 프로젝트
    ├── src/
    └── package.json
```

### 3. 스크립트 실행 권한

```bash
chmod +x .claude/skills/tdd-parallel/scripts/*.sh
```

---

## 사용법

### Step 1: 초기 설정 (프로젝트당 최초 1회)

**Claude Code에서:**
```
/tdd-setup
```

**수동 실행:**
```bash
./.claude/skills/tdd-parallel/scripts/setup-worktrees.sh
```

**실행 결과:**
```
🚀 TDD 병렬 개발 환경 설정 시작...
📌 Step 1: dev 브랜치 확인
📁 Step 2: Worktree 디렉토리 생성
🌿 Step 3: Feature 브랜치 생성
🌳 Step 4: Git Worktree 생성
📦 Step 5: 의존성 설치

✅ 설정 완료!

📋 Worktree 목록:
/path/to/project              abc1234 [dev]
/path/to/worktrees/qa-back    def5678 [feat/qa-back]
/path/to/worktrees/qa-front   ghi9012 [feat/qa-front]
/path/to/worktrees/backend    jkl3456 [feat/backend]
/path/to/worktrees/frontend   mno7890 [feat/frontend]
```

---

### Step 2: TDD 파이프라인 실행

**Claude Code에서:**
```
/tdd-pipeline [기능 설명]
```

**예시:**
```
/tdd-pipeline JWT 기반 사용자 인증 (로그인, 회원가입, 토큰 갱신, 내 정보 조회)
```

```
/tdd-pipeline 칸반 보드 - 보드 CRUD, 칼럼 관리, 카드 드래그앤드롭, 실시간 동기화
```

```
/tdd-pipeline Todo 앱 - 할일 CRUD, 완료 토글, 필터링, 정렬
```

**실행 결과 예시:**
```
🚀 TDD Pipeline 시작: 칸반 보드 기능

📋 Phase 0: 스펙 분석 중... (Extended Thinking)
   - API 엔드포인트 12개 도출
   - 컴포넌트 8개 식별
   - 테스트 시나리오 45개 생성

📝 Phase 1: QA 테스트 작성 (병렬 실행 중)
   ├── [qa-backend] 24개 테스트 작성 중... ✅ 완료 (2분 30초)
   └── [qa-frontend] 21개 테스트 작성 중... ✅ 완료 (2분 45초)

💻 Phase 2: 구현 (병렬 실행 중)
   ├── [backend] 테스트 통과 시도 중...
   │   ├── Attempt 1: 18/24 passed ❌
   │   ├── Attempt 2: 22/24 passed ❌
   │   └── Attempt 3: 24/24 passed ✅ (8분 20초)
   └── [frontend] 테스트 통과 시도 중...
       ├── Attempt 1: 15/21 passed ❌
       ├── Attempt 2: 19/21 passed ❌
       ├── Attempt 3: 20/21 passed ❌
       └── Attempt 4: 21/21 passed ✅ (12분 10초)

🔀 Phase 3: 통합
   ├── dev 브랜치 merge... ✅
   ├── 전체 테스트 실행... ✅ (45/45 passed)
   └── beta MR 생성... ✅

✨ 완료! MR: https://github.com/user/repo/pull/123
   - Backend: 24 tests, 92% coverage
   - Frontend: 21 tests, 88% coverage
   - 총 소요시간: 15분 42초
```

---

### Step 3: 정리 (선택)

**Claude Code에서:**
```
/tdd-cleanup
```

**수동 실행:**
```bash
./.claude/skills/tdd-parallel/scripts/cleanup-worktrees.sh
```

---

## 명령어

| 명령어 | 설명 |
|--------|------|
| `/tdd-setup` | Git Worktree 초기 설정 (최초 1회) |
| `/tdd-pipeline [feature]` | TDD 전체 파이프라인 실행 |
| `/tdd-cleanup` | Worktree 및 브랜치 정리 |

---

## 에이전트 구성

### QA Backend Engineer

```yaml
Identity: Senior QA Architect (15+ years)
Branch: feat/qa-back
Worktree: ../worktrees/qa-back

Allowed:
  - backend/src/**/*.spec.ts
  - backend/test/**/*.e2e-spec.ts

Forbidden:
  - 모든 구현 코드

Tech Stack:
  - NestJS 10.x
  - Jest + Supertest
  - @nestjs/testing
```

### QA Frontend Engineer

```yaml
Identity: Principal Frontend Test Architect (15+ years)
Branch: feat/qa-front
Worktree: ../worktrees/qa-front

Allowed:
  - frontend/src/**/*.test.tsx
  - frontend/src/**/*.spec.ts
  - frontend/src/mocks/**/*

Forbidden:
  - 모든 구현 코드

Tech Stack:
  - React Testing Library
  - Vitest / Jest
  - MSW (Mock Service Worker)
```

### Backend Developer

```yaml
Identity: Principal Backend Engineer (15+ years)
Branch: feat/backend
Worktree: ../worktrees/backend

Allowed:
  - backend/src/**/*.ts

Forbidden:
  - backend/src/**/*.spec.ts
  - backend/test/**/*.e2e-spec.ts

Tech Stack:
  - NestJS 10.x
  - TypeORM
  - PostgreSQL
```

### Frontend Developer

```yaml
Identity: Principal Frontend Engineer (15+ years)
Branch: feat/frontend
Worktree: ../worktrees/frontend

Allowed:
  - frontend/src/**/*.tsx
  - frontend/src/**/*.ts

Forbidden:
  - frontend/src/**/*.test.tsx
  - frontend/src/**/*.spec.ts
  - frontend/src/mocks/**/*

Tech Stack:
  - React 18 + TypeScript
  - TanStack Query
  - Tailwind CSS
```

---

## 워크플로우 상세

### Phase 0: 스펙 분석 (Extended Thinking)

Orchestrator가 기능을 분석하여 다음을 도출합니다:

- **API Contract**: 엔드포인트, HTTP 메서드, Request/Response 스키마
- **DB Schema**: 엔티티, 관계, 제약조건
- **Components**: 컴포넌트 계층 구조, Props
- **Test Scenarios**: 각 에이전트가 작성할 테스트 케이스

### Phase 1: QA 테스트 작성 (병렬)

**QA Backend:**
```bash
cd ../worktrees/qa-back
# 테스트 작성
# *.spec.ts, *.e2e-spec.ts 파일 생성
git add .
git commit -m "test(backend): [feature] 테스트 케이스 작성"
git push origin feat/qa-back
```

**QA Frontend:**
```bash
cd ../worktrees/qa-front
# 테스트 작성 + MSW handlers
# *.test.tsx, handlers.ts 파일 생성
git add .
git commit -m "test(frontend): [feature] 테스트 케이스 작성"
git push origin feat/qa-front
```

### Phase 2: 구현 (병렬)

**Backend Dev:**
```bash
cd ../worktrees/backend
git fetch origin feat/qa-back
git merge origin/feat/qa-back --no-edit

# TDD Loop
while [ "$(npm run test 2>&1 | grep -c 'failed')" -gt 0 ]; do
  # 구현 코드 작성/수정
  # 테스트 다시 실행
done

git add .
git commit -m "feat(backend): [feature] 구현"
git push origin feat/backend
```

**Frontend Dev:**
```bash
cd ../worktrees/frontend
git fetch origin feat/qa-front
git merge origin/feat/qa-front --no-edit

# TDD Loop
while [ "$(npm run test 2>&1 | grep -c 'failed')" -gt 0 ]; do
  # 구현 코드 작성/수정
  # 테스트 다시 실행
done

git add .
git commit -m "feat(frontend): [feature] 구현"
git push origin feat/frontend
```

### Phase 3: 통합 & MR

```bash
git checkout dev
git pull origin dev

# 모든 브랜치 merge
git merge origin/feat/qa-back --no-edit
git merge origin/feat/qa-front --no-edit
git merge origin/feat/backend --no-edit
git merge origin/feat/frontend --no-edit

# 전체 테스트
cd backend && npm run test && npm run test:e2e && cd ..
cd frontend && npm run test && cd ..

git push origin dev

# beta로 MR 생성
gh pr create --base beta --head dev --title "feat: [feature]"
# 또는
glab mr create --source-branch dev --target-branch beta
```

---

## 파일 구조

```
.claude/skills/tdd-parallel/
├── SKILL.md                    # 스킬 메인 파일
│                               # - 명령어 정의 (/tdd-setup, /tdd-pipeline, /tdd-cleanup)
│                               # - 워크플로우 개요
│                               # - 에이전트 참조 가이드
│
├── scripts/
│   ├── setup-worktrees.sh      # 초기 설정 스크립트
│   │                           # - dev 브랜치에서 4개 feature 브랜치 생성
│   │                           # - 각 브랜치에 worktree 연결
│   │                           # - 의존성 설치
│   │
│   └── cleanup-worktrees.sh    # 정리 스크립트
│                               # - worktree 제거
│                               # - 브랜치 삭제 (선택)
│
└── references/
    ├── qa-backend.md           # Backend QA 가이드
    │                           # - 테스트 템플릿 (Unit, E2E)
    │                           # - 커버리지 요구사항
    │                           # - 필수 시나리오 체크리스트
    │
    ├── qa-frontend.md          # Frontend QA 가이드
    │                           # - 컴포넌트 테스트 템플릿
    │                           # - Hook 테스트 템플릿
    │                           # - MSW handlers 템플릿
    │
    ├── backend-dev.md          # Backend Dev 가이드
    │                           # - NestJS 구조
    │                           # - Controller/Service/DTO 패턴
    │                           # - TDD 워크플로우
    │
    └── frontend-dev.md         # Frontend Dev 가이드
                                # - React 구조
                                # - Component/Hook/API 패턴
                                # - 접근성 체크리스트
```

---

## 주의사항

### ⚠️ 절대 금지 사항

```
❌ Dev 에이전트가 테스트 파일 수정
❌ Dev 에이전트가 테스트 파일 삭제
❌ Dev 에이전트가 .skip() 사용
❌ Dev 에이전트가 @Skip() 데코레이터 사용
❌ main 브랜치에 직접 merge
```

### ✅ 필수 사항

```
✅ 모든 테스트 통과 후에만 commit
✅ 각 Phase 완료 시 결과 리포트 출력
✅ MR은 반드시 beta 브랜치로 생성
✅ TypeScript strict mode 준수
✅ ESLint 규칙 준수
```

---

## FAQ

### Q: Worktree 설정이 실패해요

```bash
# 기존 worktree 강제 제거
git worktree prune

# 다시 설정
/tdd-setup
```

### Q: 브랜치가 이미 존재한다고 해요

```bash
# 기존 브랜치 삭제 후 재시도
git branch -D feat/qa-back feat/qa-front feat/backend feat/frontend
/tdd-setup
```

### Q: 테스트가 무한 루프에 빠져요

```bash
# 최대 시도 횟수는 기본 10회입니다
# 10회 실패 시 사용자에게 확인 요청합니다
```

### Q: merge 충돌이 발생해요

```bash
# Orchestrator가 Extended Thinking으로 충돌 분석 후 해결합니다
# 복잡한 경우 사용자에게 확인 요청합니다
```

### Q: 특정 Phase만 실행하고 싶어요

```bash
# 현재는 전체 파이프라인만 지원합니다
# 개별 Phase 실행이 필요하면 각 worktree에서 수동으로 작업하세요
```

---

## 라이선스

MIT License

---

## 기여

Issues와 Pull Requests를 환영합니다!
