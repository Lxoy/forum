const express = require('express');
const getAllCategoriesNames = require('../controllers/category.controller');
const {getAllThreads, createThread} = require('../controllers/thread.controller');
const authMiddleware = require('../middleware/auth.middleware');
const createPost = require('../controllers/post.controller');
const router = express.Router();

router.get('/categories', getAllCategoriesNames);
router.get('/thread', getAllThreads);
router.post('/thread', authMiddleware, createThread)
router.post('/post', authMiddleware, createPost);

module.exports = router;