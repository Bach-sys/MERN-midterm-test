const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: { type: String, required: [true, 'userId is required'] },
    content: { type: String, required: [true, 'content is required'], trim: true },
  },
  { timestamps: true, versionKey: false } // createdAt, updatedAt tự động = thời điểm tạo/cập nhật
);

module.exports = mongoose.model('Post', postSchema, 'post');
