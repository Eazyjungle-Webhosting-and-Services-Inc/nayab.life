function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }
  const redirect = encodeURIComponent(req.originalUrl || '/admin');
  res.redirect(`/admin/login?redirect=${redirect}`);
}

module.exports = { requireAuth };
