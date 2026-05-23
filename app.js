require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');

const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
const { getAssets, asset } = require('./lib/assets');
const { mountPublicStatic } = require('./lib/static-files');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Required on Plesk / nginx so secure session cookies work over HTTPS
if (isProduction) {
  app.set('trust proxy', 1);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    name: 'nayab.sid',
    secret: process.env.SESSION_SECRET || 'nayab-life-dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    proxy: isProduction,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    },
  })
);

const publicDir = path.join(__dirname, 'public');
mountPublicStatic(app, publicDir);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.asset = asset;
  res.locals.assets = getAssets();
  next();
});

app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
  const content = require('./lib/content');
  res.status(404).render('404', {
    title: 'Page Not Found',
    site: content.getSite(),
    assets: getAssets(),
  });
});

app.use((err, req, res, _next) => {
  console.error(err);
  const content = require('./lib/content');
  res.status(500).render('error', {
    title: 'Something went wrong',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Please try again later.',
    site: content.getSite(),
    assets: getAssets(),
  });
});

app.listen(PORT, () => {
  console.log(`nayab.life running on port ${PORT}`);
});
