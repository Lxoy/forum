const pool = require('../db');

const categoryController = {
  getAllCategoriesNames: async (req, res) => {
    try {
      const { rows } = await pool.query(
        'SELECT id, name, description FROM categories ORDER BY name'
      );

      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { name, description } = req.body;

      if (!name || !description) {
        return res.status(400).json({
          message: 'Name and description are required'
        });
      }

      const existing = await pool.query(
        'SELECT id FROM categories WHERE LOWER(name) = LOWER($1)',
        [name]
      );

      if (existing.rows.length > 0) {
        return res.status(409).json({
          message: 'Category already exists'
        });
      }

      const { rows } = await pool.query(
        `INSERT INTO categories (name, description)
         VALUES ($1, $2)
         RETURNING id, name, description`,
        [name, description]
      );

      res.status(201).json(rows[0]);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          message: 'Category ID is required'
        });
      }

      const existingCategory = await pool.query(
        'SELECT id FROM categories WHERE id = $1',
        [id]
      );

      if (existingCategory.rows.length === 0) {
        return res.status(409).json({
          message: 'Cannot delete category because it contains threads'
        });
      }

      const existingThreads = await pool.query(
        'SELECT id FROM threads WHERE category_id = $1 LIMIT 1',
        [id]
      );

      if (existingThreads.rows.length > 0) {
        return res.status(409).json({
          message: 'Cannot delete category because it contains threads'
        });
      }

      await pool.query(
        'DELETE FROM categories WHERE id = $1',
        [id]
      );

      res.status(200).json({
        message: 'Category deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

};

module.exports = categoryController;
