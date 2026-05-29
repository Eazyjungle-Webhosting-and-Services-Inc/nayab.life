require('dotenv').config();

const fs = require('fs');
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

/** Verify deploy reached the Node application root (not just the Git clone folder). */
app.get('/deploy-check', (_req, res) => {
  const root = __dirname;
  let assets = {};
  try {
    assets = JSON.parse(fs.readFileSync(path.join(root, 'data', 'assets.json'), 'utf8'));
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'assets.json unreadable', detail: e.message });
  }
  let homeSnippet = '';
  try {
    homeSnippet = fs.readFileSync(path.join(root, 'views', 'home.ejs'), 'utf8');
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'home.ejs unreadable', detail: e.message });
  }
  const pillarFile = path.join(root, 'public', 'images', 'pillars', 'collaborative-therapy.jpg');
  const stressFile = path.join(root, 'public', 'images', 'services', 'stress-management.jpg');
  const payload = {
    ok: true,
    deployMarker: 'services-v18',
    assetsVersion: assets.version || null,
    therapySessionPath: assets.therapySession || null,
    pillarsSectionInTemplate: homeSnippet.includes('pillars-section'),
    areasOfFocusInTemplate: homeSnippet.includes('areas-of-focus'),
    pillarImageOnDisk: fs.existsSync(pillarFile),
    serviceStressOnDisk: fs.existsSync(stressFile),
    appRoot: root,
    nodeEnv: process.env.NODE_ENV || 'development',
  };
  payload.fullyDeployed =
    payload.assetsVersion === '18' &&
    payload.pillarsSectionInTemplate &&
    payload.areasOfFocusInTemplate &&
    payload.pillarImageOnDisk &&
    payload.serviceStressOnDisk;
  res.json(payload);
});

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
