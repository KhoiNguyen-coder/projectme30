# ProjectMe30 🌱

Nhật ký hành trình 30 ngày thay đổi lối sống — dạng timeline trực quan.

## Tính năng

- **Timeline dọc** — Mỗi ngày là một card entry có ảnh/video, caption, tags, mood
- **Progress bar** — Thanh tiến trình đơn giản hiển thị ngày hoàn thành
- **Upload & log nhanh** — Chụp ảnh + vài dòng text là xong
- **Modal lightbox** — Phóng to media ngay tại trang, không chuyển route
- **"Lời tự thú"** — Ngày thất bại hiển thị khác biệt, chân thực
- **Chia sẻ công khai** — Link `/:username` để bạn bè xem timeline
- **Kudos reactions** — Tim, lửa, vỗ tay từ người xem (không cần đăng ký)
- **Nén ảnh client-side** — Ảnh được nén xuống ≤1MB trước khi upload

## Tech Stack

- **React + Vite** — Nhanh, build nhẹ
- **Tailwind CSS v4** — Utility-first styling
- **Supabase** — Auth (Magic Link), PostgreSQL, Storage
- **browser-image-compression** — Nén ảnh phía client
- **React Router v6** — 2 route: `/` và `/:username`

## Cài đặt

```bash
npm install
```

## Cấu hình Supabase

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Điền `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` từ Supabase Dashboard > Settings > API.

### Tạo bảng trong Supabase

```sql
-- Bảng entries
CREATE TABLE entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  day integer CHECK (day >= 1 AND day <= 30),
  date date NOT NULL,
  mood text CHECK (mood IN ('good', 'ok', 'bad')),
  caption text,
  tags text[],
  media_type text CHECK (media_type IN ('image', 'video', 'none')),
  media_url text,
  completed boolean DEFAULT true,
  is_fail boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Bảng reactions
CREATE TABLE reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid REFERENCES entries(id) ON DELETE CASCADE,
  type text CHECK (type IN ('heart', 'fire', 'clap')),
  created_at timestamptz DEFAULT now()
);

-- RLS policies
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Owner có thể CRUD entries của mình
CREATE POLICY "Users can manage own entries" ON entries
  FOR ALL USING (auth.uid() = user_id);

-- Ai cũng đọc được entries (public timeline)
CREATE POLICY "Public read entries" ON entries
  FOR SELECT USING (true);

-- Ai cũng thêm được reaction
CREATE POLICY "Anyone can add reactions" ON reactions
  FOR INSERT WITH CHECK (true);

-- Ai cũng đọc được reactions
CREATE POLICY "Public read reactions" ON reactions
  FOR SELECT USING (true);
```

### Tạo Storage bucket

1. Vào Supabase Dashboard > Storage
2. Tạo bucket `media` (public)
3. Thêm policy cho phép authenticated users upload

## Chạy dev

```bash
npm run dev
```

Nếu chưa cấu hình Supabase, app sẽ chạy ở **demo mode** với mock data.

## Build

```bash
npm run build
```

## Deploy

Recommend deploy lên **Vercel**:

```bash
npx vercel
```
