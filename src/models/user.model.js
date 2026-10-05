const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: [true, 'userName is required'], trim: true },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@$]+@[^\s@$]+\.[^\s@$]+$/, 'email is invalid'],
    },
    password: { type: String, required: [true, 'password is required'] },
    // randomstring của apiKey hiện tại — mỗi user chỉ có 1 apiKey hợp lệ, đổi mỗi lần đăng nhập
    apiKeySecret: { type: String, default: null, select: false },
  },
  { versionKey: false }
);

// Mã hoá mật khẩu trước khi lưu
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.apiKeySecret;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema, 'user');
