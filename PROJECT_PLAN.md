# Project Plan: Discord Music Bot (YouTube & YouTube Music)

## 1. Project Overview
สร้าง Discord Bot สำหรับเปิดเพลงจาก YouTube และ YouTube Music เพื่อใช้งานส่วนตัวในเซิร์ฟเวอร์ โดยเน้นความเสถียร รองรับระบบ Queue ค้นหาเพลงง่าย และใช้งานผ่าน Slash Commands

## 2. Technology Stack
- **Language**: TypeScript (Node.js)
- **Bot Framework**: `discord.js` (v14)
- **Voice System**: `@discordjs/voice`
- **Audio Extraction**: `play-dl` (มีประสิทธิภาพและรองรับ YouTube / YT Music ได้เป็นอย่างดี)
- **Audio Processing**: `ffmpeg-static`, `libsodium-wrappers`
- **Testing**: `vitest` (ตามกฎ Test-Driven Development)

## 3. Core Features
- **Play**: ค้นหาเพลงหรือใช้ URL จาก YouTube / YT Music (ถ้ามีเพลงเล่นอยู่ จะเพิ่มลงคิว)
- **Queue System**: 
  - `/queue`: ดูคิวเพลง
  - `/playnextqueue`: ข้ามเพลงปัจจุบันและเล่นเพลงถัดไปในคิว
- **Controls**: 
  - `/pause`: หยุดเล่นชั่วคราว
  - `/stop`: หยุดเล่นทั้งหมดและล้างคิว
- **Permissions**: อนุญาตให้ทุกคนใช้งานได้ (จะจัดการการมองเห็นห้องแชทผ่าน Discord settings เอง)
- *หมายเหตุ*: ไม่ต้องรองรับ Spotify

## 4. Development Phases
- **Phase 1: Project Setup & CI**
  - ตั้งค่า TypeScript, ESLint, Prettier
  - ติดตั้ง Dependencies ที่จำเป็นทั้งหมด
  - สร้างโครงสร้างระบบ Test (TDD)
- **Phase 2: Music Core System**
  - พัฒนาระบบ Queue (พร้อม Unit Tests)
  - พัฒนา Audio Player Wrapper สำหรับ @discordjs/voice
- **Phase 3: Discord Commands**
  - สร้าง Slash Commands Handler
  - พัฒนาคำสั่ง `/play`, `/playnextqueue`, `/stop`, `/queue`, `/pause`
- **Phase 4: Bot Integration & Testing**
  - ประกอบร่าง Bot Core
  - Manual E2E Testing ผ่าน Discord Client

## 5. Security & Quality Guidelines
- ซ่อน Token และ Secrets ในไฟล์ `.env` เสมอ
- ไม่มีการ mutate objects (ตามกฎ Immutability)
- 80%+ Test Coverage
- อัพเดท CHANGELOG.md ทุกครั้งที่มีการเปลี่ยนแปลง
