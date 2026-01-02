import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

/**
 * 解析 frontmatter
 */
export function parseFrontmatter(markdown) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return {
      frontmatter: {
        title: 'Untitled',
        date: new Date().toISOString().split('T')[0],
      },
      content: markdown,
    };
  }

  const [, frontmatterText, content] = match;
  const frontmatter = {
    title: 'Untitled',
    date: new Date().toISOString().split('T')[0],
  };

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

  return { frontmatter, content };
}

/**
 * 规范化 ID
 */
export function sanitizeId(id) {
  if (!id) return null;
  return id
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * 从文件名生成 ID
 */
export function generateIdFromFilename(filename) {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * 从路径生成 ID
 */
export function generateIdFromPath(relativePath) {
  const normalizedPath = relativePath.replace(/\\/g, '/');
  const pathParts = normalizedPath.split('/');

  if (pathParts.length === 1) {
    return generateIdFromFilename(pathParts[0]);
  }

  // 使用文件的相对路径，保留中文，转换为适合 URL 的格式
  let id = pathParts
    .join('/')
    .replace(/\.md$/, '')
    .toLowerCase()
    // 保留中文字符和字母数字
    .replace(/[^a-z0-9\u4e00-\u9fa5/]+/g, '-')
    .replace(/\/+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // 如果生成的 ID 为空（全是中文被过滤掉），使用 nanoid 风格的随机 ID
  if (!id) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    id = `blog-${timestamp}-${random}`;
  }

  return id;
}

/**
 * 从路径提取分类
 */
export function extractCategoryFromPath(relativePath) {
  const normalizedPath = relativePath.replace(/\\/g, '/');
  const pathParts = normalizedPath.split('/');

  if (pathParts.length <= 1) {
    return '';
  }

  return pathParts.slice(0, -1).join('/');
}

/**
 * 递归获取所有 markdown 文件
 */
export function getAllBlogFiles(dir, fileList = []) {
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
 * 加载所有博客文件并解析
 */
export function loadAllBlogs(blogsSourcePath) {
  const blogFiles = getAllBlogFiles(blogsSourcePath);
  const blogs = [];
  const usedIds = new Set();

  const generateUniqueId = (baseId) => {
    let id = baseId;
    let counter = 1;
    
    while (usedIds.has(id)) {
      id = `${baseId}-${counter}`;
      counter++;
    }
    
    usedIds.add(id);
    return id;
  };

  for (const filePath of blogFiles) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const { frontmatter } = parseFrontmatter(content);
      
      const relativePath = relative(blogsSourcePath, filePath).replace(/\\/g, '/');
      const categoryFromPath = extractCategoryFromPath(relativePath);
      const category = frontmatter.category || categoryFromPath || undefined;
      
      const baseId = frontmatter.id 
        ? sanitizeId(frontmatter.id)
        : generateIdFromPath(relativePath);

      if (!baseId) {
        console.error(`无法生成博客ID: ${filePath}`);
        continue;
      }

      const id = generateUniqueId(baseId);

      blogs.push({
        id,
        title: frontmatter.title,
        date: frontmatter.date,
        category,
        description: frontmatter.description,
        modifiedTime: frontmatter.modifiedTime || frontmatter.date,
        image: frontmatter.image,
        relativePath: relativePath,
      });
    } catch (error) {
      console.error(`解析博客文件失败: ${filePath}`, error);
    }
  }

  return blogs;
}

