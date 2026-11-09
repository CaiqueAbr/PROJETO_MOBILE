const { Router } = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { text, integer } = require('../utils/validation');

const router = Router();

router.post('/movies/:movieId/reviews', requireAuth, (req, res, next) => {
  try {
    const movieId = Number(req.params.movieId);
    if (!db.prepare('SELECT id FROM movies WHERE id = ?').get(movieId)) return res.status(404).json({ error: 'Filme não encontrado.' });
    const rating = integer(req.body.rating, { min: 1, max: 5, field: 'Nota' });
    const comment = text(req.body.comment ?? '', { min: 0, max: 2000, field: 'Comentário' });
    const result = db.prepare('INSERT INTO reviews (movie_id, user_id, rating, comment) VALUES (?, ?, ?, ?)')
      .run(movieId, req.user.sub, rating, comment);
    return res.status(201).json(db.prepare(`SELECT r.id, r.movie_id AS movieId, r.user_id AS userId,
      u.name AS userName, r.rating, r.comment, r.created_at AS createdAt, r.updated_at AS updatedAt
      FROM reviews r JOIN users u ON u.id = r.user_id WHERE r.id = ?`).get(result.lastInsertRowid));
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(409).json({ error: 'Você já avaliou este filme. Atualize sua avaliação existente.' });
    return next(error);
  }
});

router.patch('/reviews/:id', requireAuth, (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    if (!review) return res.status(404).json({ error: 'Avaliação não encontrada.' });
    if (review.user_id !== req.user.sub) return res.status(403).json({ error: 'Você só pode editar suas próprias avaliações.' });
    const hasRating = req.body.rating !== undefined;
    const hasComment = req.body.comment !== undefined;
    if (!hasRating && !hasComment) return res.status(400).json({ error: 'Informe a nota ou o comentário.' });
    const rating = hasRating ? integer(req.body.rating, { min: 1, max: 5, field: 'Nota' }) : review.rating;
    const comment = hasComment ? text(req.body.comment, { min: 0, max: 2000, field: 'Comentário' }) : review.comment;
    db.prepare("UPDATE reviews SET rating = ?, comment = ?, updated_at = datetime('now') WHERE id = ?").run(rating, comment, id);
    return res.json({ ...review, rating, comment });
  } catch (error) { return next(error); }
});

router.delete('/reviews/:id', requireAuth, (req, res) => {
  const review = db.prepare('SELECT user_id FROM reviews WHERE id = ?').get(Number(req.params.id));
  if (!review) return res.status(404).json({ error: 'Avaliação não encontrada.' });
  if (review.user_id !== req.user.sub) return res.status(403).json({ error: 'Você só pode remover suas próprias avaliações.' });
  db.prepare('DELETE FROM reviews WHERE id = ?').run(Number(req.params.id));
  return res.status(204).end();
});

router.get('/me/reviews', requireAuth, (req, res) => {
  const items = db.prepare(`SELECT r.id, r.movie_id AS movieId, m.title, m.poster_url AS posterUrl,
    r.rating, r.comment, r.created_at AS createdAt FROM reviews r JOIN movies m ON m.id = r.movie_id
    WHERE r.user_id = ? ORDER BY r.created_at DESC`).all(req.user.sub);
  return res.json({ items });
});

module.exports = router;
