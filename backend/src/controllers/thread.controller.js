const pool = require('../db');

const getAllThreads = async (req, res) => {
    try {
        const { rows } = await pool.query(
            `
            WITH cte AS (
            SELECT p.thread_id, COUNT(p.id) as posts_count
            FROM posts p
            GROUP BY(p.thread_id)
            )

            SELECT t.id, t.title, t.category_id, c.name AS category, t.user_id, u.username, t.created_at, cte.posts_count
            from threads t 
            JOIN users u ON u.id = t.user_id 
            JOIN categories c ON c.id = t.category_id
            JOIN cte ON cte.thread_id = t.id
            ORDER BY created_at DESC`);
        return res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching threads:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

const createThread = async (req, res) => {
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
        return res.status(500).json({ message: 'Server error' });
    }
}

const getPopularThreads = async (req, res) => {
    try {
        const { rows } = await pool.query(
            `WITH cte AS (
            SELECT p.thread_id, COUNT(p.id) as posts_count
            FROM posts p
            GROUP BY(p.thread_id)
            )

            SELECT t.id, t.title, t.category_id, c.name AS category, t.user_id, u.username, t.created_at, cte.posts_count
            from threads t 
            JOIN users u ON u.id = t.user_id 
            JOIN categories c ON c.id = t.category_id
            JOIN cte ON cte.thread_id = t.id
            ORDER BY posts_count DESC`
        );

        res.status(200).json(rows);
    }
    catch (error) {
        console.error("Error fetching popular threads: ", error);
        return res.status(500).json({ message: "Server error" });
    }
}

const getThreadsByCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query(
            `
            WITH cte AS (
                SELECT p.thread_id, COUNT(p.id) AS posts_count
                FROM posts p
                GROUP BY p.thread_id
            )

            SELECT 
                t.id,
                t.title,
                t.category_id,
                c.name AS category,
                t.user_id,
                u.username,
                t.created_at,
                COALESCE(cte.posts_count, 0) AS posts_count
            FROM threads t
            JOIN users u ON u.id = t.user_id
            JOIN categories c ON c.id = t.category_id
            LEFT JOIN cte ON cte.thread_id = t.id
            WHERE t.category_id = $1
            ORDER BY posts_count DESC
            `,
            [id]
        );
        res.status(200).json(rows);
    }
    catch (error) {
        console.error("Error fetching threads by category: ", error);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    getAllThreads,
    createThread,
    getPopularThreads,
    getThreadsByCategory
};