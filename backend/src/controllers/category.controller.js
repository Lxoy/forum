const pool = require('../db');

const getAllCategoriesNames = async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT id, name, icon FROM categories ORDER BY name'
        );

        return res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

module.exports = getAllCategoriesNames