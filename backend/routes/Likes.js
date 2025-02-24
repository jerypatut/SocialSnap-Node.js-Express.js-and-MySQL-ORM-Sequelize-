const express = require('express');
const router = express.Router();
const addLikes = require('../controller/Likes');
const validateToken = require('../middlewares/AuthMiddleware');

router.post('/', validateToken, addLikes);

module.exports = router;
