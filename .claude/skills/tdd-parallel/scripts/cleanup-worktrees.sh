#!/bin/bash
# TDD Parallel Development - Cleanup Script

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

WORKTREE_ROOT="../worktrees"

echo -e "${YELLOW}🧹 TDD Worktree 정리 시작...${NC}"

# 1. Worktree 제거
echo -e "${YELLOW}Step 1: Worktree 제거${NC}"
git worktree remove "$WORKTREE_ROOT/qa-back" --force 2>/dev/null || echo "  qa-back already removed"
git worktree remove "$WORKTREE_ROOT/qa-front" --force 2>/dev/null || echo "  qa-front already removed"
git worktree remove "$WORKTREE_ROOT/backend" --force 2>/dev/null || echo "  backend already removed"
git worktree remove "$WORKTREE_ROOT/frontend" --force 2>/dev/null || echo "  frontend already removed"

# 2. 원격 브랜치 삭제 (선택)
read -p "원격 브랜치도 삭제할까요? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Step 2: 원격 브랜치 삭제${NC}"
  git push origin --delete feat/qa-back 2>/dev/null || echo "  feat/qa-back not on remote"
  git push origin --delete feat/qa-front 2>/dev/null || echo "  feat/qa-front not on remote"
  git push origin --delete feat/backend 2>/dev/null || echo "  feat/backend not on remote"
  git push origin --delete feat/frontend 2>/dev/null || echo "  feat/frontend not on remote"
fi

# 3. 로컬 브랜치 삭제
echo -e "${YELLOW}Step 3: 로컬 브랜치 삭제${NC}"
git branch -D feat/qa-back 2>/dev/null || echo "  feat/qa-back not found"
git branch -D feat/qa-front 2>/dev/null || echo "  feat/qa-front not found"
git branch -D feat/backend 2>/dev/null || echo "  feat/backend not found"
git branch -D feat/frontend 2>/dev/null || echo "  feat/frontend not found"

# 4. Worktree 디렉토리 정리
if [ -d "$WORKTREE_ROOT" ]; then
  rmdir "$WORKTREE_ROOT" 2>/dev/null || echo "  worktrees 디렉토리에 다른 파일 존재"
fi

echo ""
echo -e "${GREEN}✅ 정리 완료!${NC}"
echo ""
echo "📋 현재 Worktree 목록:"
git worktree list
