const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { text } = require('../utils/validation');

const router = Router();
const publicUser = ({ id, name, email, created_at }) => ({ id, name, email, createdAt: created_at });
const signToken = (user) => jwt.sign({ sub: String(user.id), name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

router.post('/register', (req, res, next) => {
  try {
    const name = text(req.body.name, { min: 2, max: 80, field: 'Nome' });
    const email = text(req.body.email, { min: 5, max: 254, field: 'E-mail' }).toLowerCase();
    const password = req.body.password;
    if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
      return res.status(400).json({ error: 'Senha deve ter entre 8 e 128 caracteres.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Informe um e-mail válido.' });

    const info = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
      .run(name, email, bcrypt.hashSync(password, 12));
    const user = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(info.lastInsertRowid);
    return res.status(201).json({ user: publicUser(user), token: signToken(user) });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
    return next(error);
  }
});

router.post('/login', (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  }
  return res.json({ user: publicUser(row), token: signToken(row) });
});

module.exports = router;
