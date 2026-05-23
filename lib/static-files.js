const path = require('path');
const express = require('express');

function mountPublicStatic(app, publicDir) {
  const opts = {
    maxAge: process.env.NODE_ENV === 'production' ? '7d' : 0,
    etag: true,
    fallthrough: false,
  };

  app.use('/css', express.static(path.join(publicDir, 'css'), opts));
  app.use('/js', express.static(path.join(publicDir, 'js'), opts));
  app.use('/images', express.static(path.join(publicDir, 'images'), opts));
  app.use(express.static(publicDir, { ...opts, fallthrough: true }));
}

module.exports = { mountPublicStatic };
