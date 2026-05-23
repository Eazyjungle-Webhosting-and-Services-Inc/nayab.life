const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const content = require('../lib/content');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]/gi, '-');
      cb(null, `${base}-${Date.now()}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpe?g|png|gif|webp|svg|pdf|mp4|webm)$/i;
    if (allowed.test(file.originalname)) cb(null, true);
    else cb(new Error('File type not allowed'));
  },
});

function adminLocals(req) {
  return {
    site: content.getSite(),
    adminUser: req.session.username,
    flash: req.session.flash,
  };
}

function setFlash(req, message, level = 'success') {
  req.session.flash = { message, level };
}

router.use((req, res, next) => {
  res.locals.adminPath = req.path;
  if (req.session.flash) {
    res.locals.flash = req.session.flash;
    delete req.session.flash;
  }
  next();
});

router.get('/login', (req, res) => {
  if (req.session.authenticated) return res.redirect('/admin');
  res.render('admin/login', {
    title: 'Admin Login',
    redirect: req.query.redirect || '/admin',
    error: req.query.error,
  });
});

router.post('/login', (req, res) => {
  const username = process.env.ADMIN_USERNAME || 'nayab_admin';
  const password = process.env.ADMIN_PASSWORD || 'NayabLife2025!';
  const { user, pass, redirect } = req.body;

  if (user === username && pass === password) {
    req.session.authenticated = true;
    req.session.username = user;
    return res.redirect(redirect || '/admin');
  }
  res.redirect(`/admin/login?error=1&redirect=${encodeURIComponent(redirect || '/admin')}`);
});

router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

router.get('/', requireAuth, (req, res) => {
  if (req.session.flash) {
    res.locals.flash = req.session.flash;
    delete req.session.flash;
  }
  res.render('admin/dashboard', {
    title: 'Dashboard',
    stats: content.dashboardStats(),
    ...adminLocals(req),
  });
});

router.get('/site', requireAuth, (req, res) => {
  res.render('admin/site', { title: 'Site Settings', ...adminLocals(req) });
});

router.post('/site', requireAuth, (req, res) => {
  const site = { ...content.getSite(), ...req.body };
  content.saveSite(site);
  setFlash(req, 'Site settings saved.');
  res.redirect('/admin/site');
});

router.get('/posts/:type', requireAuth, (req, res) => {
  const { type } = req.params;
  if (!content.POST_TYPES.includes(type)) return res.status(404).send('Invalid type');
  res.render('admin/posts-list', {
    title: `Manage ${type}`,
    postType: type,
    posts: content.listPosts(type, { publishedOnly: false }),
    ...adminLocals(req),
  });
});

router.get('/posts/:type/new', requireAuth, (req, res) => {
  res.render('admin/post-edit', {
    title: 'New Post',
    postType: req.params.type,
    post: { status: 'draft', bodyFormat: 'markdown' },
    ...adminLocals(req),
  });
});

router.get('/posts/:type/edit/:slug', requireAuth, (req, res) => {
  const post = content.getPost(req.params.type, req.params.slug);
  if (!post) return res.status(404).send('Not found');
  res.render('admin/post-edit', {
    title: 'Edit Post',
    postType: req.params.type,
    post,
    ...adminLocals(req),
  });
});

router.post('/posts/:type/save', requireAuth, (req, res) => {
  const { type } = req.params;
  const body = req.body;
  const existing = body.slug ? content.getPost(type, body.slug) : null;
  const post = {
    ...(existing || {}),
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt,
    body: body.body,
    bodyFormat: body.bodyFormat || 'markdown',
    status: body.status || 'draft',
    featuredImage: body.featuredImage,
    author: body.author || 'Nayab Tahir',
    tags: body.tags ? body.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    metaDescription: body.metaDescription,
  };
  const saved = content.savePost(type, post);
  setFlash(req, `Post "${saved.title}" saved.`);
  res.redirect(`/admin/posts/${type}/edit/${saved.slug}`);
});

router.post('/posts/:type/approve/:slug', requireAuth, (req, res) => {
  const post = content.getPost(req.params.type, req.params.slug);
  if (!post) return res.status(404).send('Not found');
  post.status = 'published';
  if (!post.publishedAt) post.publishedAt = new Date().toISOString();
  content.savePost(req.params.type, post);
  setFlash(req, `Published: ${post.title}`);
  res.redirect(`/admin/posts/${req.params.type}`);
});

router.post('/posts/:type/delete/:slug', requireAuth, (req, res) => {
  content.deletePost(req.params.type, req.params.slug);
  setFlash(req, 'Post deleted.');
  res.redirect(`/admin/posts/${req.params.type}`);
});

router.get('/pages', requireAuth, (req, res) => {
  res.render('admin/pages-list', {
    title: 'Pages',
    pages: content.listPages(),
    ...adminLocals(req),
  });
});

router.get('/pages/edit/:slug', requireAuth, (req, res) => {
  const page = content.getPage(req.params.slug);
  if (!page) return res.status(404).send('Not found');
  res.render('admin/page-edit', { title: 'Edit Page', page, ...adminLocals(req) });
});

router.post('/pages/save', requireAuth, (req, res) => {
  const body = req.body;
  const existing = content.getPage(body.slug);
  const page = {
    ...(existing || {}),
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt,
    body: body.body,
    bodyFormat: body.bodyFormat || 'markdown',
  };
  content.savePage(page);
  setFlash(req, `Page "${page.title}" saved.`);
  res.redirect(`/admin/pages/edit/${page.slug}`);
});

router.get('/media', requireAuth, (req, res) => {
  res.render('admin/media', {
    title: 'Media Library',
    media: content.listMedia(),
    ...adminLocals(req),
  });
});

router.post('/media/upload', requireAuth, upload.array('files', 12), (req, res) => {
  setFlash(req, `${req.files.length} file(s) uploaded.`);
  res.redirect('/admin/media');
});

router.post('/media/delete', requireAuth, (req, res) => {
  const file = path.basename(req.body.filename);
  const target = path.join(__dirname, '..', 'uploads', file);
  if (fs.existsSync(target)) fs.unlinkSync(target);
  setFlash(req, 'File deleted.');
  res.redirect('/admin/media');
});

module.exports = router;
