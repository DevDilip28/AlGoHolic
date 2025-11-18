# 🚀 AlgoHol!c — DSA Practice Platform

AlgoHol!c is a fully production-ready **Data Structures & Algorithms Practice Platform** engineered to help users master DSA through curated problems, streak tracking, achievements, custom playlists, and an interactive multi-language code editor.

🔗 **Live Demo:** https://algoholic.site  
📦 **Tech Stack:** React, TailwindCSS, Framer Motion, Zustand, Node.js, Express, Prisma, PostgreSQL (Neon), JWT Auth

---

## ⭐ Features

### 🧩 Curated Problem Library
- 300+ structured DSA problems across **Arrays, Strings, DP, Trees, Graphs, Recursion, Backtracking**, and more.
- Difficulty levels: **Easy, Medium, Hard**
- Advanced search, tagging, and filtering system.

### 💻 Interactive Code Editor
- LeetCode-style code editor with:
  - Multi-language support
  - Run & Submit functionality
  - Real-time verdicts and execution output

### 🔥 Daily Streak System
- Builds consistency and discipline.
- Rewards streaks with levels & visible badges (3-day, 7-day, 30-day, 100-day...).

### 🏆 Achievements & Badges
- Solve-based badges
- Topic mastery badges (e.g. **DP Master**, **Graph Guru**)
- Profile dashboard showing progress and unlocked achievements.

### 🎧 Custom Playlists
- Create personalized problem playlists for:
  - Interview prep  
  - Topic-focused practice  
  - Weekly goals

### 👤 User Profiles
- Visual dashboard with stats:
  - Solved problems  
  - Streak count  
  - Achievements  
  - Activity history  

### 🧱 Production-Ready Backend
- Clean architecture using:
  - **Node.js + Express**
  - **Prisma ORM**
  - **PostgreSQL (Neon)**
- Secure **JWT + HttpOnly Cookies Authentication**
- Fully modularized controllers, services, middleware, routes.

---

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite)**
- **TailwindCSS**
- **Framer Motion**
- **Zustand** (global state)
- **Axios** for API handling

### Backend
- **Node.js**
- **Express**
- **Prisma ORM**
- **PostgreSQL** (Neon)

### Authentication
- **JWT Authentication**
- HttpOnly Cookies
- Zod request validation

### Deployment
- Frontend → **Vercel**
- Backend → **Render**
- Database → **Neon PostgreSQL**

---

## 📁 Project Structure

algoholic/
├── client/
│ ├── public/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── layout/
│ │ ├── lib/
│ │ ├── pages/
│ │ ├── store/
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ ├── index.css
│ └── vite.config.js
│
└── server/
├── prisma/
├── src/
│ ├── controllers/
│ ├── generated/
│ ├── libs/
│ ├── middleware/
│ ├── routes/
│ ├── utils/
│ └── index.js
├── .env
├── docker/
├── package.json

---
