const express = require('express');
const router = express.Router();
const { register, login, me, updateProfile} = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login)

module.exports = router;