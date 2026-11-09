const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Autenticação necessária.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    req.user.sub = Number(req.user.sub);
    if (!Number.isInteger(req.user.sub) || req.user.sub < 1) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

module.exports = { requireAuth };
