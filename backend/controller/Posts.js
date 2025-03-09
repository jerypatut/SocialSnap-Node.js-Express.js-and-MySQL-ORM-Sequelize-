const { Posts, Likes } = require('../models');
const upload = require('../migrations/multer');
const redisClient = require('./redisClient');

// GET ALL POSTS dengan caching Redis
const getAllPosts = async (req, res) => {
  const cacheKey = `getAllPosts:${req.user.id}`;
  try {
    // Cek data di Redis
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      // Jika data ada di cache, kembalikan hasilnya
      return res.json(JSON.parse(cachedData));
    }
  } catch (error) {
    console.error('Redis error:', error);
    // Jika terjadi error Redis, tetap lanjutkan untuk mengambil data dari database
  }
  // Ambil data dari database jika cache kosong
  const listOfPosts = await Posts.findAll({ include: [Likes] });
  const likedPostsData = await Likes.findAll({
    where: { UserId: req.user.id },
  });
  // Ubah likedPosts menjadi array PostId agar frontend mudah memprosesnya
  const likedPosts = likedPostsData.map((like) => like.PostId);
  // Buat data yang akan dikembalikan dan di-cache
  const dataToCache = { listOfPosts, likedPosts };

  // Simpan data ke Redis dengan TTL 3600 detik (1 jam)
  try {
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(dataToCache));
  } catch (error) {
    console.error('Error setting cache:', error);
  }

  res.json(dataToCache);
};

// GET ONE POST (tanpa caching)
const getOnePosts = async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
};

// CREATE POST
const createPost = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const postData = req.body;
      postData.username = req.user.username;

      // Jika ada file gambar, simpan path-nya
      if (req.file) {
        postData.image = `/assets/${req.file.filename}`;
      }

      const newPost = await Posts.create(postData);
      res.status(201).json(newPost);
    } catch (error) {
      console.error('Error saat membuat post:', error);
      res.status(500).json({ error: error.message });
    }
  });
};

// DELETE POST
const deletePost = async (req, res) => {
  const postId = req.params.postId;
  await Posts.destroy({ where: { id: postId } });
  res.json('DELETED SUCCESSFULLY');
};

module.exports = {
  getAllPosts,
  getOnePosts,
  createPost,
  deletePost,
};
