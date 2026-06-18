# Discord Music Bot 🎵

บอทเปิดเพลง Discord สำหรับการใช้งานส่วนตัว รองรับ YouTube และ YouTube Music อย่างเต็มรูปแบบ 
พัฒนาด้วย TypeScript และ `discord.js` v14 ปลอดภัย ทำงานรวดเร็ว และมีระบบจัดการ Memory เพื่อป้องกันบอทหน่วง

## 🚀 การติดตั้งบน Linux VPS / Ubuntu VM

คุณสามารถเลือกรันบอทได้ 2 วิธีตามความถนัดครับ

### วิธีที่ 1: รันด้วย Docker Compose (แนะนำ)
เหมาะสำหรับเครื่องที่มี Docker ติดตั้งอยู่แล้ว ติดตั้งง่ายและไม่รกเครื่อง

1. **Clone โปรเจกต์ลงบน VPS:**
   ```bash
   git clone https://github.com/son11930/discordbkkmusic.git
   cd discordbkkmusic
   ```
2. **สร้างไฟล์ Environment:**
   ```bash
   cp .env.example .env
   nano .env
   ```
   *(นำ `DISCORD_TOKEN` ของคุณไปใส่ในไฟล์ แล้วกด `Ctrl+X` -> `Y` -> `Enter` เพื่อเซฟ)*

3. **รันบอทเบื้องหลัง:**
   ```bash
   docker-compose up --build -d
   ```
   *ในการรันครั้งแรก Docker จะลงทะเบียนคำสั่ง (Deploy commands) ให้เมื่อตอน Start บอท*
   *(หาก VPS ทำการรีสตาร์ท บอทก็จะรันขึ้นมาใหม่โดยอัตโนมัติ)*

---

### วิธีที่ 2: รันด้วย PM2 (Native Node.js)
สำหรับเครื่องที่ติดตั้ง Node.js ไว้แล้ว (แนะนำ Node v20+)

1. **ติดตั้ง Library ระบบที่จำเป็น:**
   ```bash
   sudo apt update
   sudo apt install -y python3 make g++ ffmpeg
   ```
2. **ติดตั้ง PM2 (หากยังไม่มี):**
   ```bash
   sudo npm install -g pm2
   ```
3. **Clone และติดตั้งแพ็กเกจ:**
   ```bash
   git clone https://github.com/son11930/discordbkkmusic.git
   cd discordbkkmusic
   npm install
   ```
4. **ตั้งค่า Environment:**
   ```bash
   cp .env.example .env
   nano .env
   ```
   *(ใส่ `DISCORD_TOKEN` ของคุณ)*
5. **ลงทะเบียนคำสั่ง Slash Commands ไปที่ Discord:**
   ```bash
   npm run deploy
   ```
6. **เปิดบอทผ่าน PM2:**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

## 🛠 คำสั่งการใช้งาน (Slash Commands)
- `/play [url หรือ ชื่อเพลง]` - เล่นเพลงจาก YouTube หรือเพิ่มเข้าคิว
- `/playnextqueue` - ข้ามเพลงปัจจุบันและเล่นเพลงถัดไป
- `/pause` - หยุดเพลงชั่วคราว
- `/resume` - เล่นเพลงต่อจากที่หยุดไว้
- `/queue` - ดูคิวเพลงปัจจุบันทั้งหมด
- `/stop` - เลิกเล่น ล้างคิว และออกจากห้อง
- `/join` - สั่งบอทให้เข้ามาในห้อง Voice ปัจจุบันของคุณทันที
