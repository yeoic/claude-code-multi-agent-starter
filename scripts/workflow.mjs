#!/usr/bin/env zx
import { argv } from 'zx';
$.verbose = true;

// 설정: Worktree 경로들
const WORKTREES = [
    '../worktrees/architect',
    '../worktrees/qa-back',
    '../worktrees/qa-front',
    '../worktrees/backend',
    '../worktrees/frontend'
];

// [수정 1] 인덱스 변경: 1 -> 0
const command = argv._[0];

// 1. [Planner] 이슈 생성
if (command === 'ticket') {
    // [수정 2] 인덱스 변경: 2 -> 1, 3 -> 2
    const title = argv._[1];
    const body = argv._[2] || 'Details required';

    if (!title) {
        console.error(chalk.red('Error: Title is required.'));
        process.exit(1);
    }

    // [수정 3] --json 옵션 제거 및 URL 파싱 로직으로 변경
    const res = await $`gh issue create --title ${title} --body ${body} --label "feature"`;

    // gh issue create는 성공 시 생성된 URL을 stdout으로 출력함 (예: https://github.com/user/repo/issues/10)
    const issueUrl = res.stdout.trim();
    const issueNumber = issueUrl.split('/').pop(); // URL 맨 끝의 번호 추출

    console.log(chalk.green(`✅ Ticket Created: #${issueNumber} (${issueUrl})`));
}

// 2. [Architect] 작업 시작 & Worktree 동기화
else if (command === 'start') {
    // [수정 4] 인덱스 변경: 2 -> 1
    const issueId = argv._[1];
    if (!issueId) throw new Error('Issue ID required');

    // 이슈 제목 가져오기 (view 명령어는 --json 지원함)
    const issueRes = await $`gh issue view ${issueId} --json title`;
    const issueTitle = JSON.parse(issueRes.stdout).title;

    // 브랜치 이름 생성 (kebab-case)
    const safeTitle = issueTitle.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const branchName = `topic/feat-${issueId}-${safeTitle}`;

    console.log(chalk.blue(`🚀 Initializing Branch: ${branchName}`));

    // 메인 Repo에서 브랜치 생성 및 dev 동기화
    await $`git checkout dev`;
    await $`git pull origin dev`;
    try {
        await $`git checkout -b ${branchName}`;
    } catch (e) {
        await $`git checkout ${branchName}`; // 이미 존재하면 이동
    }

    // 모든 Worktree를 해당 브랜치로 강제 이동 (Loop)
    for (const wt of WORKTREES) {
        console.log(`Syncing worktree: ${wt}...`);
        try {
            // Worktree 폴더로 가서 checkout 실행
            await $`cd ${wt} && git fetch origin && git checkout ${branchName}`;
        } catch (e) {
            console.warn(`Warning: Could not sync ${wt}. Check if directory exists.`);
        }
    }
}

// 3. [QA/Dev] 중간 저장
else if (command === 'ready') {
    await $`git add .`;
    try {
        await $`git commit -m "wip: update progress"`;
        await $`git push origin HEAD`;
        console.log('✅ Changes pushed to remote.');
    } catch (e) {
        console.log('Nothing to commit.');
    }
}

// 4. [Dev] PR 생성
else if (command === 'pr') {
    const currentBranch = (await $`git branch --show-current`).stdout.trim();
    const issueId = currentBranch.match(/feat-(\d+)/)?.[1]; // 브랜치명에서 이슈 번호 추출

    if (!issueId) {
        console.log(chalk.red('Error: Cannot find issue ID from branch name.'));
        process.exit(1);
    }

    await $`git push origin ${currentBranch}`;
    // pr create도 --json 없이 URL 반환이 기본일 수 있으나, 여기선 결과 파싱이 없으므로 일단 둠
    await $`gh pr create --base dev --head ${currentBranch} --title "feat: Resolve #${issueId}" --body "Closes #${issueId}"`;
}

// 5. [Reviewer] 병합
else if (command === 'merge') {
    // [수정 5] 인덱스 변경: 2 -> 1
    const prId = argv._[1];
    if (!prId) throw new Error('PR ID required');

    await $`gh pr merge ${prId} --squash --delete-branch`;
    console.log(chalk.green(`🎉 PR #${prId} Merged & Branch Deleted`));
}

else {
    console.log(`
  Usage:
    /ops ticket "Title" "Body"
    /ops start <issue-id>
    /ops ready
    /ops pr
    /ops merge <pr-id>
  `);
}