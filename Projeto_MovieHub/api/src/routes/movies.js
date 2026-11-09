const { Router } = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { text, integer } = require('../utils/validation');

const router = Router();
const movieSelect = `
  SELECT m.id, m.title, m.synopsis, m.release_year AS releaseYear, m.genre,
    m.director, m.poster_url AS posterUrl, m.created_by AS createdBy,
    m.created_at AS createdAt, m.updated_at AS updatedAt,
    COALESCE(ROUND(AVG(r.rating), 1), 0) AS averageRating,
    COUNT(r.id) AS reviewCount
  FROM movies m LEFT JOIN reviews r ON r.movie_id = m.id
`;

function parseMovie(body, partial = false) {
  const fields = {};
  const specs = {
    title: { min: 1, max: 160, field: 'Título' },
    synopsis: { min: 0, max: 5000, field: 'Sinopse' },
    genre: { min: 0, max: 80, field: 'Gênero' },
    director: { min: 0, max: 120, field: 'Diretor' },
    posterUrl: { min: 0, max: 2048, field: 'URL do pôster' },
  };
  for (const [key, spec] of Object.entries(specs)) {
    if (!partial || body[key] !== undefined) fields[key] = text(body[key] ?? (partial ? undefined : ''), { ...spec, optional: partial });
  }
  if (fields.posterUrl && !/^https?:\/\//i.test(fields.posterUrl)) {
    throw new Error('URL do pôster deve ser uma URL HTTP ou HTTPS.');
  }
  if (!partial || body.releaseYear !== undefined) {
    fields.releaseYear = integer(body.releaseYear, { min: 1888, max: 2200, field: 'Ano de lançamento', optional: true });
  }
  return fields;
}

router.get('/', (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
  const search = typeof req.query.search === 'string' ? req.query.search.trim().slice(0, 160) : '';
  const genre = typeof req.query.genre === 'string' ? req.query.genre.trim().slice(0, 80) : '';
  const year = req.query.year ? Number.parseInt(req.query.year, 10) : null;
  const sortMap = { newest: 'm.created_at DESC', title: 'm.title COLLATE NOCASE ASC', year: 'm.release_year DESC', rating: 'averageRating DESC, reviewCount DESC' };
  const sort = sortMap[req.query.sort] ? req.query.sort : 'newest';
  const where = [];
  const params = [];
  if (search) { where.push('(m.title LIKE ? OR m.director LIKE ? OR m.genre LIKE ?)'); params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
  if (genre) { where.push('m.genre = ? COLLATE NOCASE'); params.push(genre); }
  if (Number.isInteger(year) && year >= 1888 && year <= 2200) { where.push('m.release_year = ?'); params.push(year); }
  const whereSql = where.length ? ` WHERE ${where.join(' AND ')}` : '';
  const total = db.prepare(`SELECT COUNT(*) AS total FROM movies m${whereSql}`).get(...params).total;
  const items = db.prepare(`${movieSelect}${whereSql} GROUP BY m.id ORDER BY ${sortMap[sort]} LIMIT ? OFFSET ?`)
    .all(...params, limit, (page - 1) * limit);
  return res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const movie = db.prepare(`${movieSelect} WHERE m.id = ? GROUP BY m.id`).get(id);
  if (!movie) return res.status(404).json({ error: 'Filme não encontrado.' });
  const reviews = db.prepare(`SELECT r.id, r.rating, r.comment, r.created_at AS createdAt,
      r.updated_at AS updatedAt, u.id AS userId, u.name AS userName
    FROM reviews r JOIN users u ON u.id = r.user_id WHERE r.movie_id = ? ORDER BY r.created_at DESC`).all(id);
  return res.json({ ...movie, reviews });
});

router.post('/', requireAuth, (req, res, next) => {
  try {
    const fields = parseMovie(req.body);
    const result = db.prepare(`INSERT INTO movies (title, synopsis, release_year, genre, director, poster_url, created_by)
      VALUES (@title, @synopsis, @releaseYear, @genre, @director, @posterUrl, @createdBy)`)
      .run({ ...fields, createdBy: req.user.sub });
    const movie = db.prepare(`${movieSelect} WHERE m.id = ? GROUP BY m.id`).get(result.lastInsertRowid);
    return res.status(201).json(movie);
  } catch (error) { return next(error); }
});

router.patch('/:id', requireAuth, (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM movies WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Filme não encontrado.' });
    if (existing.created_by !== req.user.sub) return res.status(403).json({ error: 'Somente quem cadastrou o filme pode editá-lo.' });
    const fields = parseMovie(req.body, true);
    if (!Object.keys(fields).length) return res.status(400).json({ error: 'Informe ao menos um campo para atualizar.' });
    const columns = { title: 'title', synopsis: 'synopsis', releaseYear: 'release_year', genre: 'genre', director: 'director', posterUrl: 'poster_url' };
    const updates = Object.keys(fields).map((key) => `${columns[key]} = @${key}`).join(', ');
    db.prepare(`UPDATE movies SET ${updates}, updated_at = datetime('now') WHERE id = @id`).run({ ...fields, id });
    return res.json(db.prepare(`${movieSelect} WHERE m.id = ? GROUP BY m.id`).get(id));
  } catch (error) { return next(error); }
});

router.delete('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT created_by FROM movies WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Filme não encontrado.' });
  if (existing.created_by !== req.user.sub) return res.status(403).json({ error: 'Somente quem cadastrou o filme pode removê-lo.' });
  db.prepare('DELETE FROM movies WHERE id = ?').run(id);
  return res.status(204).end();
});

module.exports = router;
