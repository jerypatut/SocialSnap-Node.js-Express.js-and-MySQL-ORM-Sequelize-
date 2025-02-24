const express = require('express');
const router = express.Router();
const validateToken = require('../middlewares/AuthMiddleware');
const { UsersRegister, UserLogin, getUser } = require('../controller/Users');

// Register: Membuat user baru
router.post('/', UsersRegister);

// Login: Mengautentikasi user
router.post('/login', UserLogin);
// Auth check route
router.get('/auth', validateToken, getUser);

module.exports = router;
