const { Comments } = require('../models');
const { StatusCodes } = require('http-status-codes');
const redisClient = require('./redisClient'); // Import Redis client

// Mengambil komentar untuk sebuah post dengan caching
const getOneComment = async (req, res) => {
  const postId = req.params.postId;
  const cacheKey = `comments:${postId}`;
  try {
    // Cek apakah data komentar ada di cache Redis
    const cachedComments = await redisClient.get(cacheKey);
    if (cachedComments) {
      // Jika ada, parsing data dan kembalikan sebagai response
      return res.json(JSON.parse(cachedComments));
    }

    // Jika tidak ada di cache, ambil data dari database
    const comments = await Comments.findAll({ where: { PostId: postId } });

    // Simpan data ke cache dengan TTL 60 detik
    await redisClient.setEx(cacheKey, 60, JSON.stringify(comments));

    res.json(comments);
  } catch (error) {
    console.error('Error getting comments:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// Menambahkan komentar baru dan invalidasi cache
const postAddComment = async (req, res) => {
  const comment = req.body;
  const username = req.user.username;
  comment.username = username;

  try {
    const newComment = await Comments.create(comment);
    // Invalidate cache komentar untuk post terkait, jika ada
    if (comment.PostId) {
      const cacheKey = `comments:${comment.PostId}`;
      await redisClient.del(cacheKey);
    }
    res.status(StatusCodes.CREATED).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// Menghapus komentar dan invalidasi cache
const deleteComment = async (req, res) => {
  const commentId = req.params.commentId;

  try {
    // Ambil informasi komentar untuk mendapatkan PostId (jika diperlukan untuk invalidasi cache)
    const comment = await Comments.findByPk(commentId);
    if (!comment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Comment not found' });
    }

    await Comments.destroy({
      where: { id: commentId },
    });

    // Invalidate cache untuk post terkait
    const cacheKey = `comments:${comment.PostId}`;
    await redisClient.del(cacheKey);

    res.json('DELETED SUCCESSFULLY');
  } catch (error) {
    console.error('Error deleting comment:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  getOneComment,
  postAddComment,
  deleteComment,
};
