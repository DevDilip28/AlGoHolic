# AlgoHol!c

A fully production-ready **DSA Practice Platform** built to help users master Data Structures & Algorithms through curated problems, streaks, achievements, playlists, and an interactive code editor.

This project is deployed live at **https://algoholic.site** and is designed to feel like a polished real-world product — fast, modern, and scalable.

## 🚀 Features

- **Curated Problem Library** - Organized problems across multiple tags (arrays, strings, DP, recursion, etc.) with difficulty levels (Easy, Medium, Hard) and advanced search/filtering.
- **Interactive Code Editor** - LeetCode-style code editor supporting multiple languages, with run and submit functionality to track your solutions.
- **Daily Streak System** - Track your daily problem-solving streak to maintain consistency and unlock achievement badges (3-day, 7-day, 30-day, etc.).
- **Achievements & Badges** - Unlock badges for solving problems, maintaining streaks, and mastering specific topics like "DP Master".
- **Custom Playlists** - Create personalized problem playlists for interview prep or weekly goals.
- **User Profiles** - View your solved count, streaks, achievements, and activity history on a personalized dashboard.
- **Production Ready Backend** - Built with Node.js, Express, Prisma ORM, and PostgreSQL with JWT authentication and clean architecture.

## 🛠️ Tech Stack

- **Frontend**: React.js, TailwindCSS, Framer Motion, Zustand
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL (Neon)
- **Auth**: JWT with HttpOnly cookies
- **Validation**: Zod
- **Deployment**: Frontend (Vercel), Backend (Render), Database (Neon)

## 📁 Project Structure

client/
 ├── public/
 ├── src/
 │   ├── assets/
 │   ├── components/
 │   ├── layout/
 │   ├── lib/
 │   ├── page/
 │   ├── store/
 │   ├── App.jsx
 │   ├── main.jsx
 │   ├── index.css
 └── vite.config.js

server/
 ├── prisma/
 ├── src/
 │   ├── controllers/
 │   ├── generated/
 │   ├── libs/
 │   ├── middleware/
 │   ├── routes/
 │   ├── utils/
 │   ├── index.js
 ├── .env
 ├── docker
 ├── package.json

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (or Neon account)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/DevDilip28/AlGoHolic.git
    cd AlGoHolic
    ```

2. Setup Backend:
    ```bash
    cd backend
    npm install
    cp .env.example .env
    # Add your database URL and JWT secrets in .env
    npx prisma migrate dev
    npm run dev
    ```

3. Setup Frontend:
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

4. Open [http://localhost:5173](http://localhost:5173) to view the app.
