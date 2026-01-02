import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * 解析 frontmatter
 */
function parseFrontmatter(markdown) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content: markdown, hasFrontmatter: false };
  }

  const [, frontmatterText, content] = match;
  const frontmatter = {};

  let currentKey = null;
  const arrayValues = [];

  for (const line of frontmatterText.split('\n')) {
    // 处理数组项（以 "- " 开头）
    if (line.trim().startsWith('- ')) {
      const value = line.trim().slice(2).trim().replace(/^["']|["']$/g, '');
      if (currentKey) {
        arrayValues.push(value);
      }
      continue;
    }

    // 如果之前在收集数组项，现在保存它们
    if (currentKey && arrayValues.length > 0) {
      frontmatter[currentKey] = [...arrayValues];
      arrayValues.length = 0;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      currentKey = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '');

      if (value) {
        // 如果有值，直接保存
        frontmatter[currentKey] = value;
        currentKey = null;
      }
      // 如果没有值，可能是数组开始，继续等待下一行的数组项
    }
  }

  // 保存最后的数组
  if (currentKey && arrayValues.length > 0) {
    frontmatter[currentKey] = [...arrayValues];
  }

  return { frontmatter, content, hasFrontmatter: true };
}

/**
 * 生成 8 位随机 ID（小写字母 + 数字）
 */
function generateRandomId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * 从文件路径生成 ID（已弃用，现在统一使用随机 ID）
 */
function generateIdFromPath(relativePath) {
  // 现在统一使用随机 ID，不再从路径生成
  return generateRandomId();
}

/**
 * 生成唯一 ID（避免冲突）
 */
function generateUniqueIds(allFiles) {
  const usedIds = new Set();
  const fileIds = {};

  // 第一遍：处理已有 ID 的文件
  for (const file of allFiles) {
    if (file.frontmatter.id) {
      usedIds.add(file.frontmatter.id);
      fileIds[file.relativePath] = file.frontmatter.id;
    }
  }

  // 第二遍：为没有 ID 的文件生成唯一 ID
  for (const file of allFiles) {
    if (!file.frontmatter.id) {
      let baseId = generateIdFromPath(file.relativePath);
      let id = baseId;
      let counter = 1;

      // 如果 ID 冲突，添加数字后缀
      while (usedIds.has(id)) {
        id = `${baseId}-${counter}`;
        counter++;
      }

      usedIds.add(id);
      fileIds[file.relativePath] = id;
    }
  }

  return fileIds;
}

/**
 * 递归获取所有 markdown 文件
 */
function getAllBlogFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      getAllBlogFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

/**
 * 为没有 ID 的博客文件添加 ID
 */
function ensureBlogIds() {
  const blogsSourcePath = resolve(__dirname, '../blogs');
  const blogFiles = getAllBlogFiles(blogsSourcePath);
  const updatedFiles = [];

  // 解析所有文件
  const allFiles = blogFiles.map(filePath => {
    const content = readFileSync(filePath, 'utf-8');
    const { frontmatter, hasFrontmatter } = parseFrontmatter(content);
    const relativePath = relative(blogsSourcePath, filePath).replace(/\\/g, '/');

    return {
      filePath,
      relativePath,
      frontmatter,
      content,
      hasFrontmatter,
      needsId: !frontmatter.id
    };
  });

  // 生成唯一 ID
  const fileIds = generateUniqueIds(allFiles);

  // 更新需要添加 ID 的文件
  for (const file of allFiles) {
    if (file.needsId) {
      const newId = fileIds[file.relativePath];
      const { frontmatter, content, hasFrontmatter } = file;

      // 添加 id 字段到 frontmatter
      frontmatter.id = newId;

      // 重建 frontmatter 文本
      const frontmatterText = Object.entries(frontmatter)
        .map(([key, value]) => {
          // 处理数组类型（tags）
          if (Array.isArray(value)) {
            return `${key}:\n${value.map(v => `  - ${v}`).join('\n')}`;
          }
          return `${key}: ${value}`;
        })
        .join('\n');

      // 重建完整内容
      const newContent = hasFrontmatter
        ? `---\n${frontmatterText}\n---\n\n${content}`
        : `---\n${frontmatterText}\n---\n\n${content}`;

      // 写入文件
      writeFileSync(file.filePath, newContent, 'utf-8');
      updatedFiles.push({
        path: file.relativePath,
        id: newId
      });

      console.log(`✓ 添加 ID: ${file.relativePath} -> ${newId}`);
    }
  }

  console.log(`\n✅ 完成！共更新 ${updatedFiles.length} 个文件`);

  if (updatedFiles.length > 0) {
    console.log('\n更新的文件：');
    updatedFiles.forEach(({ path, id }) => {
      console.log(`  ${path} => ${id}`);
    });
  } else {
    console.log('\n✓ 所有博客文件都已包含 ID');
  }
}

// 导出供其他脚本使用
export { ensureBlogIds };

// 如果直接运行此脚本
// Windows 路径兼容处理
const isMainModule =
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/')) ||
  import.meta.url.includes(process.argv[1].replace(/\\/g, '/'));

if (isMainModule) {
  try {
    console.log('🔍 检查博客文件的 ID...\n');
    ensureBlogIds();
  } catch (error) {
    console.error('❌ 错误:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}
