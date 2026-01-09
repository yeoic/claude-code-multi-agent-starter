#!/bin/bash
# TDD Parallel Development - Worktree Setup Script

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PROJECT_ROOT=$(pwd)
WORKTREE_ROOT="../worktrees"

echo -e "${YELLOW}🚀 TDD 병렬 개발 환경 설정 시작...${NC}"

# 1. dev 브랜치 확인
echo -e "${YELLOW}📌 Step 1: dev 브랜치 확인${NC}"
git checkout dev
git pull origin dev

# 2. Worktree 디렉토리 생성
echo -e "${YELLOW}📁 Step 2: Worktree 디렉토리 생성${NC}"
mkdir -p "$WORKTREE_ROOT"

# 3. Feature 브랜치 생성
echo -e "${YELLOW}🌿 Step 3: Feature 브랜치 생성${NC}"
git branch feat/qa-back 2>/dev/null || echo "  feat/qa-back already exists"
git branch feat/qa-front 2>/dev/null || echo "  feat/qa-front already exists"
git branch feat/backend 2>/dev/null || echo "  feat/backend already exists"
git branch feat/frontend 2>/dev/null || echo "  feat/frontend already exists"

# 4. Worktree 생성
echo -e "${YELLOW}🌳 Step 4: Git Worktree 생성${NC}"
git worktree add "$WORKTREE_ROOT/qa-back" feat/qa-back 2>/dev/null || echo "  qa-back worktree exists"
git worktree add "$WORKTREE_ROOT/qa-front" feat/qa-front 2>/dev/null || echo "  qa-front worktree exists"
git worktree add "$WORKTREE_ROOT/backend" feat/backend 2>/dev/null || echo "  backend worktree exists"
git worktree add "$WORKTREE_ROOT/frontend" feat/frontend 2>/dev/null || echo "  frontend worktree exists"

# 5. 의존성 설치
echo -e "${YELLOW}📦 Step 5: 의존성 설치${NC}"

if [ -d "$WORKTREE_ROOT/qa-back/backend" ]; then
  echo "  Installing in qa-back/backend..."
  (cd "$WORKTREE_ROOT/qa-back/backend" && npm install)
fi

if [ -d "$WORKTREE_ROOT/qa-front/frontend" ]; then
  echo "  Installing in qa-front/frontend..."
  (cd "$WORKTREE_ROOT/qa-front/frontend" && npm install)
fi

if [ -d "$WORKTREE_ROOT/backend/backend" ]; then
  echo "  Installing in backend/backend..."
  (cd "$WORKTREE_ROOT/backend/backend" && npm install)
fi

if [ -d "$WORKTREE_ROOT/frontend/frontend" ]; then
  echo "  Installing in frontend/frontend..."
  (cd "$WORKTREE_ROOT/frontend/frontend" && npm install)
fi

cd "$PROJECT_ROOT"

# 6. 결과 출력
echo ""
echo -e "${GREEN}✅ 설정 완료!${NC}"
echo ""
echo "📋 Worktree 목록:"
git worktree list
echo ""
echo -e "${YELLOW}🎯 사용법:${NC}"
echo "  Claude Code에서: /tdd-pipeline [기능 설명]"
