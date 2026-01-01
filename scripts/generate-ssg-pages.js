import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/common';
import { loadAllBlogs, parseFrontmatter } from './utils/blog-parser.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const BASE_PATH = '/b';
const SITE_CONFIG = {
  name: '耶温博客',
  url: process.env.SITE_URL || 'https://yuwb.cn',
  locale: 'zh_CN',
};
const BASE_URL = `${SITE_CONFIG.url}${BASE_PATH}`;

const SEO_CONFIG = {
  defaultImage: '/og-image.jpg',
  favicon: '/icon.svg',
  themeColor: '#0a0a0a',
};

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


/**
 * HTML 转义
 */
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 从 HTML 内容中提取资源路径
 */
function getAssetPaths(indexHtmlContent) {
  const scriptMatch = indexHtmlContent.match(/src="([^"]+)"/);
  const linkMatch = indexHtmlContent.match(/href="([^"]+\.css)"/);

  return {
    script: scriptMatch ? scriptMatch[1] : null,
    stylesheet: linkMatch ? linkMatch[1] : null,
  };
}

/**
 * 渲染博客内容为 HTML
 */
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

/**
 * 生成结构化数据（Schema.org JSON-LD）
 */
function generateStructuredData(blog) {
  const blogUrl = `${BASE_URL}/blog/${blog.id}`;
  const imageUrl = blog.image 
    ? (blog.image.startsWith('http') ? blog.image : `${BASE_URL}${blog.image}`)
    : `${BASE_URL}${SEO_CONFIG.defaultImage}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.description || blog.title,
    image: imageUrl,
    datePublished: blog.date,
    dateModified: blog.modifiedTime || blog.date,
    author: {
      '@type': 'Person',
      name: SITE_CONFIG.name,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': blogUrl,
    },
  };
}

/**
 * 生成博客 HTML 页面
 */
function generateBlogHTML(blog, blogContent, indexHtmlContent, assetPaths) {
  const title = blog.title || 'Untitled';
  const description = blog.description || blog.title || '耶温博客文章';
  const category = blog.category || '';
  const blogUrl = `${BASE_URL}/blog/${blog.id}`;
  const imageUrl = blog.image 
    ? (blog.image.startsWith('http') ? blog.image : `${BASE_URL}${blog.image}`)
    : `${BASE_URL}${SEO_CONFIG.defaultImage}`;
  
  const keywords = category 
    ? `耶温博客,${escapeHtml(category)},${escapeHtml(title)}`
    : `耶温博客,${escapeHtml(title)}`;

  const structuredData = generateStructuredData(blog);
  const structuredDataJson = JSON.stringify(structuredData, null, 2);

  const renderedContent = renderBlogContent(blog, blogContent);

  let html = indexHtmlContent
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)} - 耶温博客</title>`)
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeHtml(description)}" />`
    )
    .replace(
      /<meta name="keywords" content="[^"]*" \/>/,
      `<meta name="keywords" content="${escapeHtml(keywords)}" />`
    )
    .replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${blogUrl}" />`
    )
    .replace(
      /<\/head>/,
      `    <!-- Favicon -->
    <link rel="icon" href="${BASE_URL}${SEO_CONFIG.favicon}" />
    <link rel="shortcut icon" href="${BASE_URL}${SEO_CONFIG.favicon}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${blogUrl}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:site_name" content="${SITE_CONFIG.name}" />
    <meta property="og:locale" content="${SITE_CONFIG.locale}" />
    <meta property="article:published_time" content="${blog.date}" />
    ${blog.modifiedTime ? `    <meta property="article:modified_time" content="${blog.modifiedTime}" />` : ''}
    ${category ? `    <meta property="article:section" content="${escapeHtml(category)}" />` : ''}

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${imageUrl}" />

    <!-- Structured Data -->
    <script type="application/ld+json">${structuredDataJson}</script>
  </head>`
    )
    .replace(
      /<div id="root"><\/div>/,
      `<div id="root">${renderedContent}</div>`
    );

  return adjustAssetPaths(html, assetPaths);
}

/**
 * 调整资源路径为相对路径
 * 从 /b/assets/... 转换为 ../../assets/...
 */
function adjustAssetPaths(html, assetPaths) {
  if (assetPaths.script) {
    // 去掉 /b/ 前缀，只保留 assets/... 部分
    const scriptPath = assetPaths.script.replace(/^\/b\//, '');
    const relativeScriptPath = `../../${scriptPath}`;
    html = html.replace(assetPaths.script, relativeScriptPath);
  }

  if (assetPaths.stylesheet) {
    // 去掉 /b/ 前缀，只保留 assets/... 部分
    const stylesheetPath = assetPaths.stylesheet.replace(/^\/b\//, '');
    const relativeStylesheetPath = `../../${stylesheetPath}`;
    html = html.replace(assetPaths.stylesheet, relativeStylesheetPath);
  }

  return html.replace(/([^:])\.\.\/\//g, '$1../');
}

/**
 * 生成错误页面的 HTML
 */
function generateErrorHTML(indexHtmlContent, assetPaths, statusCode = 500, title = '出错了', message = '抱歉，页面遇到了一些问题') {
  const pageTitle = `错误 ${statusCode} - ${SITE_CONFIG.name}`;
  const errorPageUrl = `${BASE_URL}/error`;

  const errorPageContent = `
    <div class="error-page">
      <div class="error-page-background"></div>
      <div class="error-page-content">
        <div class="error-code">${statusCode}</div>
        <h1 class="error-title">${title}</h1>
        <p class="error-message">${message}</p>
        <button class="error-home-button" onclick="window.location.href='${BASE_PATH}/'">
          返回首页
        </button>
      </div>
    </div>`;

  let html = indexHtmlContent
    .replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`)
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="页面出现错误" />`
    )
    .replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${errorPageUrl}" />`
    )
    .replace(
      /<\/head>/,
      `    <!-- Favicon -->
    <link rel="icon" href="${BASE_URL}${SEO_CONFIG.favicon}" />
    <link rel="shortcut icon" href="${BASE_URL}${SEO_CONFIG.favicon}" />
  </head>`
    )
    .replace(
      /<div id="root"><\/div>/,
      `<div id="root">${errorPageContent}</div>`
    );

  return adjustAssetPathsForError(html, assetPaths);
}

/**
 * 调整错误页面的资源路径
 */
function adjustAssetPathsForError(html, assetPaths) {
  if (assetPaths.script) {
    const scriptPath = assetPaths.script.replace(/^\/b\//, '');
    const relativeScriptPath = `../${scriptPath}`;
    html = html.replace(assetPaths.script, relativeScriptPath);
  }

  if (assetPaths.stylesheet) {
    const stylesheetPath = assetPaths.stylesheet.replace(/^\/b\//, '');
    const relativeStylesheetPath = `../${stylesheetPath}`;
    html = html.replace(assetPaths.stylesheet, relativeStylesheetPath);
  }

  return html;
}

/**
 * 生成静态站点页面
 */
async function generateSSGPages() {
  try {
    const distPath = resolve(__dirname, '../dist');
    const blogPath = resolve(distPath, 'blog');
    const blogsSourcePath = resolve(__dirname, '../blogs');
    const indexHtmlPath = resolve(distPath, 'index.html');

    const indexHtmlContent = readFileSync(indexHtmlPath, 'utf-8');
    const assetPaths = getAssetPaths(indexHtmlContent);

    const blogMetas = loadAllBlogs(blogsSourcePath);
    const blogs = [];

    for (const blogMeta of blogMetas) {
      try {
        const filePath = resolve(blogsSourcePath, blogMeta.relativePath);
        const content = readFileSync(filePath, 'utf-8');
        const { content: markdownContent } = parseFrontmatter(content);

        blogs.push({
          ...blogMeta,
          content: markdownContent,
        });
      } catch (error) {
        console.error(`Error loading blog content: ${blogMeta.id}`, error);
      }
    }

    for (const blog of blogs) {
      const blogDir = resolve(blogPath, blog.id);
      mkdirSync(blogDir, { recursive: true });

      const blogHtml = generateBlogHTML(blog, blog.content, indexHtmlContent, assetPaths);
      const indexPath = resolve(blogDir, 'index.html');
      writeFileSync(indexPath, blogHtml, 'utf-8');
      console.log(`Generated SSG page: ${BASE_PATH}/blog/${blog.id}/index.html`);
    }

    // 生成错误页面
    const errorPath = resolve(distPath, 'error');
    mkdirSync(errorPath, { recursive: true });

    // 生成 500 错误页面
    const error500Html = generateErrorHTML(indexHtmlContent, assetPaths, 500, '出错了', '抱歉，页面遇到了一些问题');
    const error500IndexPath = resolve(errorPath, 'index.html');
    writeFileSync(error500IndexPath, error500Html, 'utf-8');
    console.log(`Generated SSG page: ${BASE_PATH}/error/index.html`);

    // 生成 404 错误页面
    const notFoundPath = resolve(distPath, '404');
    mkdirSync(notFoundPath, { recursive: true });

    const error404Html = generateErrorHTML(indexHtmlContent, assetPaths, 404, '页面未找到', '抱歉，您访问的页面不存在');
    const notFoundIndexPath = resolve(notFoundPath, 'index.html');
    writeFileSync(notFoundIndexPath, error404Html, 'utf-8');
    console.log(`Generated SSG page: ${BASE_PATH}/404/index.html`);

    console.log(`Successfully generated ${blogs.length + 2} SSG pages (${blogs.length} blogs + 2 error pages)`);
  } catch (error) {
    console.error('Error generating SSG pages:', error);
    process.exit(1);
  }
}

generateSSGPages();

