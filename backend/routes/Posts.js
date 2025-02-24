const express = require('express');
const router = express.Router();
const validateToken = require('../middlewares/AuthMiddleware');
const {
  getAllPosts,
  getOnePosts,
  createPost,
  deletePost,
} = require('../controller/Posts');
// Ambil semua postingan (dengan Like)
router.get('/', validateToken, getAllPosts);
// Ambil satu postingan berdasarkan ID
router.get('/byId/:id', getOnePosts);

// Tambah postingan baru dengan dukungan upload gambar
router.post('/', validateToken, createPost);

// Hapus postingan
router.delete('/:postId', validateToken, deletePost);

module.exports = router;
