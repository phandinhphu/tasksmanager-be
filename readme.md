# TasksManager-BE

TasksManager-BE là backend quản lý công việc cá nhân, xây dựng với Node.js, Express, MongoDB, Socket.IO và Cloudinary.

Sử dụng cùng với [TasksManager-FE](https://github.com/phandinhphu/tasksmanager-fe)

## Tính năng chính

- Đăng ký, đăng nhập, đăng xuất người dùng (JWT, cookie).
- Quản lý công việc (task), phân loại theo trạng thái, mức độ ưu tiên.
- Hỗ trợ subtask cho từng công việc.
- Quản lý lịch biểu cá nhân (schedule).
- Cập nhật hồ sơ, thay đổi avatar (tích hợp Cloudinary).
- Thống kê số lượng công việc, trạng thái, số subtask.
- Gửi thông báo tự động qua Socket.IO khi task/subtask sắp đến hạn hoặc quá hạn.
- Bảo mật API với xác thực JWT.
- Cron job kiểm tra deadline công việc mỗi 15 phút.

## Cấu trúc thư mục

```
├── src/
|    ├── apis/
|    |  ├──  controllers/   // Controllers cho các API
|    |  ├──  models/        // Mongoose models
|    ├── config/
|    ├── cloudinary/    // Cấu hình Cloudinary
|    ├── db/            // Kết nối MongoDB
|    ├── middleware/      // Middleware xác thực
|    ├── routes/          // Định tuyến API
|    ├── services/        // Cron job, dịch vụ nền
|    ├── sockets/         // Quản lý Socket.IO
|    ├── util/            // Tiện ích chung
|    ├── server.js        // Khởi tạo server HTTP & Socket.IO
|    ├── index.js
├── .env.example               // Biến môi trường
```

## Cài đặt

1. **Clone dự án**
   ```sh
   git clone https://github.com/phandinhphu/tasksmanager-be.git
   cd tasksmanager-be
   ```

2. **Cài đặt dependencies**
   ```sh
   npm install
   ```

3. **Cấu hình biến môi trường**
   - Đổi tên tệp `.env.example` thành `.env` và chỉnh lại các thông tin MongoDB, JWT, Cloudinary sao cho hợp.

4. **Chạy dự án**
   - Chạy ở chế độ phát triển:
     ```sh
     npm run dev
     ```
   - Hoặc chạy ở chế độ production:
     ```sh
     npm start
     ```

## API chính
|Methods|Endpoint|Description|
|---|---|---|
|POST|/api/auth/register|Đăng ký tài khoản|
|POST|/api/auth/login|Đăng nhập|
|POST|/api/auth/logout|Đăng xuất|
|GET|/api/user/me|Lấy thông tin cá nhân|
|PUT|/api/user/me/update-profile|Cập nhật hồ sơ|
|GET|/api/tasks/me|Lấy danh sách công việc cá nhân|
|POST|/api/tasks|Tạo công việc mới|
|PUT|/api/tasks/:id|Cập nhật công việc|
|PUT|/api/tasks/:id/complete|Hoàn thành công việc|
|DELETE|/api/tasks/:id|Xóa công việc|
|GET|/api/schedules/me|Lấy lịch biểu cá nhân|
|POST|/api/schedules/create|Tạo lịch biểu mới|

## Công nghệ sử dụng

- Node.js, Express.js
- MongoDB, Mongoose
- Socket.IO (realtime notification)
- Cloudinary (lưu trữ ảnh)
- JWT, cookie-parser, helmet, cors, dotenv

## Đóng góp

Mọi đóng góp, báo lỗi hoặc ý tưởng mới đều được hoan nghênh qua Issues trên GitHub.

---

> Tác giả: phandinhphu
