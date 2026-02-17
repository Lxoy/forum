const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

const categoryController = require('../controllers/category.controller');
const threadController = require('../controllers/thread.controller');
const postController = require('../controllers/post.controller');
const userController = require('../controllers/user.controller');

router.get('/categories', authMiddleware, categoryController.getAllCategoriesNames);
router.post('/categories', authMiddleware, categoryController.createCategory);
router.delete('/categories/:id', authMiddleware, categoryController.deleteCategory);

router.get('/threads/popular', authMiddleware, threadController.getPopularThreads);
router.get('/categories/:id/threads', authMiddleware, threadController.getThreadsByCategory);

router.get('/threads', authMiddleware, threadController.getAllThreads);
router.post('/threads', authMiddleware, threadController.createThread);
router.get('/threads/:id', authMiddleware, threadController.getThreadById);
router.put('/threads/:id', authMiddleware, threadController.updateThreadTitle);
router.delete('/threads/:id', authMiddleware, threadController.deleteThread);

router.get('/threads/:threadId/posts', authMiddleware, postController.getAllPostsByThreadId);
router.post('/threads/:threadId/posts', authMiddleware, postController.createPost);
router.put('/posts/:id', authMiddleware, postController.updatePost);
router.delete('/posts/:id', authMiddleware, postController.deletePost);

router.get('/users/me', authMiddleware, userController.getProfile);
router.put('/users/me', authMiddleware, userController.updateProfile);
router.put('/users/:id/role', authMiddleware, userController.updateUserRole);

module.exports = router;
