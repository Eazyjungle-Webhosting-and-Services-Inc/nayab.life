const express = require('express');
const content = require('../lib/content');

const router = express.Router();

function siteLocals() {
  return { site: content.getSite() };
}

router.get('/', (req, res) => {
  res.render('home', {
    title: 'Home',
    ...siteLocals(),
    latestBlog: content.listPosts('blog').slice(0, 3),
    latestNews: content.listPosts('news').slice(0, 3),
    latestArticles: content.listPosts('articles').slice(0, 2),
  });
});

router.get('/about', (req, res) => {
  const page = content.getPage('about') || {};
  res.render('about', { title: 'About Nayab', ...siteLocals(), page });
});

router.get('/services', (req, res) => {
  const page = content.getPage('services') || {};
  res.render('services', { title: 'Services', ...siteLocals(), page });
});

router.get('/approach', (req, res) => {
  const page = content.getPage('approach') || {};
  res.render('approach', { title: 'My Approach', ...siteLocals(), page });
});

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact', ...siteLocals(), sent: req.query.sent === '1' });
});

router.post('/contact', (req, res) => {
  res.redirect('/contact?sent=1');
});

router.get('/blog', (req, res) => {
  res.render('archive', {
    title: 'Blog',
    type: 'blog',
    typeLabel: 'Blog',
    ...siteLocals(),
    posts: content.listPosts('blog'),
  });
});

router.get('/articles', (req, res) => {
  res.render('archive', {
    title: 'Articles',
    type: 'articles',
    typeLabel: 'Articles',
    ...siteLocals(),
    posts: content.listPosts('articles'),
  });
});

router.get('/news', (req, res) => {
  res.render('archive', {
    title: 'News & Developments',
    type: 'news',
    typeLabel: 'News',
    ...siteLocals(),
    posts: content.listPosts('news'),
  });
});

router.get('/blog/:slug', (req, res) => {
  const post = content.getPost('blog', req.params.slug);
  if (!post || post.status !== 'published') return res.status(404).render('404', { title: 'Not Found', ...siteLocals() });
  res.render('post', { title: post.title, type: 'blog', typeLabel: 'Blog', ...siteLocals(), post });
});

router.get('/articles/:slug', (req, res) => {
  const post = content.getPost('articles', req.params.slug);
  if (!post || post.status !== 'published') return res.status(404).render('404', { title: 'Not Found', ...siteLocals() });
  res.render('post', { title: post.title, type: 'articles', typeLabel: 'Article', ...siteLocals(), post });
});

router.get('/news/:slug', (req, res) => {
  const post = content.getPost('news', req.params.slug);
  if (!post || post.status !== 'published') return res.status(404).render('404', { title: 'Not Found', ...siteLocals() });
  res.render('post', { title: post.title, type: 'news', typeLabel: 'News', ...siteLocals(), post });
});

module.exports = router;
