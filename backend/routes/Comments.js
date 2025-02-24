const express = require('express');
const router = express.Router();
const {
  getOneComment,
  postAddComment,
  deleteComment,
} = require('../controller/Comments');
const validateToken = require('../middlewares/AuthMiddleware');

router.get('/:postId', getOneComment);

router.post('/', validateToken, postAddComment);

router.delete('/:commentId', validateToken, deleteComment);

module.exports = router;
