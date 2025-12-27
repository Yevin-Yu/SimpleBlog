import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * 生成 8 位随机小写字母和数字
 */
function generateRandomId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

/**
 * 递归获取所有 markdown 文件
 */
function getAllMarkdownFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      getAllMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

/**
 * 解析 frontmatter
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content };
  }

  const [, frontmatterText, body] = match;
  const frontmatter = {};

  for (const line of frontmatterText.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      if (key) {
        frontmatter[key] = value;
      }
    }
  }

  return { frontmatter, content: body };
}

/**
 * 生成 frontmatter 字符串
 */
function generateFrontmatter(frontmatter) {
  const lines = [];
  for (const [key, value] of Object.entries(frontmatter)) {
    if (value !== undefined && value !== null) {
      lines.push(`${key}: ${value}`);
    }
  }
  return `---\n${lines.join('\n')}\n---\n`;
}

/**
 * 处理单个文件
 */
function processFile(filePath, usedIds) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const { frontmatter, content: body } = parseFrontmatter(content);

    // 如果已经有 id，跳过
    if (frontmatter.id) {
      console.log(`跳过 ${filePath}，已有 ID: ${frontmatter.id}`);
      return;
    }

    // 生成唯一 ID
    let id;
    do {
      id = generateRandomId();
    } while (usedIds.has(id));
    usedIds.add(id);

    // 添加 id 到 frontmatter
    frontmatter.id = id;

    // 重新生成文件内容
    const newContent = generateFrontmatter(frontmatter) + body;
    writeFileSync(filePath, newContent, 'utf-8');

    console.log(`✓ ${filePath} -> ID: ${id}`);
  } catch (error) {
    console.error(`✗ 处理文件失败: ${filePath}`, error);
  }
}

/**
 * 主函数
 */
function main() {
  const blogsDir = resolve(__dirname, '../blogs');
  const markdownFiles = getAllMarkdownFiles(blogsDir);
  const usedIds = new Set();

  console.log(`找到 ${markdownFiles.length} 个 markdown 文件\n`);

  for (const filePath of markdownFiles) {
    processFile(filePath, usedIds);
  }

  console.log(`\n完成！已为 ${usedIds.size} 个文件生成唯一 ID`);
}

main();

