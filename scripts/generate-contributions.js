import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

function getGitContributions() {
  try {
    const gitLog = execSync(
      'git log --since="30 days ago" --format="%ad" --date=short',
      { encoding: 'utf-8', cwd: resolve(__dirname, '..') }
    );

    const dates = gitLog.trim().split('\n').filter(Boolean);
    const contributions = {};

    dates.forEach((date) => {
      contributions[date] = (contributions[date] || 0) + 1;
    });

    return {
      generatedAt: new Date().toISOString(),
      contributions,
      totalCommits: dates.length,
    };
  } catch (error) {
    console.warn('无法获取 git 提交记录，使用空数据:', error.message);
    return {
      generatedAt: new Date().toISOString(),
      contributions: {},
      totalCommits: 0,
    };
  }
}

function generateContributionsData() {
  const data = getGitContributions();
  const outputPath = resolve(__dirname, '../public/contributions.json');

  writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✓ 生成提交记录数据: ${outputPath}`);
  console.log(`  总提交数: ${data.totalCommits}`);
}

generateContributionsData();

