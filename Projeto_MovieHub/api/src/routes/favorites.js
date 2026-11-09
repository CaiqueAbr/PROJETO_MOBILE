const { Router } = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const items = db.prepare(`SELECT m.id, m.title, m.synopsis, m.release_year AS releaseYear,
    m.genre, m.director, m.poster_url AS posterUrl, f.created_at AS favoritedAt,
    COALESCE(ROUND(AVG(r.rating), 1), 0) AS averageRating, COUNT(r.id) AS reviewCount
    FROM favorites f JOIN movies m ON m.id = f.movie_id LEFT JOIN reviews r ON r.movie_id = m.id
    WHERE f.user_id = ? GROUP BY m.id ORDER BY f.created_at DESC`).all(req.user.sub);
  return res.json({ items });
});

router.put('/:movieId', (req, res) => {
  const movieId = Number(req.params.movieId);
  if (!db.prepare('SELECT id FROM movies WHERE id = ?').get(movieId)) return res.status(404).json({ error: 'Filme não encontrado.' });
  db.prepare('INSERT OR IGNORE INTO favorites (user_id, movie_id) VALUES (?, ?)').run(req.user.sub, movieId);
  return res.status(204).end();
});

router.delete('/:movieId', (req, res) => {
  db.prepare('DELETE FROM favorites WHERE user_id = ? AND movie_id = ?').run(req.user.sub, Number(req.params.movieId));
  return res.status(204).end();
});

module.exports = router;
