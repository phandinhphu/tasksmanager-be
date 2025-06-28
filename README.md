


<div align="center">
  
# 🖥️ Tasks Manager Backend
  
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

*Backend API cho ứng dụng quản lý công việc và lịch học – xây dựng với Node.js, Express, MongoDB và Socket.IO*

[🧠 Frontend Repo](https://github.com/phandinhphu/tasksmanager-fe) | [🐛 Báo lỗi](https://github.com/phandinhphu/tasksmanager-be/issues)

</div>

---

## 🚀 Các chức năng chính

### ✅ **Quản lý người dùng**
- Đăng ký, đăng nhập (Email/Password)
- Xác thực JWT, xác minh email
- Quên mật khẩu, gửi mail khôi phục
- Cập nhật thông tin hồ sơ cá nhân

### 🗂️ **Quản lý công việc (Tasks)**
- CRUD cho task chính và task phụ
- Gán trạng thái, độ ưu tiên
- Sắp xếp, tìm kiếm, lọc theo deadline
- Thống kê số lượng và hiệu suất

### 🗓️ **Lịch học và Lịch trình**
- Tạo, chỉnh sửa lịch học theo tuần
- Hỗ trợ lịch lặp (repeat)
- Kết hợp hiển thị với calendar phía client

### 🔔 **Thông báo real-time**
- Sử dụng Socket.IO để đẩy thông báo nhắc việc
- Cảnh báo deadline sắp tới, task quá hạn

---

## 🛠️ Công nghệ sử dụng

| Công nghệ | Mô tả |
|----------|-------|
| [Node.js](https://nodejs.org/) | Môi trường thực thi server-side |
| [Express](https://expressjs.com/) | Framework HTTP tối ưu cho API |
| [MongoDB](https://www.mongodb.com/) | Cơ sở dữ liệu NoSQL linh hoạt |
| [Mongoose](https://mongoosejs.com/) | ORM tương tác MongoDB |
| [Socket.IO](https://socket.io/) | Giao tiếp real-time hai chiều |
| [Cloudinary](https://cloudinary.com/) | Lưu trữ và xử lý hình ảnh |
| [Nodemailer](https://nodemailer.com/) | Gửi email xác minh và khôi phục |
| [Bcrypt](https://www.npmjs.com/package/bcrypt) | Mã hóa mật khẩu |
| [JSON Web Token (JWT)](https://jwt.io/) | Xác thực người dùng |

---

## ⚙️ Cài đặt & Khởi động

### 🔧 Yêu cầu hệ thống

- Node.js 18+
- MongoDB (local hoặc MongoDB Atlas)
- Tài khoản Cloudinary (để lưu ảnh)
- SMTP Email (GMail hoặc custom domain)

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
PORT=5000
MONGO_URI=mongodb+srv://<your-db-url>
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SMTP_EMAIL=your_email
SMTP_PASSWORD=your_email_app_password
CLIENT_URL=http://localhost:5173
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
├    ├    ├── 📁 models/               # Mongoose Models
├    ├── 📁 config/
├    ├    ├── 📁 cloudinary/           # Cấu hình Cloudinary
├    ├    ├── 📁 db/                   # Kết nối với MongoDB
├    ├    ├── 📁 passport/             # Cấu hình để kết nối với các ứng dụng bên thứ ba
├    ├── 📁 middleware/                # Middleware xác thực
├    ├── 📁 routes/                    # Định tuyến API
├    ├── 📁 services/                  # Cron job, dịch vụ nền
├    ├── 📁 sockets/                   # Cấu hình socket.io
├    ├── 📁 utils/                     # Tiện ích (sendMail, generateToken, ...)
├    ├── 📄 server.js                  # Khởi tạo server HTTP & Socket.IO
├    ├── 📄 index.js                   # Điểm khởi động server
└── 📄 .env.example                    # Mẫu biến môi trường
└── 📄 package.json                    # Các package được cài đặt trong repo 
```

---

## 🔐 Bảo mật

- Mã hóa mật khẩu với `bcrypt`
- Sử dụng JWT cho phiên đăng nhập
- Xác minh email khi đăng ký
- Hạn chế truy cập API theo role

---

## 🤝 Đóng góp

1. Fork repository
2. Tạo nhánh (`git checkout -b dev/YourFeature`)  
3. Commit (`git commit -m 'Thêm chức năng mới'`)  
4. Push (`git push origin feature/YourFeature`)  
5. Mở Pull Request để được review

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
      <a href="https://github.com/nguyenhuuphuoc">
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
*Được phát triển với ❤️ bởi đội ngũ Tasks Manager*

</div>
