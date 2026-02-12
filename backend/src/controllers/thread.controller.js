const pool = require('../db');

const threadController = {

  getAllThreads: async (req, res) => {
    try {
      const { rows } = await pool.query(`
        WITH cte AS (
          SELECT p.thread_id, COUNT(p.id) as posts_count
          FROM posts p
          GROUP BY p.thread_id
        )
        SELECT 
          t.id, t.title, t.category_id, c.name AS category, 
          t.user_id, u.username, t.created_at, cte.posts_count
        FROM threads t
        JOIN users u ON u.id = t.user_id
        JOIN categories c ON c.id = t.category_id
        JOIN cte ON cte.thread_id = t.id
        ORDER BY created_at DESC
      `);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching threads:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  createThread: async (req, res) => {
    try {
      const { title, categoryId } = req.body;
      const userId = req.user.id;

      if (!title || !categoryId) {
        return res.status(400).json({ message: 'Missing fields' });
      }

      const result = await pool.query(
        `INSERT INTO threads (title, user_id, category_id)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [title, userId, categoryId]
      );

      res.status(201).json({ threadId: result.rows[0].id });
    } catch (error) {
      console.error('Error creating thread:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getPopularThreads: async (req, res) => {
    try {
      const { rows } = await pool.query(`
        WITH cte AS (
          SELECT p.thread_id, COUNT(p.id) as posts_count
          FROM posts p
          GROUP BY p.thread_id
        )
        SELECT 
          t.id, t.title, t.category_id, c.name AS category, 
          t.user_id, u.username, t.created_at, cte.posts_count
        FROM threads t
        JOIN users u ON u.id = t.user_id
        JOIN categories c ON c.id = t.category_id
        JOIN cte ON cte.thread_id = t.id
        ORDER BY posts_count DESC
      `);
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching popular threads: ", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  getThreadsByCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { rows } = await pool.query(`
        WITH cte AS (
          SELECT p.thread_id, COUNT(p.id) AS posts_count
          FROM posts p
          GROUP BY p.thread_id
        )
        SELECT 
          t.id, t.title, t.category_id, c.name AS category, 
          t.user_id, u.username, t.created_at, 
          COALESCE(cte.posts_count, 0) AS posts_count
        FROM threads t
        JOIN users u ON u.id = t.user_id
        JOIN categories c ON c.id = t.category_id
        JOIN cte ON cte.thread_id = t.id
        WHERE t.category_id = $1
        ORDER BY posts_count DESC
      `, [id]);

      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching threads by category: ", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  getThreadById: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(`
        WITH cte AS (
          SELECT p.thread_id, COUNT(p.id) AS posts_count
          FROM posts p
          GROUP BY p.thread_id
        )
        SELECT 
          t.id, t.title, t.category_id, c.name AS category, 
          t.user_id, u.username, t.created_at, 
          COALESCE(cte.posts_count, 0) AS posts_count
        FROM threads t
        JOIN users u ON u.id = t.user_id
        JOIN categories c ON c.id = t.category_id
        JOIN cte ON cte.thread_id = t.id
        WHERE t.id = $1
      `, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Thread not found" });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  deleteThread: async (req, res) => {
    const threadId = req.params.id;
    const userIdFromToken = req.user.id;

    try {
      const threadResult = await pool.query(
        'SELECT user_id FROM threads WHERE id = $1',
        [threadId]
      );

      if (!threadResult.rows.length) {
        return res.status(404).json({ message: 'Thread not found' });
      }

      const threadOwnerId = threadResult.rows[0].user_id;

      if (threadOwnerId !== userIdFromToken) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      await pool.query(
        'DELETE FROM threads WHERE id = $1',
        [threadId]
      );

      res.json({ message: 'Thread deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }

};

module.exports = threadController;
