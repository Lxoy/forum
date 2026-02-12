const pool = require('../db');

const categoryController = {
  getAllCategoriesNames: async (req, res) => {
    try {
      const { rows } = await pool.query(
        'SELECT id, name, icon FROM categories ORDER BY name'
      );

      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = categoryController;
