const express = require('express');
const router = express.Router();
const { register, login, me, updateProfile} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login)

module.exports = router;