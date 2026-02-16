const pool = require('../db');

const userController = {

    getProfile: async (req, res) => {
        try {
            const userId = req.user.id;

            const result = await pool.query(
                `SELECT id, username, email, role 
                 FROM users 
                 WHERE id = $1`,
                [userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json(result.rows[0]);

        } catch (error) {
            console.error('Error fetching user:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const userId = req.user.id;
            const { username, email } = req.body;

            if (!username || !email) {
                return res.status(400).json({
                    message: 'Username and email are required'
                });
            }

            const existing = await pool.query(
                `SELECT id FROM users 
                 WHERE (username = $1 OR email = $2)
                 AND id != $3`,
                [username, email, userId]
            );

            if (existing.rows.length > 0) {
                return res.status(409).json({
                    message: 'Username or email already exists'
                });
            }

            const result = await pool.query(
                `UPDATE users
                 SET username = $1, email = $2
                 WHERE id = $3
                 RETURNING id, username, email, role`,
                [username, email, userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json(result.rows[0]);

        } catch (error) {
            console.error('Error updating profile:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = userController;
