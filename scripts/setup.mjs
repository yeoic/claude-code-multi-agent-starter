#!/usr/bin/env zx
import { argv } from 'zx';
$.verbose = true;

const REQUIRED_BRANCHES = ['dev', 'beta', 'prod'];
const REQUIRED_LABELS = [
    { name: 'feature', color: 'a2eeef', desc: 'New functionality' },
    { name: 'bug', color: 'd73a4a', desc: 'Something isn\'t working' },
    { name: 'refactor', color: 'cfd3d7', desc: 'Code change that neither fixes a bug nor adds a feature' },
    { name: 'chore', color: '7057ff', desc: 'Build process or auxiliary tool changes' }
];

const WORKTREES = [
    { name: 'architect', branch: 'dev' },
    { name: 'qa-back', branch: 'dev' },
    { name: 'qa-front', branch: 'dev' },
    { name: 'backend', branch: 'dev' },
    { name: 'frontend', branch: 'dev' }
];

console.log(chalk.bold.blue('\n🏗️  BMAD6 Factory Setup Initiated...\n'));

// 1. Ensure Branches Exist
console.log(chalk.yellow('Checking Branches...'));
const currentBranches = (await $`git branch -a`).stdout;

for (const branch of REQUIRED_BRANCHES) {
    if (!currentBranches.includes(branch)) {
        console.log(`Creating branch: ${branch}...`);
        try {
            await $`git branch ${branch} main`;
            await $`git push -u origin ${branch}`;
        } catch (e) {
            await $`git branch ${branch}`;
            await $`git push -u origin ${branch}`;
        }
    } else {
        console.log(chalk.gray(`✓ Branch '${branch}' already exists.`));
    }
}

// 2. Ensure GitHub Labels
console.log(chalk.yellow('\nChecking GitHub Labels...'));
for (const label of REQUIRED_LABELS) {
    try {
        await $`gh label create ${label.name} --color ${label.color} --description ${label.desc}`;
        console.log(`Created label: ${label.name}`);
    } catch (e) {
        console.log(chalk.gray(`✓ Label '${label.name}' ready.`));
    }
}

// 3. Setup Worktrees
console.log(chalk.yellow('\nSetting up Worktrees...'));
await $`mkdir -p ../worktrees`;

for (const wt of WORKTREES) {
    const wtPath = `../worktrees/${wt.name}`;
    try {
        // 폴더가 있는지 확인
        await $`ls ${wtPath}`;
        console.log(chalk.gray(`✓ Worktree '${wt.name}' already exists.`));
    } catch (e) {
        console.log(`Creating worktree: ${wt.name}...`);

        // [수정 핵심] --detach 옵션 추가
        // 브랜치를 직접 체크아웃하지 않고, 해당 브랜치의 HEAD 커밋만 바라보게 함 (Lock 회피)
        await $`git worktree add --detach ${wtPath} ${wt.branch}`;
    }
}

// 4. Default Branch Setting
console.log(chalk.yellow('\nSwitching to dev branch...'));
await $`git checkout dev`;

console.log(chalk.bold.green('\n✅ Setup Complete! Factory is ready to run.'));