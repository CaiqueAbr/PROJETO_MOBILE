require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./db');
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const reviewRoutes = require('./routes/reviews');
const favoriteRoutes = require('./routes/favorites');

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('Defina JWT_SECRET com pelo menos 32 caracteres no arquivo .env.');
}

const app = express();
const origins = (process.env.CORS_ORIGIN || '*').split(',').map((value) => value.trim());
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: origins.includes('*') ? '*' : origins }));
app.use(express.json({ limit: '1mb' }));
app.use((req, _res, next) => {
  req.body = req.body || {};
  next();
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok', database: 'connected' }));
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use((_req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));
app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && 'body' in error) return res.status(400).json({ error: 'JSON inválido.' });
  if (error instanceof Error && /deve ser/.test(error.message)) return res.status(400).json({ error: error.message });
  console.error(error);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
});

const port = Number(process.env.PORT || 3333);
const host = process.env.HOST || '0.0.0.0';
const server = app.listen(port, host, () => console.log(`MovieHub API disponível em http://${host}:${port}`));

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
