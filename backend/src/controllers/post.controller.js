const pool = require('../db');

const postController = {

    getAllPostsByThreadId: async (req, res) => {
        try {
           const { threadId } = req.params;

            const { rows } = await pool.query(
                `
                SELECT 
                    p.id,
                    p.content,
                    p.user_id,
                    u.username,
                    p.created_at
                FROM posts p
                JOIN users u ON u.id = p.user_id
                WHERE p.thread_id = $1
                ORDER BY p.created_at ASC
                `,
                [threadId]
            );

            return res.status(200).json(rows);

        } catch (error) {
            console.error('Error fetching posts:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    createPost: async (req, res) => {
        try {
            const { content } = req.body;
            const threadId = req.params.threadId;
            const userId = req.user.id;

            if (!content) {
                return res.status(400).json({ message: 'Missing fields' });
            }

            const result = await pool.query(
                `INSERT INTO posts (content, thread_id, user_id)
                 VALUES ($1, $2, $3)
                 RETURNING id`,
                [content, threadId, userId]
            );

            return res.status(201).json({
                message: 'Post created successfully',
                postId: result.rows[0].id
            });

        } catch (error) {
            console.error('Error creating post:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    updatePost: async (req, res) => {
        const postId = req.params.id;
        const userIdFromToken = req.user.id;
        const userRole = req.user.role;
        const { content } = req.body;

        try {
            if (!content || !content.trim()) {
                return res.status(400).json({ message: 'Content is required' });
            }

            const result = await pool.query(
                'SELECT user_id FROM posts WHERE id = $1',
                [postId]
            );

            if (!result.rows.length) {
                return res.status(404).json({ message: 'Post not found' });
            }

            const postOwnerId = result.rows[0].user_id;

            if (postOwnerId !== userIdFromToken && userRole !== 'ADMIN') {
                return res.status(403).json({ message: 'Not authorized' });
            }

            await pool.query(
                'UPDATE posts SET content = $1 WHERE id = $2',
                [content, postId]
            );

            res.json({ message: 'Post updated' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    deletePost: async (req, res) => {
        const postId = req.params.id;
        const userIdFromToken = req.user.id;
        const userRole = req.user.role;

        try {
            const result = await pool.query(
                'SELECT user_id FROM posts WHERE id = $1',
                [postId]
            );

            if (!result.rows.length) {
                return res.status(404).json({ message: 'Post not found' });
            }

            const postOwnerId = result.rows[0].user_id;

            if (postOwnerId !== userIdFromToken && userRole !== 'ADMIN') {
                return res.status(403).json({ message: 'Not authorized' });
            }

            await pool.query(
                'DELETE FROM posts WHERE id = $1',
                [postId]
            );

            res.json({ message: 'Post deleted' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = postController;
