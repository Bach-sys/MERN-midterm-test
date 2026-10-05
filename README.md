# MERN – Kiểm tra giữa kỳ

REST API (Express + Mongoose + MongoDB Atlas) cho hệ thống đăng bài chia sẻ.

## Cài đặt & chạy
```bash
npm install
cp .env.example .env   # điền MONGODB_URI của MongoDB Atlas
npm start              # hoặc: npm run dev
```
Server mặc định: `http://localhost:8080`

## Cấu trúc
```
src/
  index.js                 # khởi tạo app
  config/db.js             # kết nối MongoDB Atlas
  models/user.model.js     # collection "user" (password mã hoá bcrypt)
  models/post.model.js     # collection "post" (createdAt/updatedAt tự động)
  middlewares/auth.js      # xác thực apiKey qua query
  middlewares/errorHandler.js
  controllers/, routes/, utils/apiKey.js
```

## API

| # | Method | Endpoint | Body | Mô tả |
|---|--------|----------|------|-------|
| 1 | POST | `/users/register` | `{ userName, email, password }` | Đăng ký, email duy nhất |
| 2 | POST | `/users/login` | `{ email, password }` | Trả về `apiKey` |
| 3 | POST | `/posts?apiKey=...` | `{ userId, content }` | Tạo bài post |
| 4 | PUT  | `/posts/:id?apiKey=...` | `{ content }` | Cập nhật bài post (PATCH cũng được) |

### apiKey
Dạng `mern-$userId$-$email$-$randomstring$`. `randomstring` (UUID) được lưu vào user; mỗi lần đăng nhập sinh
randomstring mới nên apiKey cũ mất hiệu lực → mỗi người chỉ có **một** apiKey hợp lệ.

> Lưu ý: khi gửi apiKey qua query, nên encode ký tự `$` và `@` (`encodeURIComponent`), Postman tự xử lý.

### Mã lỗi
| Trường hợp | HTTP |
|---|---|
| Thiếu trường bắt buộc / id không hợp lệ | 400 |
| Email đã tồn tại | 409 |
| Sai mật khẩu, thiếu/sai/hết hạn apiKey | 401 |
| userId không khớp apiKey, cập nhật post của người khác | 403 |
| Không tìm thấy user / post | 404 |
