const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// Controllers
const categoryController = require('../controllers/category.controller');
const threadController = require('../controllers/thread.controller');
const postController = require('../controllers/post.controller');
const userController = require('../controllers/user.controller');

/* ---------- CATEGORY ---------- */
router.get('/categories', categoryController.getAllCategoriesNames);
router.post('/categories', categoryController.createCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

/* ---------- THREAD ---------- */
router.get('/thread', authMiddleware, threadController.getAllThreads);
router.post('/thread', authMiddleware, threadController.createThread);
router.get('/thread/:id', authMiddleware, threadController.getThreadById);
router.delete('/thread/:id', authMiddleware, threadController.deleteThread);
router.put('/thread/:id', authMiddleware, threadController.updateThreadTitle);

/* ---------- THREAD POSTS ---------- */
router.get('/thread/:id/posts', authMiddleware, postController.getAllPostsByThreadId);
router.post('/post', authMiddleware, postController.createPost);
router.put('/post/:id', authMiddleware, postController.updatePost);
router.delete('/post/:id', authMiddleware, postController.deletePost);

/* ---------- OTHER ---------- */
router.get('/popular', authMiddleware, threadController.getPopularThreads);
router.get('/category/:id', authMiddleware, threadController.getThreadsByCategory);

/* ---------- USER ----------- */
router.get('/me', authMiddleware, userController.getProfile);
router.put('/me', authMiddleware, userController.updateProfile);

module.exports = router;
