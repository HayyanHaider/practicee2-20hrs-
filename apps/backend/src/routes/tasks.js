const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const tasks = await db.query('SELECT * FROM tasks WHERE user_id=$1', [req.userId]);
  res.json(tasks.rows);
});

router.post('/', auth, async (req, res) => {
  const { title } = req.body;
  const task = await db.query(
    'INSERT INTO tasks (user_id, title) VALUES ($1, $2) RETURNING *',
    [req.userId, title]
  );
  res.json(task.rows[0]);
});

router.patch('/:id', auth, async (req, res) => {
  const { status } = req.body;
  const task = await db.query(
    'UPDATE tasks SET status=$1 WHERE id=$2 AND user_id=$3 RETURNING *',
    [status, req.params.id, req.userId]
  );
  res.json(task.rows[0]);
});

router.delete('/:id', auth, async (req, res) => {
  await db.query('DELETE FROM tasks WHERE id=$1 AND user_id=$2', [req.params.id, req.userId]);
  res.json({ message: 'Deleted' });
});

module.exports = router;