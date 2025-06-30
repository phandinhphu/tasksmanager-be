<div align="center">
  
# 🖥️ Tasks Manager Backend
  
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

_Backend API cho ứng dụng quản lý công việc và lịch học – xây dựng với Node.js, Express, MongoDB và Socket.IO_

[🧠 Frontend Repo](https://github.com/phandinhphu/tasksmanager-fe) | [🐛 Báo lỗi](https://github.com/phandinhphu/tasksmanager-be/issues)

</div>

---

## ✨ Tính năng mới nổi bật

🔥 **OAuth 2.0 Integration** - Đăng nhập bằng Google & Facebook  
🤖 **Smart Auto Services** - Email tự động + thông báo real-time  
📊 **Advanced Task Analytics** - Thống kê chi tiết hiệu suất  
🛡️ **Enhanced Security** - Rate limiting, reCAPTCHA, graceful shutdown  
🎯 **Smart Task Management** - Tự động cập nhật trạng thái, gia hạn deadline

---

## 🚀 Các chức năng chính

### ✅ **Quản lý người dùng**

-   Đăng ký, đăng nhập (Email/Password)
-   **Đăng nhập bằng Google & Facebook OAuth 2.0**
-   Xác thực JWT, xác minh email
-   Quên mật khẩu, gửi mail khôi phục
-   Cập nhật thông tin hồ sơ cá nhân với avatar upload
-   **Xóa tài khoản và dữ liệu liên quan**
-   **Gửi feedback với bảo vệ reCAPTCHA**

### 🗂️ **Quản lý công việc (Tasks)**

-   CRUD cho task chính và task phụ (subtasks)
-   Gán trạng thái, độ ưu tiên với tự động cập nhật
-   **Tự động chuyển trạng thái task (To Do → In Progress → Overdue)**
-   **Gia hạn deadline cho task và subtask**
-   **Thống kê chi tiết về hiệu suất công việc**
-   **Tách subtask thành task độc lập khi xóa task cha**

### 🗓️ **Lịch học và Lịch trình**

-   Tạo, chỉnh sửa lịch học theo tuần
-   Hỗ trợ lịch lặp (repeat) với nhiều tùy chọn
-   **Quản lý thời gian bắt đầu và kết thúc**
-   Kết hợp hiển thị với calendar phía client

### 🔔 **Thông báo & Nhắc nhở**

-   **Socket.IO real-time notifications**
-   **Email tự động gửi 3 lần/ngày (8h, 13h, 18h)**
-   **Thông báo task sắp đến hạn trong 3 ngày**
-   **Cảnh báo task quá hạn**
-   **Nhắc nhở task sắp bắt đầu**
-   **Tránh spam email với hệ thống kiểm tra trùng lặp**

### 🛡️ **Bảo mật & Tự động hóa**

-   **Rate limiting cho feedback (5 requests/hour)**
-   **Tự động xóa tài khoản chưa xác thực sau 24h**
-   **Log email chi tiết với trạng thái success/fail**
-   **Graceful shutdown với cleanup resources**

---

## 🛠️ Công nghệ sử dụng

| Công nghệ                                                              | Mô tả                                 |
| ---------------------------------------------------------------------- | ------------------------------------- |
| [Node.js](https://nodejs.org/)                                         | Môi trường thực thi server-side       |
| [Express](https://expressjs.com/)                                      | Framework HTTP tối ưu cho API         |
| [MongoDB](https://www.mongodb.com/)                                    | Cơ sở dữ liệu NoSQL linh hoạt         |
| [Mongoose](https://mongoosejs.com/)                                    | ORM tương tác MongoDB                 |
| [Socket.IO](https://socket.io/)                                        | Giao tiếp real-time hai chiều         |
| [Cloudinary](https://cloudinary.com/)                                  | Lưu trữ và xử lý hình ảnh             |
| [Nodemailer](https://nodemailer.com/)                                  | Gửi email xác minh và khôi phục       |
| [Passport.js](http://www.passportjs.org/)                              | **Xác thực OAuth (Google, Facebook)** |
| [Bcrypt](https://www.npmjs.com/package/bcrypt)                         | Mã hóa mật khẩu                       |
| [JSON Web Token (JWT)](https://jwt.io/)                                | Xác thực người dùng                   |
| [Node-cron](https://www.npmjs.com/package/node-cron)                   | **Lập lịch công việc tự động**        |
| [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit) | **Giới hạn tốc độ request**           |
| [Helmet](https://helmetjs.github.io/)                                  | **Bảo mật HTTP headers**              |
| [Axios](https://axios-http.com/)                                       | **HTTP client cho reCAPTCHA**         |

---

## ⚙️ Cài đặt & Khởi động

### 🔧 Yêu cầu hệ thống

-   Node.js 18+
-   MongoDB (local hoặc MongoDB Atlas)
-   Tài khoản Cloudinary (để lưu ảnh avatar)
-   SMTP Email (GMail hoặc custom domain)
-   **Google OAuth 2.0 credentials (tùy chọn)**
-   **Facebook App credentials (tùy chọn)**
-   **reCAPTCHA v2 site key (cho feedback)**

### 📦 Cài đặt

```bash
# Clone dự án
git clone https://github.com/phandinhphu/tasksmanager-be.git
cd tasksmanager-be

# Cài dependencies
npm install
```

### ⚙️ Cấu hình `.env`

Tạo tệp `.env` từ mẫu có sẵn `.env.example`, sau đó điền các thông tin:

```env
BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
PORT=3000
MONGODB_URI=mongodb+srv://<your-db-url>
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GMAIL_USER=your_email
GMAIL_PASS=your_email_app_password

# OAuth Settings (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

FB_APP_ID=your_facebook_app_id
FB_APP_SECRET=your_facebook_app_secret
FB_CALLBACK_URL=http://localhost:3000/api/auth/facebook/callback

# Additional Settings
EMAIL_ADMIN=admin@yourdomain.com
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

### ▶️ Khởi động server

```bash
# Chạy server ở chế độ dev
npm run dev

# Hoặc build & chạy production
npm run build
npm start
```

---

## 📁 Cấu trúc thư mục

```
📦 tasksmanager-be/
├── 📁 src/
├    ├── 📁 apis/
├    ├    ├── 📁 controllers/          # Controllers cho các API
├    ├    ├── 📁 models/               # Mongoose Models (User, Task, Status, Priority, Schedule, LogEmail)
├    ├── 📁 config/
├    ├    ├── 📁 cloudinary/           # Cấu hình Cloudinary
├    ├    ├── 📁 db/                   # Kết nối với MongoDB
├    ├    ├── 📁 passport/             # **Cấu hình OAuth (Google, Facebook)**
├    ├── 📁 middleware/                # **Middleware xác thực & rate limiting**
├    ├── 📁 routes/                    # Định tuyến API
├    ├── 📁 services/                  # **Cron jobs tự động (email, cleanup, notifications)**
├    ├── 📁 sockets/                   # **Cấu hình Socket.IO real-time**
├    ├── 📁 util/                      # **Tiện ích (email, functions, constants)**
├    ├── 📄 server.js                  # **Khởi tạo server với graceful shutdown**
├    ├── 📄 index.js                   # Điểm khởi động server
└── 📄 .env.example                    # **Mẫu biến môi trường đầy đủ**
└── 📄 package.json                    # Dependencies và scripts
```

---

## 🔐 Bảo mật

-   **Mã hóa mật khẩu với `bcrypt`**
-   **Xác thực JWT với cookie httpOnly**
-   **OAuth 2.0 với Google & Facebook**
-   **Rate limiting cho API endpoints**
-   **Helmet.js cho bảo vệ HTTP headers**
-   **reCAPTCHA v2 cho feedback form**
-   **Tự động xóa tài khoản chưa xác thực**
-   **CORS được cấu hình chặt chẽ**

---

## � Dịch vụ tự động (Cron Jobs)

### 📧 Email Reminder Service

-   **Lịch chạy:** 8:00, 13:00, 18:00 mỗi ngày
-   **Chức năng:** Gửi email nhắc nhở task sắp đến hạn và quá hạn
-   **Bảo vệ spam:** Không gửi email trùng lặp trong 24h

### 🔔 Real-time Notification Service

-   **Lịch chạy:** Mỗi 15 phút
-   **Chức năng:** Gửi thông báo real-time qua Socket.IO
-   **Nội dung:** Task quá hạn, sắp đến hạn, và sắp bắt đầu

### 🧹 Account Cleanup Service

-   **Lịch chạy:** 00:00 mỗi ngày
-   **Chức năng:** Tự động xóa tài khoản chưa xác thực sau 24h
-   **Email báo cáo:** Gửi thống kê cho admin

### 📊 Task Status Auto-Update

-   **Trigger:** Mỗi khi người dùng truy cập tasks
-   **Chức năng:** Tự động cập nhật trạng thái task dựa trên thời gian
-   **Logic:** To Do → In Progress → Overdue

---

## �🤝 Đóng góp

1. Fork repository
2. Tạo nhánh (`git checkout -b dev/YourFeature`)
3. Commit (`git commit -m 'Thêm chức năng mới'`)
4. Push (`git push origin feature/YourFeature`)
5. Mở Pull Request để được review

---

## 🔌 API Documentation

### 🔐 Authentication & OAuth

| Method   | Endpoint                  | Description                  |
| -------- | ------------------------- | ---------------------------- |
| **POST** | /api/auth/register        | Đăng kí tài khoản mới        |
| **POST** | /api/auth/login           | Đăng nhập với email/password |
| **GET**  | /api/auth/google          | **Đăng nhập bằng Google**    |
| **GET**  | /api/auth/facebook        | **Đăng nhập bằng Facebook**  |
| **POST** | /api/auth/logout          | Đăng xuất                    |
| **POST** | /api/auth/forgot-password | Yêu cầu lấy lại mật khẩu     |
| **POST** | /api/auth/reset-password  | Đặt lại mật khẩu             |
| **GET**  | /api/auth/verify-email    | Xác thực Email               |

### 👤 User Management

| Method     | Endpoint                    | Description                     |
| ---------- | --------------------------- | ------------------------------- |
| **GET**    | /api/user/me                | Lấy thông tin cá nhân           |
| **PUT**    | /api/user/me/update-profile | **Cập nhật profile với avatar** |
| **DELETE** | /api/user/me/delete-account | **Xóa tài khoản và dữ liệu**    |
| **POST**   | /api/user/me/feedback       | **Gửi feedback (reCAPTCHA)**    |

### 📋 Tasks Management

| Method     | Endpoint                                    | Description                        |
| ---------- | ------------------------------------------- | ---------------------------------- |
| **GET**    | /api/tasks/me                               | Lấy danh sách task cá nhân         |
| **GET**    | /api/tasks/:id                              | **Lấy chi tiết task theo ID**      |
| **GET**    | /api/tasks/status                           | Lấy tất cả trạng thái task         |
| **GET**    | /api/tasks/priority                         | Lấy tất cả độ ưu tiên              |
| **GET**    | /api/tasks/stats                            | **Thống kê task chi tiết**         |
| **POST**   | /api/tasks                                  | Tạo task mới (có subtasks)         |
| **PUT**    | /api/tasks/:id                              | **Cập nhật task (có extend_date)** |
| **PUT**    | /api/tasks/:id/complete                     | Đánh dấu task hoàn thành           |
| **PUT**    | /api/tasks/:id/subtasks/:subtaskId/complete | **Hoàn thành subtask**             |
| **DELETE** | /api/tasks/:id                              | **Xóa task (tách subtasks)**       |

### 📅 Schedule Management

| Method     | Endpoint              | Description            |
| ---------- | --------------------- | ---------------------- |
| **GET**    | /api/schedules/me     | Lấy lịch trình cá nhân |
| **POST**   | /api/schedules/create | Tạo lịch trình mới     |
| **PUT**    | /api/schedules/:id    | Cập nhật lịch trình    |
| **DELETE** | /api/schedules/:id    | Xóa lịch trình         |

### 🔔 Real-time Features

-   **Socket.IO endpoints:** `/socket.io/`
-   **Real-time notifications** khi có task deadline sắp tới
-   **Auto email reminders** 3 lần/ngày (8h, 13h, 18h)

---

## 👥 Đội ngũ phát triển

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/phandinhphu">
        <img src="https://avatars.githubusercontent.com/u/127222540?v=4" width="100px;" alt="Phan Đình Phú"/>
        <br /><b>Phan Đình Phú</b>
      </a>
      <br />
      <sub>Frontend Developer</sub>
    </td>
    <td align="center">
      <a href="https://github.com/prpjzz">
        <img src="https://avatars.githubusercontent.com/u/89702898?v=4" width="100px;"/>
        <br /><b>prpjzz (Nguyen Huu Phuoc)</b>
      </a>
      <br />
      <sub>Backend Developer</sub>
    </td>
  </tr>
</table>

---

## 📄 Giấy phép

Dự án này sử dụng giấy phép [MIT](LICENSE).

---

<div align="center">

**⭐ Nếu bạn thấy hữu ích, hãy để lại một sao để ủng hộ dự án! ⭐**  
_Được phát triển với ❤️ bởi đội ngũ Tasks Manager_

</div>
