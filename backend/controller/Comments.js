const { Comments } = require('../models');
const { StatusCodes } = require('http-status-codes');

const getOneComment = async (req, res) => {
  const postId = req.params.postId;
  const comments = await Comments.findAll({ where: { PostId: postId } });
  res.json(comments);
};

const postAddComment = async (req, res) => {
  const comment = req.body;
  const username = req.user.username;
  comment.username = username;
  await Comments.create(comment);
  res.json(comment);
};

const deleteComment = async (req, res) => {
  const commentId = req.params.commentId;

  await Comments.destroy({
    where: {
      id: commentId,
    },
  });

  res.json('DELETED SUCCESSFULLY');
};

module.exports = {
  getOneComment,
  postAddComment,
  deleteComment,
};
