const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const slugify = require('slugify');

const ROOT = path.join(__dirname, '..');
const CONTENT = path.join(ROOT, 'content');
const DATA = path.join(ROOT, 'data');

const POST_TYPES = ['blog', 'articles', 'news'];

marked.setOptions({ gfm: true, breaks: true });

function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function getSite() {
  return readJson(path.join(DATA, 'site.json'), {});
}

function saveSite(site) {
  writeJson(path.join(DATA, 'site.json'), site);
}

function postDir(type) {
  return path.join(CONTENT, 'posts', type);
}

function listPosts(type, { publishedOnly = true } = {}) {
  const dir = postDir(type);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
  const posts = files
    .map((f) => readJson(path.join(dir, f)))
    .filter(Boolean)
    .filter((p) => !publishedOnly || p.status === 'published')
    .sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));
  return posts.map(enrichPost);
}

function getPost(type, slug) {
  const file = path.join(postDir(type), `${slug}.json`);
  const post = readJson(file);
  if (!post) return null;
  return enrichPost(post);
}

function enrichPost(post) {
  const html = post.bodyFormat === 'html' ? post.body : marked.parse(post.body || '');
  const excerpt =
    post.excerpt ||
    (post.body || '')
      .replace(/[#*_`>\[\]]/g, '')
      .slice(0, 200)
      .trim() + '…';
  return { ...post, html, excerpt };
}

function savePost(type, post) {
  const slug =
    post.slug ||
    slugify(post.title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
  post.slug = slug;
  post.updatedAt = new Date().toISOString();
  if (!post.createdAt) post.createdAt = post.updatedAt;
  if (post.status === 'published' && !post.publishedAt) {
    post.publishedAt = post.updatedAt;
  }
  const file = path.join(postDir(type), `${slug}.json`);
  writeJson(file, post);
  return enrichPost(post);
}

function deletePost(type, slug) {
  const file = path.join(postDir(type), `${slug}.json`);
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

function listPages() {
  const dir = path.join(CONTENT, 'pages');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => enrichPost(readJson(path.join(dir, f))))
    .filter(Boolean);
}

function getPage(slug) {
  const page = readJson(path.join(CONTENT, 'pages', `${slug}.json`));
  return page ? enrichPost(page) : null;
}

function savePage(page) {
  const slug =
    page.slug ||
    slugify(page.title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
  page.slug = slug;
  page.updatedAt = new Date().toISOString();
  if (!page.createdAt) page.createdAt = page.updatedAt;
  writeJson(path.join(CONTENT, 'pages', `${slug}.json`), page);
  return enrichPost(page);
}

function listMedia() {
  const uploads = path.join(ROOT, 'uploads');
  if (!fs.existsSync(uploads)) return [];
  return fs
    .readdirSync(uploads)
    .filter((f) => f !== '.gitkeep')
    .map((filename) => ({
      filename,
      url: `/uploads/${filename}`,
      size: fs.statSync(path.join(uploads, filename)).size,
      mtime: fs.statSync(path.join(uploads, filename)).mtime,
    }))
    .sort((a, b) => b.mtime - a.mtime);
}

function dashboardStats() {
  const stats = { blog: 0, articles: 0, news: 0, draft: 0, published: 0 };
  for (const type of POST_TYPES) {
    const dir = postDir(type);
    if (!fs.existsSync(dir)) continue;
    fs.readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .forEach((f) => {
        const p = readJson(path.join(dir, f));
        if (!p) return;
        stats[type]++;
        if (p.status === 'published') stats.published++;
        else stats.draft++;
      });
  }
  return stats;
}

module.exports = {
  POST_TYPES,
  getSite,
  saveSite,
  listPosts,
  getPost,
  savePost,
  deletePost,
  listPages,
  getPage,
  savePage,
  listMedia,
  dashboardStats,
  enrichPost,
};
