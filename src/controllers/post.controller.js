const mongoose = require('mongoose');
const Post = require('../models/post.model');

// POST /posts?apiKey=...
const createPost = async (req, res, next) => {
  try {
    const { userId, content } = req.body || {};
    const missing = [];
    if (!userId) missing.push('userId');
    if (!content) missing.push('content');
    if (missing.length) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
    }

    // Chỉ được tạo bài post cho chính mình
    if (String(userId) !== req.user._id.toString()) {
      return res.status(403).json({ message: 'userId does not match the apiKey owner' });
    }

    const post = await Post.create({ userId: String(userId), content });
    res.status(201).json({ message: 'Create post successfully', data: post });
  } catch (err) {
    next(err);
  }
};

// PUT /posts/:id?apiKey=...
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid post id' });
    }

    const { content } = req.body || {};
    if (!content) return res.status(400).json({ message: 'content is required' });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Chỉ chủ bài post mới được cập nhật
    if (post.userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not allowed to update this post' });
    }

    post.content = content; // updatedAt tự cập nhật nhờ timestamps
    await post.save();
    res.status(200).json({ message: 'Update post successfully', data: post });
  } catch (err) {
    next(err);
  }
};

module.exports = { createPost, updatePost };
