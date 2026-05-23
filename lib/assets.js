const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'data', 'assets.json');
let cache = null;

function getAssets() {
  if (!cache) {
    try {
      cache = JSON.parse(fs.readFileSync(DATA, 'utf8'));
    } catch {
      cache = {};
    }
  }
  return cache;
}

function asset(url) {
  const v = getAssets().version || '1';
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}v=${v}`;
}

/** Local path with CDN fallback for <img src> + onerror */
function img(localPath, fallbackKey) {
  const assets = getAssets();
  const fb = fallbackKey ? assets[fallbackKey] : null;
  return { src: asset(localPath), fallback: fb || localPath };
}

function imgTag(localPath, fallbackKey, attrs = {}) {
  const { src, fallback } = img(localPath, fallbackKey);
  const alt = attrs.alt != null ? attrs.alt : '';
  const cls = attrs.className ? ` class="${attrs.className}"` : '';
  const loading = attrs.loading ? ` loading="${attrs.loading}"` : ' loading="lazy"';
  const w = attrs.width ? ` width="${attrs.width}"` : '';
  const h = attrs.height ? ` height="${attrs.height}"` : '';
  return `<img src="${src}"${cls} alt="${alt}"${loading}${w}${h} onerror="this.onerror=null;this.src='${fallback}'" />`;
}

module.exports = { getAssets, asset, img, imgTag };
