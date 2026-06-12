# UIT Knowledge

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-76E2B2?style=for-the-badge&logo=vitest&logoColor=6E6E6E)](https://vitest.dev/)

**UIT Knowledge** là hệ thống chia sẻ và quản lý kiến thức dành riêng cho sinh viên Trường Đại học Công nghệ Thông tin (UIT). Dự án được xây dựng với kiến trúc hiện đại, tập trung vào hiệu năng và trải nghiệm người dùng.

---

## ✨ Tính năng nổi bật

- **Quản lý học tập:** Hỗ trợ lưu trữ và xem video bài giảng trực tuyến với trình phát video tích hợp.
- **Hệ thống Media:** Tối ưu hóa việc tải lên và lưu trữ hình ảnh, video thông qua Cloudinary.
- **Bảo mật & Xác thực:** Đăng nhập an toàn bằng NextAuth, hỗ trợ đổi mật khẩu và xác thực qua mã OTP.
- **Quản trị hệ thống (Admin):** Dashboard mạnh mẽ cho phép quản lý khóa học, danh mục sản phẩm (merch), câu hỏi thường gặp (FAQ) và cảm nhận học viên (testimonials).
- **Landing Page chuyên nghiệp:** Giao diện trang chủ hiện đại, tối ưu SEO và hỗ trợ hiển thị trên nhiều thiết bị.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Ngôn ngữ:** TypeScript
- **Styling:** Tailwind CSS & shadcn/ui
- **Database ORM:** Prisma kết nối PostgreSQL
- **Xác thực:** NextAuth.js
- **Kiểm thử:** Vitest (Unit/Integration) & Playwright (E2E)

---

## 🚀 Cài đặt dự án

### 1. Clone Repo
```bash
git clone <link-repo-cua-ni>
cd UIT_Knowledge
2. Cài đặt Dependencies
Bash
npm install
3. Cấu hình môi trường
Tạo file .env từ file mẫu và điền các thông số cần thiết:

Bash
cp .env.example .env
Lưu ý: Cần điền đầy đủ DATABASE_URL, CLOUDINARY_URL và thông tin Mail server để các tính năng hoạt động ổn định.

4. Khởi tạo Database
Bash
npx prisma migrate dev
npx prisma db seed
5. Chạy project
Bash
npm run dev
Truy cập: http://localhost:3000

🧪 Kiểm thử (Testing)
Dự án tích hợp quy trình kiểm thử tự động để đảm bảo chất lượng code:

Chạy Unit/Integration Tests:

Bash
  npm run test
Chạy End-to-End Tests:

Bash
  npm run test:e2e
📝 Code of Conduct & License
Dự án tuân thủ các quy chuẩn lập trình sạch (Clean Code) với ESLint và Prettier.

Giấy phép: MIT.
