const { Likes } = require('../models');
const redisClient = require('../redisClient'); // Pastikan file redisClient.js sudah dikonfigurasi dengan benar

const addLikes = async (req, res) => {
  const { PostId } = req.body;
  const UserId = req.user.id;
  // Misal kita menggunakan cacheKey untuk menyimpan data jumlah like pada sebuah post
  const cacheKey = `postLikes:${PostId}`;

  try {
    const found = await Likes.findOne({
      where: { PostId, UserId },
    });

    if (!found) {
      // Jika like belum ada, buat like baru
      await Likes.create({ PostId, UserId });
      // Invalidate cache untuk post tersebut
      await redisClient.del(cacheKey);
      res.json({ liked: true });
    } else {
      // Jika like sudah ada, hapus like
      await Likes.destroy({
        where: { PostId, UserId },
      });
      // Invalidate cache untuk post tersebut
      await redisClient.del(cacheKey);
      res.json({ liked: false });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = addLikes;
