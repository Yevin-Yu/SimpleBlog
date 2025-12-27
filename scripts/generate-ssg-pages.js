import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { resolve, join, relative } from 'path';
import { fileURLToPath } from 'url';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const markdownRenderer = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch {
        return '';
      }
    }
    return '';
  },
});

function parseFrontmatter(markdown) {
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
      frontmatter[key] = value;
    }
  }

  return { frontmatter, content };
}

function generateIdFromFilename(filename) {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateIdFromPath(relativePath) {
  const normalizedPath = relativePath.replace(/\\/g, '/');
  const pathParts = normalizedPath.split('/');

  if (pathParts.length === 1) {
    return generateIdFromFilename(pathParts[0]);
  }

  let id = pathParts
    .join('/')
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9/]+/g, '-')
    .replace(/\/+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return id || 'untitled';
}

function extractCategoryFromPath(relativePath) {
  const normalizedPath = relativePath.replace(/\\/g, '/');
  const pathParts = normalizedPath.split('/');

  if (pathParts.length <= 1) {
    return '';
  }

  return pathParts.slice(0, -1).join('/');
}

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

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getAssetPaths(indexHtmlContent) {
  const scriptMatch = indexHtmlContent.match(/src="([^"]+)"/);
  const linkMatch = indexHtmlContent.match(/href="([^"]+\.css)"/);

  return {
    script: scriptMatch ? scriptMatch[1] : null,
    stylesheet: linkMatch ? linkMatch[1] : null,
  };
}

function renderBlogContent(blog, blogContent) {
  const htmlContent = markdownRenderer.render(blogContent);
  
  const categoryHtml = blog.category
    ? `<span class="blog-tree-article-category">${escapeHtml(blog.category)}</span>`
    : '';

  return `
    <main class="blog-tree-content">
      <div class="blog-tree-article-wrapper">
        <article class="blog-tree-article article-visible">
          <header class="blog-tree-article-header">
            <h1 class="blog-tree-article-title">${escapeHtml(blog.title)}</h1>
            <div class="blog-tree-article-meta">
              ${categoryHtml}
              <time class="blog-tree-article-date">${escapeHtml(blog.date)}</time>
            </div>
          </header>
          <div class="blog-tree-article-body">
            <div class="markdown-content">${htmlContent}</div>
          </div>
        </article>
      </div>
    </main>`;
}

function generateBlogHTML(blog, blogContent, indexHtmlContent, assetPaths) {
  const title = blog.title || 'Untitled';
  const description = blog.description || blog.title || '耶温博客文章';
  const category = blog.category || '';

  const renderedContent = renderBlogContent(blog, blogContent);

  let html = indexHtmlContent
    .replace(
      /<title>.*?<\/title>/,
      `<title>${escapeHtml(title)} - 耶温博客</title>`
    )
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeHtml(description)}" />`
    )
    .replace(
      /<meta name="keywords" content="[^"]*" \/>/,
      `<meta name="keywords" content="耶温博客,${escapeHtml(category)}" />`
    )
    .replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="https://your-blog-domain.com/blog/${blog.id}" />`
    )
    .replace(
      /<div id="root"><\/div>/,
      `<div id="root">${renderedContent}</div>`
    );

  if (assetPaths.script) {
    const scriptPath = assetPaths.script.replace(/^\//, '');
    const relativeScriptPath = '../../' + scriptPath;
    html = html.replace(assetPaths.script, relativeScriptPath);
  }

  if (assetPaths.stylesheet) {
    const stylesheetPath = assetPaths.stylesheet.replace(/^\//, '');
    const relativeStylesheetPath = '../../' + stylesheetPath;
    html = html.replace(assetPaths.stylesheet, relativeStylesheetPath);
  }

  html = html.replace(/([^:])\.\.\/\//g, '$1../');


  return html;
}

async function generateSSGPages() {
  try {
    const distPath = resolve(__dirname, '../dist');
    const blogPath = resolve(distPath, 'blog');
    const blogsSourcePath = resolve(__dirname, '../blogs');
    const indexHtmlPath = resolve(distPath, 'index.html');

    const indexHtmlContent = readFileSync(indexHtmlPath, 'utf-8');
    const assetPaths = getAssetPaths(indexHtmlContent);

    const blogFiles = getAllBlogFiles(blogsSourcePath);
    const blogs = [];

    for (const filePath of blogFiles) {
      try {
        const content = readFileSync(filePath, 'utf-8');
        const { frontmatter, content: markdownContent } = parseFrontmatter(content);
        
        const relativePath = relative(blogsSourcePath, filePath).replace(/\\/g, '/');
        const id = generateIdFromPath(relativePath);
        const categoryFromPath = extractCategoryFromPath(relativePath);
        const category = frontmatter.category || categoryFromPath || undefined;

        blogs.push({
          id: id || 'untitled',
          title: frontmatter.title,
          date: frontmatter.date,
          category,
          description: frontmatter.description,
          content: markdownContent,
        });
      } catch (error) {
        console.error(`Error parsing blog file: ${filePath}`, error);
      }
    }

    for (const blog of blogs) {
      const blogDir = resolve(blogPath, blog.id);
      mkdirSync(blogDir, { recursive: true });

      const blogHtml = generateBlogHTML(blog, blog.content, indexHtmlContent, assetPaths);
      const indexPath = resolve(blogDir, 'index.html');
      writeFileSync(indexPath, blogHtml, 'utf-8');
      console.log(`Generated SSG page: /blog/${blog.id}/index.html`);
    }

    console.log(`Successfully generated ${blogs.length} SSG pages`);
  } catch (error) {
    console.error('Error generating SSG pages:', error);
    process.exit(1);
  }
}

generateSSGPages();

