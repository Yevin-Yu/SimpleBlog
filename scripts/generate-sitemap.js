import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { loadAllBlogs } from './utils/blog-parser.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const SITE_URL = process.env.SITE_URL || 'https://your-blog-domain.com';
const TODAY = new Date().toISOString().split('T')[0];

function generateSitemap() {
  const blogsSourcePath = resolve(__dirname, '../blogs');
  const blogs = loadAllBlogs(blogsSourcePath);

  const blogUrls = blogs
    .map(
      (blog) => `  <url>
    <loc>${SITE_URL}/blog/${blog.id}</loc>
    <lastmod>${blog.modifiedTime || blog.date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
${blogUrls}
</urlset>`;

  const outputPath = resolve(__dirname, '../public/sitemap.xml');
  writeFileSync(outputPath, sitemap, 'utf-8');
  console.log(`Sitemap generated successfully: ${blogs.length} blogs included`);
}

generateSitemap();
