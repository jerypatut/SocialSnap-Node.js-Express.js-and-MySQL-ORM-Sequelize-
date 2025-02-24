const { Posts, Likes } = require('../models');
const upload = require('../migrations/multer');

const getAllPosts = async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [Likes] });
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPosts, likedPosts });
};

const getOnePosts = async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
};

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
