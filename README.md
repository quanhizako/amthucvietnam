# 🍜 Ẩm Thực Việt Nam

Website giới thiệu các món ăn đặc sản 3 miền Việt Nam, có tích hợp database, đăng nhập/đăng ký, lưu món yêu thích và chatbot AI tư vấn ẩm thực (Google Gemini).

## 📁 Cấu trúc project

```
amthucvietnam/
├── Frontend/                  # Giao diện website (HTML/CSS/JS thuần)
│   ├── BTLth (1).html
│   ├── BTLl.css
│   └── BTLL.js
│
└── backend/                   # API server (Node.js + Express + MySQL)
    ├── server.js              # File khởi động server
    ├── db.js                  # Kết nối MySQL
    ├── schema.sql             # Câu lệnh tạo database + dữ liệu mẫu (24 món ăn)
    ├── package.json
    ├── .env.example           # File mẫu cấu hình (copy thành .env và điền thông tin thật)
    ├── routes/
    │   ├── auth.js            # API đăng ký / đăng nhập
    │   ├── foods.js           # API lấy danh sách / chi tiết món ăn
    │   └── favorites.js       # API quản lý món yêu thích
    └── middleware/
        └── auth.js            # Kiểm tra đăng nhập (JWT)
```

## 🛠️ Công nghệ sử dụng

| Phần | Công nghệ |
|---|---|
| Frontend | HTML, CSS, JavaScript (thuần, không framework) |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Xác thực | JWT (JSON Web Token) + bcrypt (hash mật khẩu) |
| Chatbot AI | Google Gemini API |

## ✨ Tính năng

- 🍽️ Xem danh sách món ăn theo vùng miền (Bắc / Trung / Nam), tìm kiếm theo tên
- 📖 Xem chi tiết món ăn: nguyên liệu, giá, nguồn gốc, lịch sử
- 👤 Đăng ký / đăng nhập tài khoản (mật khẩu được hash an toàn, không lưu plaintext)
- ❤️ Lưu món ăn yêu thích theo từng tài khoản (lưu trong database, dùng được trên nhiều thiết bị)
- 🤖 Chatbot AI Gemini tư vấn, trả lời câu hỏi về ẩm thực Việt Nam
- 💾 Toàn bộ dữ liệu món ăn, người dùng, yêu thích đều lưu trong MySQL (không còn phụ thuộc localStorage)

## 🚀 Hướng dẫn chạy project

### 1. Cài đặt backend

```bash
cd backend
npm install
```

### 2. Tạo database

Mở MySQL (XAMPP, Laragon, MySQL Workbench...) và chạy file `schema.sql`:

```bash
mysql -u root -p < schema.sql
```

Lệnh này tự tạo database `am_thuc_vn`, 3 bảng (`users`, `foods`, `favorites`) và seed sẵn 24 món ăn.

### 3. Cấu hình kết nối

Copy file mẫu thành `.env`:

```bash
cp .env.example .env
```

Mở `.env` và điền đúng thông tin MySQL của bạn:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=mat_khau_mysql_cua_ban
DB_NAME=am_thuc_vn
JWT_SECRET=mot-chuoi-bi-mat-dai-ngau-nhien
PORT=3000
```

### 4. Chạy backend

```bash
npm start
```

Backend sẽ chạy tại: `http://localhost:3000`

### 5. Chạy frontend

Mở file `Frontend/BTLth (1).html` bằng trình duyệt, hoặc dùng tiện ích **Live Server** trong VS Code để có trải nghiệm tốt hơn (tự reload khi sửa code).

> ⚠️ Backend phải đang chạy (bước 4) trước khi mở frontend, vì frontend gọi API tới `http://localhost:3000`.

## 📡 Danh sách API

| Method | Endpoint | Cần đăng nhập | Mô tả |
|---|---|---|---|
| POST | `/api/auth/register` | Không | Đăng ký tài khoản mới |
| POST | `/api/auth/login` | Không | Đăng nhập, trả về token |
| GET | `/api/foods` | Không | Lấy tất cả món ăn (`?region=bac\|trung\|nam`, `?search=...`) |
| GET | `/api/foods/:idOrSlug` | Không | Lấy chi tiết 1 món ăn |
| GET | `/api/favorites` | **Có** | Lấy danh sách món yêu thích |
| POST | `/api/favorites` | **Có** | Thêm món vào yêu thích (`{ foodId }`) |
| DELETE | `/api/favorites/:foodId` | **Có** | Bỏ yêu thích |

Với API cần đăng nhập, gửi token nhận được sau khi đăng ký/đăng nhập trong header:
```
Authorization: Bearer <token>
```

## 🔒 Bảo mật

- Mật khẩu người dùng được hash bằng **bcrypt**, không lưu dạng văn bản thường.
- File `.env` chứa thông tin nhạy cảm (mật khẩu DB, JWT secret) — **không commit lên Git** (đã được khai báo trong `.gitignore`).
- Gemini API key hiện do người dùng tự nhập và lưu ở phía client (localStorage); không được hard-code key vào code.

## 📌 Ghi chú

- Khi deploy lên hosting thật, cần đổi `API_BASE` trong file JS frontend từ `http://localhost:3000` thành domain backend thật.
- Nên đổi `JWT_SECRET` trong `.env` thành chuỗi ngẫu nhiên, dài, khó đoán trước khi deploy production.
- XIN HẾT
